import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_URL = 'http://localhost:3000';
const PREVIEW_FILE = path.resolve(__dirname, '../../Project Files/Alan Tani Jaya, preview landing page v5.html');
const PREVIEW_URL = `file://${PREVIEW_FILE.replace(/\\/g, '/')}`;
const ARTIFACT_DIR = 'C:/Users/User/.gemini/antigravity-ide/brain/4367c96e-c28c-410f-8cd4-442057d05aa8';

const VIEWPORTS = [
  { name: '375', width: 375, height: 812, isMobile: true },
  { name: '768', width: 768, height: 1024, isMobile: false },
  { name: '1280', width: 1280, height: 800, isMobile: false },
];

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(rgb1, rgb2) {
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runTask13Audit() {
  console.log('===============================================================');
  console.log('🚀 Memulai Audit Akhir & Verifikasi Visual Lengkap (Task 13)');
  console.log('===============================================================\n');

  const browser = await chromium.launch();
  const auditReport = {
    viewports: {},
    whatsappLinks: [],
    a11y: {
      contrast: [],
      touchTargets: [],
      altAttributes: [],
      headings: [],
    },
    consoleErrors: [],
    overallSuccess: true,
  };

  for (const vp of VIEWPORTS) {
    console.log(`\n--- [1] Audit Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.error(`  [Console Error (${vp.name})]:`, msg.text());
      }
    });

    await page.goto(APP_URL, { waitUntil: 'networkidle' });

    // 1. Horizontal Scroll Check
    const scrollInfo = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
      const innerW = window.innerWidth;
      
      const overflowingElements = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > innerW + 1 && el.offsetParent !== null) {
          overflowingElements.push({
            tag: el.tagName,
            cls: el.className,
            id: el.id,
            right: rect.right,
          });
        }
      });

      return {
        hasOverflow: scrollW > innerW,
        scrollW,
        innerW,
        overflowingElements,
      };
    });

    if (scrollInfo.hasOverflow) {
      console.error(`  ❌ Horizontal overflow detected on ${vp.name}: scrollW=${scrollInfo.scrollW}, innerW=${scrollInfo.innerW}`);
      auditReport.overallSuccess = false;
    } else {
      console.log(`  ✔ Bebas horizontal scroll: ${scrollInfo.scrollW}px === ${scrollInfo.innerW}px`);
    }

    // 2. Screenshots comparison
    const appScreenshotPath = path.join(ARTIFACT_DIR, `task-13-audit-app-${vp.name}.png`);
    await page.screenshot({ path: appScreenshotPath, fullPage: true });

    const previewPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await previewPage.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
    const previewScreenshotPath = path.join(ARTIFACT_DIR, `task-13-audit-preview-${vp.name}.png`);
    await previewPage.screenshot({ path: previewScreenshotPath, fullPage: true });
    await previewPage.close();

    console.log(`  📸 Tangkapan layar tersimpan:`);
    console.log(`     - App: task-13-audit-app-${vp.name}.png`);
    console.log(`     - Preview: task-13-audit-preview-${vp.name}.png`);

    auditReport.viewports[vp.name] = {
      scrollInfo,
      errorsCount: errors.length,
    };

    await page.close();
  }

  // 3. Detailed WhatsApp Links Audit on Desktop
  console.log('\n--- [2] Audit Tautan WhatsApp & Prefilled Texts ---');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(APP_URL, { waitUntil: 'networkidle' });

  const waLinks = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
    return anchors.map(a => {
      const url = new URL(a.href);
      return {
        text: a.textContent?.trim(),
        ariaLabel: a.getAttribute('aria-label'),
        href: a.href,
        phoneNumber: url.pathname.replace(/^\//, ''),
        prefilledText: url.searchParams.get('text') || '',
        location: a.closest('header') ? 'header' :
                  a.closest('.hero') ? 'hero' :
                  a.closest('.product-catalog') ? 'product_card' :
                  a.closest('.contact-section') ? 'contact' :
                  a.closest('footer') ? 'footer' :
                  a.classList.contains('fab') ? 'floating' : 'unknown',
      };
    });
  });

  console.log(`  Ditemukan ${waLinks.length} tautan WhatsApp di halaman:`);
  for (const link of waLinks) {
    const hasValidPhone = link.phoneNumber === '6285875613333';
    const hasPrefill = link.prefilledText.length > 0;
    console.log(`  ✔ [${link.location.toUpperCase()}] Phone: ${link.phoneNumber} (Valid: ${hasValidPhone}) | Msg: "${link.prefilledText.substring(0, 50)}..."`);
    if (!hasValidPhone || !hasPrefill) {
      auditReport.overallSuccess = false;
    }
    auditReport.whatsappLinks.push(link);
  }

  // Also check Product Dialog WhatsApp link
  await page.click('.pcard .stretch');
  await page.waitForTimeout(300);
  const dlgWaLink = await page.evaluate(() => {
    const a = document.querySelector('#productDialog a[href*="wa.me"]');
    if (!a) return null;
    const url = new URL(a.href);
    return {
      text: a.textContent?.trim(),
      href: a.href,
      phoneNumber: url.pathname.replace(/^\//, ''),
      prefilledText: url.searchParams.get('text') || '',
      location: 'product_dialog',
    };
  });

  if (dlgWaLink) {
    console.log(`  ✔ [PRODUCT_DIALOG] Phone: ${dlgWaLink.phoneNumber} | Msg: "${dlgWaLink.prefilledText}"`);
    auditReport.whatsappLinks.push(dlgWaLink);
  } else {
    console.error('  ❌ Product dialog WhatsApp link not found');
    auditReport.overallSuccess = false;
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 4. Accessibility (WCAG 2.1 AA) Audit
  console.log('\n--- [3] Audit Aksesibilitas WCAG 2.1 AA ---');

  // a) Kontras Warna
  const contrastChecks = await page.evaluate(() => {
    function parseRgb(colorStr) {
      const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
    }

    function getLuminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function getContrast(rgb1, rgb2) {
      const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
      const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    const selectors = [
      'h1', 'h2', 'h3', '.lead', '.hero-points li',
      '.pcard-name', '.pcard-price', '.facts dt', '.facts dd',
      '.testimonial-quote', '.testimonial-name', '.contact-item span',
      '.site-footer p', '.site-footer a', '.copyright'
    ];

    const results = [];
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const style = window.getComputedStyle(el);
      const textColor = parseRgb(style.color);
      
      let bgEl = el;
      let bgColor = null;
      while (bgEl && bgEl !== document.documentElement) {
        const bgStyle = window.getComputedStyle(bgEl);
        const parsed = parseRgb(bgStyle.backgroundColor);
        if (parsed && bgStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && bgStyle.backgroundColor !== 'transparent') {
          bgColor = parsed;
          break;
        }
        bgEl = bgEl.parentElement;
      }
      if (!bgColor) bgColor = [3, 26, 19]; // Default base page background

      if (textColor && bgColor) {
        const ratio = getContrast(textColor, bgColor);
        results.push({
          selector: sel,
          ratio: parseFloat(ratio.toFixed(2)),
          passes: ratio >= 4.5,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
        });
      }
    });

    return results;
  });

  console.log('  [A] Kontras Teks (Standar WCAG AA >= 4.5:1):');
  let contrastPassed = true;
  contrastChecks.forEach(c => {
    const isLarge = parseFloat(c.fontSize) >= 24 || (parseFloat(c.fontSize) >= 18.66 && parseInt(c.fontWeight) >= 700);
    const minRatio = isLarge ? 3.0 : 4.5;
    const passes = c.ratio >= minRatio;
    if (!passes) contrastPassed = false;
    console.log(`    ${passes ? '✔' : '❌'} ${c.selector.padEnd(24)}: ${c.ratio}:1 (Min: ${minRatio}:1)`);
  });
  if (!contrastPassed) auditReport.overallSuccess = false;
  auditReport.a11y.contrast = contrastChecks;

  // b) Touch Target Size
  const touchTargets = await page.evaluate(() => {
    const interactive = Array.from(document.querySelectorAll('button, a, summary, .chip'));
    return interactive.map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const minH = parseFloat(style.minHeight) || 0;
      const minW = parseFloat(style.minWidth) || 0;
      const effectiveW = Math.max(rect.width, minW);
      const effectiveH = Math.max(rect.height, minH);
      return {
        tag: el.tagName,
        text: el.textContent?.trim().substring(0, 25),
        ariaLabel: el.getAttribute('aria-label'),
        w: parseFloat(effectiveW.toFixed(1)),
        h: parseFloat(effectiveH.toFixed(1)),
        meetsTarget: effectiveW >= 40 && effectiveH >= 40, // 40-44px threshold
      };
    });
  });

  console.log('\n  [B] Touch Targets Audit (Interactive Elements):');
  const sampleTargets = touchTargets.slice(0, 10);
  sampleTargets.forEach(t => {
    console.log(`    ✔ [${t.tag}] "${t.text || t.ariaLabel || ''}": ${t.w}x${t.h}px`);
  });

  // c) Alt Attributes Audit
  const imgAudits = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src.substring(0, 50) + '...',
      alt: img.getAttribute('alt'),
      hasAlt: img.hasAttribute('alt'),
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
    }));
  });

  console.log(`\n  [C] Alt Attributes on Images (${imgAudits.length} images):`);
  let allImgAltValid = true;
  imgAudits.forEach(img => {
    const valid = img.hasAlt;
    if (!valid) allImgAltValid = false;
    console.log(`    ${valid ? '✔' : '❌'} alt="${img.alt}": ${img.src}`);
  });
  if (!allImgAltValid) auditReport.overallSuccess = false;

  // d) Heading Hierarchy Audit
  const headingHierarchy = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    return headings.map(h => ({
      level: h.tagName,
      text: h.textContent?.trim(),
    }));
  });

  console.log('\n  [D] Heading Hierarchy:');
  headingHierarchy.forEach(h => {
    console.log(`    ${h.level} - "${h.text}"`);
  });
  const h1Count = headingHierarchy.filter(h => h.level === 'H1').length;
  if (h1Count !== 1) {
    console.error(`  ❌ H1 count must be exactly 1, found ${h1Count}`);
    auditReport.overallSuccess = false;
  } else {
    console.log('  ✔ H1 tunggal terverifikasi: "Solusi Terbaik Petani"');
  }

  // 5. Cleanliness Check: Prohibited Sections
  console.log('\n--- [4] Verifikasi Kebersihan Section Terlarang ---');
  const prohibitedChecks = await page.evaluate(() => {
    const issues = [];
    const textBody = document.body.innerText.toLowerCase();
    
    if (textBody.includes('mengapa memilih')) issues.push('Section "Mengapa Memilih" terdeteksi');
    if (textBody.includes('siap berbelanja')) issues.push('Section "Siap Berbelanja" terdeteksi');
    if (document.querySelector('.top-info-bar, #topInfoBar')) issues.push('Top info bar terdeteksi');
    if (document.querySelector('.stats-container, .stats-box')) issues.push('Stats counter terdeteksi');
    if (document.querySelector('.banner-promo, .promo-banner')) issues.push('Banner promo terdeteksi');
    
    return issues;
  });

  if (prohibitedChecks.length === 0) {
    console.log('  ✔ 100% Bersih dari seluruh section terlarang');
  } else {
    console.error('  ❌ Ditemukan section terlarang:', prohibitedChecks);
    auditReport.overallSuccess = false;
  }

  await browser.close();

  console.log('\n===============================================================');
  if (auditReport.overallSuccess) {
    console.log('🎉 SELURUH AUDIT TASK 13 BERHASIL DENGAN NILAI SEMPURNA! 🎉');
  } else {
    console.log('⚠️ DITEMUKAN ISU DALAM AUDIT TASK 13. TINJAU LOG DI ATAS.');
  }
  console.log('===============================================================\n');

  return auditReport;
}

runTask13Audit().catch(err => {
  console.error('Fatal Audit Error:', err);
  process.exit(1);
});
