// Add favicon + per-page meta description to each page's <head>.
const fs = require('fs');
const D = 'C:/Users/User/OneDrive/Documents/New project/website-redesign/';
const desc = {
  'index': 'Gregory Shepard — The Startup Architect. Founder, operator, and advisor helping ambitious founders build companies engineered to scale.',
  'about': 'About Gregory Shepard — serial entrepreneur, author, and advisor. Twelve companies built and exited, and the operating system behind startups that last.',
  'advisory': 'Advisory by Gregory Shepard — board seats, fractional leadership, and turnarounds. Twelve exits and a $925M deal, applied directly to your company.',
  'speaking': 'Book Gregory Shepard to speak — keynotes, workshops, and panels on building companies that scale. From TEDx to the United Nations.',
  'startup-science': 'Startup Science — Gregory Shepard\'s seven-phase framework for building investor-grade companies on purpose, from idea to exit.',
  'resources': 'Watch, listen, and read Gregory Shepard — a TEDx talk, the Forbes Startup Science podcast, and 100+ articles on building startups that last.',
  'media': 'Gregory Shepard in the media — featured in Forbes, Inc., Entrepreneur, and Fortune, plus a TEDx talk and 100+ published articles.',
  'contact': 'Contact Gregory Shepard — work with Gregory, book him to speak, or subscribe to The Startup Architect newsletter.'
};
Object.keys(desc).forEach(p => {
  const f = D + p + '.html';
  let s = fs.readFileSync(f, 'utf8'); let add = '';
  if (!s.includes('rel="icon"')) add += '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n';
  if (!s.includes('name="description"')) add += '<meta name="description" content="' + desc[p] + '">\n';
  if (add) { s = s.replace('</head>', add + '</head>'); fs.writeFileSync(f, s); console.log('qa+', p); }
  else console.log('skip', p);
});
console.log('done');
