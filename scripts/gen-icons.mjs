import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const svg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff8b5e"/>
      <stop offset="50%" stop-color="#ffc15e"/>
      <stop offset="100%" stop-color="#6fe3d0"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="#0b0d12"/>
  <circle cx="256" cy="256" r="168" fill="none" stroke="url(#g)" stroke-width="26"/>
  <text x="256" y="300" font-family="Georgia, serif" font-style="italic" font-size="200" fill="url(#g)" text-anchor="middle">L</text>
</svg>`;

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

for (const size of sizes) {
  await sharp(Buffer.from(svg(size))).resize(size, size).png().toFile(`public/icons/icon-${size}.png`);
}
await sharp(Buffer.from(svg(180))).resize(180, 180).png().toFile("public/apple-touch-icon.png");
await sharp(Buffer.from(svg(32))).resize(32, 32).png().toFile("public/favicon.png");

console.log("Icons generated.");
