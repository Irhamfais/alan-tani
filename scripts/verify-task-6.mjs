import { chromium } from 'playwright';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACT_DIR = path.resolve('C:/Users/User/.gemini/antigravity-ide/brain/4367c96e-c28c-410f-8cd4-442057d05aa8');
const PREVIEW_HTML_PATH = path.resolve(__dirname, '../../Project Files/Alan Tani Jaya, preview landing page v5.html');
const PREVIEW_FILE_URL = 'file:///' + PREVIEW_HTML_PATH.replace(/\\/g, '/');
const APP_URL = 'http://localhost:3000';

async function verify() {
  console.log('Starting Section 4 — Tips dan Edukasi Pertanian (Task 6) Verification...');

  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: '375', width: 375, height: 812 },
    { name: '768', width: 768, height: 1024 },
    { name: '1280', width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.width}x${vp.height} (${vp.name}) ===`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Verify no horizontal scroll on page body
    const bodyScroll = await page.evaluate(() => {
      return {
        bodyScrollWidth: document.body.scrollWidth,
        htmlScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    });
    assert.ok(
      bodyScroll.htmlScrollWidth <= bodyScroll.innerWidth,
      `Horizontal overflow detected on ${vp.name}: ${bodyScroll.htmlScrollWidth} > ${bodyScroll.innerWidth}`
    );
    console.log(`  ✔ No page-level horizontal scroll (html: ${bodyScroll.htmlScrollWidth}px, inner: ${bodyScroll.innerWidth}px)`);

    // 2. Verify section existence and properties
    const sectionData = await page.evaluate(() => {
      const sec = document.querySelector('#artikel');
      if (!sec) return null;
      const title = sec.querySelector('#artikelTitle')?.textContent?.trim();
      const h2 = sec.querySelector('h2')?.textContent?.trim();
      const prevBtn = sec.querySelector('#prevArticle');
      const nextBtn = sec.querySelector('#nextArticle');
      const carousel = sec.querySelector('#articleCarousel');
      const cards = [...sec.querySelectorAll('.acard')].map(c => {
        return {
          title: c.querySelector('h3')?.textContent?.trim(),
          category: c.querySelector('.acard-meta span:nth-child(1)')?.textContent?.trim(),
          date: c.querySelector('.acard-meta span:nth-child(2)')?.textContent?.trim(),
          read: c.querySelector('.acard-meta span:nth-child(3)')?.textContent?.trim(),
          excerpt: c.querySelector('p')?.textContent?.trim(),
          linkText: c.querySelector('.stretch')?.textContent?.trim(),
        };
      });
      const bg = window.getComputedStyle(sec).backgroundColor;
      const carouselStyles = carousel ? window.getComputedStyle(carousel) : null;
      const cardStyle = sec.querySelector('.acard') ? window.getComputedStyle(sec.querySelector('.acard')) : null;

      return {
        title,
        h2,
        hasPrev: !!prevBtn,
        hasNext: !!nextBtn,
        carouselExists: !!carousel,
        carouselSnap: carouselStyles?.scrollSnapType,
        carouselOverflowX: carouselStyles?.overflowX,
        cardSnapAlign: cardStyle?.scrollSnapAlign,
        cardCount: cards.length,
        cards,
        bg,
      };
    });

    assert.ok(sectionData, 'Section #artikel must exist');
    assert.strictEqual(sectionData.h2, 'Tips dan edukasi pertanian', 'Heading must match');
    assert.ok(sectionData.hasPrev, '#prevArticle button must exist');
    assert.ok(sectionData.hasNext, '#nextArticle button must exist');
    assert.ok(sectionData.carouselExists, '#articleCarousel must exist');
    assert.strictEqual(sectionData.cardCount, 5, 'Must render exactly 5 article cards');
    assert.ok(sectionData.carouselSnap.includes('x'), 'Carousel must have scroll-snap-type: x');
    console.log(`  ✔ Section structure verified: Heading "${sectionData.h2}", 5 authentic article cards, prev/next buttons`);

    // 3. Verify specific authentic article titles
    const expectedTitles = [
      'Cara memilih pupuk yang tepat',
      'Tips budidaya tanaman agar produktif',
      'Panduan penggunaan pestisida yang aman',
      'Teknik perawatan tanaman modern',
      'Memilih bibit unggul berkualitas',
    ];
    for (let i = 0; i < expectedTitles.length; i++) {
      assert.strictEqual(sectionData.cards[i].title, expectedTitles[i], `Card ${i + 1} title mismatch`);
    }
    console.log('  ✔ All 5 authentic article titles matched');

    // 4. Capture screenshot of section #artikel in App
    const secElement = await page.$('#artikel');
    await secElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const appScreenshotPath = path.join(ARTIFACT_DIR, `task-6-app-${vp.name}.png`);
    await secElement.screenshot({ path: appScreenshotPath });
    console.log(`  📸 App #artikel screenshot saved: task-6-app-${vp.name}.png`);

    // 5. Capture screenshot of section #artikel in Preview v5
    const previewPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await previewPage.goto(PREVIEW_FILE_URL, { waitUntil: 'load' });
    await previewPage.waitForTimeout(500);
    const prevSecElement = await previewPage.$('#artikel');
    if (prevSecElement) {
      await prevSecElement.scrollIntoViewIfNeeded();
      await previewPage.waitForTimeout(300);
      const previewScreenshotPath = path.join(ARTIFACT_DIR, `task-6-preview-${vp.name}.png`);
      await prevSecElement.screenshot({ path: previewScreenshotPath });
      console.log(`  📸 Preview #artikel screenshot saved: task-6-preview-${vp.name}.png`);
    }
    await previewPage.close();

    // 6. Test Interactive Carousel Controls (Buttons & Keyboard & Slide)
    if (vp.name === '1280') {
      console.log('\n=== Testing Carousel Navigation (Next, Prev, Keyboard Arrow) ===');
      const initialScrollLeft = await page.evaluate(() => document.querySelector('#articleCarousel').scrollLeft);
      assert.strictEqual(initialScrollLeft, 0, 'Initial scroll position must be 0');

      // Click Next
      await page.click('#nextArticle');
      await page.waitForTimeout(600);
      const afterNextScroll = await page.evaluate(() => document.querySelector('#articleCarousel').scrollLeft);
      assert.ok(afterNextScroll > 0, `Carousel scrollLeft should increase after clicking next (got ${afterNextScroll})`);
      console.log(`  ✔ Next button scrolled carousel forward to: ${afterNextScroll}px`);

      // Click Prev
      await page.click('#prevArticle');
      await page.waitForTimeout(600);
      const afterPrevScroll = await page.evaluate(() => document.querySelector('#articleCarousel').scrollLeft);
      assert.ok(afterPrevScroll < afterNextScroll, `Carousel scrollLeft should decrease after clicking prev (got ${afterPrevScroll})`);
      console.log(`  ✔ Prev button scrolled carousel back to: ${afterPrevScroll}px`);

      // Test Keyboard ArrowRight
      await page.focus('#articleCarousel');
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(600);
      const afterKeyRightScroll = await page.evaluate(() => document.querySelector('#articleCarousel').scrollLeft);
      assert.ok(afterKeyRightScroll > 0, `Carousel scrollLeft should increase after ArrowRight key (got ${afterKeyRightScroll})`);
      console.log(`  ✔ ArrowRight keyboard key scrolled carousel to: ${afterKeyRightScroll}px`);

      // Test Keyboard ArrowLeft
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(600);
      const afterKeyLeftScroll = await page.evaluate(() => document.querySelector('#articleCarousel').scrollLeft);
      assert.ok(afterKeyLeftScroll < afterKeyRightScroll, `Carousel scrollLeft should decrease after ArrowLeft key (got ${afterKeyLeftScroll})`);
      console.log(`  ✔ ArrowLeft keyboard key scrolled carousel back to: ${afterKeyLeftScroll}px`);

      // Test Toast trigger when clicking "Baca artikel"
      await page.click('.acard:first-child a[data-article]');
      await page.waitForTimeout(300);
      const toastVisible = await page.evaluate(() => {
        const t = document.querySelector('#toast');
        return t && t.dataset.show === 'true' && t.textContent.includes('Halaman artikel dibuat di versi Next.js');
      });
      assert.ok(toastVisible, 'Toast notification should be displayed upon clicking "Baca artikel"');
      console.log('  ✔ Toast notification displayed correctly when clicking "Baca artikel"');
    }

    assert.strictEqual(errors.length, 0, `No console errors allowed. Found: ${errors.join('; ')}`);
    console.log('  ✔ 0 console errors');

    await page.close();
  }

  await browser.close();
  console.log('\n🎉 ALL SECTION 4 (TASK 6) VERIFICATION CHECKS PASSED PERFECTLY!');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
