// Usage: node build-images.mjs <plan.json> <scratch dir> <out dir>
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const [planFile, base, out] = process.argv.slice(2);
const { plan } = JSON.parse(fs.readFileSync(planFile, 'utf8'));
fs.mkdirSync(out, { recursive: true });
let n = 0;
for (const [id, p] of Object.entries(plan)) {
  const dest = path.join(out, `${id}.webp`);
  const targetW = Math.round(Math.min(p.crop.w * 2, 2400));
  let img;
  if (p.raw) {
    img = sharp(path.join(base, p.raw)).resize({ width: targetW, withoutEnlargement: true });
  } else {
    const { file, x, y, w, h, scale } = p.crop;
    const src = sharp(path.join(base, file));
    const meta = await src.metadata();
    const left = Math.max(0, Math.round(x * scale)), top = Math.max(0, Math.round(y * scale));
    const width = Math.min(Math.round(w * scale), meta.width - left), height = Math.min(Math.round(h * scale), meta.height - top);
    img = sharp(await src.extract({ left, top, width, height }).toBuffer());
  }
  await img.webp({ quality: 82, effort: 5 }).toFile(dest);
  n++;
}
console.log('wrote', n, 'images');
