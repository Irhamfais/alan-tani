// Visual regression snapshot: full-page screenshots + computed styles of every element.
// Usage: node scripts/visual-snapshot.mjs <outDir> [baseUrl]
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outDir = process.argv[2];
const baseUrl = process.argv[3] || 'http://localhost:3100';
if (!outDir) {
  console.error('Usage: node scripts/visual-snapshot.mjs <outDir> [baseUrl]');
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { width: 375, height: 812, name: '375' },
  { width: 768, height: 1024, name: '768' },
  { width: 1280, height: 800, name: '1280' },
  { width: 1440, height: 900, name: '1440' },
];

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

async function dumpStyles(page) {
  return page.evaluate(() => {
    const out = [];
    document.querySelectorAll('body *').forEach((el, i) => {
      const cs = getComputedStyle(el);
      const props = {};
      for (let j = 0; j < cs.length; j++) props[cs[j]] = cs.getPropertyValue(cs[j]);
      const r = el.getBoundingClientRect();
      out.push({
        i,
        tag: el.tagName.toLowerCase(),
        id: el.id || undefined,
        cls: el.getAttribute('class') || undefined,
        text: el.children.length === 0 ? (el.textContent || '').trim().slice(0, 80) : undefined,
        box: [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 100) / 100),
        props,
      });
    });
    return out;
  });
}

const browser = await chromium.launch({ headless: true });
const summary = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await settle(page);

  // 1. Full page, top of document
  await page.screenshot({ path: path.join(outDir, `full-${vp.name}.png`), fullPage: true });
  fs.writeFileSync(path.join(outDir, `styles-${vp.name}.json`), JSON.stringify(await dumpStyles(page)));

  // 2. Scrolled state (header shrink)
  await page.evaluate(() => window.scrollTo(0, 900));
  await settle(page);
  await page.screenshot({ path: path.join(outDir, `scrolled-${vp.name}.png`) });
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);

  // 3. Product dialog
  await page.locator('.pcard .stretch').first().click();
  await page.waitForSelector('#productDialog[open]');
  await settle(page);
  await page.screenshot({ path: path.join(outDir, `dialog-${vp.name}.png`) });
  await page.keyboard.press('Escape');
  await settle(page);

  // 4. Mobile menu (narrow viewports only)
  if (vp.width < 1024) {
    const toggle = page.locator('button[aria-controls]').filter({ visible: true }).first();
    if (await toggle.count()) {
      await toggle.click();
      await settle(page);
      await page.screenshot({ path: path.join(outDir, `menu-${vp.name}.png`) });
    }
  }

  summary.push({ viewport: vp.name, consoleErrors: errors });
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
