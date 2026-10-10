import { chromium } from 'playwright';
import assert from 'node:assert';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/User/.gemini/antigravity-ide/brain/4367c96e-c28c-410f-8cd4-442057d05aa8';
const appUrl = 'http://localhost:3000';

const viewports = [
  { name: 'desktop', width: 1280, height: 800, file: 'dialog-1280x800.png' },
  { name: 'mobile-large', width: 412, height: 924, file: 'dialog-412x924.png' },
  { name: 'mobile-small', width: 360, height: 640, file: 'dialog-360x640.png' },
];

async function verify() {
  console.log('Starting ProductDialog verification across viewports...');
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.width}x${vp.height} (${vp.name}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    await page.goto(appUrl, { waitUntil: 'networkidle' });

    // Scroll to products section
    await page.locator('#produk').scrollIntoViewIfNeeded();

    // Click on the first product card button
    const productButton = page.locator('.pcard:first-child .stretch');
    await productButton.click();

    // Wait for dialog to open
    const dialog = page.locator('#productDialog');
    await page.waitForSelector('#productDialog[open]');

    // (1) Check body scroll locked
    const bodyOverflow = await page.evaluate(() => document.documentElement.style.overflow);
    assert.strictEqual(bodyOverflow, 'hidden', 'Scroll behind open dialog must be locked (overflow: hidden)');
    console.log('  ✔ Scroll page behind dialog is locked');

    // (2) Check centering horizontally and vertically
    const metrics = await page.evaluate(() => {
      const dlg = document.querySelector('#productDialog');
      const dlgWrapper = document.querySelector('.dlg');
      const closeBtn = document.querySelector('#dlgClose');
      const waBtn = document.querySelector('#dlgWa');
      const body = document.querySelector('.dlg-body');
      const art = document.querySelector('.dlg .art');

      const rect = dlg.getBoundingClientRect();
      const wrapRect = dlgWrapper.getBoundingClientRect();
      const closeRect = closeBtn.getBoundingClientRect();
      const waRect = waBtn.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Horizontal centering check: left margin should roughly equal right margin
      const leftMargin = rect.left;
      const rightMargin = viewportWidth - rect.right;
      const diffX = Math.abs(leftMargin - rightMargin);

      // Vertical centering check
      const topMargin = rect.top;
      const bottomMargin = viewportHeight - rect.bottom;
      const diffY = Math.abs(topMargin - bottomMargin);

      return {
        rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
        diffX,
        diffY,
        leftMargin,
        rightMargin,
        topMargin,
        bottomMargin,
        viewportWidth,
        viewportHeight,
        hasHorizontalPageScroll: document.documentElement.scrollWidth > window.innerWidth,
        dlgHorizontalScroll: dlgWrapper.scrollWidth > dlgWrapper.clientWidth + 1,
        closeVisible: closeRect.width > 0 && closeRect.height > 0 && closeRect.top >= wrapRect.top && closeRect.right <= wrapRect.right + 2,
        waExists: !!waBtn,
        waVisibleOrReachable: waRect.width > 0 && waRect.height > 0,
      };
    });

    console.log(`  Dialog rect: ${metrics.rect.width}x${metrics.rect.height} at (${metrics.rect.left}, ${metrics.rect.top})`);
    console.log(`  Horizontal centering margins: left=${metrics.leftMargin.toFixed(1)}px, right=${metrics.rightMargin.toFixed(1)}px (diff: ${metrics.diffX.toFixed(1)}px)`);
    console.log(`  Vertical centering margins: top=${metrics.topMargin.toFixed(1)}px, bottom=${metrics.bottomMargin.toFixed(1)}px (diff: ${metrics.diffY.toFixed(1)}px)`);

    // Margin diff tolerance (within 2px due to subpixel rendering)
    assert.ok(metrics.diffX <= 3, `Dialog must be horizontally centered (diffX=${metrics.diffX})`);
    assert.ok(metrics.diffY <= 3, `Dialog must be vertically centered (diffY=${metrics.diffY})`);
    assert.ok(metrics.rect.left > 0, 'Dialog must NOT stick to top-left edge');
    assert.ok(metrics.rect.top > 0, 'Dialog must NOT stick to top-left edge');
    console.log('  ✔ Dialog is perfectly centered horizontally & vertically');

    // (3) Check no horizontal scroll
    assert.strictEqual(metrics.hasHorizontalPageScroll, false, 'No page horizontal scroll');
    assert.strictEqual(metrics.dlgHorizontalScroll, false, 'No dialog horizontal scroll');
    console.log('  ✔ No horizontal overflow or scrollbar');

    // (4) Check Close Button (#dlgClose)
    assert.strictEqual(metrics.closeVisible, true, 'Close button must be visible in top-right of .dlg');
    console.log('  ✔ Close button #dlgClose is pinned & visible');

    // (5) Check WhatsApp button reachable
    assert.strictEqual(metrics.waExists, true, 'WhatsApp button #dlgWa exists');
    assert.strictEqual(metrics.waVisibleOrReachable, true, 'WhatsApp button has valid dimensions');

    // Scroll dlg-body down to test scroll containment & verify close button stays pinned
    await page.evaluate(() => {
      const dlgBody = document.querySelector('.dlg-body');
      if (dlgBody) dlgBody.scrollTop = dlgBody.scrollHeight;
    });

    // Check close button didn't scroll away
    const closeAfterScroll = await page.evaluate(() => {
      const closeBtn = document.querySelector('#dlgClose');
      const wrap = document.querySelector('.dlg');
      const cRect = closeBtn.getBoundingClientRect();
      const wRect = wrap.getBoundingClientRect();
      return Math.abs(cRect.top - (wRect.top + 12)) < 5; // top: 0.75rem = 12px
    });
    assert.strictEqual(closeAfterScroll, true, 'Close button stays pinned and did NOT scroll with body');
    console.log('  ✔ Close button stays pinned when .dlg-body is scrolled');

    // Take screenshot of the open dialog in this viewport
    const screenshotPath = path.join(ARTIFACT_DIR, vp.file);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  📸 Screenshot saved: ${screenshotPath}`);

    // (6) Test closing and focus return
    if (vp.name === 'desktop') {
      // Test backdrop click close on desktop
      console.log('  Testing backdrop click close on desktop...');
      // Click at the top-left area outside dialog
      await page.mouse.click(10, 10);
      const isClosedBackdrop = await page.evaluate(() => !document.querySelector('#productDialog').hasAttribute('open'));
      assert.strictEqual(isClosedBackdrop, true, 'Dialog closes on backdrop click');

      // Verify focus returned to the triggering product card
      const activeAttr = await page.evaluate(() => document.activeElement?.getAttribute('data-detail'));
      assert.ok(activeAttr !== null, `Focus returned to product card button (data-detail=${activeAttr})`);
      console.log('  ✔ Focus returned to product card button after backdrop close');
    } else if (vp.name === 'mobile-large') {
      // Test ESC key close
      console.log('  Testing Escape key close on mobile-large...');
      await page.keyboard.press('Escape');
      const isClosedEsc = await page.evaluate(() => !document.querySelector('#productDialog').hasAttribute('open'));
      assert.strictEqual(isClosedEsc, true, 'Dialog closes on Escape');

      const activeAttr = await page.evaluate(() => document.activeElement?.getAttribute('data-detail'));
      assert.ok(activeAttr !== null, `Focus returned to product card button (data-detail=${activeAttr})`);
      console.log('  ✔ Focus returned to product card button after Escape close');
    } else {
      // Test X button close on mobile-small
      console.log('  Testing close button (#dlgClose) on mobile-small...');
      await page.click('#dlgClose');
      const isClosedX = await page.evaluate(() => !document.querySelector('#productDialog').hasAttribute('open'));
      assert.strictEqual(isClosedX, true, 'Dialog closes on X button click');

      const activeAttr = await page.evaluate(() => document.activeElement?.getAttribute('data-detail'));
      assert.ok(activeAttr !== null, `Focus returned to product card button (data-detail=${activeAttr})`);
      console.log('  ✔ Focus returned to product card button after X button close');
    }

    // Verify body overflow restored
    const bodyOverflowAfter = await page.evaluate(() => document.documentElement.style.overflow);
    assert.strictEqual(bodyOverflowAfter, '', 'Scroll behind dialog restored after close');
    console.log('  ✔ Scroll page behind dialog is unlocked after close');

    await context.close();
  }

  await browser.close();
  console.log('\n🎉 ALL DIALOG VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

verify().catch(err => {
  console.error('Dialog verification failed:', err);
  process.exit(1);
});
