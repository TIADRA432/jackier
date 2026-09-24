-- Atomic school registration to prevent race-condition overbooking.
create or replace function public.register_school_participant(
  p_session_id uuid,
  p_full_name text,
  p_email text,
  p_phone text,
  p_notes text default null,
  p_price_snapshot numeric default null
)
returns public.school_registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.school_sessions%rowtype;
  v_count integer;
  v_registration public.school_registrations%rowtype;
begin
  select * into v_session
  from public.school_sessions
  where id = p_session_id
  for update;

  if not found or v_session.status <> 'scheduled' or v_session.starts_at <= now() then
    raise exception 'session_not_open';
  end if;

  if exists (
    select 1 from public.school_registrations
    where session_id = p_session_id
      and status <> 'cancelled'
      and (lower(email) = lower(p_email) or phone = p_phone)
  ) then
    raise exception 'duplicate_registration';
  end if;

  select count(*) into v_count
  from public.school_registrations
  where session_id = p_session_id
    and status <> 'cancelled';

  if v_count >= v_session.capacity then
    raise exception 'session_full';
  end if;

  insert into public.school_registrations (
    session_id, full_name, email, phone, notes, status, price_snapshot
  ) values (
    p_session_id, p_full_name, lower(p_email), p_phone, p_notes, 'pending', p_price_snapshot
  )
  returning * into v_registration;

  return v_registration;
end;
$$;

revoke all on function public.register_school_participant(uuid,text,text,text,text,numeric) from public;
revoke all on function public.register_school_participant(uuid,text,text,text,text,numeric) from anon;
revoke all on function public.register_school_participant(uuid,text,text,text,text,numeric) from authenticated;
grant execute on function public.register_school_participant(uuid,text,text,text,text,numeric) to service_role;
