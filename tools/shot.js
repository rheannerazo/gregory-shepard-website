// Full-page screenshot via system Chrome (no browser download).
// Usage: node tools/shot.js <inputHtmlOrUrl> <outputPng> [width]
const { chromium } = require('playwright-core');

(async () => {
  const [, , input, out, widthArg] = process.argv;
  if (!input || !out) {
    console.error('Usage: node tools/shot.js <inputHtmlOrUrl> <outputPng> [width]');
    process.exit(1);
  }
  const width = parseInt(widthArg || '1440', 10);
  const url = /^https?:|^file:/.test(input)
    ? input
    : 'file:///' + input.replace(/\\/g, '/').replace(/^\/+/, '');

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    deviceScaleFactor: 2,
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  // reveal everything so full-page captures aren't blank (reveal-on-scroll otherwise hides off-screen content)
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(e => { e.classList.add('in'); e.style.transitionDelay = '0ms'; });
  });
  await page.waitForTimeout(650);
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log('saved', out, '@', width + 'px');
})();
