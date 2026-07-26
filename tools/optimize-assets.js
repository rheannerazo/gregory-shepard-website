// Generates right-sized WebP assets for the production site.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const jobs = [
  { input: 'assets/orig/gs-logo-full.png', output: 'assets/orig/gs-logo-full.webp', width: 600, quality: 88 },
  { input: 'assets/real/hero-cut.png', output: 'assets/real/hero-cut.webp', width: 1500, quality: 80 },
  { input: 'assets/real/portrait-smile-cut.png', output: 'assets/real/portrait-smile-cut.webp', width: 1100, quality: 80 },
  { input: 'assets/real/grey-blazer-cut.png', output: 'assets/real/grey-blazer-cut.webp', width: 1200, quality: 80 },
  { input: 'assets/real/editorial-bg.jpg', output: 'assets/real/editorial-bg.webp', width: 1600, quality: 76 },
  { input: 'assets/orig/event-1.jpg', output: 'assets/orig/event-1.webp', width: 1600, quality: 78 },
  { input: 'assets/orig/event-2.jpg', output: 'assets/orig/event-2.webp', width: 1600, quality: 78 },
  { input: 'assets/orig/event-4.jpg', output: 'assets/orig/event-4.webp', width: 900, quality: 76 },
  { input: 'assets/orig/event-5.jpg', output: 'assets/orig/event-5.webp', width: 1600, quality: 78 },
  { input: 'assets/orig/greg-head.png', output: 'assets/orig/greg-head-hero.webp', width: 1200, quality: 80 },
  { input: 'assets/orig/press-entrepreneur.webp', output: 'assets/orig/press-entrepreneur-1200.webp', width: 1200, quality: 78 },
  { input: 'assets/orig/book-next.png', output: 'assets/orig/book-next.webp', width: 900, quality: 80 },
  { input: 'assets/orig/hi-im-gregory.jpg', output: 'assets/orig/hi-im-gregory.webp', width: 1600, quality: 78 },
  { input: 'assets/real/speaking-hero.jpg', output: 'assets/real/speaking-hero.webp', width: 1200, quality: 76 },
  { input: 'assets/real/speaking-2.jpg', output: 'assets/real/speaking-2.webp', width: 900, quality: 76 },
  { input: 'assets/real/slides.jpg', output: 'assets/real/slides.webp', width: 900, quality: 76 },
  { input: 'assets/orig/podcast-deepwealth.png', output: 'assets/orig/podcast-deepwealth.webp', width: 700, quality: 80 },
  { input: 'assets/orig/podcast-accelerate.jpg', output: 'assets/orig/podcast-accelerate.webp', width: 700, quality: 80 }
];

async function optimize(job) {
  const input = path.join(root, job.input);
  const output = path.join(root, job.output);
  await fs.promises.mkdir(path.dirname(output), { recursive: true });
  await sharp(input)
    .rotate()
    .resize({ width: job.width, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: job.quality, alphaQuality: 85, effort: 6 })
    .toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(`${job.output}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
}

async function avatar() {
  const input = path.join(root, 'assets/orig/greg-head.png');
  const output = path.join(root, 'assets/orig/greg-head-avatar.webp');
  await sharp(input)
    .rotate()
    .resize({ width: 96, height: 96, fit: 'cover', position: 'attention' })
    .webp({ quality: 78, effort: 6 })
    .toFile(output);
  console.log(`assets/orig/greg-head-avatar.webp: ${(fs.statSync(output).size / 1024).toFixed(0)} KB`);
}

(async () => {
  for (const job of jobs) await optimize(job);
  await avatar();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
