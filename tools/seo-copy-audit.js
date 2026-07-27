// Checks page-level search copy, heading structure, and generated SEO metadata.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const utilityPages = new Set(['404.html', 'privacy.html', 'terms.html', 'thanks.html']);
const rows = [];
const issues = [];

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function match(html, pattern) {
  return decode(((html.match(pattern) || [])[1] || '').trim());
}

for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const ogTitle = match(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDescription = match(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  rows.push({ file, title, description });

  if (!title) issues.push(`${file}: missing title`);
  if (!description) issues.push(`${file}: missing meta description`);
  if (h1Count !== 1) issues.push(`${file}: expected 1 h1, found ${h1Count}`);
  if (title !== ogTitle) issues.push(`${file}: Open Graph title does not match title`);
  if (description !== ogDescription) issues.push(`${file}: Open Graph description does not match meta description`);

  if (!utilityPages.has(file)) {
    if (title.length < 30 || title.length > 60) {
      issues.push(`${file}: title length ${title.length}, expected 30-60`);
    }
    if (description.length < 120 || description.length > 160) {
      issues.push(`${file}: description length ${description.length}, expected 120-160`);
    }
  }

  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      issues.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }
}

for (const field of ['title', 'description']) {
  const values = new Map();
  for (const row of rows) {
    const matches = values.get(row[field]) || [];
    matches.push(row.file);
    values.set(row[field], matches);
  }
  for (const [value, matchingFiles] of values) {
    if (value && matchingFiles.length > 1) {
      issues.push(`duplicate ${field}: ${matchingFiles.join(', ')}`);
    }
  }
}

const stalePatterns = [
  ['Q3 2025', /Q3 2025/i],
  ['unconfirmed Amazon store', /Amazon store/i],
  ['unconfirmed streaming claim', /streaming everywhere soon/i],
  ['unconfirmed shipping claim', /Ships from San Diego/i],
  ['unconfirmed returns policy', /Returns:\s*30 days/i],
  ['unqualified preview price', /class="price">(?:From )?\$/i]
];

for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const [label, pattern] of stalePatterns) {
    if (pattern.test(html)) issues.push(`${file}: ${label}`);
  }
}

if (issues.length) {
  console.error(`SEO copy audit failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`SEO copy audit passed: ${files.length} pages, unique titles/descriptions, one h1 per page, synchronized social metadata, valid JSON-LD.`);
