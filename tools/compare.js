// Side-by-side: YOUR sample mockup  |  MY render — so I can match the target.
// Usage: node tools/compare.js <sampleImg> <myRender> <outPng> [height]
const sharp = require('sharp');

(async () => {
  const [, , a, b, out, hArg] = process.argv;
  const H = parseInt(hArg || '1600', 10);
  const GAP = 28, BG = { r: 233, g: 236, b: 240, alpha: 1 };

  const prep = async (src) => {
    const img = sharp(src).resize({ height: H, fit: 'inside' });
    const buf = await img.png().toBuffer();
    const meta = await sharp(buf).metadata();
    return { buf, w: meta.width, h: meta.height };
  };

  const A = await prep(a);
  const B = await prep(b);
  const W = A.w + B.w + GAP * 3;
  const labelH = 46;

  const label = (text, w) =>
    Buffer.from(
      `<svg width="${w}" height="${labelH}"><rect width="100%" height="100%" fill="#0A1730"/><text x="16" y="30" font-family="Arial" font-size="20" font-weight="bold" fill="#6BB6FF">${text}</text></svg>`
    );

  await sharp({ create: { width: W, height: H + labelH + GAP, channels: 4, background: BG } })
    .composite([
      { input: label('SAMPLE  (your mockup)', A.w), left: GAP, top: 0 },
      { input: A.buf, left: GAP, top: labelH + GAP },
      { input: label('MY BUILD  (live)', B.w), left: A.w + GAP * 2, top: 0 },
      { input: B.buf, left: A.w + GAP * 2, top: labelH + GAP },
    ])
    .png()
    .toFile(out);

  console.log('saved', out, `(${W}x${H + labelH + GAP})`);
})();
