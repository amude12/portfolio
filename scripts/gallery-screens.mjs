// Gallery tiles built from real project screens, in the gallery's presentation style:
// tinted panel + browser window (dashboards) or three phones (mobile). Output: public/gallery/*.webp
// Run: node scripts/gallery-screens.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const K = 2; // render at 2× for sharp display
const OUT = 'public/gallery';
const PH = 'scripts/assets/sm-phones';

// Compose layers that may overflow the tile (soft shadows), then trim back to the tile
const PAD = 400;
async function compose(W, H, bg, layers, out) {
  const base = await sharp(panel(W, H, bg)).extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const flat = await sharp(base).composite(layers.map((l) => ({ ...l, left: l.left + PAD, top: l.top + PAD }))).png().toBuffer();
  const tile = await sharp(flat).extract({ left: PAD, top: PAD, width: W * K, height: H * K }).png().toBuffer();
  // keep the panel's rounded corners clean
  await sharp(tile).composite([{ input: panel(W, H, '#fff'), blend: 'dest-in' }]).webp({ quality: 86, effort: 6 }).toFile(out);
}
const panel = (w, h, bg) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * K}" height="${h * K}"><rect width="100%" height="100%" rx="${28 * K}" fill="${bg}"/></svg>`);

async function shadowOf(png, blur, opacity, color = '20,26,52') {
  const m = await sharp(png).metadata();
  const pad = blur * 3;
  const sil = await sharp({ create: { width: m.width, height: m.height, channels: 4, background: `rgba(${color},${opacity})` } })
    .composite([{ input: png, blend: 'dest-in' }]).png().toBuffer();
  return { buf: await sharp(sil).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).blur(blur).png().toBuffer(), pad };
}

// Dashboard tile: browser window holding a screenshot (top of the screen shown)
async function browserTile(name, src, { W, H, bg, x = 60, y = 70, w, h }) {
  const S = (v) => Math.round(v * K);
  const bar = 46;
  const innerW = S(w), innerH = S(h - bar);
  const meta = await sharp(src).metadata();
  const cropH = Math.min(meta.height, Math.round(meta.width * innerH / innerW));
  const shot = await sharp(src).extract({ left: 0, top: 0, width: meta.width, height: cropH }).resize(innerW, innerH).png().toBuffer();
  const r = S(18);
  const bottomMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${innerW}" height="${innerH}"><path d="M0 0H${innerW}V${innerH - r}Q${innerW} ${innerH} ${innerW - r} ${innerH}H${r}Q0 ${innerH} 0 ${innerH - r}Z" fill="#fff"/></svg>`);
  const shotR = await sharp(shot).ensureAlpha().composite([{ input: bottomMask, blend: 'dest-in' }]).png().toBuffer();
  const win = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S(w)}" height="${S(h)}">
    <rect width="100%" height="100%" rx="${r}" fill="#fff"/>
    <path d="M${r} 0H${S(w) - r}Q${S(w)} 0 ${S(w)} ${r}V${S(bar)}H0V${r}Q0 0 ${r} 0Z" fill="#f1f3f8"/>
    <circle cx="${S(26)}" cy="${S(23)}" r="${S(7)}" fill="#ff6b6b"/><circle cx="${S(48)}" cy="${S(23)}" r="${S(7)}" fill="#ffc24b"/><circle cx="${S(70)}" cy="${S(23)}" r="${S(7)}" fill="#3ecf8e"/>
    <rect x="${S(100)}" y="${S(12)}" width="${S(w * 0.42)}" height="${S(22)}" rx="${S(11)}" fill="#fff"/></svg>`);
  const winPng = await sharp(win).composite([{ input: shotR, left: 0, top: S(bar) }]).png().toBuffer();
  const sh = await shadowOf(win, S(22), 0.16);
  await compose(W, H, bg, [{ input: sh.buf, left: S(x) - sh.pad, top: S(y + 18) - sh.pad }, { input: winPng, left: S(x), top: S(y) }], `${OUT}/${name}.webp`);
}

// Mobile tile: three phones, the middle one raised
async function phoneTile(name, phones, { W = 1270, H = 1000, bg, ph = 600 }) {
  const S = (v) => Math.round(v * K);
  const imgs = await Promise.all(phones.map((p) => sharp(`${PH}/${p}.png`).resize({ height: S(ph) }).png().toBuffer()));
  const widths = await Promise.all(imgs.map(async (b) => (await sharp(b).metadata()).width));
  const gap = (S(W) - widths.reduce((a, b) => a + b, 0)) / 4;
  const layers = [];
  let cx = gap;
  for (const [i, img] of imgs.entries()) {
    const top = i === 1 ? S((H - ph) / 2 - 40) : S((H - ph) / 2 + 40);
    const sh = await shadowOf(img, S(20), 0.22);
    layers.push({ input: sh.buf, left: Math.round(cx) - sh.pad, top: top + S(18) - sh.pad }, { input: img, left: Math.round(cx), top });
    cx += widths[i] + gap;
  }
  // shadows first, then phones (middle phone on top)
  const sh = layers.filter((_, i) => i % 2 === 0), ph2 = layers.filter((_, i) => i % 2 === 1);
  await compose(W, H, bg, [...sh, ph2[0], ph2[2], ph2[1]], `${OUT}/${name}.webp`);
}

const F = 'public/figma';
await browserTile('dash-admin', `${F}/m2-57-1399.webp`, { W: 1100, H: 1000, bg: '#eef2ff', w: 980, h: 860 });
await browserTile('dash-provider', `${F}/m2-38-1207.webp`, { W: 1440, H: 1000, bg: '#f3efff', w: 1320, h: 860 });
await browserTile('dash-acquisition', `${F}/m2-7-1110.webp`, { W: 1440, H: 1000, bg: '#e8f7f4', w: 1320, h: 860 });
await browserTile('dash-application', `${F}/m2-7-1307.webp`, { W: 1440, H: 1000, bg: '#fff4e6', w: 1320, h: 860 });

await phoneTile('mobile-schedule', ['timetable', 'holiday', 'attendance'], { bg: '#e9f9ef' });
await phoneTile('mobile-home', ['navigation', 'home', 'profile'], { bg: '#eef0ff' });
await phoneTile('mobile-contact', ['contact', 'events', 'attendance-detail'], { bg: '#fff1ea' });
await phoneTile('mobile-settings', ['settings', 'language', 'password'], { bg: '#e6f4ff' });
console.log('done');
