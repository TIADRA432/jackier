alter table public.profiles drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('USER','ADMIN','MANAGER','FINANCE','RECEPTION','CHEF','EDITOR'));

drop policy if exists "Users read own profile" on public.profiles;

create policy "Users read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);
