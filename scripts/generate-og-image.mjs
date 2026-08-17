// One-off generator for public/og-image.png (1200x630 PNG)
import sharp from "sharp";

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b101d"/>
      <stop offset="100%" stop-color="#030408"/>
    </linearGradient>
    <radialGradient id="glowCyan" cx="0.15" cy="0.1" r="0.7">
      <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#00f2fe" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="0.9" cy="0.95" r="0.8">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gradText" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <clipPath id="circleClip">
      <circle cx="990" cy="315" r="150"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glowCyan)"/>
  <rect width="${W}" height="${H}" fill="url(#glowViolet)"/>

  <!-- grid -->
  <g stroke="#ffffff" stroke-opacity="0.035" stroke-width="1">
    ${Array.from({ length: Math.floor(W / 60) + 1 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${H}"/>`).join("")}
    ${Array.from({ length: Math.floor(H / 60) + 1 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="${W}" y2="${i * 60}"/>`).join("")}
  </g>

  <!-- label -->
  <text x="72" y="112" font-family="'Segoe UI', 'Bahnschrift', Arial, sans-serif" font-size="21" letter-spacing="7" fill="#00f2fe" font-weight="600">// FULL-STACK &amp; CLOUD ENGINEER</text>

  <!-- name -->
  <text x="70" y="300" font-family="'Bahnschrift', 'Segoe UI', Arial, sans-serif" font-size="86" font-weight="700" fill="#f4f6f8">Rahul Singh</text>
  <text x="70" y="392" font-family="'Bahnschrift', 'Segoe UI', Arial, sans-serif" font-size="86" font-weight="700" fill="#f4f6f8">Shekhawat.</text>

  <!-- tagline -->
  <text x="72" y="466" font-family="'Segoe UI', Arial, sans-serif" font-size="38" font-weight="600" fill="url(#gradText)">Designing scalable systems.</text>

  <line x1="72" y1="512" x2="660" y2="512" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>

  <!-- footer -->
  <text x="72" y="556" font-family="'Segoe UI', Arial, sans-serif" font-size="22" fill="#8b93a7">AWS · Node.js · AI · Serverless Architecture</text>
  <text x="72" y="592" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="600" fill="#e2e8f0">rahulshekhawat.dev</text>

  <!-- portrait ring -->
  <circle cx="990" cy="315" r="150" fill="none" stroke="#00f2fe" stroke-opacity="0.45" stroke-width="3"/>
  <circle cx="990" cy="315" r="158" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>
</svg>
`;

// Render the base layout
const base = await sharp(Buffer.from(svg)).png().toBuffer();

// Circular-crop the portrait (dest-in keeps only the pixels inside the circle)
const mask = Buffer.from(
  `<svg width="300" height="300"><circle cx="150" cy="150" r="150" fill="white"/></svg>`
);
const portrait = await sharp("public/rahul.png")
  .resize(300, 300, { fit: "cover" })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

// Composite portrait onto base at (990-150, 315-150)
await sharp(base)
  .composite([{ input: portrait, left: 840, top: 165 }])
  .png()
  .toFile("public/og-image.png");

console.log("og-image.png regenerated: 1200x630 PNG");
