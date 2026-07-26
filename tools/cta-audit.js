// Inventories CTA links and forms, then flags misleading or unsafe destinations.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const rows = [];
const issues = [];

function cleanText(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|#39);/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function attrs(value) {
  const result = {};
  for (const match of value.matchAll(/\b([a-z:-]+)(?:\s*=\s*(["'])(.*?)\2)?/gi)) {
    result[match[1].toLowerCase()] = match[3] === undefined ? true : match[3];
  }
  return result;
}

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

function contactTopic(label, page) {
  const labelValue = label.toLowerCase();
  const pageValue = page.toLowerCase();
  if (/notify|drop alert|early access/.test(labelValue)) return 'Updates / Newsletter';
  if (/advis|board|director|philanthrop|cause/.test(labelValue)) return 'Advisory / Board';
  if (/speak|speaker|keynote|panel|book greg|booking inquiry/.test(labelValue)) return 'Speaking';
  if (/podcast|show|media|piece|press|author|read|listen|watch/.test(labelValue)) return 'Media / Podcast';
  if (/invest|venture|pitch/.test(labelValue)) return 'Investment / Pitch';
  if (/advisory|about-causes/.test(pageValue)) return 'Advisory / Board';
  if (/venture/.test(pageValue)) return 'Investment / Pitch';
  if (/workshop|lecture|event/.test(pageValue)) return 'Workshop / Event';
  if (/speaking/.test(pageValue)) return 'Speaking';
  if (/author|authority/.test(pageValue)) return 'Media / Podcast';
  if (/workshop|lecture|reserve|seat|event|intensive|cohort/.test(labelValue)) return 'Workshop / Event';
  if (/partner/.test(labelValue)) return 'Partnership';
  return 'General Inquiry';
}

function destinationStatus(href, sourceFile) {
  if (!href || href === '#') return 'placeholder';
  if (/^(?:https?:|mailto:|tel:)/i.test(href)) return href.startsWith('http') ? 'external' : 'direct contact';
  const relative = href.split(/[?#]/)[0] || sourceFile;
  return fs.existsSync(path.resolve(root, relative)) ? 'internal' : 'missing';
}

for (const page of pages) {
  const text = fs.readFileSync(path.join(root, page), 'utf8');

  for (const match of text.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attributes = attrs(match[1]);
    const href = String(attributes.href || '');
    const label = cleanText(match[2]);
    const line = lineNumber(text, match.index);
    const status = destinationStatus(href, page);
    const topic = href === 'contact.html' ? contactTopic(label, page) : '';
    const row = { page, line, label, href, status, topic };
    rows.push(row);

    if (status === 'placeholder' || status === 'missing') {
      issues.push(`${page}:${line} "${label}" -> ${href || '(blank)'} [${status}]`);
    }
    if (href === 'contact.html' && /^(?:learn more|explore|read|watch|listen|subscribe|join)\b/i.test(label)) {
      issues.push(`${page}:${line} "${label}" routes to the contact form; use a specific destination or action label`);
    }
    if (/^https?:/i.test(href) && attributes.target === '_blank' && !/\bnoopener\b/i.test(String(attributes.rel || ''))) {
      issues.push(`${page}:${line} "${label}" opens a new tab without rel="noopener"`);
    }
  }

  for (const match of text.matchAll(/<form\b([^>]*)>/gi)) {
    const attributes = attrs(match[1]);
    const line = lineNumber(text, match.index);
    const action = String(attributes.action || '');
    const method = String(attributes.method || 'get').toLowerCase();
    rows.push({ page, line, label: '[form]', href: action, status: 'form', topic: method.toUpperCase() });
    if (!action || /^mailto:/i.test(action)) {
      issues.push(`${page}:${line} form uses ${action || 'no action'}; it is not an on-page web submission`);
    }
  }
}

const contactLinks = rows.filter((row) => row.href === 'contact.html').length;
const forms = rows.filter((row) => row.status === 'form').length;
console.log(`CTA inventory: ${rows.length} links/forms across ${pages.length} pages`);
console.log(`Contact-form CTAs: ${contactLinks} | Forms: ${forms} | Issues: ${issues.length}`);
if (issues.length) console.log(`\n${issues.join('\n')}`);

if (process.argv.includes('--all')) {
  console.log('\npage\tline\tlabel\tdestination\tstatus\ttopic');
  for (const row of rows) {
    console.log([row.page, row.line, row.label, row.href, row.status, row.topic].join('\t'));
  }
}
process.exitCode = issues.length ? 1 : 0;
