// Generates the "Beyond Case Studies" gallery artwork as vector SVGs (public/gallery/*.svg).
// Original showcase pieces, separate from the case-study screens. Run: node scripts/gallery-art.mjs
// In use: the Design Systems and Wireframes cards. The Dashboards and Mobile cards now use real screens
// (scripts/gallery-screens.mjs); their dash-*.svg / mobile-*.svg outputs here are not referenced.
import fs from 'node:fs';

const OUT = 'public/gallery';
fs.mkdirSync(OUT, { recursive: true });
const FONT = "Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif".replace(/'/g, '&apos;');
const P = { ink: '#0f1222', body: '#5b6275', muted: '#98a0b3', line: '#e4e8f0', bg: '#f6f8fc', blue: '#3b5bfd', indigo: '#5b4bdb', violet: '#8b5cf6', teal: '#14b8a6', green: '#22c55e', amber: '#f59e0b', red: '#ef4444', pink: '#ec4899', navy: '#1e2140' };

/* ── primitives ── */
const r = (x, y, w, h, fill, rx = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const t = (x, y, s, txt, fill = P.ink, w = 600, anchor = 'start') => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" font-family="${FONT}">${String(txt).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`;
const c = (cx, cy, rad, fill, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}" ${extra}/>`;
const bar = (x, y, w, h = 12, fill = P.line) => r(x, y, w, h, fill, h / 2);
const card = (x, y, w, h, rx = 16) => r(x, y, w, h, '#fff', rx, `stroke="${P.line}" stroke-width="2"`);
const shadow = `<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#1b2550" flood-opacity="0.16"/></filter>`;
const svg = (w, h, bg, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${shadow}${defs}</defs>${r(0, 0, w, h, bg, 28)}${body}</svg>`;
const save = (name, s) => fs.writeFileSync(`${OUT}/${name}.svg`, s);
const avatar = (cx, cy, rad, hue) => c(cx, cy, rad, hue) + c(cx, cy - rad * 0.22, rad * 0.38, '#fff', 'opacity="0.85"') + `<path d="M${cx - rad * 0.62} ${cy + rad * 0.62} a${rad * 0.62} ${rad * 0.5} 0 0 1 ${rad * 1.24} 0z" fill="#fff" opacity="0.85"/>`;
const pill = (x, y, label, fg, bgc, s = 20) => { const w = label.length * s * 0.6 + s * 1.4; return r(x, y, w, s * 1.6, bgc, s * 0.8) + t(x + w / 2, y + s * 1.13, s, label, fg, 600, 'middle'); };
const browser = (x, y, w, h) => `<g filter="url(#sh)">${r(x, y, w, h, '#fff', 18)}</g>${r(x, y, w, 46, '#f1f3f8', 18)}${r(x, y + 28, w, 18, '#f1f3f8')}${c(x + 26, y + 23, 7, '#ff6b6b')}${c(x + 48, y + 23, 7, '#ffc24b')}${c(x + 70, y + 23, 7, '#3ecf8e')}${r(x + 100, y + 12, w * 0.42, 22, '#fff', 11)}`;
const phone = (x, y, w, h, inner, screen = '#fff') => `<g filter="url(#sh)">${r(x, y, w, h, '#14161f', w * 0.16)}</g>${r(x + 10, y + 10, w - 20, h - 20, screen, w * 0.13)}<g transform="translate(${x + 10} ${y + 10})"><clipPath id="cp${x}${y}"><rect width="${w - 20}" height="${h - 20}" rx="${w * 0.13}"/></clipPath><g clip-path="url(#cp${x}${y})">${inner(w - 20, h - 20)}</g></g>${r(x + w / 2 - w * 0.17, y + 14, w * 0.34, 18, '#14161f', 9)}`;
const area = (pts, x, y, w, h) => { const step = w / (pts.length - 1); const P2 = pts.map((v, i) => [x + i * step, y + h - v * h]); let d = `M${P2[0][0]} ${P2[0][1]}`; for (let i = 1; i < P2.length; i++) { const [px, py] = P2[i - 1]; const [cx2, cy2] = P2[i]; const m = (px + cx2) / 2; d += ` C${m} ${py} ${m} ${cy2} ${cx2} ${cy2}`; } return { line: d, fill: `${d} L${x + w} ${y + h} L${x} ${y + h}Z` }; };

/* ════════ 1 · Dashboards & Web Interfaces ════════ */

// 1a · Analytics dashboard (tall feature tile)
{
  const W = 1100, H = 1000, x = 60, y = 70, w = 980, h = 860;
  let b = browser(x, y, w, h);
  b += r(x, y + 46, 190, h - 46, P.navy, 0) + r(x, y + h - 18, 190, 18, P.navy, 18);
  b += c(x + 40, y + 92, 14, P.blue) + t(x + 64, y + 99, 20, 'Pulse', '#fff', 700);
  ['Overview', 'Revenue', 'Customers', 'Reports', 'Settings'].forEach((n, i) => {
    const yy = y + 150 + i * 52;
    if (i === 0) b += r(x + 16, yy - 26, 158, 40, 'rgba(255,255,255,0.12)', 10);
    b += r(x + 32, yy - 14, 16, 16, i === 0 ? '#fff' : '#6b7199', 4) + t(x + 60, yy, 17, n, i === 0 ? '#fff' : '#a3a8c6', 500);
  });
  const cx = x + 220;
  b += t(cx, y + 100, 26, 'Revenue overview') + bar(cx, y + 116, 220, 10, '#e9ecf4');
  b += r(x + w - 200, y + 76, 170, 40, P.blue, 10) + t(x + w - 115, y + 102, 16, 'Export report', '#fff', 600, 'middle');
  [['MRR', '$84.2k', '+12.4%', P.green], ['Active users', '18,240', '+8.1%', P.green], ['Churn', '2.3%', '−0.4%', P.green], ['NPS', '62', '+5', P.green]].forEach(([l, v, d, col], i) => {
    const kx = cx + i * 192;
    b += card(kx, y + 150, 176, 112, 14) + t(kx + 18, y + 182, 15, l, P.body, 500) + t(kx + 18, y + 222, 30, v, P.ink, 700) + t(kx + 18, y + 248, 14, d, col, 600);
  });
  b += card(cx, y + 286, 500, 300, 14) + t(cx + 22, y + 322, 18, 'Monthly revenue') + pill(cx + 380, y + 302, '12 months', P.blue, '#eef2ff', 14);
  const ar = area([0.25, 0.32, 0.3, 0.42, 0.4, 0.5, 0.48, 0.6, 0.58, 0.7, 0.68, 0.82], cx + 24, y + 350, 452, 210);
  b += `<path d="${ar.fill}" fill="url(#ga)"/><path d="${ar.line}" fill="none" stroke="${P.blue}" stroke-width="4" stroke-linecap="round"/>`;
  for (let i = 0; i < 4; i++) b += r(cx + 24, y + 350 + i * 70, 452, 1.5, '#eef0f5');
  b += card(cx + 516, y + 286, 244, 300, 14) + t(cx + 538, y + 322, 18, 'Plan mix');
  const donut = [[0.52, P.blue], [0.3, P.violet], [0.18, P.teal]]; let a0 = -Math.PI / 2;
  donut.forEach(([f, col]) => { const a1 = a0 + f * Math.PI * 2; const R = 74, ox = cx + 638, oy = y + 440; const large = f > 0.5 ? 1 : 0; b += `<path d="M${ox + R * Math.cos(a0)} ${oy + R * Math.sin(a0)} A${R} ${R} 0 ${large} 1 ${ox + R * Math.cos(a1)} ${oy + R * Math.sin(a1)}" fill="none" stroke="${col}" stroke-width="26"/>`; a0 = a1 + 0.04; });
  b += t(cx + 638, y + 448, 24, '3.4k', P.ink, 700, 'middle');
  [['Pro', P.blue], ['Team', P.violet], ['Free', P.teal]].forEach(([l, col], i) => { b += c(cx + 548 + i * 72, y + 555, 6, col) + t(cx + 560 + i * 72, y + 560, 13, l, P.body, 500); });
  b += card(cx, y + 606, 760, 220, 14) + t(cx + 22, y + 642, 18, 'Top accounts');
  [['Northwind Labs', '$12.4k', 'Active', P.green], ['Acme Studio', '$9.1k', 'Active', P.green], ['Bluefin Co.', '$7.8k', 'At risk', P.amber]].forEach(([n, v, s, col], i) => {
    const yy = y + 690 + i * 44; b += avatar(cx + 40, yy - 6, 14, [P.blue, P.pink, P.teal][i]) + t(cx + 66, yy, 16, n, P.ink, 500) + t(cx + 420, yy, 16, v, P.ink, 600) + pill(cx + 580, yy - 20, s, col, col + '22', 13);
  });
  save('dash-analytics', svg(W, H, '#eef2ff', b, `<linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${P.blue}" stop-opacity="0.28"/><stop offset="1" stop-color="${P.blue}" stop-opacity="0"/></linearGradient>`));
}

// 1b · Kanban board
{
  const W = 1440, H = 1000, x = 60, y = 70, w = 1320, h = 860;
  let b = browser(x, y, w, h);
  b += t(x + 40, y + 108, 28, 'Website relaunch') + pill(x + 330, y + 84, 'Sprint 14', P.indigo, '#efedff', 16);
  [P.pink, P.teal, P.amber, P.blue].forEach((col, i) => { b += avatar(x + w - 250 + i * 34, y + 98, 18, col); });
  b += r(x + w - 110, y + 78, 80, 40, P.indigo, 10) + t(x + w - 70, y + 104, 16, '+ Task', '#fff', 600, 'middle');
  const cols = [['To do', 3, P.muted], ['In progress', 2, P.blue], ['Review', 2, P.amber], ['Done', 3, P.green]];
  const tags = [['Design', P.violet], ['Research', P.teal], ['Dev', P.blue], ['Content', P.pink]];
  cols.forEach(([name, n, col], i) => {
    const kx = x + 40 + i * 316;
    b += r(kx, y + 150, 296, h - 190, '#f5f7fb', 16) + c(kx + 24, y + 182, 6, col) + t(kx + 40, y + 188, 18, name) + t(kx + 270, y + 188, 16, String(n + 1), P.muted, 600, 'end');
    for (let k = 0; k < n; k++) {
      const yy = y + 214 + k * 168; const [tag, tc] = tags[(i + k) % 4];
      b += card(kx + 14, yy, 268, 150, 12) + pill(kx + 30, yy + 18, tag, tc, tc + '1f', 13) + bar(kx + 30, yy + 64, 210, 12, '#dfe3ec') + bar(kx + 30, yy + 86, 150, 12, '#eceef4');
      b += avatar(kx + 44, yy + 124, 13, [P.blue, P.pink, P.teal][k % 3]) + r(kx + 200, yy + 114, 66, 22, '#f1f3f8', 11) + t(kx + 233, yy + 130, 12, `${3 + k} / 5`, P.body, 600, 'middle');
      if (i === 3) b += c(kx + 250, yy + 32, 12, P.green) + `<path d="M${kx + 244} ${yy + 32} l4 4 l8 -8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
    }
  });
  save('dash-kanban', svg(W, H, '#f3efff', b));
}

// 1c · E-commerce orders
{
  const W = 1440, H = 1000, x = 60, y = 70, w = 1320, h = 860;
  let b = browser(x, y, w, h);
  b += t(x + 40, y + 108, 28, 'Orders') + t(x + 40, y + 140, 16, '1,284 orders this month', P.body, 500);
  ['All', 'Paid', 'Pending', 'Refunded'].forEach((f, i) => { b += pill(x + 320 + i * 120, y + 86, f, i === 0 ? '#fff' : P.body, i === 0 ? P.ink : '#f1f3f8', 15); });
  b += card(x + 40, y + 176, 600, 250, 14) + t(x + 64, y + 214, 18, 'Sales by day');
  [0.4, 0.62, 0.5, 0.8, 0.7, 0.92, 0.66].forEach((v, i) => { const bh = v * 160; b += r(x + 76 + i * 78, y + 400 - bh, 44, bh, i === 5 ? P.teal : '#cdeee9', 8); });
  [['Revenue', '$48.9k', P.teal], ['Avg. order', '$38.10', P.blue], ['Returns', '1.8%', P.pink]].forEach(([l, v, col], i) => {
    const kx = x + 660 + i * 206; b += card(kx, y + 176, 190, 250, 14) + c(kx + 34, y + 216, 16, col + '26') + c(kx + 34, y + 216, 6, col) + t(kx + 22, y + 290, 15, l, P.body, 500) + t(kx + 22, y + 330, 30, v, P.ink, 700) + bar(kx + 22, y + 370, 140, 10, col + '33') + bar(kx + 22, y + 370, 90, 10, col);
  });
  b += card(x + 40, y + 446, w - 80, 380, 14);
  ['Order', 'Customer', 'Date', 'Total', 'Status'].forEach((hd, i) => { b += t(x + 70 + i * 250, y + 490, 14, hd.toUpperCase(), P.muted, 600); });
  [['#10482', 'Maya Chen', 'Paid', P.green], ['#10481', 'Leo Park', 'Pending', P.amber], ['#10480', 'Aria Gomez', 'Paid', P.green], ['#10479', 'Noah Reed', 'Refunded', P.red], ['#10478', 'Zoe Hart', 'Paid', P.green]].forEach(([o, n, s, col], i) => {
    const yy = y + 548 + i * 56; b += r(x + 60, yy - 34, w - 120, 1.5, '#eef0f5') + t(x + 70, yy, 16, o, P.ink, 600) + avatar(x + 334, yy - 6, 13, [P.blue, P.pink, P.teal, P.amber, P.violet][i]) + t(x + 356, yy, 16, n, P.ink, 500) + t(x + 570, yy, 16, `Nov ${20 - i}`, P.body, 500) + t(x + 820, yy, 16, `$${(42 + i * 7.5).toFixed(2)}`, P.ink, 600) + pill(x + 1070, yy - 22, s, col, col + '1f', 14);
  });
  save('dash-orders', svg(W, H, '#e8f7f4', b));
}

// 1d · Billing settings
{
  const W = 1440, H = 1000, x = 60, y = 70, w = 1320, h = 860;
  let b = browser(x, y, w, h);
  b += t(x + 40, y + 108, 28, 'Plans & billing');
  ['General', 'Team', 'Billing', 'Security'].forEach((n, i) => { b += t(x + 40 + i * 130, y + 160, 17, n, i === 2 ? P.blue : P.body, i === 2 ? 600 : 500) + (i === 2 ? r(x + 40, y + 172, 70, 4, P.blue, 2) : ''); });
  b += r(x + 40, y + 180, w - 80, 1.5, P.line);
  [['Starter', '$0', false], ['Pro', '$24', true], ['Business', '$59', false]].forEach(([n, p, on], i) => {
    const kx = x + 40 + i * 420, yy = y + 220;
    b += r(kx, yy, 400, 420, on ? '#f5f7ff' : '#fff', 18, `stroke="${on ? P.blue : P.line}" stroke-width="${on ? 3 : 2}"`);
    if (on) b += pill(kx + 270, yy + 24, 'Popular', '#fff', P.blue, 14);
    b += t(kx + 32, yy + 70, 22, n) + t(kx + 32, yy + 140, 52, p, P.ink, 800) + t(kx + 32 + p.length * 32, yy + 140, 18, '/ month', P.body, 500);
    for (let k = 0; k < 4; k++) b += c(kx + 44, yy + 196 + k * 44, 11, on ? P.blue : '#dfe7ff') + `<path d="M${kx + 39} ${yy + 196 + k * 44} l3.5 3.5 l7 -7" fill="none" stroke="${on ? '#fff' : P.blue}" stroke-width="2.6" stroke-linecap="round"/>` + bar(kx + 68, yy + 190 + k * 44, 200 - k * 22, 12, '#e3e7f0');
    b += r(kx + 32, yy + 350, 336, 48, on ? P.blue : '#fff', 12, on ? '' : `stroke="${P.line}" stroke-width="2"`) + t(kx + 200, yy + 381, 17, on ? 'Current plan' : 'Choose plan', on ? '#fff' : P.ink, 600, 'middle');
  });
  b += card(x + 40, y + 670, w - 80, 150, 14) + r(x + 70, y + 704, 80, 54, P.navy, 10) + r(x + 82, y + 718, 22, 16, '#f5c451', 3) + t(x + 176, y + 728, 18, 'Visa ending 4242') + t(x + 176, y + 754, 15, 'Expires 08 / 28', P.body, 500) + r(x + w - 220, y + 712, 150, 44, '#fff', 10, `stroke="${P.line}" stroke-width="2"`) + t(x + w - 145, y + 740, 16, 'Update', P.ink, 600, 'middle');
  save('dash-billing', svg(W, H, '#fff4e6', b));
}

/* ════════ 2 · Mobile App Interfaces ════════ */
const PW = 300, PH = 620;
const three = (bg, screens) => { let b = ''; const xs = [95, 485, 875]; const ys = [230, 150, 230]; screens.forEach((fn, i) => { b += phone(xs[i], ys[i], PW, PH, fn); }); return svg(1270, 1000, bg, b); };

// 2a · Fitness
save('mobile-fitness', three('#e9f9ef', [
  (w) => { let s = r(0, 0, w, 600, '#0f1a14'); s += t(22, 70, 15, 'Good morning', '#9fb8a8', 500) + t(22, 100, 24, 'Your activity', '#fff', 700); [[78, P.green, 0.8], [58, '#7dd3fc', 0.62], [38, '#f9a8d4', 0.9]].forEach(([R, col, f]) => { const ox = w / 2, oy = 230; s += c(ox, oy, R, 'none', `stroke="${col}" stroke-opacity="0.2" stroke-width="16"`) + `<circle cx="${ox}" cy="${oy}" r="${R}" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * R * f} 999" transform="rotate(-90 ${ox} ${oy})"/>`; }); [['8,420', 'Steps'], ['540', 'kcal'], ['42', 'min']].forEach(([v, l], i) => { s += t(40 + i * 84, 380, 20, v, '#fff', 700, 'middle') + t(40 + i * 84, 402, 12, l, '#9fb8a8', 500, 'middle'); }); s += r(16, 432, w - 32, 130, '#18261d', 16); [0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3].forEach((v, i) => { s += r(36 + i * 32, 540 - v * 80, 16, v * 80, i === 3 ? P.green : '#2f4a38', 8); }); return s; },
  (w) => { let s = t(22, 70, 24, 'Workouts', P.ink, 700) + r(16, 92, w - 32, 150, P.green, 18) + t(34, 140, 20, 'HIIT Burn', '#fff', 700) + t(34, 166, 13, '25 min · Intermediate', '#e8fff0', 500) + r(34, 190, 90, 32, '#fff', 16) + t(79, 211, 13, 'Start', P.green, 700, 'middle'); ['Yoga flow', 'Core strength', 'Morning run'].forEach((n, i) => { const yy = 264 + i * 96; s += r(16, yy, w - 32, 82, '#f4f6f5', 14) + r(30, yy + 14, 54, 54, ['#d9f99d', '#bae6fd', '#fbcfe8'][i], 12) + t(98, yy + 38, 15, n, P.ink, 600) + bar(98, yy + 50, 110, 9, '#dfe5e1'); }); return s; },
  (w) => { let s = t(22, 70, 24, 'Progress', P.ink, 700) + pill(22, 88, 'Week', '#fff', P.ink, 12) + pill(82, 88, 'Month', P.body, '#eef1ef', 12); const ar = area([0.3, 0.45, 0.4, 0.62, 0.55, 0.75, 0.7], 22, 140, w - 44, 170); s += `<path d="${ar.fill}" fill="${P.green}" fill-opacity="0.16"/><path d="${ar.line}" fill="none" stroke="${P.green}" stroke-width="4"/>`; [['Weight', '64.2 kg'], ['Sleep', '7h 40m'], ['Heart rate', '68 bpm']].forEach(([l, v], i) => { const yy = 350 + i * 76; s += r(16, yy, w - 32, 62, '#f4f6f5', 14) + t(32, yy + 37, 14, l, P.body, 500) + t(w - 32, yy + 38, 16, v, P.ink, 700, 'end'); }); return s; },
]));

// 2b · Banking
save('mobile-banking', three('#eef0ff', [
  (w) => { let s = t(22, 66, 14, 'Total balance', P.body, 500) + t(22, 100, 30, '$12,840.50', P.ink, 800); s += `<rect x="16" y="124" width="${w - 32}" height="160" rx="18" fill="url(#gb)"/>` + t(34, 168, 14, 'Nova Card', '#dfe3ff', 500) + t(34, 236, 18, '•••• 4821', '#fff', 600) + c(w - 60, 248, 14, '#ff8a65', 'opacity="0.9"') + c(w - 44, 248, 14, '#ffd54f', 'opacity="0.85"'); ['Send', 'Pay', 'Top up', 'More'].forEach((n, i) => { s += c(44 + i * 66, 330, 22, '#eef0ff') + c(44 + i * 66, 330, 7, P.indigo) + t(44 + i * 66, 374, 12, n, P.body, 500, 'middle'); }); s += t(22, 420, 16, 'Recent', P.ink, 700); [['Spotify', '−$9.99'], ['Salary', '+$3,200'], ['Coffee Lab', '−$4.50']].forEach(([n, v], i) => { const yy = 446 + i * 54; s += c(40, yy + 14, 18, ['#dcfce7', '#e0e7ff', '#fde68a'][i]) + t(68, yy + 19, 14, n, P.ink, 600) + t(w - 22, yy + 19, 14, v, v.startsWith('+') ? P.green : P.ink, 700, 'end'); }); return s; },
  (w) => { let s = t(22, 70, 24, 'Spending', P.ink, 700) + t(22, 96, 13, 'November', P.body, 500); const ox = w / 2, oy = 220; [[0.4, P.indigo], [0.25, P.pink], [0.2, P.teal], [0.15, P.amber]].reduce((a0, [f, col]) => { const a1 = a0 + f * Math.PI * 2; const R = 80; s += `<path d="M${ox + R * Math.cos(a0)} ${oy + R * Math.sin(a0)} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${ox + R * Math.cos(a1)} ${oy + R * Math.sin(a1)}" fill="none" stroke="${col}" stroke-width="24"/>`; return a1 + 0.05; }, -Math.PI / 2); s += t(ox, oy + 8, 22, '$2,140', P.ink, 800, 'middle'); [['Housing', '$860', P.indigo], ['Food', '$535', P.pink], ['Travel', '$428', P.teal], ['Other', '$317', P.amber]].forEach(([n, v, col], i) => { const yy = 350 + i * 52; s += r(16, yy, w - 32, 42, '#f5f6fb', 12) + c(36, yy + 21, 7, col) + t(54, yy + 26, 13, n, P.ink, 600) + t(w - 30, yy + 26, 13, v, P.ink, 700, 'end'); }); return s; },
  (w) => { let s = t(22, 70, 24, 'Send money', P.ink, 700); [P.pink, P.teal, P.amber, P.blue].forEach((col, i) => { s += avatar(44 + i * 66, 130, 24, col); }); s += t(w / 2, 240, 44, '$250', P.ink, 800, 'middle') + t(w / 2, 270, 13, 'to Maya Chen', P.body, 500, 'middle'); for (let k = 0; k < 9; k++) s += t(60 + (k % 3) * 80, 340 + Math.floor(k / 3) * 62, 24, String(k + 1), P.ink, 600, 'middle'); s += r(16, 532, w - 32, 50, P.indigo, 14) + t(w / 2, 563, 15, 'Send', '#fff', 700, 'middle'); return s; },
]).replace('</defs>', `<linearGradient id="gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.indigo}"/><stop offset="1" stop-color="${P.violet}"/></linearGradient></defs>`));

// 2c · Food delivery
save('mobile-food', three('#fff1ea', [
  (w) => { let s = t(22, 66, 13, 'Deliver to · Home', P.body, 500) + t(22, 96, 24, 'Hungry, Sam?', P.ink, 700) + r(16, 116, w - 32, 44, '#f5f3f1', 12) + bar(40, 133, 120, 10, '#ddd6d0'); ['Pizza', 'Sushi', 'Salad', 'Dessert'].forEach((n, i) => { s += c(44 + i * 66, 200, 24, ['#fed7aa', '#fecaca', '#bbf7d0', '#fbcfe8'][i]) + t(44 + i * 66, 244, 11, n, P.body, 600, 'middle'); }); [0, 1].forEach((i) => { const yy = 270 + i * 160; s += r(16, yy, w - 32, 146, '#fff', 16, `stroke="${P.line}" stroke-width="2"`) + r(16, yy, w - 32, 86, ['#fdba74', '#86efac'][i], 16) + r(16, yy + 70, w - 32, 16, ['#fdba74', '#86efac'][i]) + t(30, yy + 114, 15, ['Bella Napoli', 'Green Bowl'][i], P.ink, 700) + t(30, yy + 134, 12, ['★ 4.8 · 20–30 min', '★ 4.6 · 15–25 min'][i], P.body, 500); }); return s; },
  (w) => { let s = r(0, 0, w, 250, '#fdba74') + c(w / 2, 140, 90, '#fff7ed', 'opacity="0.55"') + c(w / 2, 140, 64, '#f97316', 'opacity="0.8"') + t(22, 290, 22, 'Margherita', P.ink, 700) + t(22, 316, 13, 'Tomato, mozzarella, basil', P.body, 500) + t(22, 360, 26, '$14.50', '#f97316', 800); ['Small', 'Medium', 'Large'].forEach((n, i) => { s += r(22 + i * 86, 384, 76, 40, i === 1 ? '#f97316' : '#f5f3f1', 12) + t(60 + i * 86, 409, 13, n, i === 1 ? '#fff' : P.body, 600, 'middle'); }); s += r(16, 520, w - 32, 54, '#f97316', 16) + t(w / 2, 553, 15, 'Add to basket · $14.50', '#fff', 700, 'middle'); return s; },
  (w) => { let s = t(22, 70, 24, 'On the way', P.ink, 700) + r(16, 92, w - 32, 250, '#fde7d6', 16); s += `<path d="M50 300 C 90 220, 170 260, 200 170 S 250 120, 240 110" fill="none" stroke="#f97316" stroke-width="5" stroke-dasharray="10 8"/>` + c(50, 300, 12, '#f97316') + c(240, 110, 14, P.ink); s += t(22, 386, 13, 'Arriving in', P.body, 500) + t(22, 418, 28, '12 min', P.ink, 800); ['Order placed', 'Preparing', 'On the way'].forEach((n, i) => { const yy = 450 + i * 40; s += c(32, yy, 9, i < 3 ? '#f97316' : '#e7e5e4') + t(52, yy + 5, 13, n, P.ink, 600); }); return s; },
]));

// 2d · Travel
save('mobile-travel', three('#e6f4ff', [
  (w) => { let s = t(22, 66, 13, 'Where to next?', P.body, 500) + t(22, 96, 24, 'Explore', P.ink, 700); s += `<rect x="16" y="118" width="${w - 32}" height="260" rx="20" fill="url(#gt)"/>` + `<path d="M16 330 L90 250 L150 300 L220 220 L${w - 16} 300 L${w - 16} 378 L16 378Z" fill="#0e7490" opacity="0.55"/>` + c(w - 60, 170, 22, '#fde68a') + t(34, 350, 20, 'Lisbon', '#fff', 700) + t(34, 368, 12, 'Portugal · from $420', '#e0f2fe', 500); [['Kyoto', '#fda4af'], ['Bali', '#86efac']].forEach(([n, col], i) => { const xx = 16 + i * ((w - 40) / 2 + 8); s += r(xx, 396, (w - 40) / 2, 150, col, 16) + t(xx + 14, 528, 15, n, '#fff', 700); }); return s; },
  (w) => { let s = t(22, 70, 24, 'Your flight', P.ink, 700) + r(16, 96, w - 32, 300, '#fff', 20, `stroke="${P.line}" stroke-width="2"`) + t(36, 150, 30, 'LHR', P.ink, 800) + t(w - 36, 150, 30, 'LIS', P.ink, 800, 'end') + t(36, 174, 12, 'London', P.body, 500) + t(w - 36, 174, 12, 'Lisbon', P.body, 500, 'end') + `<path d="M110 140 Q ${w / 2} 100 ${w - 110} 140" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="6 6"/>` + r(36, 214, w - 72, 2, '#eef0f5'); [['Date', '24 Dec'], ['Gate', 'B12'], ['Seat', '14A']].forEach(([l, v], i) => { s += t(36 + i * 76, 256, 11, l, P.body, 500) + t(36 + i * 76, 280, 16, v, P.ink, 700); }); for (let k = 0; k < 28; k++) s += r(36 + k * 7.6, 316, k % 3 ? 3 : 5, 56, P.ink); return s; },
  (w) => { let s = t(22, 70, 24, 'Pick a seat', P.ink, 700); for (let row = 0; row < 8; row++) for (let col = 0; col < 4; col++) { const taken = (row * 3 + col) % 5 === 0; const sel = row === 3 && col === 1; s += r(46 + col * 52 + (col > 1 ? 24 : 0), 110 + row * 52, 40, 40, sel ? '#0ea5e9' : taken ? '#d6dbe4' : '#e0f2fe', 10); } s += r(16, 540, w - 32, 50, '#0ea5e9', 14) + t(w / 2, 571, 15, 'Confirm seat 4B', '#fff', 700, 'middle'); return s; },
]).replace('</defs>', '<linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#0284c7"/></linearGradient></defs>'));

/* ════════ 3 · Design Systems & Components ════════ */

// 3a · Colour tokens (portrait)
{
  const W = 560, H = 1000;
  let b = card(40, 40, W - 80, H - 80, 22) + t(76, 108, 30, 'Colour') + t(76, 140, 15, 'Primary · Indigo', P.body, 500);
  const scale = ['#eef0ff', '#dde1ff', '#bcc4ff', '#8f9cff', '#6874fb', '#4f55f0', '#3f41d6', '#3434ad', '#2c2f88', '#1d1f52'];
  scale.forEach((col, i) => { const yy = 170 + i * 66; b += r(76, yy, 120, 54, col, 12) + t(220, yy + 24, 17, String(i === 0 ? 50 : i * 100), P.ink, 700) + t(220, yy + 46, 14, col.toUpperCase(), P.body, 500); });
  ['#22c55e', '#f59e0b', '#ef4444', '#0ea5e9'].forEach((col, i) => { b += c(392, 210 + i * 90, 30, col) + t(392, 268 + i * 90, 12, ['Success', 'Warning', 'Error', 'Info'][i], P.body, 600, 'middle'); });
  save('ds-colour', svg(W, H, '#eef0ff', b));
}

// 3b · Typography
{
  const W = 1800, H = 1000;
  let b = card(50, 50, W - 100, H - 100, 24) + r(100, 100, 560, 800, '#4f55f0', 22) + t(380, 560, 300, 'Aa', '#fff', 700, 'middle') + t(380, 680, 30, 'Inter', '#dde1ff', 600, 'middle') + t(380, 720, 20, 'Regular · Medium · Semibold · Bold', '#bcc4ff', 500, 'middle');
  [['Display', 64, 800, 'Design at scale'], ['Heading 1', 48, 700, 'Build with clarity'], ['Heading 2', 36, 700, 'Consistent and calm'], ['Body', 24, 400, 'Every component, one source of truth.'], ['Caption', 18, 500, 'Tokens · Components · Patterns']].forEach(([l, s, wgt, txt], i) => {
    const yy = 180 + i * 150; b += t(720, yy - 36, 16, `${l.toUpperCase()} · ${s}/${Math.round(s * 1.25)}`, P.muted, 600) + t(720, yy + s * 0.35, s, txt, P.ink, wgt) + r(720, yy + 52, 960, 1.5, P.line);
  });
  save('ds-type', svg(W, H, '#f4f2ff', b));
}

// 3c · Buttons
{
  const W = 2500, H = 1000;
  let b = card(50, 50, W - 100, H - 100, 24) + t(110, 150, 40, 'Buttons') + t(110, 196, 22, 'Variants, sizes and states', P.body, 500);
  const btn = (x, y, w, h, label, kind, state = '') => {
    const st = { primary: ['#4f55f0', '#fff', ''], secondary: ['#fff', '#2c2f88', 'stroke="#c9cff0" stroke-width="3"'], ghost: ['#eef0ff', '#3f41d6', ''], danger: ['#ef4444', '#fff', ''] }[kind];
    const fill = state === 'hover' ? (kind === 'primary' ? '#3f41d6' : kind === 'danger' ? '#dc2626' : '#e2e5ff') : state === 'disabled' ? '#e8eaf0' : st[0];
    return r(x, y, w, h, fill, h / 4, state === 'focus' ? 'stroke="#8f9cff" stroke-width="6"' : st[2]) + t(x + w / 2, y + h / 2 + h * 0.13, h * 0.34, label, state === 'disabled' ? '#a3a9ba' : st[1], 600, 'middle');
  };
  ['primary', 'secondary', 'ghost', 'danger'].forEach((k, i) => { b += t(110, 300 + i * 150, 20, k[0].toUpperCase() + k.slice(1), P.muted, 600); ['', 'hover', 'focus', 'disabled'].forEach((s, j) => { b += btn(340 + j * 420, 252 + i * 150, 340, 84, k === 'danger' ? 'Delete' : 'Continue', k, s); }); });
  ['Default', 'Hover', 'Focus', 'Disabled'].forEach((s, j) => { b += t(510 + j * 420, 860, 20, s, P.muted, 600, 'middle'); });
  b += t(2050, 300, 20, 'SIZES', P.muted, 600); [[72, 'Large'], [58, 'Medium'], [44, 'Small']].forEach(([h, l], i) => { b += btn(2050, 330 + i * 120, 320, h, l, 'primary'); });
  save('ds-buttons', svg(W, H, '#eef6ff', b));
}

// 3d · Form controls
{
  const W = 2500, H = 1000;
  let b = card(50, 50, W - 100, H - 100, 24) + t(110, 150, 40, 'Form controls') + t(110, 196, 22, 'Inputs, selection and feedback', P.body, 500);
  b += t(110, 290, 20, 'Email', P.ink, 600) + r(110, 310, 620, 84, '#fff', 14, 'stroke="#4f55f0" stroke-width="4"') + t(140, 362, 24, 'sam@studio.com', P.ink, 500) + r(110, 410, 620, 1, 'none');
  b += t(110, 470, 20, 'Password', P.ink, 600) + r(110, 490, 620, 84, '#fff', 14, 'stroke="#ef4444" stroke-width="3"') + t(140, 542, 24, '••••••', P.ink, 600) + t(110, 610, 18, 'At least 8 characters', '#ef4444', 500);
  b += t(110, 700, 20, 'Plan', P.ink, 600) + r(110, 720, 620, 84, '#fff', 14, 'stroke="#c9cff0" stroke-width="3"') + t(140, 772, 24, 'Pro · monthly', P.ink, 500) + `<path d="M690 755 l12 12 l12 -12" fill="none" stroke="#5b6275" stroke-width="4" stroke-linecap="round"/>`;
  [[true, 'Email updates'], [false, 'SMS alerts'], [true, 'Weekly digest']].forEach(([on, l], i) => { const yy = 320 + i * 110; b += r(880, yy, 96, 52, on ? '#4f55f0' : '#d6dbe8', 26) + c(on ? 950 : 906, yy + 26, 20, '#fff') + t(1004, yy + 34, 24, l, P.ink, 500); });
  [[true, 'Remember me'], [false, 'Keep me signed in'], [true, 'I agree to the terms']].forEach(([on, l], i) => { const yy = 320 + i * 110; b += r(1460, yy, 48, 48, on ? '#4f55f0' : '#fff', 10, on ? '' : 'stroke="#c9cff0" stroke-width="3"') + (on ? `<path d="M${1472} ${yy + 24} l8 8 l16 -16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : '') + t(1532, yy + 34, 24, l, P.ink, 500); });
  b += t(880, 700, 20, 'BADGES', P.muted, 600); [['New', '#4f55f0', '#eef0ff'], ['Active', '#16a34a', '#dcfce7'], ['Pending', '#b45309', '#fef3c7'], ['Failed', '#dc2626', '#fee2e2'], ['Beta', '#7c3aed', '#ede9fe']].forEach(([l, fg, bg], i) => { b += pill(880 + i * 200, 730, l, fg, bg, 26); });
  [[true], [false], [false]].forEach(([on], i) => { const yy = 676 + i * 74; b += c(2120, yy, 22, '#fff', `stroke="${on ? '#4f55f0' : '#c9cff0'}" stroke-width="${on ? 11 : 3}"`) + t(2164, yy + 9, 24, ['Monthly', 'Yearly', 'Custom'][i], P.ink, 500); });
  save('ds-forms', svg(W, H, '#fef6ee', b));
}

/* ════════ 4 · Wireframes, Flows & Prototypes ════════ */
const WF = { line: '#c3c9d6', fill: '#e9ecf2', ink: '#7a8296' };
const wfBox = (x, y, w, h) => r(x, y, w, h, '#fff', 10, `stroke="${WF.line}" stroke-width="3"`);
const wfImg = (x, y, w, h) => r(x, y, w, h, WF.fill, 8) + `<path d="M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}" stroke="${WF.line}" stroke-width="2"/>`;

// 4a · Low-fidelity wireframes
{
  const W = 1860, H = 1000;
  let b = '';
  [0, 1, 2].forEach((i) => {
    const x = 70 + i * 590, y = 90, w = 540, h = 820;
    b += wfBox(x, y, w, h) + r(x, y, w, 60, WF.fill, 10) + r(x, y + 50, w, 10, WF.fill) + bar(x + 24, y + 24, 90, 12, WF.line) + [0, 1, 2].map((k) => bar(x + 280 + k * 80, y + 24, 56, 12, WF.line)).join('');
    if (i === 0) b += wfImg(x + 24, y + 90, w - 48, 260) + bar(x + 24, y + 380, 300, 22, WF.line) + bar(x + 24, y + 420, 420, 12, WF.fill) + bar(x + 24, y + 444, 360, 12, WF.fill) + r(x + 24, y + 480, 160, 50, WF.line, 10) + [0, 1, 2].map((k) => wfImg(x + 24 + k * 168, y + 570, 156, 120) + bar(x + 24 + k * 168, y + 706, 120, 12, WF.fill)).join('');
    if (i === 1) b += bar(x + 24, y + 96, 240, 22, WF.line) + [0, 1, 2, 3].map((k) => r(x + 24, y + 140 + k * 150, w - 48, 130, '#fff', 10, `stroke="${WF.line}" stroke-width="2"`) + wfImg(x + 40, y + 156 + k * 150, 98, 98) + bar(x + 160, y + 172 + k * 150, 200, 14, WF.line) + bar(x + 160, y + 198 + k * 150, 280, 10, WF.fill) + bar(x + 160, y + 218 + k * 150, 220, 10, WF.fill)).join('');
    if (i === 2) b += bar(x + 24, y + 96, 200, 22, WF.line) + [0, 1, 2, 3].map((k) => bar(x + 24, y + 150 + k * 100, 120, 12, WF.ink) + r(x + 24, y + 172 + k * 100, w - 48, 48, '#fff', 8, `stroke="${WF.line}" stroke-width="2"`)).join('') + r(x + 24, y + 600, w - 48, 60, WF.ink, 10) + bar(x + 160, y + 690, 220, 12, WF.fill);
  });
  save('wire-lofi', svg(W, H, '#f3f4f7', b));
}

// 4b · User flow
{
  const W = 1860, H = 1000;
  const node = (x, y, w, label, kind = 'step') => kind === 'start' ? r(x, y, w, 80, '#4f55f0', 40) + t(x + w / 2, y + 50, 24, label, '#fff', 600, 'middle') : kind === 'decision' ? `<path d="M${x + w / 2} ${y - 20} L${x + w + 20} ${y + 40} L${x + w / 2} ${y + 100} L${x - 20} ${y + 40}Z" fill="#fff7e6" stroke="#f59e0b" stroke-width="3"/>` + t(x + w / 2, y + 48, 22, label, '#92400e', 600, 'middle') : r(x, y, w, 80, '#fff', 16, 'stroke="#c9cff0" stroke-width="3"') + t(x + w / 2, y + 50, 22, label, P.ink, 600, 'middle');
  const arrow = (d) => `<path d="${d}" fill="none" stroke="#8f9cff" stroke-width="3.5" marker-end="url(#ar)"/>`;
  let b = t(80, 120, 34, 'Checkout flow') + t(80, 160, 20, 'Guest and signed-in paths', P.body, 500);
  b += node(80, 420, 220, 'Cart', 'start') + arrow('M300 460 H 380') + node(390, 420, 240, 'Signed in?', 'decision') + arrow('M510 400 V 270 H 730') + arrow('M510 520 V 650 H 730') + t(520, 330, 18, 'Yes', P.green, 600) + t(520, 610, 18, 'No', P.red, 600);
  b += node(740, 230, 260, 'Saved address') + node(740, 610, 260, 'Guest details') + arrow('M1000 270 H 1100 V 420') + arrow('M1000 650 H 1100 V 500') + node(1010, 420, 240, 'Payment') + arrow('M1250 460 H 1330') + node(1340, 420, 240, 'Valid card?', 'decision') + arrow('M1580 460 H 1650') + r(1660, 420, 140, 80, '#dcfce7', 40) + t(1730, 470, 22, 'Done', '#15803d', 700, 'middle') + arrow('M1460 520 V 700 H 1250 V 760') + node(1130, 760, 240, 'Retry payment') + t(1470, 640, 18, 'No', P.red, 600);
  save('flow-checkout', svg(W, H, '#f1f3ff', b, '<marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#8f9cff"/></marker>'));
}

// 4c · Sitemap
{
  const W = 1860, H = 1000;
  const box = (x, y, w, label, top = false) => r(x, y, w, 70, top ? '#1d1f52' : '#fff', 14, top ? '' : 'stroke="#c9cff0" stroke-width="3"') + t(x + w / 2, y + 44, 21, label, top ? '#fff' : P.ink, 600, 'middle');
  let b = t(80, 120, 34, 'Sitemap') + t(80, 160, 20, 'Information architecture · v2', P.body, 500) + box(800, 200, 260, 'Home', true);
  const L1 = ['Product', 'Solutions', 'Pricing', 'Resources', 'Company'];
  L1.forEach((n, i) => { const x = 90 + i * 350; b += `<path d="M930 270 V 320 H ${x + 130} V 360" fill="none" stroke="#b6bdf5" stroke-width="3"/>` + box(x, 360, 260, n); const kids = [['Features', 'Integrations', 'Security'], ['Startups', 'Enterprise'], ['Plans', 'Compare'], ['Blog', 'Guides', 'Docs'], ['About', 'Careers']][i]; kids.forEach((k, j) => { const yy = 490 + j * 100; b += `<path d="M${x + 40} 430 V ${yy + 35} H ${x + 70}" fill="none" stroke="#d6dbf5" stroke-width="3"/>` + r(x + 70, yy, 190, 64, '#f5f6ff', 12) + t(x + 165, yy + 40, 18, k, P.body, 500, 'middle'); }); });
  save('flow-sitemap', svg(W, H, '#f6f5ff', b));
}

// 4d · Prototype links
{
  const W = 1860, H = 1000;
  const scr = (x, y, inner) => r(x, y, 300, 600, '#fff', 30, `stroke="${WF.line}" stroke-width="3"`) + inner(x, y);
  let b = t(80, 110, 34, 'Prototype') + t(80, 150, 20, 'Onboarding · interactions', P.body, 500);
  b += scr(140, 230, (x, y) => wfImg(x + 30, y + 60, 240, 240) + bar(x + 30, y + 340, 200, 18, WF.line) + bar(x + 30, y + 376, 240, 12, WF.fill) + r(x + 30, y + 500, 240, 56, '#4f55f0', 14));
  b += scr(780, 180, (x, y) => bar(x + 30, y + 60, 160, 18, WF.line) + [0, 1, 2].map((k) => r(x + 30, y + 110 + k * 90, 240, 70, k === 1 ? '#eef0ff' : '#fff', 12, `stroke="${k === 1 ? '#4f55f0' : WF.line}" stroke-width="3"`) + bar(x + 54, y + 140 + k * 90, 140, 12, WF.line)).join('') + r(x + 30, y + 500, 240, 56, '#4f55f0', 14));
  b += scr(1420, 230, (x, y) => c(x + 150, y + 200, 70, '#dcfce7') + `<path d="M${x + 120} ${y + 200} l22 22 l40 -40" fill="none" stroke="#16a34a" stroke-width="9" stroke-linecap="round"/>` + bar(x + 60, y + 320, 180, 18, WF.line) + bar(x + 40, y + 356, 220, 12, WF.fill) + r(x + 30, y + 500, 240, 56, '#4f55f0', 14));
  const link = (d) => `<path d="${d}" fill="none" stroke="#4f55f0" stroke-width="4" marker-end="url(#ap)"/>`;
  b += c(410, 758, 10, '#4f55f0') + link('M410 758 C 560 758, 640 560, 770 470') + c(1050, 708, 10, '#4f55f0') + link('M1050 708 C 1200 708, 1290 560, 1410 520');
  b += r(560, 600, 150, 40, '#4f55f0', 20) + t(635, 627, 16, 'On tap', '#fff', 600, 'middle') + r(1200, 620, 170, 40, '#4f55f0', 20) + t(1285, 647, 16, 'Smart animate', '#fff', 600, 'middle');
  save('flow-prototype', svg(W, H, '#eef0ff', b, '<marker id="ap" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#4f55f0"/></marker>'));
}

console.log('wrote', fs.readdirSync(OUT).length, 'files to', OUT);
