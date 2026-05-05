#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_SPEC_URL = 'https://letsintern.kr/v3/api-docs';

const url = process.env.SWAGGER_SPEC_URL ?? DEFAULT_SPEC_URL;
const outPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'openapi.json',
);

const res = await fetch(url);
if (!res.ok) {
  console.error(
    `[fetch-spec] Failed to fetch ${url}: HTTP ${res.status} ${res.statusText}`,
  );
  process.exit(1);
}

const text = await res.text();
try {
  JSON.parse(text);
} catch (err) {
  console.error(`[fetch-spec] Response is not valid JSON: ${err.message}`);
  process.exit(1);
}

await writeFile(outPath, text);
console.log(
  `[fetch-spec] ${url} → openapi.json (${text.length.toLocaleString()} bytes)`,
);
