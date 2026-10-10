import { chromium } from 'playwright';
import assert from 'node:assert';

console.log('Starting Task 5 (Product Catalog & Modal) Playwright Verification...');

const appUrl = 'http://localhost:3000';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];

  // ================= 1. Mobile (375px) =================
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

  // 1.1 Check H2 and subtitle
  const h2Text = await mobilePage.$eval('#produkTitle', el => el.textContent.trim());
  assert.strictEqual(h2Text, 'Produk unggulan', 'H2 must be "Produk unggulan"');

  const subtitleText = await mobilePage.$eval('#produk .section-head p', el => el.textContent.trim());
  assert.strictEqual(
    subtitleText,
    'Pilihan yang paling sering dicari petani. Daftar lengkapnya ada di marketplace kami.'
  );

  // 1.2 Check filter chips
  const chips = await mobilePage.$$eval('#filters .chip', els =>
    els.map(el => ({
      cat: el.getAttribute('data-cat'),
      text: el.textContent.trim(),
      pressed: el.getAttribute('aria-pressed')
    }))
  );
  assert.strictEqual(chips.length, 5, 'Must have exactly 5 filter chips');
  assert.strictEqual(chips[0].cat, 'all');
  assert.strictEqual(chips[0].pressed, 'true');
  assert.ok(chips[0].text.includes('Semua'), 'First chip is Semua');
  assert.ok(chips[0].text.includes('8'), 'Semua has count 8');

  // 1.3 Check initial products count (8 products)
  const initialCards = await mobilePage.$$('.pcard');
  assert.strictEqual(initialCards.length, 8, 'Initially all 8 products must be rendered');

  // 1.4 Check mobile grid layout (2 columns)
  const mobileGridCols = await mobilePage.$eval('.grid-products', el => {
    return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
  });
  assert.strictEqual(mobileGridCols, 2, 'Grid must have 2 columns on 375px mobile');

  // 1.5 Check filter interactivity: click "Pupuk"
  await mobilePage.click('.chip[data-cat="pupuk"]');
  const pupukCards = await mobilePage.$$('.pcard');
  assert.strictEqual(pupukCards.length, 2, 'Pupuk category must show 2 products');

  const resultCountText = await mobilePage.$eval('#resultCount', el => el.textContent.trim());
  assert.strictEqual(resultCountText, '2 produk ditampilkan');

  // Reset to "all"
  await mobilePage.click('.chip[data-cat="all"]');
  const resetCards = await mobilePage.$$('.pcard');
  assert.strictEqual(resetCards.length, 8);

  // 1.6 Check Product Card structure
  const firstCardTitle = await mobilePage.$eval('.pcard h3 .stretch', el => el.textContent.trim());
  assert.strictEqual(firstCardTitle, 'Pupuk NPK Mutiara 16-16-16 (1 kg)');

  const firstCardPrice = await mobilePage.$eval('.pcard .price', el => el.textContent.trim());
  assert.ok(firstCardPrice.includes('24.000'), 'Price must be formatted in Rupiah');

  const firstCardWa = await mobilePage.$eval('.pcard .icon-btn--wa', el => el.getAttribute('href'));
  assert.ok(firstCardWa.includes('wa.me/6285875613333'), 'WA button must link to official WhatsApp');
  assert.ok(firstCardWa.includes('Pupuk%20NPK%20Mutiara'), 'WA button must be prefilled with product name');

  // 1.7 Check Modal Dialog open and close
  await mobilePage.click('.pcard:first-child .stretch');
  await mobilePage.waitForSelector('#productDialog[open]');

  const isModalOpen = await mobilePage.$eval('#productDialog', el => el.hasAttribute('open'));
  assert.strictEqual(isModalOpen, true, 'Product dialog must be open');

  const dlgTitle = await mobilePage.$eval('#dlgTitle', el => el.textContent.trim());
  assert.strictEqual(dlgTitle, 'Pupuk NPK Mutiara 16-16-16 (1 kg)');

  const dlgWaHref = await mobilePage.$eval('#dlgWa', el => el.getAttribute('href'));
  assert.ok(dlgWaHref.includes('wa.me/6285875613333'));

  const bodyOverflowLocked = await mobilePage.evaluate(() => document.documentElement.style.overflow);
  assert.strictEqual(bodyOverflowLocked, 'hidden', 'Body scroll must be locked when modal is open');

  // Close modal via close button
  await mobilePage.click('#dlgClose');
  const isModalClosed = await mobilePage.$eval('#productDialog', el => !el.hasAttribute('open'));
  assert.strictEqual(isModalClosed, true, 'Product dialog must be closed');

  const bodyOverflowUnlocked = await mobilePage.evaluate(() => document.documentElement.style.overflow);
  assert.strictEqual(bodyOverflowUnlocked, '', 'Body scroll must be restored when modal is closed');

  // 1.8 Check horizontal scroll on mobile
  const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.strictEqual(mobileOverflow, false, 'No horizontal scroll on 375px');
  console.log('✔ Mobile 375px checks passed!');

  // ================= 2. Tablet (768px) =================
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

  // 2.1 Check tablet grid layout (3 columns on >= 720px)
  const tabletGridCols = await tabletPage.$eval('.grid-products', el => {
    return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
  });
  assert.strictEqual(tabletGridCols, 3, 'Grid must have 3 columns on 768px tablet');

  // 2.2 Check dialog 2 columns on tablet
  await tabletPage.click('.pcard:first-child .stretch');
  await tabletPage.waitForSelector('#productDialog[open]');
  const dlgGridCols = await tabletPage.$eval('.dlg', el => {
    return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
  });
  assert.strictEqual(dlgGridCols, 2, 'Dialog must have 2 columns on >= 720px');

  // Close with Escape key
  await tabletPage.keyboard.press('Escape');
  const tabletDlgClosed = await tabletPage.$eval('#productDialog', el => !el.hasAttribute('open'));
  assert.strictEqual(tabletDlgClosed, true, 'Dialog must close on Escape key');

  const tabletOverflow = await tabletPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.strictEqual(tabletOverflow, false, 'No horizontal scroll on 768px');
  console.log('✔ Tablet 768px checks passed!');

  // ================= 3. Desktop (1280px) =================
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

  // 3.1 Check desktop grid layout (4 columns on >= 1040px)
  const desktopGridCols = await desktopPage.$eval('.grid-products', el => {
    return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
  });
  assert.strictEqual(desktopGridCols, 4, 'Grid must have 4 columns on 1280px desktop');

  // 3.2 Check marketplace links in section footer
  const mpLinks = await desktopPage.$$eval('.more-links a', els => els.map(el => el.textContent.trim()));
  assert.strictEqual(mpLinks.length, 3, 'Must have 3 marketplace links in section footer');
  assert.ok(mpLinks.includes('Shopee'));
  assert.ok(mpLinks.includes('Tokopedia'));
  assert.ok(mpLinks.includes('TikTok Shop'));

  const desktopOverflow = await desktopPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.strictEqual(desktopOverflow, false, 'No horizontal scroll on 1280px');
  console.log('✔ Desktop 1280px checks passed!');

  // ================= 4. Console Errors Check =================
  assert.strictEqual(consoleErrors.length, 0, `Expected 0 console errors, got: ${JSON.stringify(consoleErrors)}`);

  console.log('ALL TASK 5 VERIFICATION CHECKS PASSED PERFECTLY! 🚀');
  await browser.close();
}

verify().catch(err => {
  console.error('Task 5 Verification failed:', err);
  process.exit(1);
});
