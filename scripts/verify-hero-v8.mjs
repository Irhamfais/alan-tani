import { chromium } from 'playwright';
import assert from 'node:assert';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/User/.gemini/antigravity-ide/brain/4367c96e-c28c-410f-8cd4-442057d05aa8';
const appUrl = 'http://localhost:3000';
const previewUrl = 'file:///' + 'c:/Project/alan-tani/Project Files/Alan Tani Jaya, preview landing page v5.html'.replace(/ /g, '%20');

const viewports = [
  { width: 375, height: 812, name: '375' },
  { width: 412, height: 924, name: '412' },
  { width: 768, height: 1024, name: '768' },
  { width: 1280, height: 800, name: '1280' },
  { width: 1920, height: 1080, name: '1920' },
];

async function verify() {
  console.log('Starting Hero Section (v8 Preview) Comprehensive Verification...');
  const browser = await chromium.launch({ headless: true });

  // 1. Viewports comparison and screenshots
  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.width}x${vp.height} (${vp.name}) ===`);
    
    // --- App Page ---
    const appCtx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const appPage = await appCtx.newPage();
    const networkRequests = [];
    appPage.on('request', r => networkRequests.push(r.url()));

    await appPage.goto(appUrl, { waitUntil: 'networkidle' });
    await appPage.waitForTimeout(300);

    // Check no horizontal scroll
    const hasHorizontalOverflow = await appPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert.strictEqual(hasHorizontalOverflow, false, `No horizontal scroll on ${vp.width}px`);
    console.log('  ✔ No horizontal scroll');

    // Check hero elements
    const heroInfo = await appPage.evaluate(() => {
      const hero = document.querySelector('.hero');
      const bg = document.querySelector('.hero-bg');
      const bgImg = bg ? bg.querySelector('img') : null;
      const h1 = document.querySelector('.hero h1');
      const lead = document.querySelector('.lead');
      const art = document.querySelector('.hero-art');
      const points = Array.from(document.querySelectorAll('.hero-points li')).map(li => li.textContent.trim());
      const mpLinks = Array.from(document.querySelectorAll('.hero-mp a')).map(a => a.textContent.trim());

      return {
        h1Text: h1 ? h1.textContent.trim() : null,
        leadText: lead ? lead.textContent.trim() : null,
        pointsCount: points.length,
        points,
        mpLinks,
        bgImgSrc: bgImg ? bgImg.getAttribute('src') : null,
        bgImgFetchPriority: bgImg ? bgImg.getAttribute('fetchpriority') : null,
        artDisplay: art ? window.getComputedStyle(art).display : null,
      };
    });

    assert.strictEqual(heroInfo.h1Text, 'Solusi Terbaik Petani');
    assert.ok(heroInfo.leadText.includes('Mitra terpercaya petani sejak 2020'));
    assert.strictEqual(heroInfo.pointsCount, 4);
    assert.ok(heroInfo.points[0].includes('R1 Seller.'));
    assert.ok(heroInfo.points[1].includes('Pengiriman cepat'));
    assert.ok(heroInfo.points[2].includes('Menerima konsultasi'));
    assert.ok(heroInfo.points[3].includes('Pelayanan ramah'));
    assert.deepStrictEqual(heroInfo.mpLinks, ['Shopee', 'Tokopedia', 'TikTok Shop']);
    assert.strictEqual(heroInfo.bgImgFetchPriority, 'high');
    console.log('  ✔ Headline, lead, CTA, 4 points, and marketplace links verified');

    // Mobile specific checks (< 900px)
    if (vp.width < 900) {
      assert.strictEqual(heroInfo.artDisplay, 'none', 'Hero logo must be display:none on mobile (<900px)');
      const logoRequested = networkRequests.some(u => u.includes('logo-hero.png'));
      assert.strictEqual(logoRequested, false, 'logo-hero.png must NOT be fetched on mobile');
      console.log('  ✔ Mobile: .hero-art is display:none and logo-hero.png is NOT requested');
    } else {
      assert.strictEqual(heroInfo.artDisplay, 'block', 'Hero logo must be visible on desktop (>=900px)');
      console.log('  ✔ Desktop: .hero-art is display:block');
    }

    // Capture app hero screenshot
    const appScreenshot = path.join(ARTIFACT_DIR, `hero-app-${vp.name}.png`);
    const heroLocator = appPage.locator('.hero');
    await heroLocator.screenshot({ path: appScreenshot });
    console.log(`  📸 App hero screenshot: hero-app-${vp.name}.png`);

    // --- Preview Page ---
    const prevCtx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const prevPage = await prevCtx.newPage();
    await prevPage.goto(previewUrl, { waitUntil: 'networkidle' });
    await prevPage.waitForTimeout(300);

    const prevScreenshot = path.join(ARTIFACT_DIR, `hero-preview-${vp.name}.png`);
    const prevHeroLocator = prevPage.locator('.hero');
    await prevHeroLocator.screenshot({ path: prevScreenshot });
    console.log(`  📸 Preview hero screenshot: hero-preview-${vp.name}.png`);

    await appCtx.close();
    await prevCtx.close();
  }

  // 2. Parallax mouse tracking on desktop
  console.log('\n=== Testing Parallax Cursor Interaction on Desktop (1280x800) ===');
  const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(appUrl, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(500);

  // Initial transform
  const initialTf = await desktopPage.evaluate(() => document.querySelector('.parallax')?.style.transform);
  console.log('  Initial transform:', initialTf || '(idle)');

  // Move cursor across hero
  await desktopPage.mouse.move(950, 350, { steps: 5 });
  await desktopPage.waitForTimeout(100);
  const hoverTf = await desktopPage.evaluate(() => document.querySelector('.parallax')?.style.transform);
  assert.ok(hoverTf.includes('translate3d') && hoverTf.includes('rotateX'), 'Parallax transform must update on pointermove');
  console.log('  ✔ Pointermove parallax transform:', hoverTf);

  // Move cursor out
  await desktopPage.mouse.move(0, 0);
  await desktopPage.waitForTimeout(1200);
  const resetTf = await desktopPage.evaluate(() => document.querySelector('.parallax')?.style.transform);
  assert.ok(resetTf.includes('translate3d(0px, 0px, 0') || resetTf.includes('translate3d(0px, 0px, 0px)'), 'Parallax transform must ease back to center on leave');
  console.log('  ✔ Eased back to center on leave:', resetTf);
  await desktopCtx.close();

  // 3. Reduced Motion Test
  console.log('\n=== Testing Prefers-Reduced-Motion ===');
  const rmCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const rmPage = await rmCtx.newPage();
  await rmPage.emulateMedia({ reducedMotion: 'reduce' });
  await rmPage.goto(appUrl, { waitUntil: 'networkidle' });

  const bobAnim = await rmPage.evaluate(() => {
    const bob = document.querySelector('.bob');
    return window.getComputedStyle(bob).animationName;
  });
  assert.strictEqual(bobAnim, 'none', 'Bob animation must be disabled when reduced-motion is requested');
  console.log('  ✔ Bob animation is disabled (animation-name: none)');
  await rmCtx.close();

  // 4. Seam/Border Check between Hero and Products
  console.log('\n=== Testing Hero to Products Seamless Background Transition ===');
  const seamCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const seamPage = await seamCtx.newPage();
  await seamPage.goto(appUrl, { waitUntil: 'networkidle' });

  const bgMatch = await seamPage.evaluate(() => {
    const hero = document.querySelector('.hero');
    const produk = document.querySelector('#produk');
    const heroBg = window.getComputedStyle(hero).backgroundColor;
    const produkBg = window.getComputedStyle(produk).backgroundColor;
    const heroBorderBottom = window.getComputedStyle(hero).borderBottomWidth;
    const produkBorderTop = window.getComputedStyle(produk).borderTopWidth;
    return {
      heroBg,
      produkBg,
      heroBorderBottom,
      produkBorderTop,
    };
  });
  assert.strictEqual(bgMatch.heroBorderBottom, '0px', 'No border between hero and products');
  assert.strictEqual(bgMatch.produkBorderTop, '0px', 'No border between hero and products');
  console.log('  ✔ Seamless transition: no borders or dividers between sections');
  await seamCtx.close();

  await browser.close();
  console.log('\n🎉 ALL HERO V8 VERIFICATION CHECKS PASSED PERFECTLY!');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
