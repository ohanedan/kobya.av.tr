// @ts-check
import { writeFile } from 'node:fs/promises';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const PRODUCTION_ORIGIN = 'https://kobya.av.tr';

// The deploy workflow sets these from actions/configure-pages: https://ohanedan.github.io + /kobya.av.tr
// until a custom domain is configured in the repository's Pages settings, then https://kobya.av.tr + "".
// Local builds default to the production domain.
const PRODUCTION_HOST = new URL(PRODUCTION_ORIGIN).host;

// actions/configure-pages reports "http://kobya.av.tr" until GitHub's "Enforce HTTPS" is switched on,
// so match on the host and always publish https URLs for the real domain.
const requested = new URL(process.env.SITE_URL || PRODUCTION_ORIGIN);
if (requested.host === PRODUCTION_HOST) requested.protocol = 'https:';
const site = requested.origin;
const base = process.env.BASE_PATH || '/';
const isProduction = requested.host === PRODUCTION_HOST && base === '/';

/** Writes dist/CNAME for the real domain only, so a preview build never claims kobya.av.tr. */
const cname = {
  name: 'kobya:cname',
  hooks: {
    'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => {
      if (isProduction) await writeFile(new URL('CNAME', dir), `${new URL(PRODUCTION_ORIGIN).host}\n`);
    },
  },
};

// Unicode ranges of Fontsource's "latin" and "latin-ext" subsets (Turkish needs both: ğ ş İ live in latin-ext).
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT =
  'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';
const SUBSETS = /** @type {const} */ ([
  ['latin', LATIN],
  ['latin-ext', LATIN_EXT],
]);

/** One @font-face per subset, read from the Fontsource package already in node_modules (no network at build). */
const variants = (/** @type {(subset: string) => string} */ file, /** @type {string} */ weight, /** @type {'normal' | 'italic'} */ style) =>
  SUBSETS.map(([subset, range]) => ({ weight, style, src: [file(subset)], unicodeRange: [range] }));

const cormorant = (/** @type {string} */ weight, /** @type {'normal' | 'italic'} */ style) =>
  variants((subset) => `./node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-${subset}-${weight}-${style}.woff2`, weight, style);

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-serif',
      fallbacks: ['serif'],
      options: {
        // Deliberately only three cuts (six files): every extra weight is another request on first load.
        // Italic accents all use the light cut; bolder serif text uses 400.
        // @ts-expect-error — the tuple type wants a non-empty literal; the spread is non-empty at runtime.
        variants: [...cormorant('300', 'normal'), ...cormorant('400', 'normal'), ...cormorant('300', 'italic')],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Manrope',
      cssVariable: '--font-sans',
      fallbacks: ['sans-serif'],
      options: {
        // @ts-expect-error — see above.
        variants: variants((subset) => `./node_modules/@fontsource-variable/manrope/files/manrope-${subset}-wght-normal.woff2`, '200 800', 'normal'),
      },
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => !page.includes('404'),
      lastmod: new Date(),
      i18n: { defaultLocale: 'tr', locales: { tr: 'tr-TR', en: 'en-US' } },
    }),
    cname,
  ],
  build: { inlineStylesheets: 'always' },
});
