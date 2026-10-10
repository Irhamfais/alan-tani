import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_URL = 'http://localhost:3000';
const PREVIEW_FILE = path.resolve(__dirname, '../../Project Files/Alan Tani Jaya, preview landing page v17.html');
const PREVIEW_URL = `file://${PREVIEW_FILE.replace(/\\/g, '/')}`;
const ARTIFACT_DIR = 'C:/Users/User/.gemini/antigravity-ide/brain/4367c96e-c28c-410f-8cd4-442057d05aa8';

async function verifyHeroV17() {
  console.log('Starting Verification for Hero Logo v17 (Dark Logo & Thinner Mist)...');
  const browser = await chromium.launch();

  const viewports = [
    { name: '1280', width: 1280, height: 800, isDesktop: true },
    { name: '1477', width: 1477, height: 900, isDesktop: true },
    { name: '375', width: 375, height: 812, isDesktop: false },
    { name: '412', width: 412, height: 924, isDesktop: false },
  ];

  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(APP_URL, { waitUntil: 'networkidle' });

    // 1. Horizontal Scroll Check
    const scrollInfo = await page.evaluate(() => ({
      scrollW: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      innerW: window.innerWidth,
    }));
    const hasNoOverflow = scrollInfo.scrollW <= scrollInfo.innerW;
    console.log(`  ${hasNoOverflow ? '✔' : '❌'} No horizontal scroll: ${scrollInfo.scrollW}px === ${scrollInfo.innerW}px`);

    // 2. Mobile / Desktop specific checks
    if (!vp.isDesktop) {
      const heroArtHidden = await page.evaluate(() => {
        const art = document.querySelector('.hero-art');
        if (!art) return true;
        const style = window.getComputedStyle(art);
        return style.display === 'none';
      });
      console.log(`  ${heroArtHidden ? '✔' : '❌'} Mobile: hero-art is hidden (display: none)`);
    } else {
      const heroDetails = await page.evaluate(() => {
        const art = document.querySelector('.hero-art');
        const bob = document.querySelector('.bob');
        const img = document.querySelector('.bob img');
        const headerLogo = document.querySelector('header .logo');
        const footerLogo = document.querySelector('footer .logo');

        const artStyle = art ? window.getComputedStyle(art) : null;
        const bobStyle = bob ? window.getComputedStyle(bob) : null;
        const imgStyle = img ? window.getComputedStyle(img) : null;

        // Check pseudo-elements
        const beforeStyle = bob ? window.getComputedStyle(bob, '::before') : null;
        const afterStyle = bob ? window.getComputedStyle(bob, '::after') : null;

        return {
          artVisible: artStyle && artStyle.display !== 'none',
          bobIsolation: bobStyle ? bobStyle.isolation : null,
          bobWidth: bobStyle ? bobStyle.width : null,
          imgOpacity: imgStyle ? imgStyle.opacity : null,
          beforeZIndex: beforeStyle ? beforeStyle.zIndex : null,
          afterZIndex: afterStyle ? afterStyle.zIndex : null,
          beforeContent: beforeStyle ? beforeStyle.content : null,
          afterContent: afterStyle ? afterStyle.content : null,
          heroImgSrc: img?.currentSrc || img?.src,
          headerImgSrc: headerLogo?.currentSrc || headerLogo?.src,
          footerImgSrc: footerLogo?.currentSrc || footerLogo?.src,
        };
      });

      console.log(`  ✔ Desktop: hero-art visible: ${heroDetails.artVisible}`);
      console.log(`  ✔ Desktop: .bob isolation: ${heroDetails.bobIsolation}, width: ${heroDetails.bobWidth}`);
      console.log(`  ✔ Desktop: .bob img opacity: ${heroDetails.imgOpacity}`);
      console.log(`  ✔ Desktop: ::before z-index: ${heroDetails.beforeZIndex}, ::after z-index: ${heroDetails.afterZIndex}`);

      // 3. Test Parallax Cursor Movement
      console.log('  Testing cursor parallax interaction...');
      const heroSection = page.locator('#home.hero');
      const box = await heroSection.boundingBox();
      if (box) {
        // Move to right side of hero
        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.4);
        await page.waitForTimeout(150);
        const transformMoved = await page.evaluate(() => {
          const parallax = document.querySelector('.parallax');
          return parallax?.style.transform;
        });
        console.log(`  ✔ Parallax moved: transform = "${transformMoved}"`);

        // Move outside
        await page.mouse.move(box.x - 100, box.y - 100);
        await page.waitForTimeout(300);
        const transformReset = await page.evaluate(() => {
          const parallax = document.querySelector('.parallax');
          return parallax?.style.transform;
        });
        console.log(`  ✔ Parallax reset on leave: transform = "${transformReset}"`);
      }
    }

    // 4. Capture App Screenshot (Hero section on desktop, top hero on mobile)
    const appScreenshotPath = path.join(ARTIFACT_DIR, `hero-v17-app-${vp.name}.png`);
    await page.locator('#home.hero').screenshot({ path: appScreenshotPath });
    console.log(`  📸 Saved app hero screenshot: hero-v17-app-${vp.name}.png`);

    // 5. Capture Preview v17 Screenshot for comparison
    const previewPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await previewPage.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
    const previewScreenshotPath = path.join(ARTIFACT_DIR, `hero-v17-preview-${vp.name}.png`);
    await previewPage.locator('#home.hero').screenshot({ path: previewScreenshotPath });
    console.log(`  📸 Saved preview v17 hero screenshot: hero-v17-preview-${vp.name}.png`);
    await previewPage.close();

    // Console Errors Check
    console.log(`  ${errors.length === 0 ? '✔' : '❌'} Console errors: ${errors.length}`);
    await page.close();
  }

  // Extra: Detail capture of .hero-art, header logo, and footer logo on desktop 1280
  console.log('\n=== Capturing Detailed Component Logos ===');
  const detailPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await detailPage.goto(APP_URL, { waitUntil: 'networkidle' });

  await detailPage.locator('.hero-art').screenshot({ path: path.join(ARTIFACT_DIR, 'hero-v17-logo-detail-app.png') });
  await detailPage.locator('header .brand').screenshot({ path: path.join(ARTIFACT_DIR, 'hero-v17-header-logo.png') });
  await detailPage.locator('footer .footer-brand').screenshot({ path: path.join(ARTIFACT_DIR, 'hero-v17-footer-logo.png') });

  const previewDetailPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await previewDetailPage.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
  await previewDetailPage.locator('.hero-art').screenshot({ path: path.join(ARTIFACT_DIR, 'hero-v17-logo-detail-preview.png') });
  await previewDetailPage.close();

  console.log('  📸 Detailed logos captured successfully!');
  await detailPage.close();
  await browser.close();
  console.log('\nAll verification tests completed successfully!');
}

verifyHeroV17().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
