#!/usr/bin/env node
/**
 * Download WordPress/Atrium Court images into static/images/
 * Run: node scripts/download-wp-images.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_IMAGES = path.join(__dirname, '..', 'static', 'images');
const BASE = 'https://atriumcourtseattle.com/wp-content/uploads';

const IMAGES = [
  '2024/08/Atrium-Court-Logo.png',
  '2024/08/Atrium-Court-Rendering-1.jpg',
  '2025/11/7324-Rendering-Plaza-230808-small.jpg',
  '2025/11/7324-MLKjr-by-nitze-stagen-Driveway-Buffer-Perspective-N.jpg',
  '2025/11/7324-MLKjr-by-nitze-stagen-Plaza-Perspective.jpg',
  '2025/11/pattern2-scaled.png',
  '2025/11/Atrium-Court-by-Nitze-entry-1-.jpg',
  '2025/11/Atrium-Court-by-Nitze-entry-night.jpg',
  '2025/11/AdobeStock_525840265.jpg',
  '2025/11/DSC05439.jpg',
  '2025/11/DSC05448.jpg',
  '2025/11/7324FinalInteriorUnitRendering.webp',
  '2025/11/DSC04861-HDR.jpg',
  '2025/11/AmenityDeckPerspective3copy2.webp',
  '2025/11/AmenityDeckPerspective.webp',
  '2025/11/S2INSIDE2.jpg',
  '2025/11/DSC05454-home.jpg',
  '2025/11/DSC04855-HDR-THUMB.jpg',
  '2025/11/DSC04888-THUMB.jpg',
  '2025/11/wood-style-floor.png',
  '2025/11/quartz-counter.png',
  '2025/11/natural-light.png',
  '2025/11/community-lounge.png',
  '2025/11/welcome-art.png',
  '2025/11/retail.png',
  '2025/11/bike-storage.png',
  '2025/11/package-area.png',
  '2025/11/garage.png',
  '2025/11/grocery.png',
  '2025/11/restaurants.png',
  '2025/11/rail.png',
  '2025/11/parks.png',
  '2025/11/pets.png',
  '2026/03/7324-Martin-Luther-King-Jr-Way-S-6.png',
  '2026/03/7324-Martin-Luther-King-Jr-Way-S-23.png',
];

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'image/*,*/*',
};

if (!fs.existsSync(STATIC_IMAGES)) {
  fs.mkdirSync(STATIC_IMAGES, { recursive: true });
}

let ok = 0;
let fail = 0;

for (const rel of IMAGES) {
  const url = `${BASE}/${rel}`;
  const filename = path.basename(rel);
  const dest = path.join(STATIC_IMAGES, filename);
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`Skip ${filename}: ${res.status}`);
      fail++;
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`OK ${filename}`);
    ok++;
  } catch (e) {
    console.warn(`Fail ${filename}:`, e.message);
    fail++;
  }
}

console.log(`\nDone: ${ok} downloaded, ${fail} failed.`);
