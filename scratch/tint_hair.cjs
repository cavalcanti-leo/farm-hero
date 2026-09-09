const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

function tintHair(srcPng, targetHex) {
  const { r: tR, g: tG, b: tB } = hexToRgb(targetHex);
  const outPng = new PNG({ width: srcPng.width, height: srcPng.height });

  for (let y = 0; y < srcPng.height; y++) {
    for (let x = 0; x < srcPng.width; x++) {
      const idx = (srcPng.width * y + x) << 2;
      const a = srcPng.data[idx + 3];

      if (a > 5) {
        const r = srcPng.data[idx];
        const g = srcPng.data[idx + 1];
        const b = srcPng.data[idx + 2];

        // Luminance check for black outline vs fill
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        if (lum < 55) {
          // Keep outline black/dark
          outPng.data[idx] = r;
          outPng.data[idx + 1] = g;
          outPng.data[idx + 2] = b;
          outPng.data[idx + 3] = a;
        } else {
          // Tint fill proportionally to brightness
          const factor = lum / 165;
          outPng.data[idx] = Math.min(255, Math.round(tR * factor));
          outPng.data[idx + 1] = Math.min(255, Math.round(tG * factor));
          outPng.data[idx + 2] = Math.min(255, Math.round(tB * factor));
          outPng.data[idx + 3] = a;
        }
      } else {
        outPng.data[idx] = 0;
        outPng.data[idx + 1] = 0;
        outPng.data[idx + 2] = 0;
        outPng.data[idx + 3] = 0;
      }
    }
  }
  return outPng;
}

const colors = [
  { id: 'c5979d', hex: '#C5979D' },
  { id: '4b8f8c', hex: '#4B8F8C' },
  { id: '484d6d', hex: '#484D6D' },
  { id: '2c365e', hex: '#2C365E' },
  { id: '2b193d', hex: '#2B193D' },
  { id: 'f5e9e2', hex: '#F5E9E2' },
  { id: 'e3b5a4', hex: '#E3B5A4' },
  { id: 'd44d5c', hex: '#D44D5C' },
  { id: '773344', hex: '#773344' },
  { id: '160029', hex: '#160029' },
  { id: 'e6e626', hex: '#E6E626' },
  { id: 'e57373', hex: '#E57373' },
  { id: 'd96868', hex: '#D96868' },
  { id: 'c55d2b', hex: '#C55D2B' },
  { id: '1e2022', hex: '#1E2022' }
];

const maleBase = PNG.sync.read(fs.readFileSync('src/assets/avatar/hair_red.png'));
const femaleBase = PNG.sync.read(fs.readFileSync('src/assets/avatar/hair_female_pink.png'));

const outputDir = 'src/assets/avatar';

colors.forEach(c => {
  // Male hair
  const maleTinted = tintHair(maleBase, c.hex);
  fs.writeFileSync(path.join(outputDir, `hair_male_${c.id}.png`), PNG.sync.write(maleTinted));

  // Female hair
  const femaleTinted = tintHair(femaleBase, c.hex);
  fs.writeFileSync(path.join(outputDir, `hair_female_${c.id}.png`), PNG.sync.write(femaleTinted));

  console.log(`Generated male & female hair for ${c.hex}`);
});
