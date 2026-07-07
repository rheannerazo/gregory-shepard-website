// Stamps identical nav+footer chrome into every root page, with active-state per section.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const nav = fs.readFileSync(path.join(__dirname, 'chrome-nav.html'), 'utf8').trim();
const foot = fs.readFileSync(path.join(__dirname, 'chrome-footer.html'), 'utf8').trim();

const groups = {
  about: /^about/, advisory: /^advisory/,
  speaker: /^(speaking|lectures|workshops|workshop-|events)/,
  author: /^(author\.|startup-science)/, authority: /^authority/,
  ventures: /^ventures/, shop: /^shop/, community: /^community/,
};
const skip = new Set(['know-your-phase.html']); // standalone event landing keeps its own chrome

let stamped = 0, missing = [];
for (const f of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
  if (skip.has(f)) continue;
  const p = path.join(root, f);
  let h = fs.readFileSync(p, 'utf8');
  let navHtml = nav;
  for (const [g, re] of Object.entries(groups)) {
    if (re.test(f)) navHtml = navHtml.replace(new RegExp(`class="top([^"]*)" data-g="${g}"`), `class="top$1 active" data-g="${g}"`);
  }
  const beforeNav = h;
  h = h.replace(/<header class="nav">[\s\S]*?<\/header>/, navHtml);
  h = h.replace(/<footer>[\s\S]*?<\/footer>/, foot);
  if (h === beforeNav) missing.push(f);
  fs.writeFileSync(p, h);
  stamped++;
}
console.log(`stamped ${stamped} pages` + (missing.length ? `; NO CHROME MARKERS IN: ${missing.join(', ')}` : ''));
