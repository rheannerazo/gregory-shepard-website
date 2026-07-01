// Build a clean deployable dist/ (site files only — no node_modules/tools/shots).
const fs = require('fs');
const D = 'C:/Users/User/OneDrive/Documents/New project/website-redesign/';
const dist = D + 'dist/';
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
const rootFiles = fs.readdirSync(D).filter(f => /\.(html|css|js)$/.test(f));
rootFiles.forEach(f => fs.copyFileSync(D + f, dist + f));
fs.cpSync(D + 'assets', dist + 'assets', { recursive: true });
const html = fs.readdirSync(dist).filter(f => f.endsWith('.html'));
console.log('dist built →', dist);
console.log('files:', fs.readdirSync(dist).join(', '));
console.log('html pages:', html.length, '| assets:', fs.readdirSync(dist + 'assets').length);
