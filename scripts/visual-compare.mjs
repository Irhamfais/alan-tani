// Compares two snapshot dirs produced by visual-snapshot.mjs.
// Usage: node scripts/visual-compare.mjs <beforeDir> <afterDir> [reportFile]
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const [beforeDir, afterDir, reportFile] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error('Usage: node scripts/visual-compare.mjs <beforeDir> <afterDir> [reportFile]');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const toDataUrl = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');

const results = { screenshots: [], styles: [] };

for (const file of fs.readdirSync(beforeDir).filter((f) => f.endsWith('.png')).sort()) {
  const after = path.join(afterDir, file);
  if (!fs.existsSync(after)) {
    results.screenshots.push({ file, status: 'MISSING_AFTER' });
    continue;
  }
  const r = await page.evaluate(
    async ([a, b]) => {
      const load = (src) =>
        new Promise((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = src;
        });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      if (ia.width !== ib.width || ia.height !== ib.height) {
        return { sizeBefore: [ia.width, ia.height], sizeAfter: [ib.width, ib.height], diffPixels: -1 };
      }
      const px = (img) => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height).data;
      };
      const da = px(ia);
      const db = px(ib);
      let diff = 0;
      for (let i = 0; i < da.length; i += 4) {
        if (da[i] !== db[i] || da[i + 1] !== db[i + 1] || da[i + 2] !== db[i + 2] || da[i + 3] !== db[i + 3]) diff++;
      }
      return { sizeBefore: [ia.width, ia.height], sizeAfter: [ib.width, ib.height], diffPixels: diff, totalPixels: da.length / 4 };
    },
    [toDataUrl(path.join(beforeDir, file)), toDataUrl(after)]
  );
  results.screenshots.push({ file, ...r, status: r.diffPixels === 0 ? 'IDENTICAL' : 'DIFFERENT' });
}

for (const file of fs.readdirSync(beforeDir).filter((f) => f.startsWith('styles-')).sort()) {
  // Non-rendered elements (RSC payload scripts, route announcer) change with every build.
  const visible = (e) => !['script', 'next-route-announcer', 'style', 'template'].includes(e.tag);
  const a = JSON.parse(fs.readFileSync(path.join(beforeDir, file), 'utf8')).filter(visible);
  const b = JSON.parse(fs.readFileSync(path.join(afterDir, file), 'utf8')).filter(visible);
  const diffs = [];
  if (a.length !== b.length) diffs.push(`element count ${a.length} -> ${b.length}`);
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const ea = a[i];
    const eb = b[i];
    const label = `#${i} <${ea.tag}${ea.id ? '#' + ea.id : ''}${ea.cls ? '.' + ea.cls.split(' ').join('.') : ''}>`;
    if (ea.tag !== eb.tag) diffs.push(`${label} tag -> ${eb.tag}`);
    if (ea.cls !== eb.cls) diffs.push(`${label} class "${ea.cls}" -> "${eb.cls}"`);
    if (ea.text !== eb.text) diffs.push(`${label} text "${ea.text}" -> "${eb.text}"`);
    if (ea.box.join() !== eb.box.join()) diffs.push(`${label} box ${ea.box} -> ${eb.box}`);
    for (const k of new Set([...Object.keys(ea.props), ...Object.keys(eb.props)])) {
      if (ea.props[k] !== eb.props[k]) diffs.push(`${label} ${k}: "${ea.props[k]}" -> "${eb.props[k]}"`);
    }
  }
  results.styles.push({ file, elements: a.length, differences: diffs.length, sample: diffs.slice(0, 40) });
}

await browser.close();
const json = JSON.stringify(results, null, 2);
if (reportFile) fs.writeFileSync(reportFile, json);
console.log(json);
