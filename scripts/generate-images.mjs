/**
 * Renders the social-preview images and app icons into public/.
 * Fonts are read from node_modules and embedded as data URIs, so no dev server is needed.
 *
 *   npm run images
 *
 * Needs a Chromium-based browser: Edge on Windows by default, Chrome elsewhere.
 * Override with PW_CHANNEL (e.g. "chrome", "msedge") or PW_EXECUTABLE_PATH.
 */
import { chromium } from 'playwright-core';
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const publicFile = (name) => new URL(`public/${name}`, root);

const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT =
  'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';

const serif = '@fontsource/cormorant-garamond/files/cormorant-garamond';
const sans = '@fontsource-variable/manrope/files/manrope';

async function fontFaces() {
  const faces = [
    ['Serif', '300', 'normal', `${serif}-latin-300-normal.woff2`, LATIN],
    ['Serif', '300', 'normal', `${serif}-latin-ext-300-normal.woff2`, LATIN_EXT],
    ['Serif', '300', 'italic', `${serif}-latin-300-italic.woff2`, LATIN],
    ['Serif', '300', 'italic', `${serif}-latin-ext-300-italic.woff2`, LATIN_EXT],
    ['Sans', '200 800', 'normal', `${sans}-latin-wght-normal.woff2`, LATIN],
    ['Sans', '200 800', 'normal', `${sans}-latin-ext-wght-normal.woff2`, LATIN_EXT],
  ];
  const css = await Promise.all(
    faces.map(async ([family, weight, style, file, range]) => {
      const data = (await readFile(new URL(`node_modules/${file}`, root))).toString('base64');
      return `@font-face{font-family:${family};font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${data}) format('woff2');unicode-range:${range}}`;
    }),
  );
  return css.join('\n');
}

const monogram = (stroke) => `
<svg viewBox="0 0 64 64" fill="none" stroke="#d6bb8c" stroke-width="${stroke}" stroke-linecap="square">
  <circle cx="32" cy="32" r="30.5"/>
  <circle cx="32" cy="32" r="27.25" stroke-opacity=".4" stroke-width="${stroke / 2}"/>
  <path d="M24 17v30M24 35 42 17M30.5 28.5 43 47M19.5 17h9M19.5 47h9M38 17h8M38.5 47h8"/>
</svg>`;

const copy = {
  tr: {
    eyebrow: 'Avukatlık ve Hukuki Danışmanlık',
    title: 'Kobya<br><em>Hukuk Bürosu</em>',
    person: 'Av. Vedat Murathan Kobya',
  },
  en: {
    eyebrow: 'Attorneys &amp; Legal Counsel',
    title: 'Kobya<br><em>Law Office</em>',
    person: 'Attorney Vedat Murathan Kobya',
  },
};

const ogHtml = (faces, lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${faces}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;position:relative;color:#f3eee6;font-family:Sans,sans-serif;background:
  radial-gradient(60% 90% at 78% 30%, rgba(62,104,170,.28), transparent 70%),
  radial-gradient(40% 60% at 80% 35%, rgba(214,187,140,.10), transparent 70%), #0b1628}
.grid{position:absolute;inset:0 64px;display:grid;grid-template-columns:repeat(4,1fr)}
.grid span{border-left:1px solid rgba(243,238,230,.08)}
.grid span:last-child{border-right:1px solid rgba(243,238,230,.08)}
.watermark{position:absolute;right:-150px;top:-40px;width:720px;opacity:.09}
.watermark svg{width:100%;height:auto}
.content{position:absolute;inset:84px 96px 76px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px}
.brand svg{width:64px;height:64px}
.eyebrow{font-size:15px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:rgba(243,238,230,.62)}
h1{margin-top:auto;font-family:Serif,serif;font-weight:300;font-size:118px;line-height:.92;letter-spacing:-.02em}
h1 em{color:#d6bb8c}
.meta{margin-top:34px;padding-top:26px;display:flex;justify-content:space-between;border-top:1px solid rgba(243,238,230,.14);
  font-size:17px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(243,238,230,.7)}
.meta b{color:#d6bb8c;font-weight:600}
</style></head><body>
<div class="grid"><span></span><span></span><span></span><span></span></div>
<div class="watermark">${monogram(0.4)}</div>
<div class="content">
  <div class="brand">${monogram(1.4)}<span class="eyebrow">${copy[lang].eyebrow}</span></div>
  <h1>${copy[lang].title}</h1>
  <div class="meta"><span>${copy[lang].person}</span><span>Ankara · <b>kobya.av.tr</b></span></div>
</div>
</body></html>`;

const iconHtml = (size, markRatio) => `<!doctype html><html><head><style>
*{margin:0}
body{width:${size}px;height:${size}px;display:grid;place-items:center;background:radial-gradient(80% 80% at 70% 20%, #1a2d4d, #0b1628 70%)}
svg{width:${Math.round(size * markRatio)}px;height:${Math.round(size * markRatio)}px}
</style></head><body>${monogram(size < 100 ? 2.6 : 2.2)}</body></html>`;

/** Packs PNG images into a single .ico container (PNG-compressed entries are valid since Windows Vista). */
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}

const browser = await chromium.launch({
  channel: process.env.PW_EXECUTABLE_PATH ? undefined : (process.env.PW_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : 'chrome')),
  executablePath: process.env.PW_EXECUTABLE_PATH,
});

async function render(html, width, height, options = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buffer = await page.screenshot(options);
  await page.close();
  return buffer;
}

async function save(name, buffer) {
  await writeFile(publicFile(name), buffer);
  console.log(`wrote public/${name} (${Math.round(buffer.length / 1024)} KB)`);
}

try {
  const faces = await fontFaces();
  await save('og.jpg', await render(ogHtml(faces, 'tr'), 1200, 630, { type: 'jpeg', quality: 90 }));
  await save('og-en.jpg', await render(ogHtml(faces, 'en'), 1200, 630, { type: 'jpeg', quality: 90 }));

  await save('apple-touch-icon.png', await render(iconHtml(180, 0.72), 180, 180));
  await save('icon-192.png', await render(iconHtml(192, 0.72), 192, 192));
  await save('icon-512.png', await render(iconHtml(512, 0.72), 512, 512));
  // Maskable icons get cropped to a circle; keep the mark inside the 80% safe zone.
  await save('icon-maskable-512.png', await render(iconHtml(512, 0.56), 512, 512));

  const svg = await readFile(publicFile('favicon.svg'), 'utf8');
  const favicon = (size) =>
    `<!doctype html><html><head><style>*{margin:0}svg{width:${size}px;height:${size}px;display:block}</style></head><body>${svg}</body></html>`;
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map(async (size) => ({ size, png: await render(favicon(size), size, size, { omitBackground: true }) })),
  );
  await save('favicon.ico', toIco(pngs));
} finally {
  await browser.close();
}
