// Adds consistent canonical, social-sharing, and structured-data metadata.
// Also regenerates sitemap.xml and robots.txt for the production domain.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const productionOrigin = 'https://www.gregoryshepard.com';
const socialImage = `${productionOrigin}/assets/og-gregory-shepard.png`;
const startMarker = '<!-- SEO:START -->';
const endMarker = '<!-- SEO:END -->';

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function attr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getMatch(html, pattern, file) {
  const match = html.match(pattern);
  if (!match) throw new Error(`Missing required metadata in ${file}`);
  return decode(match[1].trim());
}

function pagePath(file) {
  return file === 'index.html' ? '/' : `/${file}`;
}

function pageType(file) {
  if (file === 'contact.html') return 'ContactPage';
  if (file.startsWith('shop')) return 'CollectionPage';
  if (file === 'about-biography.html' || file === 'about.html') return 'ProfilePage';
  return 'WebPage';
}

function structuredData(file, title, description, url) {
  const webpageId = `${url}#webpage`;
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${productionOrigin}/#website`,
      url: `${productionOrigin}/`,
      name: 'Gregory Shepard: The Startup Architect',
      publisher: { '@id': `${productionOrigin}/#person` },
      inLanguage: 'en-US'
    },
    {
      '@type': 'Person',
      '@id': `${productionOrigin}/#person`,
      name: 'Gregory Shepard',
      url: `${productionOrigin}/`,
      image: `${productionOrigin}/assets/real/hero-cut.webp`,
      jobTitle: 'Entrepreneur, Author, Investor and Advisor',
      sameAs: [
        'https://www.linkedin.com/in/gregshepard/',
        'https://x.com/GregShepard_',
        'https://www.youtube.com/channel/UC7GeCLaOiWzNfiu9gTpfehg',
        'https://www.startupscience.io/'
      ],
      knowsAbout: [
        'Entrepreneurship',
        'Startup operations',
        'Startup investment',
        'Business exits',
        'Founder mentorship'
      ]
    },
    {
      '@type': pageType(file),
      '@id': webpageId,
      url,
      name: title,
      description,
      isPartOf: { '@id': `${productionOrigin}/#website` },
      about: { '@id': `${productionOrigin}/#person` },
      primaryImageOfPage: { '@type': 'ImageObject', url: socialImage },
      inLanguage: 'en-US'
    }
  ];

  if (file === 'know-your-phase.html') {
    graph.push({
      '@type': 'Event',
      '@id': `${url}#event`,
      name: 'Know Your Phase: Startup Lifecycle Masterclass',
      description,
      startDate: '2026-08-11T18:00:00-07:00',
      endDate: '2026-08-11T20:00:00-07:00',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: 'Estancia La Jolla',
        address: { '@type': 'PostalAddress', addressLocality: 'La Jolla', addressRegion: 'CA', addressCountry: 'US' }
      },
      image: [socialImage],
      organizer: { '@id': `${productionOrigin}/#person` },
      performer: { '@id': `${productionOrigin}/#person` },
      offers: {
        '@type': 'Offer',
        price: '49.95',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://know-your-phase.eventbrite.com/?aff=website',
        validFrom: '2026-07-01'
      }
    });
    graph[2].mainEntity = { '@id': `${url}#event` };
  }

  if (file === 'author.html' || file === 'startup-science.html') {
    graph.push({
      '@type': 'Book',
      '@id': `${productionOrigin}/author.html#book`,
      name: 'The Startup Lifecycle',
      alternateName: 'The Startup Lifecycle: The Definitive Guide to Building a Startup from Idea to Exit',
      isbn: '9781637744321',
      author: { '@id': `${productionOrigin}/#person` },
      image: `${productionOrigin}/assets/orig/book-cover.webp`,
      url: `${productionOrigin}/author.html`,
      sameAs: 'https://www.amazon.com/Startup-Lifecycle-Definitive-Guide-Building/dp/1637744323'
    });
    graph[2].mainEntity = { '@id': `${productionOrigin}/author.html#book` };
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

const files = fs.readdirSync(root)
  .filter((file) => file.endsWith('.html'))
  .sort();

for (const file of files) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(new RegExp(`${startMarker}[\\s\\S]*?${endMarker}\\s*`, 'g'), '');

  const title = getMatch(html, /<title>([\s\S]*?)<\/title>/i, file);
  const description = getMatch(html, /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i, file);
  const url = `${productionOrigin}${pagePath(file)}`;
  const jsonLd = JSON.stringify(structuredData(file, title, description, url));
  const block = [
    startMarker,
    `<link rel="canonical" href="${attr(url)}">`,
    '<meta name="theme-color" content="#071225">',
    '<meta property="og:locale" content="en_US">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Gregory Shepard: The Startup Architect">',
    `<meta property="og:title" content="${attr(title)}">`,
    `<meta property="og:description" content="${attr(description)}">`,
    `<meta property="og:url" content="${attr(url)}">`,
    `<meta property="og:image" content="${attr(socialImage)}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="Gregory Shepard: The Startup Architect">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${attr(title)}">`,
    `<meta name="twitter:description" content="${attr(description)}">`,
    `<meta name="twitter:image" content="${attr(socialImage)}">`,
    `<script type="application/ld+json">${jsonLd}</script>`,
    endMarker
  ].join('\n');

  html = html.replace('</head>', `${block}\n</head>`);
  fs.writeFileSync(filePath, html);
}

const sitemapFiles = files.filter((file) => !['404.html', 'thanks.html'].includes(file));
const urls = sitemapFiles.map((file) => `  <url><loc>${productionOrigin}${pagePath(file)}</loc></url>`).join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  '</urlset>',
  ''
].join('\n'));
fs.writeFileSync(path.join(root, 'robots.txt'), [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${productionOrigin}/sitemap.xml`,
  ''
].join('\n'));

console.log(`SEO metadata applied to ${files.length} pages; sitemap includes ${sitemapFiles.length} URLs.`);
