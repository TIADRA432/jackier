-- Preserve the owner-only policy while evaluating the auth helper once per query.
alter policy "Users read own profile"
on public.profiles
using ((select auth.uid()) = id);
