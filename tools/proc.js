// Process curated real photos -> clean web-optimized assets in assets/real/
const sharp = require('sharp');
const fs = require('fs');
const PS = 'C:/Users/User/Documents/New project/gregory-local-assets/zip-images/Photo Shoot/';
const SP = 'C:/Users/User/Documents/New project/gregory-local-assets/zip-images/Speaking/';
const OUT = 'assets/real/';
fs.mkdirSync(OUT, { recursive: true });

// [source, outName, targetWidth]
const jobs = [
  [PS + 'B0036728.jpg', 'hero-greg.jpg', 1500],          // blue blazer, hands — hero source (+cutout)
  [PS + 'B0036700.jpg', 'portrait-smile.jpg', 1100],     // smiling closeup
  [PS + '000010300026.jpg', 'whiteboard.jpg', 1200],     // at the whiteboard
  [PS + '000010300010.jpg', 'table.jpg', 1200],          // seated at table
  [PS + '000010280031.jpg', 'grey-blazer.jpg', 1200],    // grey blazer, arms crossed
  [PS + 'B0036757.jpg', 'maroon.jpg', 1200],             // maroon blazer
  [PS + '000010230009.jpg', 'outdoor.jpg', 1200],        // outdoors by water
  [PS + 'B0037229.jpg', 'standing.jpg', 1200],           // standing lifestyle
  [SP + '2017-05-16-09_27_09-9774.jpg', 'speaking-hero.jpg', 1500], // grey blazer, mid-gesture, stage
  [SP + 'IMG_0564.JPG', 'speaking-2.jpg', 1200],         // blue stage lighting
  [SP + 'IMG_2340.jpeg', 'podium.jpg', 1200],            // venture madness podium
  [SP + 'IMG_2638.JPG', 'speaking-3.jpg', 1200],         // presenting
  [SP + 'IMG_2343.jpeg', 'speaking-4.jpg', 1200],        // presenting 2
  [SP + 'IMG_2647.JPG', 'slides.jpg', 1200],             // startup lifecycle slide
];

(async () => {
  for (const [src, name, w] of jobs) {
    try {
      await sharp(src).rotate().resize({ width: w, withoutEnlargement: true })
        .jpeg({ quality: 84, mozjpeg: true }).toFile(OUT + name);
      console.log('ok', name);
    } catch (e) { console.error('FAIL', name, e.message); }
  }
  console.log('done');
})();
