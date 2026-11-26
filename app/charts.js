// NihonScope charts: small hand-rolled SVG charts, no libraries, no network.
// Every chart takes plain arrays and returns an SVG string. Colours come from
// the site palette (indigo ink, vermilion accent, warm paper background).

const INK = '#1f2a44';
const GRID = '#d9dee8';
const ACCENT = '#c0392b';
const BLUE = '#2e5fa3';
const TEAL = '#1f7a6d';
const MUTED = '#5b6577';

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Nice axis ticks: pick up to 5 round steps across [min, max].
function ticks(min, max) {
  const span = max - min || 1;
  const stepRaw = span / 4;
  const mag = 10 ** Math.floor(Math.log10(stepRaw));
  const norm = stepRaw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const start = Math.ceil(min / step) * step;
  const out = [];
  for (let v = start; v <= max + step * 0.001; v += step) out.push(Math.round(v * 100) / 100);
  return out;
}

function fmt(v) {
  if (Math.abs(v) >= 1000) return v.toLocaleString('en-US');
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 100) / 100);
}

// Line chart over YEARS. opts: { width, height, colour, unit, fromYear }
export function lineChart(years, values, opts = {}) {
  const w = opts.width || 760;
  const h = opts.height || 300;
  const padL = 58;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  const from = opts.fromYear || years[0];
  const pts = years.map((y, i) => ({ y, v: values[i] })).filter((p) => p.y >= from);
  const vals = pts.map((p) => p.v);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  const pad = (max - min) * 0.12 || Math.abs(max) * 0.1 || 1;
  min -= pad;
  max += pad;
  const X = (y) => padL + ((y - pts[0].y) / Math.max(1, pts[pts.length - 1].y - pts[0].y)) * (w - padL - padR);
  const Y = (v) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
  const tk = ticks(min, max);
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Line chart" xmlns="http://www.w3.org/2000/svg">`;
  for (const t of tk) {
    s += `<line x1="${padL}" y1="${Y(t)}" x2="${w - padR}" y2="${Y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${Y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(t)}</text>`;
  }
  for (let i = 0; i < pts.length; i += Math.ceil(pts.length / 6)) {
    s += `<text x="${X(pts[i].y)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${pts[i].y}</text>`;
  }
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.y).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
  const area = `${path} L${X(pts[pts.length - 1].y).toFixed(1)},${Y(min).toFixed(1)} L${X(pts[0].y).toFixed(1)},${Y(min).toFixed(1)} Z`;
  s += `<path d="${area}" fill="${opts.colour || BLUE}" opacity="0.10"/>`;
  s += `<path d="${path}" fill="none" stroke="${opts.colour || BLUE}" stroke-width="2.5" stroke-linejoin="round"/>`;
  for (const p of pts) {
    s += `<circle cx="${X(p.y).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="3.2" fill="#fff" stroke="${opts.colour || BLUE}" stroke-width="2"/>`;
  }
  const last = pts[pts.length - 1];
  s += `<text x="${Math.min(X(last.y) - 4, w - padR - 90)}" y="${Math.max(Y(last.v) - 10, 14)}" font-size="13" font-weight="700" fill="${INK}">${fmt(last.v)} ${esc(opts.unit || '')}</text>`;
  s += '</svg>';
  return s;
}

// Vertical bar chart over YEARS. opts: { width, height, colour, unit, fromYear }
export function barChart(years, values, opts = {}) {
  const w = opts.width || 760;
  const h = opts.height || 300;
  const padL = 58;
  const padR = 14;
  const padT = 26;
  const padB = 30;
  const from = opts.fromYear || years[0];
  const pts = years.map((y, i) => ({ y, v: values[i] })).filter((p) => p.y >= from);
  const max = Math.max(...pts.map((p) => p.v), 0) * 1.12;
  const min = Math.min(0, ...pts.map((p) => p.v));
  const Y = (v) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
  const slot = (w - padL - padR) / pts.length;
  const bw = Math.min(46, slot * 0.62);
  const tk = ticks(min, max);
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Bar chart" xmlns="http://www.w3.org/2000/svg">`;
  for (const t of tk) {
    s += `<line x1="${padL}" y1="${Y(t)}" x2="${w - padR}" y2="${Y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${Y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(t)}</text>`;
  }
  pts.forEach((p, i) => {
    const x = padL + slot * i + (slot - bw) / 2;
    const neg = p.v < 0;
    s += `<rect x="${x.toFixed(1)}" y="${(neg ? Y(0) : Y(p.v)).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.abs(Y(p.v) - Y(0)).toFixed(1)}" rx="3" fill="${neg ? ACCENT : opts.colour || BLUE}"/>`;
    if (i % 2 === 0 || pts.length <= 6) {
      s += `<text x="${(x + bw / 2).toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${p.y}</text>`;
    }
    if (i === pts.length - 1) {
      s += `<text x="${(x + bw / 2).toFixed(1)}" y="${(Y(p.v) - 6).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${fmt(p.v)}</text>`;
    }
  });
  s += '</svg>';
  return s;
}

// Population pyramid: men left, women right, one row per 5-year band.
export function pyramid(bands, opts = {}) {
  const w = opts.width || 760;
  const rowH = 24;
  const h = bands.length * rowH + 46;
  const mid = w / 2;
  const maxV = Math.max(...bands.flatMap((b) => [b.men, b.women]));
  const scale = (mid - 70) / maxV;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Population pyramid" xmlns="http://www.w3.org/2000/svg">`;
  s += `<text x="${mid - 70}" y="20" text-anchor="end" font-size="12" font-weight="700" fill="${BLUE}">Men</text>`;
  s += `<text x="${mid + 70}" y="20" text-anchor="start" font-size="12" font-weight="700" fill="${ACCENT}">Women</text>`;
  bands.forEach((b, i) => {
    const y = 30 + i * rowH;
    const mw = b.men * scale;
    const ww = b.women * scale;
    s += `<rect x="${(mid - mw).toFixed(1)}" y="${y}" width="${mw.toFixed(1)}" height="18" rx="2" fill="${BLUE}"/>`;
    s += `<rect x="${mid}" y="${y}" width="${ww.toFixed(1)}" height="18" rx="2" fill="${ACCENT}"/>`;
    s += `<text x="${mid}" y="${y + 13}" text-anchor="middle" font-size="11" fill="${INK}">${esc(b.band)}</text>`;
    if (i % 4 === 0) {
      s += `<text x="${(mid - mw - 6).toFixed(1)}" y="${y + 13}" text-anchor="end" font-size="10" fill="${MUTED}">${b.men.toFixed(1)}m</text>`;
      s += `<text x="${(mid + ww + 6).toFixed(1)}" y="${y + 13}" font-size="10" fill="${MUTED}">${b.women.toFixed(1)}m</text>`;
    }
  });
  s += `<text x="${mid}" y="${h - 6}" text-anchor="middle" font-size="11" fill="${MUTED}">Millions of people by age band, 2024. The wide top is Japan's ageing: more people over 70 than under 20.</text>`;
  s += '</svg>';
  return s;
}

// Stacked 100% bar for age structure across years.
export function ageStack(rows, opts = {}) {
  const w = opts.width || 760;
  const h = opts.height || 190;
  const padL = 70;
  const padR = 20;
  const padT = 30;
  const rowH = 34;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Age structure" xmlns="http://www.w3.org/2000/svg">`;
  s += `<text x="${padL}" y="14" font-size="12" font-weight="700" fill="${INK}">Share of population by age band</text>`;
  s += `<rect x="${padL + 330}" y="4" width="12" height="12" fill="${TEAL}"/><text x="${padL + 346}" y="14" font-size="11" fill="${MUTED}">0-14</text>`;
  s += `<rect x="${padL + 400}" y="4" width="12" height="12" fill="${BLUE}"/><text x="${padL + 416}" y="14" font-size="11" fill="${MUTED}">15-64</text>`;
  s += `<rect x="${padL + 476}" y="4" width="12" height="12" fill="${ACCENT}"/><text x="${padL + 492}" y="14" font-size="11" fill="${MUTED}">65+</text>`;
  rows.forEach((r, i) => {
    const y = padT + i * rowH;
    const total = padR ? w - padL - padR : 0;
    const wYoung = (r.young / 100) * total;
    const wWork = (r.working / 100) * total;
    const wOld = (r.old / 100) * total;
    s += `<text x="${padL - 10}" y="${y + 16}" text-anchor="end" font-size="12" fill="${INK}">${r.year}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${wYoung.toFixed(1)}" height="22" fill="${TEAL}"/>`;
    s += `<rect x="${(padL + wYoung).toFixed(1)}" y="${y}" width="${wWork.toFixed(1)}" height="22" fill="${BLUE}"/>`;
    s += `<rect x="${(padL + wYoung + wWork).toFixed(1)}" y="${y}" width="${wOld.toFixed(1)}" height="22" fill="${ACCENT}"/>`;
    s += `<text x="${(padL + wYoung / 2).toFixed(1)}" y="${y + 15}" text-anchor="middle" font-size="11" fill="#fff">${r.young}%</text>`;
    s += `<text x="${(padL + wYoung + wWork / 2).toFixed(1)}" y="${y + 15}" text-anchor="middle" font-size="11" fill="#fff">${r.working}%</text>`;
    s += `<text x="${(padL + wYoung + wWork + wOld / 2).toFixed(1)}" y="${y + 15}" text-anchor="middle" font-size="11" fill="#fff">${r.old}%</text>`;
  });
  s += '</svg>';
  return s;
}

// Horizontal comparison bars: one row per country, value scaled to the max.
export function compareBars(rows, valueKey, unit, opts = {}) {
  const w = opts.width || 760;
  const rowH = 34;
  const h = rows.length * rowH + 30;
  const padL = 120;
  const padR = 90;
  const maxV = Math.max(...rows.map((r) => r[valueKey]));
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Country comparison" xmlns="http://www.w3.org/2000/svg">`;
  rows.forEach((r, i) => {
    const y = 12 + i * rowH;
    const bw = ((w - padL - padR) * r[valueKey]) / maxV;
    const col = r.self ? ACCENT : BLUE;
    s += `<text x="${padL - 10}" y="${y + 15}" text-anchor="end" font-size="12" font-weight="${r.self ? 700 : 400}" fill="${INK}">${esc(r.country)}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${Math.max(2, bw).toFixed(1)}" height="20" rx="3" fill="${col}"/>`;
    s += `<text x="${(padL + bw + 8).toFixed(1)}" y="${y + 15}" font-size="12" font-weight="${r.self ? 700 : 400}" fill="${INK}">${fmt(r[valueKey])}${unit ? ' ' + esc(unit) : ''}</text>`;
  });
  s += '</svg>';
  return s;
}
