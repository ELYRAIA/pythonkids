// Génère les icônes PWA/stores depuis un SVG vectoriel (npm run icons).
// Sorties : public/icons/*.png + public/apple-touch-icon.png
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Serpent stylisé sur fond dégradé violet→rose (identité PythonKids)
function snakeSvg({ fullBleed = false, scale = 1 }) {
  // fullBleed : pas de coins arrondis (icônes "maskable" — l'OS applique son propre masque)
  // scale < 1 : rétrécit le motif vers le centre (zone de sécurité maskable)
  const rx = fullBleed ? 0 : 100;
  const g = (512 - 512 * scale) / 2; // offset de centrage
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c3aed"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#86efac"/>
      <stop offset="1" stop-color="#22c55e"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${rx}" fill="url(#bg)"/>
  <g transform="translate(${g} ${g}) scale(${scale})">
    <!-- corps en S -->
    <path d="M 150 358 C 150 268 362 312 362 222 C 362 132 150 168 150 168"
          stroke="url(#body)" stroke-width="58" fill="none" stroke-linecap="round"/>
    <!-- queue -->
    <path d="M 150 358 C 150 398 200 412 232 396"
          stroke="url(#body)" stroke-width="44" fill="none" stroke-linecap="round"/>
    <!-- tête -->
    <circle cx="150" cy="160" r="52" fill="url(#body)"/>
    <!-- yeux -->
    <circle cx="132" cy="148" r="11" fill="#0f172a"/>
    <circle cx="170" cy="148" r="11" fill="#0f172a"/>
    <circle cx="135" cy="145" r="4" fill="#fff"/>
    <circle cx="173" cy="145" r="4" fill="#fff"/>
    <!-- langue -->
    <path d="M 150 208 L 150 232 M 150 232 L 138 246 M 150 232 L 162 246"
          stroke="#f43f5e" stroke-width="9" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;
}

async function main() {
  const outDir = path.join("public", "icons");
  fs.mkdirSync(outDir, { recursive: true });

  const normal = Buffer.from(snakeSvg({ fullBleed: false, scale: 1 }));
  const maskable = Buffer.from(snakeSvg({ fullBleed: true, scale: 0.72 }));

  const jobs = [
    [normal, 512, path.join(outDir, "icon-512.png")],
    [normal, 192, path.join(outDir, "icon-192.png")],
    [maskable, 512, path.join(outDir, "icon-maskable-512.png")],
    [maskable, 192, path.join(outDir, "icon-maskable-192.png")],
    [normal, 180, path.join("public", "apple-touch-icon.png")],
  ];
  for (const [src, size, file] of jobs) {
    await sharp(src, { density: 300 }).resize(size, size).png().toFile(file);
    console.log("OK", file);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
