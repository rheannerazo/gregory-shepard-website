// Contact sheet: grid of labeled thumbnails from a folder, so I can pick the best shots.
// Usage: node tools/contact.js "<folder>" <outJpg> [maxImages]
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const [, , dir, out, maxArg] = process.argv;
const MAX = parseInt(maxArg || '30', 10);
const exts = /\.(jpe?g|png|webp)$/i;
const TW = 300, TH = 200, GAP = 8, COLS = 5, LBL = 22;

(async () => {
  let files = fs.readdirSync(dir).filter(f => exts.test(f)).sort().slice(0, MAX);
  const cellH = TH + LBL;
  const rows = Math.ceil(files.length / COLS);
  const W = COLS * TW + (COLS + 1) * GAP;
  const H = rows * (cellH + GAP) + GAP;
  const comp = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i], col = i % COLS, row = Math.floor(i / COLS);
    const x = GAP + col * (TW + GAP), y = GAP + row * (cellH + GAP);
    try {
      const buf = await sharp(path.join(dir, f)).rotate().resize(TW, TH, { fit: 'cover' }).jpeg().toBuffer();
      comp.push({ input: buf, left: x, top: y });
      const safe = f.replace(/&/g, '&amp;').replace(/</g, '').slice(0, 36);
      const lbl = Buffer.from(`<svg width="${TW}" height="${LBL}"><rect width="100%" height="100%" fill="#0A1730"/><text x="5" y="16" font-family="Arial" font-size="12" fill="#7EC4FF">${safe}</text></svg>`);
      comp.push({ input: lbl, left: x, top: y + TH });
    } catch (e) { console.error('skip', f, e.message); }
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 16, g: 24, b: 40 } } })
    .composite(comp).jpeg({ quality: 82 }).toFile(out);
  console.log('saved', out, W + 'x' + H, '·', files.length, 'imgs');
})();
