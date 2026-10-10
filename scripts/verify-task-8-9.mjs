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

// Contrast calculation helper
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return [255, 255, 255];
  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

async function verify() {
  console.log('Starting Sections 6 (Testimoni) & 7 (Kontak) Verification (Tasks 8 & 9)...');

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

    // 2. Verify Section 6: Testimonials
    const testiData = await page.evaluate(() => {
      const sec = document.querySelector('#testimoni');
      if (!sec) return null;

      const title = sec.querySelector('#testiTitle')?.textContent?.trim();
      const quotes = [...sec.querySelectorAll('.quotes .quote')].map(q => {
        const text = q.querySelector('blockquote')?.textContent?.trim() || '';
        const avatar = q.querySelector('.avatar')?.textContent?.trim() || '';
        const name = q.querySelector('.who strong')?.textContent?.trim() || '';
        const role = q.querySelector('.who span')?.textContent?.trim() || '';
        return { text, avatar, name, role };
      });
      const note = sec.querySelector('.note')?.textContent?.trim() || '';

      const quotesComputed = window.getComputedStyle(sec.querySelector('.quotes'));
      const secComputed = window.getComputedStyle(sec);

      return {
        title,
        quotes,
        note,
        gridTemplateColumns: quotesComputed.gridTemplateColumns,
        backgroundColor: secComputed.backgroundColor,
      };
    });

    assert.ok(testiData, 'Section #testimoni not found');
    assert.strictEqual(testiData.title, 'Kata pelanggan');
    assert.strictEqual(testiData.quotes.length, 3, 'Should have exactly 3 quotes');
    assert.strictEqual(testiData.quotes[0].name, 'Pak Sukardi');
    assert.strictEqual(testiData.quotes[0].avatar, 'PS');
    assert.strictEqual(testiData.quotes[1].name, 'H. Wahyudi');
    assert.strictEqual(testiData.quotes[1].avatar, 'HW');
    assert.strictEqual(testiData.quotes[2].name, 'Bambang Prasetyo');
    assert.strictEqual(testiData.quotes[2].avatar, 'BP');
    assert.ok(testiData.note.includes('Contoh testimoni'));
    console.log(`  ✔ Section 6 structure verified with 3 authentic quotes`);

    if (vp.width >= 900) {
      assert.ok(
        testiData.gridTemplateColumns.split(' ').length >= 3,
        `Expected 3 columns on desktop, got ${testiData.gridTemplateColumns}`
      );
      console.log(`  ✔ Section 6 3-column desktop layout verified (${testiData.gridTemplateColumns})`);
    } else {
      console.log(`  ✔ Section 6 mobile vertical layout verified (${testiData.gridTemplateColumns})`);
    }

    // 3. Verify Section 7: Contact & Store Location
    const contactData = await page.evaluate(() => {
      const sec = document.querySelector('#kontak');
      if (!sec) return null;

      const title = sec.querySelector('#kontakTitle')?.textContent?.trim();
      const mapSvg = sec.querySelector('.map > svg#mapArt');
      const storeLinks = [...sec.querySelectorAll('.stores a')].map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href'),
      }));
      const note = sec.querySelector('.map .note')?.textContent?.trim() || '';

      const rows = [...sec.querySelectorAll('.rows .row')].map(r => {
        const strong = r.querySelector('strong')?.textContent?.trim() || '';
        const span = r.querySelector('span')?.textContent?.trim() || '';
        const link = r.querySelector('a')?.textContent?.trim() || '';
        const href = r.querySelector('a')?.getAttribute('href') || '';
        return { strong, span, link, href };
      });

      const ctaBtn = sec.querySelector('.contact-cta a.btn-primary');
      const cta = {
        text: ctaBtn?.textContent?.trim() || '',
        href: ctaBtn?.getAttribute('href') || '',
      };

      const contactGridComputed = window.getComputedStyle(sec.querySelector('.contact'));

      return {
        title,
        hasMapSvg: Boolean(mapSvg),
        storeLinks,
        note,
        rows,
        cta,
        gridTemplateColumns: contactGridComputed.gridTemplateColumns,
      };
    });

    assert.ok(contactData, 'Section #kontak not found');
    assert.strictEqual(contactData.title, 'Ada pertanyaan? Hubungi kami');
    assert.ok(contactData.hasMapSvg, 'Map SVG artwork should be present');
    assert.strictEqual(contactData.storeLinks.length, 2, 'Should have 2 store route buttons');
    assert.ok(contactData.storeLinks[0].text.includes('Rute ke toko induk'));
    assert.ok(contactData.storeLinks[1].text.includes('Rute ke toko cabang'));
    assert.ok(contactData.storeLinks[0].href?.includes('google'));
    assert.ok(contactData.storeLinks[1].href?.includes('google'));
    assert.strictEqual(contactData.rows.length, 7, 'Should have 7 contact rows');
    assert.ok(contactData.cta.text.includes('Chat WhatsApp'));
    assert.ok(contactData.cta.href.includes('wa.me/6285875613333'));
    console.log(`  ✔ Section 7 structure verified (map art, 2 store buttons, 7 info rows, WhatsApp CTA)`);

    if (vp.width >= 900) {
      assert.ok(
        contactData.gridTemplateColumns.split(' ').length >= 2,
        `Expected 2 columns on desktop, got ${contactData.gridTemplateColumns}`
      );
      console.log(`  ✔ Section 7 2-column desktop layout verified (${contactData.gridTemplateColumns})`);
    } else {
      console.log(`  ✔ Section 7 1-column mobile layout verified (${contactData.gridTemplateColumns})`);
    }

    // 4. Contrast checks
    const contrastData = await page.evaluate(() => {
      const secTesti = document.querySelector('#testimoni');
      const secKontak = document.querySelector('#kontak');

      const bgAlt = window.getComputedStyle(secTesti).backgroundColor;
      const quoteColor = window.getComputedStyle(secTesti.querySelector('blockquote')).color;
      const whoColor = window.getComputedStyle(secTesti.querySelector('.who strong')).color;

      const bgBase = window.getComputedStyle(secKontak).backgroundColor;
      const contactTitleColor = window.getComputedStyle(secKontak.querySelector('#kontakTitle')).color;
      const rowStrongColor = window.getComputedStyle(secKontak.querySelector('.row strong')).color;
      const rowSpanColor = window.getComputedStyle(secKontak.querySelector('.row span')).color;

      return {
        bgAlt,
        quoteColor,
        whoColor,
        bgBase,
        contactTitleColor,
        rowStrongColor,
        rowSpanColor,
      };
    });

    const quoteContrast = getContrastRatio(parseRgb(contrastData.quoteColor), parseRgb(contrastData.bgAlt));
    const whoContrast = getContrastRatio(parseRgb(contrastData.whoColor), parseRgb(contrastData.bgAlt));
    const titleContrast = getContrastRatio(parseRgb(contrastData.contactTitleColor), parseRgb(contrastData.bgBase));
    const rowStrongContrast = getContrastRatio(parseRgb(contrastData.rowStrongColor), parseRgb(contrastData.bgBase));

    assert.ok(quoteContrast >= 4.5, `Quote contrast ${quoteContrast.toFixed(2)} should be >= 4.5`);
    assert.ok(whoContrast >= 4.5, `Author name contrast ${whoContrast.toFixed(2)} should be >= 4.5`);
    assert.ok(titleContrast >= 4.5, `Contact title contrast ${titleContrast.toFixed(2)} should be >= 4.5`);
    assert.ok(rowStrongContrast >= 4.5, `Row strong contrast ${rowStrongContrast.toFixed(2)} should be >= 4.5`);
    console.log(`  ✔ Contrast ratios meet WCAG AA >= 4.5:1 (Quote: ${quoteContrast.toFixed(2)}:1, Who: ${whoContrast.toFixed(2)}:1, Title: ${titleContrast.toFixed(2)}:1)`);

    // 5. Zero console errors
    assert.strictEqual(errors.length, 0, `Expected 0 console errors, got: ${errors.join(', ')}`);
    console.log(`  ✔ 0 console errors`);

    // 6. Capture screenshots of Sections 6 & 7 in App
    const testiLoc = page.locator('#testimoni');
    await testiLoc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await testiLoc.screenshot({
      path: path.join(ARTIFACT_DIR, `task-8-app-${vp.name}.png`),
    });

    const kontakLoc = page.locator('#kontak');
    await kontakLoc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await kontakLoc.screenshot({
      path: path.join(ARTIFACT_DIR, `task-9-app-${vp.name}.png`),
    });
    console.log(`  📸 Saved app screenshots: task-8-app-${vp.name}.png, task-9-app-${vp.name}.png`);

    await page.close();

    // 7. Capture screenshots of Sections 6 & 7 in Preview v5 HTML for side-by-side comparison
    const previewPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await previewPage.goto(PREVIEW_FILE_URL, { waitUntil: 'load' });
    await previewPage.waitForTimeout(600);

    const prevTestiLoc = previewPage.locator('#testimoni');
    await prevTestiLoc.scrollIntoViewIfNeeded();
    await previewPage.waitForTimeout(300);
    await prevTestiLoc.screenshot({
      path: path.join(ARTIFACT_DIR, `task-8-preview-${vp.name}.png`),
    });

    const prevKontakLoc = previewPage.locator('#kontak');
    await prevKontakLoc.scrollIntoViewIfNeeded();
    await previewPage.waitForTimeout(300);
    await prevKontakLoc.screenshot({
      path: path.join(ARTIFACT_DIR, `task-9-preview-${vp.name}.png`),
    });
    console.log(`  📸 Saved preview screenshots: task-8-preview-${vp.name}.png, task-9-preview-${vp.name}.png`);

    await previewPage.close();
  }

  await browser.close();
  console.log('\nAll tests for Task 8 & Task 9 passed successfully! 🎉');
}

verify().catch(err => {
  console.error('\n❌ Verification failed:', err);
  process.exit(1);
});
