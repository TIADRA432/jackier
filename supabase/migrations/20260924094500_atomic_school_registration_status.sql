-- Atomic status transition for school registrations.
create or replace function public.update_school_registration_status(
  p_registration_id uuid,
  p_status text
)
returns public.school_registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_registration public.school_registrations%rowtype;
  v_session public.school_sessions%rowtype;
  v_count integer;
begin
  if p_status not in ('pending', 'confirmed', 'paid', 'cancelled') then
    raise exception 'invalid_registration_status';
  end if;

  select * into v_registration
  from public.school_registrations
  where id = p_registration_id
  for update;

  if not found then
    raise exception 'registration_not_found';
  end if;

  select * into v_session
  from public.school_sessions
  where id = v_registration.session_id
  for update;

  if v_registration.status = 'cancelled' and p_status <> 'cancelled' then
    select count(*) into v_count
    from public.school_registrations
    where session_id = v_registration.session_id
      and status <> 'cancelled'
      and id <> p_registration_id;

    if v_count >= v_session.capacity then
      raise exception 'session_full';
    end if;
  end if;

  update public.school_registrations
  set status = p_status,
      updated_at = now()
  where id = p_registration_id
  returning * into v_registration;

  return v_registration;
end;
$$;

revoke all on function public.update_school_registration_status(uuid,text) from public;
revoke all on function public.update_school_registration_status(uuid,text) from anon;
revoke all on function public.update_school_registration_status(uuid,text) from authenticated;
grant execute on function public.update_school_registration_status(uuid,text) to service_role;
