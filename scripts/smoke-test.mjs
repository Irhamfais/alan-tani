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
// Same rule as lib/env.ts. Set NEXT_PUBLIC_GA_ID when testing a local build that should include GA4.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || config.siteUrl).replace(/\/+$/, '');
const expectedGaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || null;

const results = [];
const check = (name, ok, info = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? `  (${info})` : ''}`);
};

// Fetch with retries: the Hostinger CDN occasionally drops a connection (ConnectTimeoutError, ECONNRESET).
// Returns { res, body } or { error } instead of throwing, so one network blip is reported, not a crash.
async function get(url, { redirect = 'manual', tries = 3 } = {}) {
  let lastError;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { redirect, signal: AbortSignal.timeout(15000) });
      const body = Buffer.from(await res.arrayBuffer());
      return { res, body };
    } catch (e) {
      lastError = e;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  const cause = lastError?.cause;
  return { error: `koneksi gagal setelah ${tries}x: ${cause?.code || cause?.name || lastError?.name || lastError}` };
}

// ---- HTTP level ----
console.log(`\nSmoke test: ${base}\n`);
const times = [];
let first;
for (let i = 0; i < 5; i++) {
  const t0 = Date.now();
  const r = await get(`${base}/`);
  if (r.error) { first ??= r; continue; }
  times.push(Date.now() - t0);
  if (!first || first.error) first = r;
}
check('Halaman utama 200', first.res?.status === 200, first.error || `status ${first.res.status}`);
const sorted = [...times].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
check('Waktu respons median < 1500 ms', times.length > 0 && median < 1500, times.length ? `${times.join(', ')} ms; median ${median} ms` : 'tidak ada respons');
if (first.res) console.log(`      cache-control: ${first.res.headers.get('cache-control')} | server: ${first.res.headers.get('server')}`);

if (!isLocal) {
  const host = new URL(base).host;
  const httpRes = await get(`http://${host}/`);
  check('http dialihkan ke https', !httpRes.error && [301, 302, 307, 308].includes(httpRes.res.status) && (httpRes.res.headers.get('location') || '').startsWith('https://'),
    httpRes.error || `${httpRes.res.status} -> ${httpRes.res.headers.get('location')}`);
  const wwwRes = await get(`https://www.${host}/`);
  const wwwLocation = wwwRes.res?.headers.get('location');
  // Compare origins: Next.js sends the root as "https://domain" (no trailing slash), which equals "https://domain/".
  const wwwTarget = wwwLocation ? new URL(wwwLocation, `https://www.${host}`).origin : null;
  check('www dialihkan ke alamat utama', !wwwRes.error && [301, 308].includes(wwwRes.res.status) && wwwTarget === siteUrl,
    wwwRes.error || `${wwwRes.res.status} -> ${wwwLocation || '-'}`);
}

// ---- SEO files ----
const robots = await get(`${base}/robots.txt`);
const robotsText = robots.body?.toString() ?? '';
check('robots.txt mengizinkan crawl & menunjuk sitemap', robots.res?.status === 200 && /Allow: \//.test(robotsText) && robotsText.includes(`Sitemap: ${siteUrl}/sitemap.xml`),
  robots.error || robotsText.replace(/\s+/g, ' ').trim());
const sitemap = await get(`${base}/sitemap.xml`);
const sitemapText = sitemap.body?.toString() ?? '';
check('sitemap.xml berisi beranda', sitemap.res?.status === 200 && sitemapText.includes(`<loc>${siteUrl}/</loc>`),
  sitemap.error || (sitemapText.match(/<loc>[^<]+<\/loc>/g) || []).join(' '));

// ---- Browser level ----
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
const badResponses = [];
// Errors caused by blocking GA hits below (they don't name the URL in the text, only in location) are expected.
const isGaNoise = (m) => /google-analytics|googletagmanager|g\/collect/.test(`${m.text()} ${m.location()?.url ?? ''}`);
page.on('console', (m) => m.type() === 'error' && !isGaNoise(m) && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(e.message));
page.on('response', (r) => r.status() >= 400 && badResponses.push(`${r.status()} ${r.url()}`));

// Never send test traffic to the real GA4 property: record the hit, then block it.
const gaHits = [];
await page.route(/google-analytics\.com\/(g|.*\/g)\/collect|\/g\/collect\?/, (route) => {
  gaHits.push(new URL(route.request().url()).searchParams.get('tid'));
  return route.abort();
});

let pageError = null;
for (let i = 0; i < 2; i++) {
  try {
    await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 60000 });
    pageError = null;
    break;
  } catch (e) {
    pageError = e.message.split('\n')[0];
  }
}
if (pageError) {
  check('Halaman terbuka di browser', false, pageError);
  await browser.close();
  console.log(`\n${results.filter(Boolean).length}/${results.length} lolos (cek di browser dilewati)`);
  process.exit(1);
}
const info = await page.evaluate(() => ({
  products: document.querySelectorAll('.pcard').length,
  articles: document.querySelectorAll('.acard').length,
  testimonials: document.querySelectorAll('.quote').length,
  awards: document.querySelectorAll('.award').length,
  footer: document.querySelector('.copyright')?.textContent ?? '',
  icons: [...document.querySelectorAll('link[rel="icon"]')].map((l) => l.getAttribute('href').split('?')[0]),
  jsonLd: JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || '{}'),
  gaScript: document.querySelector('script[src*="googletagmanager.com/gtag/js"]')?.getAttribute('src') ?? null,
  canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
  meta: Object.fromEntries(
    [...document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')].map((m) => [m.getAttribute('property') || m.getAttribute('name'), m.getAttribute('content')])
  ),
}));
check('Jumlah produk', info.products === products.length, `${info.products}/${products.length}`);
check('Jumlah artikel', info.articles === articleCount, `${info.articles}/${articleCount}`);
check('Jumlah testimoni', info.testimonials === testimonials.length, `${info.testimonials}/${testimonials.length}`);
check('Jumlah penghargaan', info.awards === awards.length, `${info.awards}/${awards.length}`);
check('Tahun di footer', info.footer.includes(String(new Date().getFullYear())), info.footer);
check('Favicon terpasang', info.icons.includes('/icon.svg') && info.icons.includes('/favicon.ico'), info.icons.join(', '));
// Head tags for search engines and link previews
check('Canonical ke beranda', !!info.canonical && new URL(info.canonical).href === `${siteUrl}/`, info.canonical || 'tidak ada');
const m = info.meta;
check('Open Graph lengkap', !!(m['og:title'] && m['og:description'] && m['og:url'] && m['og:site_name'] && m['og:locale'] === 'id_ID' && m['og:type'] === 'website'),
  `og:title "${m['og:title'] ?? '-'}"`);
const ogImage = m['og:image'];
// og:image is absolute on the production domain; fetch the same path from the server under test.
const ogFetch = ogImage ? await get(new URL(new URL(ogImage).pathname + new URL(ogImage).search, base).href) : { error: 'og:image tidak ada' };
check('og:image absolut, 1200×630, bisa diunduh', !!ogImage && ogImage.startsWith(`${siteUrl}/`) && m['og:image:width'] === '1200' && m['og:image:height'] === '630'
  && ogFetch.res?.status === 200 && /^image\//.test(ogFetch.res.headers.get('content-type') || ''),
  ogFetch.error || `${ogImage} → ${ogFetch.res.status} ${ogFetch.res.headers.get('content-type')}, ${Math.round(ogFetch.body.length / 1024)} KB`);
check('Twitter card besar dengan gambar', m['twitter:card'] === 'summary_large_image' && !!m['twitter:image'], m['twitter:card'] || 'tidak ada');

// Structured data: one @graph with Organization, WebSite and the two stores
const graph = info.jsonLd['@graph'] ?? [];
const byType = (t) => graph.filter((n) => n['@type'] === t);
const shops = byType('LocalBusiness');
const cabang = config.stores.find((s) => s.gbpUrl);
check('JSON-LD @graph lengkap & memakai domain situs',
  byType('Organization').length === 1 && byType('WebSite').length === 1 && shops.length === config.stores.length
  && graph.every((n) => n['@id']?.startsWith(`${siteUrl}/`)),
  graph.map((n) => `${n['@type']} ${n['@id']?.replace(siteUrl, '')}`).join(', ') || 'tidak ada @graph');
check('JSON-LD toko sesuai data (nama GBP, geo, sameAs)',
  shops.every((s) => s.name && s.geo?.latitude && s.address?.streetAddress && s.parentOrganization)
  && (!cabang || shops.some((s) => s.name === cabang.schemaName && s.sameAs?.includes(cabang.gbpUrl))),
  shops.map((s) => `${s.name}${s.alternateName ? ` (alias ${s.alternateName})` : ''}`).join(' | '));

// GA4 is required on the live site; on a local build only when NEXT_PUBLIC_GA_ID was set for the test.
const gaIdOnPage = info.gaScript ? new URL(info.gaScript, base).searchParams.get('id') : null;
if (!isLocal || expectedGaId) {
  await page.waitForTimeout(1500); // gtag sends page_view shortly after loading
  check('GA4 terpasang', !!gaIdOnPage && (!expectedGaId || gaIdOnPage === expectedGaId), gaIdOnPage || 'script gtag.js tidak ditemukan');
  check('GA4 mengirim page_view (diblokir saat tes)', gaHits.includes(gaIdOnPage), gaHits.length ? `tid ${[...new Set(gaHits)].join(', ')}` : 'tidak ada kiriman');
} else {
  check('GA4 tidak dimuat tanpa NEXT_PUBLIC_GA_ID', !gaIdOnPage, gaIdOnPage || 'tidak dimuat');
}

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
