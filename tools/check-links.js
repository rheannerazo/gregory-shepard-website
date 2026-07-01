// Verifies every internal href/src/url() in root pages resolves to a real file.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
let bad = [], placeholders = [];
for (const f of pages) {
  const h = fs.readFileSync(path.join(root, f), 'utf8');
  const refs = [...h.matchAll(/(?:href|src)="([^"]*)"/g)].map(m => m[1]);
  const urls = [...h.matchAll(/url\('([^']+)'\)/g)].map(m => m[1]);
  for (const raw of [...refs, ...urls]) {
    const r = raw.split('#')[0];
    if (raw === '#') { placeholders.push(f + ' -> #'); continue; }
    if (r === '' || /^(https?:|mailto:|tel:|data:|javascript:)/.test(raw)) continue;
    if (!fs.existsSync(path.join(root, decodeURIComponent(r)))) bad.push(f + ' -> ' + raw);
  }
}
console.log(bad.length ? 'BROKEN (' + bad.length + '):\n' + bad.join('\n') : 'ALL INTERNAL LINKS OK across ' + pages.length + ' pages');
console.log('placeholder "#" links: ' + placeholders.length);
