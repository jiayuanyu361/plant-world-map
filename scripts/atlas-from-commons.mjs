#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const externalDir = path.join(root, 'data', 'atlas', 'external');
const inputPath = path.join(externalDir, 'commons.sample.json');
const outputPath = path.join(root, 'data', 'atlas', 'inbox', 'commons-batch.json');

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeArray(value) {
  return Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];
}

function firstText(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function stringifyAsciiJson(value) {
  return JSON.stringify(value, null, 2).replace(/[\u0080-\uFFFF]/g, (char) => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'));

}

function mapRecord(raw) {
  const zhName = raw.labels?.zh || raw.name_zh;
  const enName = raw.labels?.en || raw.name_en || raw.title;
  const name = firstText(zhName, enName);
  const imageUrl = firstText(raw.imageUrl, raw.image_url, raw.image?.url, raw.imageinfo?.[0]?.url);
  const sourceUrl = firstText(raw.pageUrl, raw.page_url, raw.canonicalurl);
  const scientificName = firstText(raw.scientificName, raw.scientific_name);
  const description = firstText(raw.description_zh, raw.description?.zh, raw.description_en, raw.description?.en, raw.extract);
  const license = firstText(raw.license, raw.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value);
  const attribution = firstText(raw.attribution, raw.imageinfo?.[0]?.user, raw.imageinfo?.[0]?.extmetadata?.Artist?.value);
  const lat = Number(raw.latitude ?? raw.coordinates?.lat ?? raw.coordinates?.[0]?.lat);
  const lon = Number(raw.longitude ?? raw.coordinates?.lon ?? raw.coordinates?.lng ?? raw.coordinates?.[0]?.lon ?? raw.coordinates?.[0]?.lng);

  return {
    slug: slugify(raw.slug || enName || scientificName || zhName),
    name,
    scientific_name: scientificName || null,
    description,
    image_url: imageUrl,
    latitude: lat,
    longitude: lon,
    tags: normalizeArray(raw.tags),
    season: firstText(raw.season),
    region: firstText(raw.region),
    region_focus: firstText(raw.region_focus, raw.region),
    habitat: firstText(raw.habitat),
    viewing_season: firstText(raw.viewing_season),
    flower_meaning: firstText(raw.flower_meaning),
    source: 'wikimedia-commons',
    source_name: 'Wikimedia Commons',
    source_record_id: firstText(raw.id, raw.pageid, raw.title),
    source_url: sourceUrl,
    image_license: license || null,
    image_attribution: attribution || null,
    status: 'approved',
    catalog_status: 'approved'
  };
}

async function main() {
  await mkdir(externalDir, { recursive: true });
  const rawText = await readFile(inputPath, 'utf8');
  const parsed = JSON.parse(rawText.replace(/^\uFEFF/, ''));
  const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed.items) ? parsed.items : [];
  const mapped = items.map(mapRecord);
  await writeFile(outputPath, stringifyAsciiJson(mapped), 'utf8');
  console.log(`Mapped ${mapped.length} Wikimedia Commons record(s) to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
