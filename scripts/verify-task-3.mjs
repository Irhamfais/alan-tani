import { chromium } from 'playwright';
import assert from 'node:assert';

console.log('Starting Task 3 (Header & Navigation) Playwright Verification...');

const appUrl = 'http://localhost:3000';

async function verify() {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile (375px) tests
  console.log('Testing Mobile (375px)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 1
  });
  const mobilePage = await mobileContext.newPage();
  const consoleErrors = [];
  mobilePage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await mobilePage.goto(appUrl, { waitUntil: 'networkidle' });

  // Check WA label is hidden on < 560px
  const waLabelVisibleMobile = await mobilePage.$eval('.wa-label', el => {
    return window.getComputedStyle(el).display !== 'none';
  });
  assert.strictEqual(waLabelVisibleMobile, false, 'WA label must be hidden on 375px');

  // Check hamburger button is visible
  const menuBtnVisibleMobile = await mobilePage.$eval('#menuBtn', el => {
    return window.getComputedStyle(el).display !== 'none';
  });
  assert.strictEqual(menuBtnVisibleMobile, true, 'Hamburger button must be visible on 375px');

  // Check logo height on mobile
  const logoHeightMobile = await mobilePage.$eval('.logo', el => el.clientHeight);
  console.log('Mobile logo height:', logoHeightMobile);
  assert.ok(logoHeightMobile >= 80 && logoHeightMobile <= 90, 'Mobile logo should be around 84px');

  // Test opening hamburger menu
  assert.strictEqual(await mobilePage.$eval('#siteHeader', el => el.getAttribute('data-open')), 'false');
  await mobilePage.click('#menuBtn');
  assert.strictEqual(await mobilePage.$eval('#siteHeader', el => el.getAttribute('data-open')), 'true');
  assert.strictEqual(await mobilePage.$eval('#menuBtn', el => el.getAttribute('aria-expanded')), 'true');

  // Test closing via Escape key
  await mobilePage.keyboard.press('Escape');
  assert.strictEqual(await mobilePage.$eval('#siteHeader', el => el.getAttribute('data-open')), 'false');

  // Test closing via clicking a link
  await mobilePage.click('#menuBtn');
  assert.strictEqual(await mobilePage.$eval('#siteHeader', el => el.getAttribute('data-open')), 'true');
  await mobilePage.click('#primaryNav a[href="#produk"]');
  assert.strictEqual(await mobilePage.$eval('#siteHeader', el => el.getAttribute('data-open')), 'false');
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

  // WA label must be visible on >= 560px
  const waLabelVisibleTablet = await tabletPage.$eval('.wa-label', el => {
    return window.getComputedStyle(el).display !== 'none';
  });
  assert.strictEqual(waLabelVisibleTablet, true, 'WA label must be visible on 768px');

  // Hamburger is still visible (< 900px)
  const menuBtnVisibleTablet = await tabletPage.$eval('#menuBtn', el => {
    return window.getComputedStyle(el).display !== 'none';
  });
  assert.strictEqual(menuBtnVisibleTablet, true, 'Hamburger button must be visible on 768px');
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

  // Check desktop nav is visible and hamburger is hidden
  const navVisibleDesktop = await desktopPage.$eval('.nav', el => {
    return window.getComputedStyle(el).display !== 'none';
  });
  assert.strictEqual(navVisibleDesktop, true, 'Desktop nav must be visible on 1280px');

  const menuBtnVisibleDesktop = await desktopPage.$eval('#menuBtn', el => {
    return window.getComputedStyle(el).display === 'none';
  });
  assert.strictEqual(menuBtnVisibleDesktop, true, 'Hamburger button must be hidden on 1280px');

  // Check logo height on desktop
  const logoHeightDesktop = await desktopPage.$eval('.logo', el => el.clientHeight);
  console.log('Desktop logo height initial:', logoHeightDesktop);
  assert.ok(logoHeightDesktop >= 95 && logoHeightDesktop <= 105, 'Desktop logo should be around 100px');

  // Check Marketplace dropdown exists and opens
  const mpVisible = await desktopPage.$eval('#mpMenu', el => {
    return window.getComputedStyle(el).display !== 'none';
  });
  assert.strictEqual(mpVisible, true, 'Marketplace details dropdown must be visible on desktop');

  // Open marketplace dropdown
  await desktopPage.click('#mpMenu summary');
  const isMpOpen = await desktopPage.$eval('#mpMenu', el => el.open);
  assert.strictEqual(isMpOpen, true, 'Marketplace dropdown should open upon click');

  // Close by pressing Escape
  await desktopPage.keyboard.press('Escape');
  const isMpClosed = await desktopPage.$eval('#mpMenu', el => el.open);
  assert.strictEqual(isMpClosed, false, 'Marketplace dropdown should close upon Escape');

  // Check scroll behavior (.is-scrolled)
  await desktopPage.evaluate(() => window.scrollTo(0, 100));
  await desktopPage.waitForTimeout(300);
  const isScrolledClass = await desktopPage.$eval('#siteHeader', el => el.classList.contains('is-scrolled'));
  assert.strictEqual(isScrolledClass, true, 'Header must have .is-scrolled class when scrolled past 24px');

  const logoHeightScrolled = await desktopPage.$eval('.logo', el => el.clientHeight);
  console.log('Desktop logo height after scroll:', logoHeightScrolled);
  assert.ok(logoHeightScrolled >= 58 && logoHeightScrolled <= 66, 'Logo height should shrink to ~62px');

  // Verify 0 console errors
  assert.strictEqual(consoleErrors.length, 0, `Expected 0 console errors, got: ${JSON.stringify(consoleErrors)}`);

  console.log('ALL TASK 3 VERIFICATION CHECKS PASSED PERFECTLY! 🚀');
  await browser.close();
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
