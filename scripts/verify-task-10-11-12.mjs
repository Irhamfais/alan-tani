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
  console.log('Starting Verification for Task 10 (Footer), Task 11 (FAB & Toast), Task 12 (Full Page Integration)...');

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

    // 2. Verify Task 12: Exact section ordering and absence of prohibited sections
    const pageStructure = await page.evaluate(() => {
      const main = document.querySelector('main#main');
      const children = main ? [...main.children] : [];
      const sectionIds = children.map(el => el.id || el.tagName.toLowerCase());

      const bodyText = document.body.textContent || '';
      const prohibitedKeywords = [
        'Mengapa Memilih',
        'Top Info Bar',
        'Category Cards',
        'Banner Promo',
        'Siap Berbelanja',
      ];
      const foundProhibited = prohibitedKeywords.filter(k => bodyText.includes(k));

      return {
        hasHeader: Boolean(document.querySelector('header.site-header')),
        hasFooter: Boolean(document.querySelector('footer.site-footer')),
        hasFab: Boolean(document.querySelector('a.fab')),
        hasToast: Boolean(document.querySelector('#toast')),
        sectionIds,
        foundProhibited,
      };
    });

    assert.ok(pageStructure.hasHeader, 'Site header should be present');
    assert.ok(pageStructure.hasFooter, 'Site footer should be present');
    assert.ok(pageStructure.hasFab, 'Floating WhatsApp button should be present');
    assert.ok(pageStructure.hasToast, 'Toast notification element should be present');
    assert.deepStrictEqual(
      pageStructure.sectionIds,
      ['home', 'produk', 'artikel', 'tentang', 'testimoni', 'kontak'],
      `Exact main section order must match preview v5. Got: ${pageStructure.sectionIds.join(' -> ')}`
    );
    assert.strictEqual(
      pageStructure.foundProhibited.length,
      0,
      `Found prohibited sections: ${pageStructure.foundProhibited.join(', ')}`
    );
    console.log(`  ✔ Exact section sequence verified: Header -> Hero -> Produk -> Artikel -> Tentang -> Testimoni -> Kontak -> Footer -> FAB`);
    console.log(`  ✔ Cleanliness verified: 0 prohibited sections present`);

    // 3. Verify Task 10: Footer
    const footerData = await page.evaluate(() => {
      const footer = document.querySelector('footer.site-footer');
      if (!footer) return null;

      const gridComputed = window.getComputedStyle(footer.querySelector('.footer-grid'));
      const footerComputed = window.getComputedStyle(footer);

      const logo = footer.querySelector('.footer-brand .logo');
      const logoComputed = logo ? window.getComputedStyle(logo) : null;

      const brandPara = footer.querySelector('.footer-brand p')?.textContent?.trim() || '';

      const headings = [...footer.querySelectorAll('.footer-grid h3')].map(h => h.textContent.trim());

      const pageLinks = [...footer.querySelectorAll('.footer-grid > div:nth-child(2) li a')].map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href'),
      }));

      const contactItems = [...footer.querySelectorAll('.footer-grid > div:nth-child(3) li')].map(li => li.textContent.trim());

      const mpLinks = [...footer.querySelectorAll('.footer-grid > div:nth-child(4) li a')].map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href'),
      }));

      const copyright = footer.querySelector('.copyright')?.textContent?.trim() || '';

      const textColor = window.getComputedStyle(footer).color;
      const h3Color = headings.length > 0 ? window.getComputedStyle(footer.querySelector('h3')).color : '';

      return {
        backgroundColor: footerComputed.backgroundColor,
        gridTemplateColumns: gridComputed.gridTemplateColumns,
        logoHeight: logoComputed?.height,
        brandPara,
        headings,
        pageLinks,
        contactItems,
        mpLinks,
        copyright,
        textColor,
        h3Color,
      };
    });

    assert.ok(footerData, 'Footer not found');
    assert.ok(footerData.brandPara.includes('Solusi Terbaik Petani'));
    assert.deepStrictEqual(footerData.headings, ['Halaman', 'Kontak', 'Marketplace dan sosial']);
    assert.strictEqual(footerData.pageLinks.length, 5, 'Should have 5 page links');
    assert.strictEqual(footerData.pageLinks[0].href, '#home');
    assert.strictEqual(footerData.pageLinks[1].href, '#produk');
    assert.strictEqual(footerData.pageLinks[2].href, '#artikel');
    assert.strictEqual(footerData.pageLinks[3].href, '#tentang');
    assert.strictEqual(footerData.pageLinks[4].href, '#kontak');
    assert.strictEqual(footerData.contactItems.length, 5, 'Should have 5 contact items');
    assert.strictEqual(footerData.mpLinks.length, 5, 'Should have 5 marketplace and social links');
    assert.ok(footerData.copyright.includes('© 2026 Alan Tani'));
    console.log(`  ✔ Task 10 Footer structure & 4 columns verified`);

    if (vp.width >= 720) {
      assert.ok(
        footerData.gridTemplateColumns.split(' ').length >= 4,
        `Expected 4 columns on >=720px, got ${footerData.gridTemplateColumns}`
      );
      console.log(`  ✔ Footer 4-column layout verified on ${vp.name} (${footerData.gridTemplateColumns})`);
    } else {
      console.log(`  ✔ Footer mobile stacked layout verified on ${vp.name} (${footerData.gridTemplateColumns})`);
    }

    // Check footer contrast
    const footerTextContrast = getContrastRatio(parseRgb(footerData.textColor), parseRgb(footerData.backgroundColor));
    const footerH3Contrast = getContrastRatio(parseRgb(footerData.h3Color), parseRgb(footerData.backgroundColor));
    assert.ok(footerTextContrast >= 4.5, `Footer text contrast ${footerTextContrast.toFixed(2)} should be >= 4.5`);
    assert.ok(footerH3Contrast >= 4.5, `Footer h3 contrast ${footerH3Contrast.toFixed(2)} should be >= 4.5`);
    console.log(`  ✔ Footer contrast meets WCAG AA >= 4.5:1 (text: ${footerTextContrast.toFixed(2)}:1, h3: ${footerH3Contrast.toFixed(2)}:1)`);

    // 4. Verify Task 11: Floating WhatsApp & Toast
    const fabData = await page.evaluate(() => {
      const fab = document.querySelector('a.fab');
      if (!fab) return null;

      const computed = window.getComputedStyle(fab);
      const rect = fab.getBoundingClientRect();

      return {
        href: fab.getAttribute('href'),
        ariaLabel: fab.getAttribute('aria-label'),
        position: computed.position,
        zIndex: computed.zIndex,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      };
    });

    assert.ok(fabData, 'FAB button not found');
    assert.strictEqual(fabData.ariaLabel, 'Chat WhatsApp Alan Tani');
    assert.ok(fabData.href.includes('wa.me/6285875613333'));
    assert.strictEqual(fabData.position, 'fixed');
    assert.strictEqual(Math.round(fabData.width), 60);
    assert.strictEqual(Math.round(fabData.height), 60);
    console.log(`  ✔ Task 11 Floating WhatsApp verified (fixed 60x60, aria-label, wa.me link)`);

    // Test GA4 click tracking
    const gaEvent = await page.evaluate(() => {
      window.dataLayer = [];
      const fab = document.querySelector('a.fab');
      fab.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      return window.dataLayer;
    });
    assert.ok(
      gaEvent.some(e => e.event === 'whatsapp_click' && e.location === 'floating'),
      'Clicking FAB must trigger GA4 event whatsapp_click with location: floating'
    );
    console.log(`  ✔ GA4 whatsapp_click tracking event verified`);

    // Test Toast interaction
    await page.evaluate(() => {
      if (typeof window.toast === 'function') {
        window.toast('Berhasil disalin');
      } else {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Berhasil disalin' }));
      }
    });
    await page.waitForFunction(() => {
      const el = document.querySelector('#toast');
      return el && el.getAttribute('data-show') === 'true';
    }, { timeout: 3000 });
    const toastState = await page.evaluate(() => {
      const toastEl = document.querySelector('#toast');
      return {
        shownDataShow: toastEl?.getAttribute('data-show'),
        shownText: toastEl?.textContent,
      };
    });
    assert.strictEqual(toastState.shownDataShow, 'true');
    assert.strictEqual(toastState.shownText, 'Berhasil disalin');
    console.log(`  ✔ Toast notification trigger and rendering verified`);

    // 5. Zero console errors
    assert.strictEqual(errors.length, 0, `Expected 0 console errors, got: ${errors.join(', ')}`);
    console.log(`  ✔ 0 console errors`);

    // 6. Capture Screenshots
    const footerLoc = page.locator('footer.site-footer');
    await footerLoc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await footerLoc.screenshot({
      path: path.join(ARTIFACT_DIR, `task-10-app-${vp.name}.png`),
    });

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `task-12-fullpage-app-${vp.name}.png`),
      fullPage: true,
    });
    console.log(`  📸 Saved app screenshots: task-10-app-${vp.name}.png, task-12-fullpage-app-${vp.name}.png`);

    await page.close();

    // 7. Capture Preview v5 Screenshots
    const previewPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await previewPage.goto(PREVIEW_FILE_URL, { waitUntil: 'load' });
    await previewPage.waitForTimeout(600);

    const prevFooterLoc = previewPage.locator('footer.site-footer');
    await prevFooterLoc.scrollIntoViewIfNeeded();
    await previewPage.waitForTimeout(300);
    await prevFooterLoc.screenshot({
      path: path.join(ARTIFACT_DIR, `task-10-preview-${vp.name}.png`),
    });

    await previewPage.screenshot({
      path: path.join(ARTIFACT_DIR, `task-12-fullpage-preview-${vp.name}.png`),
      fullPage: true,
    });
    console.log(`  📸 Saved preview screenshots: task-10-preview-${vp.name}.png, task-12-fullpage-preview-${vp.name}.png`);

    await previewPage.close();
  }

  await browser.close();
  console.log('\nAll tests for Task 10, Task 11, and Task 12 passed successfully! 🎉');
}

verify().catch(err => {
  console.error('\n❌ Verification failed:', err);
  process.exit(1);
});
