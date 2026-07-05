// Audit every page for horizontal overflow at given widths; name the offending elements.
// Usage: node tools/overflow-audit.js [baseUrl]
const { chromium } = require('playwright-core');
const fs = require('fs');

(async () => {
  const base = process.argv[2] || 'http://localhost:8420';
  const pages = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  const widths = [1366, 1100];
  const browser = await chromium.launch({ channel: 'chrome' });
  let issues = 0;

  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 768 } });
    for (const file of pages) {
      await page.goto(`${base}/${file}`, { waitUntil: 'domcontentloaded' });
      const res = await page.evaluate(() => {
        const doc = document.documentElement;
        const over = doc.scrollWidth - doc.clientWidth;
        if (over <= 0) return null;
        const offenders = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.right > doc.clientWidth + 1 || r.left < -1) {
            const tag = el.tagName.toLowerCase();
            const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.split(' ').join('.') : '';
            offenders.push(`${tag}${cls} [L${Math.round(r.left)} R${Math.round(r.right)}]`);
            if (offenders.length >= 5) break;
          }
        }
        return { over, offenders };
      });
      if (res) {
        issues++;
        console.log(`@${width} ${file}: +${res.over}px`);
        res.offenders.forEach(o => console.log(`   ${o}`));
      }
    }
    await page.close();
  }
  await browser.close();
  console.log(issues === 0 ? `NO HORIZONTAL OVERFLOW across ${pages.length} pages at ${widths.join('/')}px` : `${issues} page/width combos with overflow`);
})();
