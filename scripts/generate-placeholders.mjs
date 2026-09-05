// Generates tasteful abstract floral placeholder artwork (SVG) for demo
// seed content. No external network calls — everything is drawn
// procedurally so the repo has zero dependency on third-party image hosts.
// Replace these with real Flowersgreen photography via the admin panel.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, "../public/images/products");
const CATEGORIES_DIR = path.join(__dirname, "../public/images/categories");
const HERO_DIR = path.join(__dirname, "../public/images/hero");

mkdirSync(PRODUCTS_DIR, { recursive: true });
mkdirSync(CATEGORIES_DIR, { recursive: true });
mkdirSync(HERO_DIR, { recursive: true });

const PALETTES = [
  { bg: "#f6f1ea", petal: "#c98a93", petal2: "#e7b8ad", leaf: "#3f5c46" },
  { bg: "#f3efe6", petal: "#b95d4e", petal2: "#e2a67e", leaf: "#33482f" },
  { bg: "#f5f0e8", petal: "#8a6d8f", petal2: "#d3b7c9", leaf: "#3a4f3d" },
  { bg: "#f7f2ec", petal: "#c9a04a", petal2: "#e8d3a0", leaf: "#42583f" },
  { bg: "#f4efe7", petal: "#a63f4a", petal2: "#e39a9a", leaf: "#2f4a37" },
  { bg: "#f6f2ec", petal: "#d8c3a5", petal2: "#efe3cd", leaf: "#4a5d43" },
  { bg: "#f2ede4", petal: "#7c8f6e", petal2: "#c7d3b6", leaf: "#354a34" },
  { bg: "#f7f1e9", petal: "#bf7e63", petal2: "#e8c3a9", leaf: "#3b4f3a" },
];

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function flowerHead(cx, cy, r, petalColor, rand) {
  const petals = 6;
  let out = "";
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2 + rand() * 0.3;
    const px = cx + Math.cos(angle) * r * 0.55;
    const py = cy + Math.sin(angle) * r * 0.55;
    out += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r * 0.5).toFixed(1)}" ry="${(r * 0.32).toFixed(1)}" fill="${petalColor}" opacity="0.88" transform="rotate(${(angle * 180) / Math.PI} ${px.toFixed(1)} ${py.toFixed(1)})" />`;
  }
  out += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.28).toFixed(1)}" fill="#f2e2b8" opacity="0.9" />`;
  return out;
}

function generateScene(seed, { width = 900, height = 1100 } = {}) {
  const palette = PALETTES[seed % PALETTES.length];
  const rand = seededRandom(seed + 1);
  let flowers = "";
  const clusterCount = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < clusterCount; i++) {
    const cx = width * (0.25 + rand() * 0.5);
    const cy = height * (0.32 + rand() * 0.32);
    const r = width * (0.09 + rand() * 0.07);
    const color = i % 2 === 0 ? palette.petal : palette.petal2;
    flowers += flowerHead(cx, cy, r, color, rand);
  }
  let stems = "";
  for (let i = 0; i < clusterCount + 2; i++) {
    const x = width * (0.3 + rand() * 0.4);
    const yStart = height * 0.55;
    const yEnd = height * (0.85 + rand() * 0.1);
    const sway = (rand() - 0.5) * 40;
    stems += `<path d="M ${x.toFixed(1)} ${yStart.toFixed(1)} Q ${(x + sway).toFixed(1)} ${((yStart + yEnd) / 2).toFixed(1)} ${x.toFixed(1)} ${yEnd.toFixed(1)}" stroke="${palette.leaf}" stroke-width="3" fill="none" opacity="0.55" />`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg${seed}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${palette.bg}" />
      <stop offset="100%" stop-color="#eee7da" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg${seed})" />
  ${stems}
  ${flowers}
</svg>`;
}

function generateHero(seed, { width = 1600, height = 1000 } = {}) {
  const palette = PALETTES[seed % PALETTES.length];
  const rand = seededRandom(seed + 99);
  let flowers = "";
  for (let i = 0; i < 9; i++) {
    const cx = width * (0.55 + rand() * 0.42);
    const cy = height * (0.15 + rand() * 0.75);
    const r = width * (0.035 + rand() * 0.035);
    const color = i % 2 === 0 ? palette.petal : palette.petal2;
    flowers += flowerHead(cx, cy, r, color, rand);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="hero${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#faf7f1" />
      <stop offset="100%" stop-color="${palette.bg}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#hero${seed})" />
  ${flowers}
</svg>`;
}

// Products: two images each (main + alternate angle/seed)
for (let i = 1; i <= 24; i++) {
  writeFileSync(path.join(PRODUCTS_DIR, `product-${String(i).padStart(2, "0")}-a.svg`), generateScene(i * 7));
  writeFileSync(path.join(PRODUCTS_DIR, `product-${String(i).padStart(2, "0")}-b.svg`), generateScene(i * 7 + 3));
}

// Categories
for (let i = 1; i <= 10; i++) {
  writeFileSync(path.join(CATEGORIES_DIR, `category-${String(i).padStart(2, "0")}.svg`), generateScene(i * 13, { width: 700, height: 500 }));
}

writeFileSync(path.join(HERO_DIR, "hero.svg"), generateHero(5));

console.log("Placeholder artwork generated.");
