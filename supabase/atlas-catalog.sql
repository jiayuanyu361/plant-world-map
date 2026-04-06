create table if not exists public.atlas_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  scientific_name text,
  description text not null,
  season text,
  viewing_season text,
  region text,
  region_focus text,
  habitat text,
  flower_meaning text,
  latitude double precision not null,
  longitude double precision not null,
  tags text[] not null default '{}',
  image_url text not null,
  image_source text not null default 'manual-curation',
  image_source_url text,
  image_license text,
  image_attribution text,
  source_name text,
  source_record_id text,
  source_file text,
  source_payload jsonb not null default '{}'::jsonb,
  status text not null default 'approved' check (status in ('draft', 'approved', 'archived')),
  synced_to_plants boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists atlas_entries_status_idx on public.atlas_entries(status);
create index if not exists atlas_entries_region_idx on public.atlas_entries(region);
create index if not exists atlas_entries_season_idx on public.atlas_entries(season);
create index if not exists atlas_entries_tags_gin_idx on public.atlas_entries using gin(tags);

create or replace function public.set_atlas_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_atlas_entries_updated_at on public.atlas_entries;
create trigger set_atlas_entries_updated_at
before update on public.atlas_entries
for each row execute procedure public.set_atlas_entries_updated_at();

alter table public.atlas_entries enable row level security;

drop policy if exists "approved atlas entries readable by everyone" on public.atlas_entries;
create policy "approved atlas entries readable by everyone"
  on public.atlas_entries for select
  using (
    status = 'approved'
    or exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.is_admin = true
    )
  );

drop policy if exists "admins manage atlas entries" on public.atlas_entries;
create policy "admins manage atlas entries"
  on public.atlas_entries for all
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.is_admin = true
    )
  );
