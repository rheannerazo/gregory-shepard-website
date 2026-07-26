// Verifies local href/src/action/url() references and HTML fragments.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const stylesheets = fs.readdirSync(root).filter((file) => file.endsWith('.css')).sort();
const sources = [...pages, ...stylesheets];
const broken = [];
const placeholders = [];
const externalSchemes = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

function htmlAnchors(file) {
  const text = fs.readFileSync(file, 'utf8');
  const anchors = new Set();
  for (const match of text.matchAll(/\b(?:id|name)\s*=\s*(["'])(.*?)\1/gi)) {
    anchors.add(match[2]);
  }
  return anchors;
}

function references(file, text) {
  const found = [];
  if (file.endsWith('.html')) {
    for (const match of text.matchAll(/\b(?:href|src|action)\s*=\s*(["'])(.*?)\1/gi)) {
      found.push({ raw: match[2].trim(), index: match.index });
    }
  }
  for (const match of text.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)"']+))\s*\)/gi)) {
    found.push({ raw: (match[2] || match[3] || '').trim(), index: match.index });
  }
  return found;
}

for (const source of sources) {
  const sourcePath = path.join(root, source);
  const text = fs.readFileSync(sourcePath, 'utf8');

  for (const ref of references(source, text)) {
    const raw = ref.raw;
    const location = `${source}:${lineNumber(text, ref.index)}`;
    if (raw === '#') {
      placeholders.push(`${location} -> #`);
      continue;
    }
    if (!raw || externalSchemes.test(raw)) continue;

    const hashIndex = raw.indexOf('#');
    const queryIndex = raw.indexOf('?');
    const pathEnd = [hashIndex, queryIndex].filter((index) => index >= 0).reduce((a, b) => Math.min(a, b), raw.length);
    const relativePath = decodeURIComponent(raw.slice(0, pathEnd));
    const fragment = hashIndex >= 0 ? decodeURIComponent(raw.slice(hashIndex + 1)) : '';
    const targetPath = relativePath
      ? path.resolve(path.dirname(sourcePath), relativePath)
      : sourcePath;

    if (!fs.existsSync(targetPath)) {
      broken.push(`${location} -> ${raw} (missing file)`);
      continue;
    }

    if (fragment) {
      if (path.extname(targetPath).toLowerCase() !== '.html') {
        broken.push(`${location} -> ${raw} (fragment on non-HTML target)`);
        continue;
      }
      if (!htmlAnchors(targetPath).has(fragment)) {
        broken.push(`${location} -> ${raw} (missing fragment #${fragment})`);
      }
    }
  }
}

if (broken.length) {
  console.error(`BROKEN (${broken.length}):\n${broken.join('\n')}`);
} else {
  console.log(`ALL INTERNAL LINKS OK across ${pages.length} pages and ${stylesheets.length} stylesheets`);
}
console.log(`placeholder "#" links: ${placeholders.length}`);
if (placeholders.length) console.log(placeholders.join('\n'));
process.exitCode = broken.length || placeholders.length ? 1 : 0;
