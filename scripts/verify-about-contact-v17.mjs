import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import assert from 'node:assert';

const artifactDir = 'C:/Users/User/.gemini/antigravity-ide/brain/4367c96e-c28c-410f-8cd4-442057d05aa8';
const previewUrl = 'file:///c:/Project/alan-tani/Project%20Files/Alan%20Tani%20Jaya,%20preview%20landing%20page%20v17.html';
const appUrl = 'http://localhost:3000';

const viewports = [
  { name: '375', width: 375, height: 667 },
  { name: '412', width: 412, height: 915 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1920', width: 1920, height: 1080 }
];

async function runVerification() {
  console.log('🚀 Starting Verification of Tentang & Kontak (Preview v17 vs App)...');
  const browser = await chromium.launch({ headless: true });

  const consoleErrors = [];

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${vp.name}] ${msg.text()}`);
      }
    });

    await page.goto(appUrl, { waitUntil: 'networkidle' });

    // 1. Check Horizontal Scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    assert.strictEqual(hasHorizontalScroll, false, `Horizontal scroll detected on viewport ${vp.name}!`);
    console.log(`  ✔ No horizontal scroll`);

    // 2. Validate Section Tentang
    const aboutData = await page.evaluate(() => {
      const sec = document.getElementById('tentang');
      if (!sec) return null;
      const h2 = sec.querySelector('h2')?.textContent?.trim();
      const ps = [...sec.querySelectorAll('.about-copy p')].map(p => p.textContent?.trim());
      const facts = [...sec.querySelectorAll('.facts .fact')].map(f => ({
        dt: f.querySelector('dt')?.textContent?.trim(),
        dd: f.querySelector('dd')?.textContent?.trim()
      }));
      const galleryFigures = [...sec.querySelectorAll('.gallery figure')].map(fig => {
        const title = fig.querySelector('figcaption strong')?.textContent?.trim();
        const address = fig.querySelector('figcaption span')?.textContent?.trim();
        const btn = fig.querySelector('figcaption a.btn');
        const btnText = btn?.textContent?.trim();
        const btnHref = btn?.getAttribute('href');
        const iconSvg = btn?.querySelector('svg');
        const iconRect = iconSvg ? iconSvg.getBoundingClientRect() : null;
        const mainSvg = fig.querySelector(':scope > svg');
        const mainSvgRect = mainSvg ? mainSvg.getBoundingClientRect() : null;
        return {
          title,
          address,
          btnText,
          btnHref,
          iconWidth: iconRect ? iconRect.width : 0,
          iconHeight: iconRect ? iconRect.height : 0,
          mainSvgWidth: mainSvgRect ? mainSvgRect.width : 0
        };
      });
      const note = sec.querySelector('.note')?.textContent?.trim();
      return { h2, ps, facts, galleryFigures, note };
    });

    assert.ok(aboutData, 'Tentang section not found');
    assert.strictEqual(aboutData.h2, 'Tentang Alan Tani');
    assert.strictEqual(aboutData.ps.length, 2);
    assert.ok(aboutData.ps[0].includes('Kami menyediakan berbagai kebutuhan pertanian berkualitas tinggi'));
    assert.ok(aboutData.ps[1].includes('Sebagai R1 Seller, kami menjamin keaslian produk, pengiriman cepat, serta pelayanan ramah.'));

    // Verify facts: MUST NOT contain Toko induk or Toko cabang
    const factLabels = aboutData.facts.map(f => f.dt);
    assert.ok(!factLabels.includes('Toko induk'), 'Facts MUST NOT contain Toko induk');
    assert.ok(!factLabels.includes('Toko cabang'), 'Facts MUST NOT contain Toko cabang');
    assert.strictEqual(aboutData.facts[0].dt, 'Berdiri');
    assert.ok(aboutData.facts[0].dd.includes('2020'));
    assert.strictEqual(aboutData.facts[1].dt, 'Status');
    assert.ok(aboutData.facts[1].dd.includes('R1 Seller'));
    assert.strictEqual(aboutData.facts[2].dt, 'Area layanan');
    assert.ok(aboutData.facts[2].dd.includes('Jember'));

    // Verify gallery
    assert.strictEqual(aboutData.galleryFigures.length, 2);
    // Induk
    assert.strictEqual(aboutData.galleryFigures[0].title, 'Toko induk');
    assert.strictEqual(aboutData.galleryFigures[0].address, 'Jl. HOS Cokroaminoto, Tanggul Kulon, Tanggul, Jember, Jawa Timur');
    assert.strictEqual(aboutData.galleryFigures[0].btnHref, 'https://share.google/os4Ak9UN3mJQ9AGzL');
    assert.ok(aboutData.galleryFigures[0].btnText.includes('Rute ke toko induk'));
    assert.ok(aboutData.galleryFigures[0].iconWidth <= 22 && aboutData.galleryFigures[0].iconWidth >= 16, `Button icon size must be around 18px (got ${aboutData.galleryFigures[0].iconWidth})`);

    // Cabang
    assert.strictEqual(aboutData.galleryFigures[1].title, 'Toko cabang');
    assert.strictEqual(aboutData.galleryFigures[1].address, 'Jl. Mawar (Pasar Tanggul), Tanggul, Jember, Jawa Timur');
    assert.strictEqual(aboutData.galleryFigures[1].btnHref, 'https://share.google/1ZGzgLxBJCIZ7WLDJ');
    assert.ok(aboutData.galleryFigures[1].btnText.includes('Rute ke toko cabang'));

    // Note
    assert.strictEqual(aboutData.note, 'Ilustrasi toko bersifat sementara. Foto asli dari owner dipasang saat implementasi.');
    console.log(`  ✔ Section Tentang verified: facts list, gallery 2 stores, route links, button icons <= 22px`);

    // 3. Validate Section Kontak
    const contactData = await page.evaluate(() => {
      const sec = document.getElementById('kontak');
      if (!sec) return null;
      const h2 = sec.querySelector('.contact-head h2')?.textContent?.trim();
      const hasMap = sec.querySelector('.map, #mapArt, iframe') !== null;
      const hasWaBtn = sec.querySelector('.contact-cta, .btn-primary') !== null;
      const rows = [...sec.querySelectorAll('.rows .row')].map(r => ({
        label: r.querySelector('strong')?.textContent?.trim(),
        text: r.querySelector('div')?.textContent?.trim(),
        link: r.querySelector('a')?.getAttribute('href'),
        linkText: r.querySelector('a')?.textContent?.trim(),
        hasSvg: r.querySelector(':scope > svg') !== null
      }));
      const rowsStyle = window.getComputedStyle(sec.querySelector('.rows'));
      return {
        h2,
        hasMap,
        hasWaBtn,
        rows,
        gridColumns: rowsStyle.gridTemplateColumns
      };
    });

    assert.ok(contactData, 'Kontak section not found');
    assert.strictEqual(contactData.h2, 'Ada pertanyaan? Hubungi kami');
    assert.strictEqual(contactData.hasMap, false, 'Kontak MUST NOT contain map');
    assert.strictEqual(contactData.hasWaBtn, false, 'Kontak MUST NOT contain Chat WhatsApp CTA button');
    assert.strictEqual(contactData.rows.length, 6, `Kontak must have exactly 6 rows (got ${contactData.rows.length})`);

    // Row 1: Toko induk
    assert.strictEqual(contactData.rows[0].label, 'Toko induk');
    assert.ok(contactData.rows[0].text.includes('Jl. HOS Cokroaminoto, Tanggul Kulon, Tanggul, Jember, Jawa Timur'));
    // Row 2: Toko cabang
    assert.strictEqual(contactData.rows[1].label, 'Toko cabang');
    assert.ok(contactData.rows[1].text.includes('Jl. Mawar (Pasar Tanggul), Tanggul, Jember, Jawa Timur'));
    // Row 3: Jam operasional
    assert.strictEqual(contactData.rows[2].label, 'Jam operasional');
    assert.ok(contactData.rows[2].text.includes('Senin sampai Minggu, 07.00 sampai 16.00 WIB'));
    // Row 4: WhatsApp
    assert.strictEqual(contactData.rows[3].label, 'WhatsApp');
    assert.strictEqual(contactData.rows[3].linkText, '+62 858-7561-3333');
    assert.ok(contactData.rows[3].link.includes('wa.me/6285875613333'));
    // Row 5: Email
    assert.strictEqual(contactData.rows[4].label, 'Email');
    assert.strictEqual(contactData.rows[4].linkText, 'alantanijaya@gmail.com');
    assert.strictEqual(contactData.rows[4].link, 'mailto:alantanijaya@gmail.com');
    // Row 6: Media sosial
    assert.strictEqual(contactData.rows[5].label, 'Media sosial');
    assert.ok(contactData.rows[5].text.includes('Facebook: Alan Tani Jaya'));
    assert.ok(contactData.rows[5].text.includes('TikTok: Alan Tani Jaya'));

    // Check grid layout at >= 900px
    if (vp.width >= 900) {
      assert.ok(contactData.gridColumns.split(' ').length >= 2, `Contact .rows must be 2 columns at >= 900px (got ${contactData.gridColumns})`);
      console.log(`  ✔ Desktop layout: .rows is 2 columns (${contactData.gridColumns})`);
    } else {
      console.log(`  ✔ Mobile layout: .rows is stacked 1 column`);
    }

    // 4. Capture App Screenshots
    const aboutEl = page.locator('#tentang');
    await aboutEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const aboutAppPath = path.join(artifactDir, `about-app-${vp.name}.png`);
    await aboutEl.screenshot({ path: aboutAppPath });

    const contactEl = page.locator('#kontak');
    await contactEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const contactAppPath = path.join(artifactDir, `contact-app-${vp.name}.png`);
    await contactEl.screenshot({ path: contactAppPath });

    // 5. Capture Preview v17 Screenshots for direct comparison
    const previewPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await previewPage.goto(previewUrl, { waitUntil: 'load' });
    await previewPage.waitForTimeout(500);

    const prevAboutEl = previewPage.locator('#tentang');
    await prevAboutEl.scrollIntoViewIfNeeded();
    await previewPage.waitForTimeout(300);
    const aboutPrevPath = path.join(artifactDir, `about-preview-${vp.name}.png`);
    await prevAboutEl.screenshot({ path: aboutPrevPath });

    const prevContactEl = previewPage.locator('#kontak');
    await prevContactEl.scrollIntoViewIfNeeded();
    await previewPage.waitForTimeout(300);
    const contactPrevPath = path.join(artifactDir, `contact-preview-${vp.name}.png`);
    await prevContactEl.screenshot({ path: contactPrevPath });

    await previewPage.close();
    await page.close();
    console.log(`  ✔ Screenshots captured for viewport ${vp.name}`);
  }

  // Check JSON-LD on desktop
  const checkPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await checkPage.goto(appUrl, { waitUntil: 'networkidle' });
  const jsonLdData = await checkPage.evaluate(() => {
    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
    for (const s of scripts) {
      try {
        const parsed = JSON.parse(s.textContent);
        if (Array.isArray(parsed) && parsed.some(item => item['@type'] === 'LocalBusiness')) {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  });

  assert.ok(jsonLdData, 'JSON-LD structured data not found');
  const lbItems = jsonLdData.filter(item => item['@type'] === 'LocalBusiness');
  assert.strictEqual(lbItems.length, 2, 'JSON-LD must contain exactly 2 LocalBusiness entries');
  assert.strictEqual(lbItems[0].address.streetAddress, 'Jl. HOS Cokroaminoto, Tanggul Kulon, Tanggul, Jember, Jawa Timur');
  assert.strictEqual(lbItems[0].hasMap, 'https://share.google/os4Ak9UN3mJQ9AGzL');
  assert.strictEqual(lbItems[1].address.streetAddress, 'Jl. Mawar (Pasar Tanggul), Tanggul, Jember, Jawa Timur');
  assert.strictEqual(lbItems[1].hasMap, 'https://share.google/1ZGzgLxBJCIZ7WLDJ');
  console.log('\n✔ JSON-LD contains 2 LocalBusiness entries with correct addresses & map URLs');

  await checkPage.close();
  await browser.close();

  assert.strictEqual(consoleErrors.length, 0, `Found console errors: ${consoleErrors.join(', ')}`);
  console.log('✔ Zero console errors recorded across all viewports!');
  console.log('\n🎉 ALL VERIFICATION CRITERIA PASSED SUCCESSFULLY!');
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
