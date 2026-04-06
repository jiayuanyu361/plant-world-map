create or replace function public.sync_approved_atlas_entries()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  synced_count integer := 0;
begin
  insert into public.plants (
    name,
    description,
    image_url,
    latitude,
    longitude,
    tags,
    status,
    created_by
  )
  select
    ae.name,
    ae.description,
    ae.image_url,
    ae.latitude,
    ae.longitude,
    (
      select array_agg(distinct tag)
      from unnest(array_remove(array[ae.season, ae.region] || ae.tags, null)) as tag
    ),
    'approved',
    null
  from public.atlas_entries ae
  where ae.status = 'approved'
    and ae.synced_to_plants = false
    and not exists (
      select 1
      from public.plants p
      where lower(p.name) = lower(ae.name)
        and abs(p.latitude - ae.latitude) < 0.00001
        and abs(p.longitude - ae.longitude) < 0.00001
    );

  update public.atlas_entries ae
  set synced_to_plants = true,
      updated_at = now()
  where ae.status = 'approved'
    and ae.synced_to_plants = false
    and exists (
      select 1
      from public.plants p
      where lower(p.name) = lower(ae.name)
        and abs(p.latitude - ae.latitude) < 0.00001
        and abs(p.longitude - ae.longitude) < 0.00001
    );

  get diagnostics synced_count = row_count;
  return synced_count;
end;
$$;
