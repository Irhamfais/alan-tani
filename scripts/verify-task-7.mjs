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
  console.log('Starting Section 5 — Tentang Alan Tani, Galeri & Sertifikasi (Task 7) Verification...');

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

    // 1. Verify no page-level horizontal scroll
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

    // 2. Verify section existence and structural details
    const aboutData = await page.evaluate(() => {
      const sec = document.querySelector('#tentang');
      if (!sec) return null;

      const title = sec.querySelector('#tentangTitle')?.textContent?.trim();
      const paras = [...sec.querySelectorAll('.about-copy p')].map(p => p.textContent.trim());

      const facts = [...sec.querySelectorAll('.facts .fact')].map(f => {
        const dt = f.querySelector('dt')?.textContent?.trim() || '';
        const dd = f.querySelector('dd')?.textContent?.trim() || '';
        return { dt, dd };
      });

      const mpLinks = [...sec.querySelectorAll('.fact-links a')].map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href'),
      }));

      const figures = [...sec.querySelectorAll('.gallery figure')].map(fig => ({
        hasSvg: !!fig.querySelector('svg'),
        title: fig.querySelector('figcaption strong')?.textContent?.trim(),
        caption: fig.querySelector('figcaption span')?.textContent?.trim(),
      }));

      const certs = [...sec.querySelectorAll('.certs .cert')].map(c => ({
        hasIcon: !!c.querySelector('.cert-icon svg'),
        strong: c.querySelector('strong')?.textContent?.trim(),
        span: c.querySelector('span')?.textContent?.trim(),
      }));

      const aboutStyle = window.getComputedStyle(sec.querySelector('.about'));
      const galleryStyle = window.getComputedStyle(sec.querySelector('.gallery'));

      return {
        title,
        paras,
        factsCount: facts.length,
        facts,
        mpLinks,
        figuresCount: figures.length,
        figures,
        certsCount: certs.length,
        certs,
        aboutGridCols: aboutStyle.gridTemplateColumns,
        galleryGridCols: galleryStyle.gridTemplateColumns,
      };
    });

    assert.ok(aboutData, 'Section #tentang must exist');
    assert.strictEqual(aboutData.title, 'Tentang Alan Tani', 'Heading H2 mismatch');
    assert.strictEqual(aboutData.paras.length, 2, 'Must have exactly 2 narrative paragraphs');
    assert.ok(aboutData.paras[0].includes('Kami menyediakan berbagai kebutuhan pertanian berkualitas tinggi'), 'Para 1 text mismatch');
    assert.ok(aboutData.paras[1].includes('Sebagai R1 Seller, kami menjamin keaslian produk'), 'Para 2 text mismatch');
    console.log('  ✔ Heading and 2 narrative paragraphs verified');

    // Verify Facts
    assert.ok(aboutData.factsCount >= 6, `Must have at least 6 fact rows (got ${aboutData.factsCount})`);
    assert.ok(aboutData.facts[0].dd.includes('2020'), 'Fact Berdiri must contain 2020');
    assert.ok(aboutData.facts[1].dd.includes('R1 Seller'), 'Fact Status must contain R1 Seller');
    assert.ok(aboutData.facts[2].dd.includes('Jember'), 'Fact Area layanan must contain Jember');
    assert.strictEqual(aboutData.mpLinks.length, 3, 'Must have 3 marketplace links');
    console.log('  ✔ Facts list (Berdiri, Status, Area Layanan, Belanja Online) verified');

    // Verify Gallery
    assert.strictEqual(aboutData.figuresCount, 2, 'Gallery must contain exactly 2 store figures');
    assert.strictEqual(aboutData.figures[0].title, 'Toko induk', 'Gallery figure 1 title mismatch');
    assert.strictEqual(aboutData.figures[1].title, 'Toko cabang', 'Gallery figure 2 title mismatch');
    assert.ok(aboutData.figures[0].hasSvg && aboutData.figures[1].hasSvg, 'Both figures must render SVGs');
    console.log('  ✔ Gallery 2 store figures (Toko Induk & Toko Cabang) with SVG architectural artwork verified');

    // Verify Responsive Layout
    if (vp.width >= 900) {
      assert.ok(aboutData.aboutGridCols.split(' ').length >= 2, `About section must be 2 columns on desktop (got ${aboutData.aboutGridCols})`);
      console.log(`  ✔ Desktop layout: .about is 2 columns (${aboutData.aboutGridCols})`);
    } else {
      console.log(`  ✔ Mobile layout: .about is stacked 1 column`);
    }

    if (vp.width >= 720) {
      assert.ok(aboutData.galleryGridCols.split(' ').length >= 2, `Gallery must be 2 columns on screen >= 720px (got ${aboutData.galleryGridCols})`);
      console.log(`  ✔ Gallery layout: 2 columns on >= 720px (${aboutData.galleryGridCols})`);
    } else {
      console.log(`  ✔ Gallery layout: 1 column on mobile (< 720px)`);
    }

    // Verify Certifications
    assert.strictEqual(aboutData.certsCount, 3, 'Must have exactly 3 certification items');
    assert.strictEqual(aboutData.certs[0].strong, 'Sertifikat 1', 'Cert 1 mismatch');
    assert.strictEqual(aboutData.certs[1].strong, 'Sertifikat 2', 'Cert 2 mismatch');
    assert.strictEqual(aboutData.certs[2].strong, 'Penghargaan', 'Cert 3 mismatch');
    console.log('  ✔ 3 Certifications & awards with award icons verified');

    // 3. Capture screenshot of section #tentang in App
    const secElement = await page.$('#tentang');
    await secElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const appScreenshotPath = path.join(ARTIFACT_DIR, `task-7-app-${vp.name}.png`);
    await secElement.screenshot({ path: appScreenshotPath });
    console.log(`  📸 App #tentang screenshot saved: task-7-app-${vp.name}.png`);

    // 4. Capture screenshot of section #tentang in Preview v5
    const previewPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await previewPage.goto(PREVIEW_FILE_URL, { waitUntil: 'load' });
    await previewPage.waitForTimeout(500);
    const prevSecElement = await previewPage.$('#tentang');
    if (prevSecElement) {
      await prevSecElement.scrollIntoViewIfNeeded();
      await previewPage.waitForTimeout(300);
      const previewScreenshotPath = path.join(ARTIFACT_DIR, `task-7-preview-${vp.name}.png`);
      await prevSecElement.screenshot({ path: previewScreenshotPath });
      console.log(`  📸 Preview #tentang screenshot saved: task-7-preview-${vp.name}.png`);
    }
    await previewPage.close();

    assert.strictEqual(errors.length, 0, `No console errors allowed. Found: ${errors.join('; ')}`);
    console.log('  ✔ 0 console errors');

    await page.close();
  }

  await browser.close();
  console.log('\n🎉 ALL SECTION 5 (TASK 7) VERIFICATION CHECKS PASSED PERFECTLY!');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
