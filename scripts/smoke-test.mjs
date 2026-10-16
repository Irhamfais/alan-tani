// Smoke test for a running deployment (production or local).
// Usage: node scripts/smoke-test.mjs <baseUrl>
//   node scripts/smoke-test.mjs https://alantanijaya.com
//   node scripts/smoke-test.mjs http://localhost:3100   (skips HTTPS/www redirect checks)
import { chromium } from 'playwright';
import fs from 'fs';

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) {
  console.error('Usage: node scripts/smoke-test.mjs <baseUrl>');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(new URL('../data/config.json', import.meta.url), 'utf8'));
const products = JSON.parse(fs.readFileSync(new URL('../data/products.json', import.meta.url), 'utf8'));
const testimonials = JSON.parse(fs.readFileSync(new URL('../data/testimonials.json', import.meta.url), 'utf8')).testimonials;
const awards = JSON.parse(fs.readFileSync(new URL('../data/awards.json', import.meta.url), 'utf8'));
const articleCount = fs.readdirSync(new URL('../content/articles/', import.meta.url)).filter((f) => f.endsWith('.md')).length;
const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)/.test(base);

const results = [];
const check = (name, ok, info = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? `  (${info})` : ''}`);
};

// ---- HTTP level ----
console.log(`\nSmoke test: ${base}\n`);
const times = [];
let first;
for (let i = 0; i < 5; i++) {
  const t0 = Date.now();
  const r = await fetch(`${base}/`, { redirect: 'manual' });
  await r.text();
  times.push(Date.now() - t0);
  first ??= r;
}
check('Halaman utama 200', first.status === 200, `status ${first.status}`);
const sorted = [...times].sort((a, b) => a - b);
check('Waktu respons median < 1500 ms', sorted[2] < 1500, `${times.join(', ')} ms; median ${sorted[2]} ms`);
console.log(`      cache-control: ${first.headers.get('cache-control')} | server: ${first.headers.get('server')}`);

if (!isLocal) {
  const host = new URL(base).host;
  const httpRes = await fetch(`http://${host}/`, { redirect: 'manual' });
  check('http dialihkan ke https', [301, 302, 307, 308].includes(httpRes.status) && (httpRes.headers.get('location') || '').startsWith('https://'),
    `${httpRes.status} -> ${httpRes.headers.get('location')}`);
  const wwwRes = await fetch(`https://www.${host}/`, { redirect: 'manual' });
  const wwwLocation = wwwRes.headers.get('location');
  // Compare origins: Next.js sends the root as "https://domain" (no trailing slash), which equals "https://domain/".
  const wwwTarget = wwwLocation ? new URL(wwwLocation, `https://www.${host}`).origin : null;
  check('www dialihkan ke alamat utama', [301, 308].includes(wwwRes.status) && wwwTarget === config.siteUrl,
    `${wwwRes.status} -> ${wwwLocation || '-'}`);
}

// ---- Browser level ----
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
const badResponses = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(e.message));
page.on('response', (r) => r.status() >= 400 && badResponses.push(`${r.status()} ${r.url()}`));

await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 60000 });
const info = await page.evaluate(() => ({
  products: document.querySelectorAll('.pcard').length,
  articles: document.querySelectorAll('.acard').length,
  testimonials: document.querySelectorAll('.quote').length,
  awards: document.querySelectorAll('.award').length,
  footer: document.querySelector('.copyright')?.textContent ?? '',
  icons: [...document.querySelectorAll('link[rel="icon"]')].map((l) => l.getAttribute('href').split('?')[0]),
  jsonLd: JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || '[]'),
}));
check('Jumlah produk', info.products === products.length, `${info.products}/${products.length}`);
check('Jumlah artikel', info.articles === articleCount, `${info.articles}/${articleCount}`);
check('Jumlah testimoni', info.testimonials === testimonials.length, `${info.testimonials}/${testimonials.length}`);
check('Jumlah penghargaan', info.awards === awards.length, `${info.awards}/${awards.length}`);
check('Tahun di footer', info.footer.includes(String(new Date().getFullYear())), info.footer);
check('Favicon terpasang', info.icons.includes('/icon.svg') && info.icons.includes('/favicon.ico'), info.icons.join(', '));
check('JSON-LD memakai domain situs', info.jsonLd.length > 0 && info.jsonLd.every((b) => b['@id'].startsWith(`${config.siteUrl}/`)),
  info.jsonLd.map((b) => b['@id']).join(', '));

// Scroll the page and both carousels so every lazy image loads.
// The site sets `scroll-behavior: smooth`, so scroll instantly or later clicks race the animation.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo({ top: y, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 120));
  }
  document.querySelectorAll('.carousel').forEach((c) => c.scrollTo({ left: c.scrollWidth, behavior: 'instant' }));
});
await page.waitForTimeout(3000);
const imgs = await page.evaluate(() =>
  [...document.querySelectorAll('img')].filter((i) => i.src.includes('/_next/image')).map((i) => i.complete && i.naturalWidth > 0)
);
check('Semua foto (/_next/image) tampil', imgs.length > 0 && imgs.every(Boolean), `${imgs.filter(Boolean).length}/${imgs.length}`);

// Opens a card's detail dialog; returns false instead of throwing so the run always finishes.
async function openDialog(trigger, dialog) {
  try {
    await page.$eval(trigger, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.locator(trigger).first().click({ timeout: 10000 });
    await page.waitForSelector(`${dialog}[open]`, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
const productOpen = await openDialog('.pcard .stretch', '#productDialog');
await page.keyboard.press('Escape');
check('Detail produk terbuka', productOpen);

const articleOpen = await openDialog('.acard .stretch', '#articleDialog');
const articleHasBody = articleOpen && (await page.locator('#articleDialog .prose h2').count()) > 0;
await page.keyboard.press('Escape');
check('Detail artikel terbuka dengan isi', articleHasBody);

check('Tidak ada respons error (>= 400)', badResponses.length === 0, badResponses.slice(0, 5).join(' | '));
check('Tidak ada error console', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
await browser.close();

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} lolos`);
process.exit(passed === results.length ? 0 : 1);
