#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const inboxDir = path.join(root, 'data', 'atlas', 'inbox');
const generatedDir = path.join(root, 'data', 'atlas', 'generated');
const plantSqlOutput = path.join(root, 'supabase', 'atlas-import.generated.sql');
const catalogSqlOutput = path.join(root, 'supabase', 'atlas-catalog.generated.sql');

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function quoteSql(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function quoteNullable(value) {
  if (value === null || value === undefined || value === '') {
    return 'null';
  }
  return quoteSql(value);
}

function quoteJson(value) {
  return quoteSql(JSON.stringify(value ?? {}));
}

function quoteArray(values) {
  const normalized = (values ?? []).map((item) => String(item).replace(/"/g, '\\"'));
  return `ARRAY[${normalized.map((item) => quoteSql(item)).join(', ')}]::text[]`;
}

function normalizeRecord(raw, sourceFile) {
  const normalized = {
    slug: slugify(raw.slug || raw.name || raw.label),
    name: String(raw.name || raw.label || '').trim(),
    scientific_name: raw.scientific_name ? String(raw.scientific_name).trim() : null,
    description: String(raw.description || '').trim(),
    image_url: String(raw.image_url || '').trim(),
    latitude: Number(raw.latitude),
    longitude: Number(raw.longitude),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String).map((item) => item.trim()).filter(Boolean) : [],
    season: raw.season ? String(raw.season).trim() : null,
    region: raw.region ? String(raw.region).trim() : null,
    region_focus: raw.region_focus ? String(raw.region_focus).trim() : raw.region ? String(raw.region).trim() : null,
    habitat: raw.habitat ? String(raw.habitat).trim() : null,
    viewing_season: raw.viewing_season ? String(raw.viewing_season).trim() : null,
    flower_meaning: raw.flower_meaning ? String(raw.flower_meaning).trim() : null,
    source: raw.source ? String(raw.source).trim() : 'manual-curation',
    source_name: raw.source_name ? String(raw.source_name).trim() : raw.source ? String(raw.source).trim() : 'manual-curation',
    source_record_id: raw.source_record_id ? String(raw.source_record_id).trim() : raw.slug ? String(raw.slug).trim() : null,
    source_url: raw.source_url ? String(raw.source_url).trim() : null,
    image_license: raw.image_license ? String(raw.image_license).trim() : null,
    image_attribution: raw.image_attribution ? String(raw.image_attribution).trim() : null,
    plant_status: raw.status ? String(raw.status).trim() : 'approved',
    catalog_status: raw.catalog_status ? String(raw.catalog_status).trim() : (raw.status === 'approved' ? 'approved' : 'draft'),
    source_payload: raw,
    source_file: sourceFile
  };

  const errors = [];
  if (!normalized.slug) errors.push('缺少 slug');
  if (!normalized.name) errors.push('缺少 name');
  if (!normalized.description) errors.push('缺少 description');
  if (!normalized.image_url) errors.push('缺少 image_url');
  if (!Number.isFinite(normalized.latitude)) errors.push('latitude 无效');
  if (!Number.isFinite(normalized.longitude)) errors.push('longitude 无效');
  if (!normalized.tags.length) errors.push('至少需要 1 个 tag');

  return { normalized, errors };
}

function buildPlantTags(record) {
  return [...new Set([record.season, record.region, ...record.tags].filter(Boolean))];
}

function toPlantInsertSql(record) {
  const tags = buildPlantTags(record);
  return `insert into public.plants (name, description, image_url, latitude, longitude, tags, status, created_by)\nselect ${quoteSql(record.name)}, ${quoteSql(record.description)}, ${quoteSql(record.image_url)}, ${record.latitude}, ${record.longitude}, ${quoteArray(tags)}, ${quoteSql(record.plant_status)}, null\nwhere not exists (\n  select 1 from public.plants\n  where lower(name) = lower(${quoteSql(record.name)})\n    and abs(latitude - ${record.latitude}) < 0.00001\n    and abs(longitude - ${record.longitude}) < 0.00001\n);\n`;
}

function toCatalogUpsertSql(record) {
  return `insert into public.atlas_entries (\n  slug,\n  name,\n  scientific_name,\n  description,\n  season,\n  viewing_season,\n  region,\n  region_focus,\n  habitat,\n  flower_meaning,\n  latitude,\n  longitude,\n  tags,\n  image_url,\n  image_source,\n  image_source_url,\n  image_license,\n  image_attribution,\n  source_name,\n  source_record_id,\n  source_file,\n  source_payload,\n  status\n) values (\n  ${quoteSql(record.slug)},\n  ${quoteSql(record.name)},\n  ${quoteNullable(record.scientific_name)},\n  ${quoteSql(record.description)},\n  ${quoteNullable(record.season)},\n  ${quoteNullable(record.viewing_season)},\n  ${quoteNullable(record.region)},\n  ${quoteNullable(record.region_focus)},\n  ${quoteNullable(record.habitat)},\n  ${quoteNullable(record.flower_meaning)},\n  ${record.latitude},\n  ${record.longitude},\n  ${quoteArray(record.tags)},\n  ${quoteSql(record.image_url)},\n  ${quoteSql(record.source)},\n  ${quoteNullable(record.source_url)},\n  ${quoteNullable(record.image_license)},\n  ${quoteNullable(record.image_attribution)},\n  ${quoteSql(record.source_name)},\n  ${quoteNullable(record.source_record_id)},\n  ${quoteSql(record.source_file)},\n  ${quoteJson(record.source_payload)}::jsonb,\n  ${quoteSql(record.catalog_status)}\n) on conflict (slug) do update set\n  name = excluded.name,\n  scientific_name = excluded.scientific_name,\n  description = excluded.description,\n  season = excluded.season,\n  viewing_season = excluded.viewing_season,\n  region = excluded.region,\n  region_focus = excluded.region_focus,\n  habitat = excluded.habitat,\n  flower_meaning = excluded.flower_meaning,\n  latitude = excluded.latitude,\n  longitude = excluded.longitude,\n  tags = excluded.tags,\n  image_url = excluded.image_url,\n  image_source = excluded.image_source,\n  image_source_url = excluded.image_source_url,\n  image_license = excluded.image_license,\n  image_attribution = excluded.image_attribution,\n  source_name = excluded.source_name,\n  source_record_id = excluded.source_record_id,\n  source_file = excluded.source_file,\n  source_payload = excluded.source_payload,\n  status = excluded.status,\n  updated_at = now();\n`;
}

async function main() {
  await mkdir(generatedDir, { recursive: true });
  const files = (await readdir(inboxDir)).filter((file) => file.endsWith('.json')).sort();

  const validRecords = [];
  const invalidRecords = [];
  const seen = new Set();

  for (const file of files) {
    const fullPath = path.join(inboxDir, file);
    const rawText = await readFile(fullPath, 'utf8');
    const parsed = JSON.parse(rawText.replace(/^\uFEFF/, ''));
    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed.items) ? parsed.items : [];

    for (const item of items) {
      const { normalized, errors } = normalizeRecord(item, file);
      const dedupeKey = `${normalized.name.toLowerCase()}:${normalized.latitude}:${normalized.longitude}`;
      if (seen.has(dedupeKey)) {
        invalidRecords.push({ ...normalized, errors: ['重复记录'] });
        continue;
      }
      if (errors.length) {
        invalidRecords.push({ ...normalized, errors });
        continue;
      }
      seen.add(dedupeKey);
      validRecords.push(normalized);
    }
  }

  const plantSql = [
    '-- Generated by scripts/atlas-import.mjs',
    `-- Created at ${new Date().toISOString()}`,
    ''
  ].concat(validRecords.map(toPlantInsertSql)).join('\n');

  const catalogSql = [
    '-- Generated by scripts/atlas-import.mjs',
    `-- Created at ${new Date().toISOString()}`,
    ''
  ].concat(validRecords.map(toCatalogUpsertSql)).join('\n');

  await writeFile(path.join(generatedDir, 'atlas-import-ready.json'), JSON.stringify(validRecords, null, 2), 'utf8');
  await writeFile(path.join(generatedDir, 'atlas-import-report.json'), JSON.stringify({
    total_files: files.length,
    valid_count: validRecords.length,
    invalid_count: invalidRecords.length,
    valid_records: validRecords,
    invalid_records: invalidRecords
  }, null, 2), 'utf8');
  await writeFile(plantSqlOutput, plantSql, 'utf8');
  await writeFile(catalogSqlOutput, catalogSql, 'utf8');

  console.log(`Prepared ${validRecords.length} records from ${files.length} inbox file(s).`);
  console.log(`Plant SQL written to ${plantSqlOutput}`);
  console.log(`Catalog SQL written to ${catalogSqlOutput}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
