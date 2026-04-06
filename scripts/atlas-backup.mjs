#!/usr/bin/env node
import { mkdir, copyFile, access, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const timestamp = new Date().toISOString().replace(/[:]/g, '-').replace(/\.\d{3}Z$/, 'Z');
const backupDir = path.join(root, 'backups', `atlas-${timestamp}`);

const filesToCopy = [
  'lib/demo-atlas.ts',
  'app/page.tsx',
  'components/home-page-client.tsx',
  'components/home-hero-stage.tsx',
  'components/explore-stage.tsx',
  'components/map-view-client.tsx',
  'app/globals.css',
  'README.md'
];

async function ensureParent(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function copyIfExists(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(backupDir, relativePath);
  try {
    await access(source);
    await ensureParent(target);
    await copyFile(source, target);
  } catch {
    // ignore missing optional files
  }
}

async function main() {
  await mkdir(backupDir, { recursive: true });

  for (const relativePath of filesToCopy) {
    await copyIfExists(relativePath);
  }

  const atlasSource = path.join(root, 'public', 'plants', 'atlas');
  const atlasTarget = path.join(backupDir, 'public', 'plants', 'atlas');
  try {
    await cp(atlasSource, atlasTarget, { recursive: true });
  } catch {
    // ignore if atlas dir is absent
  }

  console.log(`Atlas backup created at ${backupDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
