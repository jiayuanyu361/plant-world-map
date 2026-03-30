create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  image_url text,
  latitude double precision not null,
  longitude double precision not null,
  tags text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.user_profiles enable row level security;
alter table public.plants enable row level security;
alter table public.comments enable row level security;

drop policy if exists "profiles are viewable by everyone" on public.user_profiles;
create policy "profiles are viewable by everyone"
  on public.user_profiles for select
  using (true);

drop policy if exists "users manage own profile" on public.user_profiles;
create policy "users manage own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

drop policy if exists "approved plants readable by everyone" on public.plants;
create policy "approved plants readable by everyone"
  on public.plants for select
  using (status = 'approved' or auth.uid() = created_by or exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and up.is_admin = true
  ));

drop policy if exists "authenticated users can insert plants" on public.plants;
create policy "authenticated users can insert plants"
  on public.plants for insert
  to authenticated
  with check (
    auth.uid() = created_by and status = 'pending'
  );

drop policy if exists "admins can review plants" on public.plants;
create policy "admins can review plants"
  on public.plants for update
  to authenticated
  using (exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and up.is_admin = true
  ))
  with check (exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and up.is_admin = true
  ));

drop policy if exists "comments readable by everyone" on public.comments;
create policy "comments readable by everyone"
  on public.comments for select
  using (true);

drop policy if exists "authenticated users can create comments" on public.comments;
create policy "authenticated users can create comments"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', true)
on conflict (id) do nothing;

drop policy if exists "public can view plant images" on storage.objects;
create policy "public can view plant images"
  on storage.objects for select
  using (bucket_id = 'plant-images');

drop policy if exists "authenticated users can upload plant images" on storage.objects;
create policy "authenticated users can upload plant images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'plant-images');
