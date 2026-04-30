// Run once: node scripts/generate-icons.mjs
// Generates PWA icons from a source image or a built-in SVG fallback.
// To use your own image: place a square PNG at public/icons/source.png before running.

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const iconsDir = join(root, 'public', 'icons');

if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

// Warm orange matching the app theme_color (#D97757)
const SOURCE = join(iconsDir, 'source.png');

const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#D97757"/>
  <text x="256" y="340" font-size="280" text-anchor="middle" font-family="serif" fill="#fff">🫘</text>
</svg>`;

const input = existsSync(SOURCE)
  ? sharp(SOURCE)
  : sharp(Buffer.from(svgFallback));

const sizes = [
  { file: join(iconsDir, 'icon-192.png'), size: 192 },
  { file: join(iconsDir, 'icon-512.png'), size: 512 },
  { file: join(root, 'public', 'apple-touch-icon.png'), size: 180 },
];

for (const { file, size } of sizes) {
  await input.clone().resize(size, size).png().toFile(file);
  console.log(`✓ ${file.replace(root, '').replace(/\\/g, '/')}`);
}

console.log('\nDone. Icons are ready in public/icons/');
