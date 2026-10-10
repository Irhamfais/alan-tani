import { chromium } from 'playwright';
import assert from 'node:assert';

console.log('Starting Task 4 (Hero Section) Playwright Verification...');

const appUrl = 'http://localhost:3000';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];

  // 1. Mobile (375px) tests
  console.log('Testing Mobile (375px)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 1
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await mobilePage.goto(appUrl, { waitUntil: 'networkidle' });

  // Check H1
  const h1Text = await mobilePage.$eval('.hero h1', el => el.textContent.trim());
  assert.strictEqual(h1Text, 'Solusi Terbaik Petani', 'H1 text must match exactly');

  // Check lead text
  const leadText = await mobilePage.$eval('.hero .lead', el => el.textContent.trim());
  assert.strictEqual(
    leadText,
    'Mitra terpercaya petani sejak 2020. Pupuk, bibit, pestisida, dan alat pertanian pilihan, dikirim ke seluruh Indonesia.'
  );

  // Check CTA buttons
  const ctaWaHref = await mobilePage.$eval('.hero .btn-primary', el => el.getAttribute('href'));
  assert.ok(ctaWaHref.includes('wa.me/6285875613333'), 'Hero WA CTA must link to wa.me/6285875613333');

  const ctaGhostHref = await mobilePage.$eval('.hero .btn-ghost', el => el.getAttribute('href'));
  assert.strictEqual(ctaGhostHref, '#produk', 'Hero ghost CTA must link to #produk');

  // Check 4 USP points
  const points = await mobilePage.$$eval('.hero-points li', items => items.map(li => li.textContent.trim()));
  assert.strictEqual(points.length, 4, 'Must have exactly 4 USP points');
  assert.ok(points[0].includes('R1 Seller'), 'Point 1 must contain R1 Seller');
  assert.ok(points[1].includes('Pengiriman cepat'), 'Point 2 must contain Pengiriman cepat');
  assert.ok(points[2].includes('Menerima konsultasi terkait kondisi pertanian Anda'), 'Point 3 must contain Menerima konsultasi');
  assert.ok(points[3].includes('Pelayanan ramah'), 'Point 4 must contain Pelayanan ramah');

  // Check CTA visible in first fold on mobile
  const ctaVisible = await mobilePage.evaluate(() => {
    const el = document.querySelector('.hero-cta');
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top > 0 && rect.top < window.innerHeight;
  });
  assert.strictEqual(ctaVisible, true, 'CTA buttons must be visible in the first fold on mobile');

  // Check artwork & sway animation
  const swayExists = await mobilePage.$eval('.hero-art .sway', el => Boolean(el));
  assert.strictEqual(swayExists, true, 'Sway animation class must exist in SVG');

  // Check horizontal overflow
  const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.strictEqual(mobileOverflow, false, 'No horizontal scroll on 375px');
  console.log('✔ Mobile 375px checks passed!');

  // 2. Tablet (768px) tests
  console.log('Testing Tablet (768px)...');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 1
  });
  const tabletPage = await tabletContext.newPage();
  tabletPage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  await tabletPage.goto(appUrl, { waitUntil: 'networkidle' });

  const tabletOverflow = await tabletPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.strictEqual(tabletOverflow, false, 'No horizontal scroll on 768px');
  console.log('✔ Tablet 768px checks passed!');

  // 3. Desktop (1280px) tests
  console.log('Testing Desktop (1280px)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1
  });
  const desktopPage = await desktopContext.newPage();
  desktopPage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  await desktopPage.goto(appUrl, { waitUntil: 'networkidle' });

  // Check grid 2 columns on desktop
  const gridColumns = await desktopPage.$eval('.hero-grid', el => {
    return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
  });
  assert.strictEqual(gridColumns, 2, 'Hero grid must have 2 columns on >= 900px');

  const desktopOverflow = await desktopPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.strictEqual(desktopOverflow, false, 'No horizontal scroll on 1280px');
  console.log('✔ Desktop 1280px checks passed!');

  // 4. Verify console errors
  assert.strictEqual(consoleErrors.length, 0, `Expected 0 console errors, got: ${JSON.stringify(consoleErrors)}`);

  console.log('ALL TASK 4 VERIFICATION CHECKS PASSED PERFECTLY! 🚀');
  await browser.close();
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
