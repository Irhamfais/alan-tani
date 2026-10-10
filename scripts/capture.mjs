import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const taskName = process.argv[2] || 'task-1';
const artifactDir = 'C:/Users/User/.gemini/antigravity-ide/brain/4367c96e-c28c-410f-8cd4-442057d05aa8';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const previewPath = 'file:///' + path.resolve('c:/Project/alan-tani/Project Files/Alan Tani Jaya, preview landing page v5.html').replace(/\\/g, '/');
const appUrl = 'http://localhost:3000';

const viewports = [
  { width: 375, height: 812, name: '375' },
  { width: 768, height: 1024, name: '768' },
  { width: 1280, height: 800, name: '1280' }
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });

    // 1. Capture App
    const appPage = await context.newPage();
    const appConsoleErrors = [];
    appPage.on('console', msg => {
      if (msg.type() === 'error') appConsoleErrors.push(msg.text());
    });

    await appPage.goto(appUrl, { waitUntil: 'networkidle' });
    // Check horizontal scroll
    const appScrollInfo = await appPage.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
        bgColor: window.getComputedStyle(document.body).backgroundColor,
        fontDisplay: window.getComputedStyle(document.body).getPropertyValue('--font-display')
      };
    });

    if (taskName === 'task-5') {
      await appPage.evaluate(() => {
        document.querySelector('#produk')?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await appPage.waitForTimeout(300);
    }
    const appScreenshotPath = path.join(artifactDir, `${taskName}-app-${vp.name}.png`);
    await appPage.screenshot({ path: appScreenshotPath, fullPage: false });

    if (taskName === 'task-5' && vp.name === '768') {
      await appPage.click('.pcard:first-child .stretch');
      await appPage.waitForSelector('#productDialog[open]');
      await appPage.screenshot({ path: path.join(artifactDir, `${taskName}-app-dialog-768.png`), fullPage: false });
      await appPage.click('#dlgClose');
    }

    // 2. Capture Preview
    const previewPage = await context.newPage();
    await previewPage.goto(previewPath, { waitUntil: 'load' });
    if (taskName === 'task-5') {
      await previewPage.evaluate(() => {
        document.querySelector('#produk')?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await previewPage.waitForTimeout(300);
    }
    const previewScreenshotPath = path.join(artifactDir, `${taskName}-preview-${vp.name}.png`);
    await previewPage.screenshot({ path: previewScreenshotPath, fullPage: false });

    if (taskName === 'task-5' && vp.name === '768') {
      await previewPage.click('.pcard:first-child [data-detail]');
      await previewPage.waitForSelector('#productDialog[open]');
      await previewPage.screenshot({ path: path.join(artifactDir, `${taskName}-preview-dialog-768.png`), fullPage: false });
      await previewPage.click('#dlgClose');
    }

    results.push({
      viewport: vp.name,
      appScrollInfo,
      appConsoleErrors,
      appScreenshot: appScreenshotPath,
      previewScreenshot: previewScreenshotPath
    });

    await context.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
