-- Kör i SQL Editor i det befintliga projektet. Använd en egen rad i
-- scen_accounts för det konto som ska få använda SCEN (se docs/MOLNBIBLIOTEK.md).
begin;
create table if not exists public.scen_accounts (
  owner uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.scen_versions (
  owner uuid not null references public.scen_accounts(owner) on delete cascade,
  deck_id text not null,
  revision integer not null check (revision > 0),
  change_id uuid not null,
  saved_at timestamptz not null default now(),
  document jsonb not null,
  media jsonb not null default '{}',
  removed boolean not null default false,
  primary key (owner, deck_id, revision),
  unique (owner, change_id)
);
alter table public.scen_accounts enable row level security;
alter table public.scen_versions enable row level security;
revoke all on public.scen_accounts, public.scen_versions from public, anon, authenticated;
grant select on public.scen_accounts to authenticated;
grant select, insert on public.scen_versions to authenticated;
drop policy if exists scen_read_account on public.scen_accounts;
create policy scen_read_account on public.scen_accounts for select to authenticated using (owner = (select auth.uid()));
drop policy if exists scen_read_versions on public.scen_versions;
create policy scen_read_versions on public.scen_versions for select to authenticated using (owner = (select auth.uid()));
drop policy if exists scen_append_version on public.scen_versions;
create policy scen_append_version on public.scen_versions for insert to authenticated with check (
  owner = (select auth.uid()) and exists (select from public.scen_accounts a where a.owner = (select auth.uid()))
);
create or replace view public.scen_library with (security_invoker = true) as
  select distinct on (owner, deck_id) * from public.scen_versions order by owner, deck_id, revision desc;
revoke all on public.scen_library from public, anon, authenticated;
grant select on public.scen_library to authenticated;
insert into storage.buckets(id, name, public) values ('scen-private', 'scen-private', false)
  on conflict (id) do nothing;
do $$
begin
  if exists (select from storage.buckets where id = 'scen-private' and public) then
    raise exception 'SCEN behöver ett privat filutrymme. Bucketnamnet scen-private används redan för publika filer.';
  end if;
end $$;
drop policy if exists scen_media_read on storage.objects;
create policy scen_media_read on storage.objects for select to authenticated using (
  bucket_id = 'scen-private' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select from public.scen_accounts a where a.owner = (select auth.uid()))
);
drop policy if exists scen_media_insert on storage.objects;
create policy scen_media_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'scen-private' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select from public.scen_accounts a where a.owner = (select auth.uid()))
);
-- Projektet kan redan ha breda behörigheter för andra buckets. Begränsa
-- sådana regler för SCEN och låt deras tidigare beteende gälla överallt annars.
drop policy if exists scen_private_boundary on storage.objects;
create policy scen_private_boundary on storage.objects as restrictive for all to authenticated
  using (case when bucket_id = 'scen-private' then
    (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (select from public.scen_accounts a where a.owner = (select auth.uid()))
    else true end)
  with check (case when bucket_id = 'scen-private' then
    (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (select from public.scen_accounts a where a.owner = (select auth.uid()))
    else true end);
drop policy if exists scen_exclude_anonymous on storage.objects;
create policy scen_exclude_anonymous on storage.objects as restrictive for all to anon
  using (bucket_id <> 'scen-private') with check (bucket_id <> 'scen-private');
drop policy if exists scen_immutable_files on storage.objects;
create policy scen_immutable_files on storage.objects as restrictive for update to public
  using (bucket_id <> 'scen-private') with check (bucket_id <> 'scen-private');
drop policy if exists scen_keep_versions on storage.objects;
create policy scen_keep_versions on storage.objects as restrictive for delete to public
  using (bucket_id <> 'scen-private');
commit;
