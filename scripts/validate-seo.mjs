/**
 * Static SEO checks against the built site in dist/. Runs in CI right after `astro build`
 * and fails the deploy on any error; warnings are printed but do not fail.
 *
 *   npm run build && npm run check:seo
 *
 * Reads SITE_URL / BASE_PATH like astro.config.mjs. On the production domain the pages must be
 * indexable and ship a CNAME; on a preview URL (GitHub Pages project path) they must be noindex
 * and must not ship a CNAME.
 */
import { access, readFile, readdir } from 'node:fs/promises';

const PRODUCTION_ORIGIN = 'https://kobya.av.tr';
const PRODUCTION_HOST = new URL(PRODUCTION_ORIGIN).host;
// Same normalisation as astro.config.mjs: the real domain is always https, whatever GitHub reports
// while "Enforce HTTPS" is still off.
const requested = new URL(process.env.SITE_URL || PRODUCTION_ORIGIN);
if (requested.host === PRODUCTION_HOST) requested.protocol = 'https:';
const ORIGIN = requested.origin;
const BASE = (process.env.BASE_PATH || '').replace(/[/]+$/, '');
const SITE = `${ORIGIN}${BASE}`;
const PRODUCTION = requested.host === PRODUCTION_HOST && BASE === '';

const dist = new URL('../dist/', import.meta.url);

/*
 * Every built page, discovered from dist/, so each new question page is checked without anyone
 * remembering to add it here. The home pages are held to the stricter rules: they are the only
 * ones that must carry the full hreflang set and a title within the recommended length.
 */
const pages = (await readdir(dist, { recursive: true }))
  .map((entry) => entry.split('\\').join('/'))
  .filter((entry) => entry.endsWith('index.html'))
  .map((file) => {
    const path = file.slice(0, -'index.html'.length);
    return { file, url: `${SITE}/${path}`, lang: path.startsWith('en/') ? 'en' : 'tr', home: path === '' || path === 'en/' };
  })
  .sort((a, b) => a.url.localeCompare(b.url));

const errors = [];
const warnings = [];

const homePages = pages.filter((page) => page.home);
if (homePages.length !== 2) errors.push(`expected two home pages, found ${homePages.length}`);

/** Maps a URL path on the site ("/kobya.av.tr/og.jpg") to a path inside dist/ ("og.jpg"). */
const toDistPath = (path) => (BASE && path.startsWith(`${BASE}/`) ? path.slice(BASE.length) : path).replace(/^\//, '');
const read = (path) => readFile(new URL(toDistPath(path), dist), 'utf8');
const exists = (path) =>
  access(new URL(toDistPath(path), dist)).then(
    () => true,
    () => false,
  );

const decode = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** Parses the attributes of a single start tag into a lower-cased map. */
const parseAttributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([^\s=<>/"']+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
      .slice(1)
      .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? '')]),
  );

const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => parseAttributes(m[0]));
const meta = (html, key, value) => tags(html, 'meta').find((attributes) => attributes[key] === value)?.content;
const typesOf = (node) => [].concat(node?.['@type'] ?? []);

function collectIdReferences(value, found = []) {
  if (Array.isArray(value)) value.forEach((item) => collectIdReferences(item, found));
  else if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === '@id') found.push(value['@id']);
    else keys.forEach((key) => collectIdReferences(value[key], found));
  }
  return found;
}

console.log(`Checking ${PRODUCTION ? 'production' : 'preview'} build for ${SITE}/\n`);

for (const page of pages) {
  const html = await read(page.file);
  const error = (message) => errors.push(`${page.file}: ${message}`);
  const warn = (message) => warnings.push(`${page.file}: ${message}`);

  const htmlLang = tags(html, 'html')[0]?.lang;
  if (htmlLang !== page.lang) error(`<html lang> is "${htmlLang}", expected "${page.lang}"`);

  // A question page's title is the question itself, so it is only held to the upper bound.
  const [minTitle, maxTitle] = page.home ? [30, 65] : [20, 80];
  const [minDescription, maxDescription] = page.home ? [70, 160] : [50, 160];

  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]));
  if (titles.length !== 1) error(`expected one <title>, found ${titles.length}`);
  else if (titles[0].length < minTitle || titles[0].length > maxTitle)
    warn(`title is ${titles[0].length} chars (aim for ${minTitle}–${maxTitle})`);

  const description = meta(html, 'name', 'description');
  if (!description) error('missing meta description');
  else if (description.length < minDescription || description.length > maxDescription)
    warn(`meta description is ${description.length} chars (aim for ${minDescription}–${maxDescription})`);

  const robots = meta(html, 'name', 'robots') ?? '';
  if (PRODUCTION && /noindex|nofollow/.test(robots)) error(`robots meta blocks indexing: "${robots}"`);
  if (!PRODUCTION && !/noindex/.test(robots)) error(`preview builds must be noindex, robots meta is "${robots}"`);

  const links = tags(html, 'link');
  const canonical = links.find((link) => link.rel === 'canonical')?.href;
  if (canonical !== page.url) error(`canonical is "${canonical}", expected "${page.url}"`);

  const alternates = Object.fromEntries(
    links.filter((link) => link.rel === 'alternate' && link.hreflang).map((link) => [link.hreflang, link.href]),
  );
  if (page.home) {
    for (const other of homePages) {
      if (alternates[other.lang] !== other.url) error(`hreflang="${other.lang}" should point to ${other.url}`);
    }
    if (alternates['x-default'] !== `${SITE}/`) error('x-default hreflang should point to the Turkish home page');
  } else {
    /*
     * A question exists in Turkish and, only if it has been translated, in English. Each page
     * therefore declares itself plus whichever other language it really has, and nothing else.
     */
    if (alternates[page.lang] !== page.url) error(`missing self-referencing hreflang="${page.lang}"`);
    for (const [code, href] of Object.entries(alternates)) {
      if (!href.startsWith(`${SITE}/`)) error(`hreflang="${code}" leaves the site: ${href}`);
      else if (!(await exists(new URL(href).pathname))) error(`hreflang="${code}" points to a page that was not built: ${href}`);
    }
  }

  for (const link of links) {
    if (!link.href?.startsWith('/') || link.href.startsWith('//')) continue;
    if (BASE && !link.href.startsWith(`${BASE}/`)) error(`<link> ignores the base path: ${link.href}`);
    else if (!(await exists(link.href))) error(`<link> points to a missing file: ${link.href}`);
  }

  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/g)) {
    if (BASE && !href.startsWith(`${BASE}/`)) error(`link ignores the base path: ${href}`);
  }

  const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  if (headings.filter((level) => level === 1).length !== 1) error('page must have exactly one <h1>');
  if (headings[0] !== 1) error('first heading must be the <h1>');
  headings.forEach((level, index) => {
    if (index > 0 && level > headings[index - 1] + 1) error(`heading level jumps from h${headings[index - 1]} to h${level}`);
  });

  for (const property of ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'og:locale']) {
    if (!meta(html, 'property', property)) error(`missing ${property}`);
  }
  if (meta(html, 'property', 'og:url') !== page.url) error('og:url must equal the canonical URL');
  const ogImage = meta(html, 'property', 'og:image');
  if (ogImage && (!ogImage.startsWith(`${SITE}/`) || !(await exists(new URL(ogImage).pathname)))) {
    error(`og:image must be an absolute URL to an existing file: ${ogImage}`);
  }
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!meta(html, 'name', name)) error(`missing ${name}`);
  }

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (jsonLd.length !== 1) error(`expected one JSON-LD block, found ${jsonLd.length}`);
  for (const [, raw] of jsonLd) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseError) {
      error(`JSON-LD does not parse: ${parseError.message}`);
      continue;
    }
    const graph = data['@graph'] ?? [data];
    const types = graph.flatMap(typesOf);
    for (const type of ['WebSite', 'LegalService', 'Person']) {
      if (!types.includes(type)) error(`JSON-LD is missing a ${type} node`);
    }
    // The page node is a WebPage or one of its subtypes (QAPage on a question, CollectionPage on the list).
    if (!types.some((type) => /^(WebPage|CollectionPage|QAPage|FAQPage|ItemPage|AboutPage|ContactPage)$/.test(type))) {
      error('JSON-LD is missing a WebPage node');
    }
    const office = graph.find((node) => typesOf(node).includes('LegalService'));
    for (const key of ['name', 'url', 'image', 'telephone', 'email', 'address', 'geo', 'openingHoursSpecification', 'founder']) {
      if (!office?.[key]) error(`LegalService is missing "${key}"`);
    }
    const ids = new Set(graph.map((node) => node['@id']).filter(Boolean));
    for (const reference of collectIdReferences(graph.map(({ ['@id']: _id, ...rest }) => rest))) {
      if (!ids.has(reference)) error(`JSON-LD references unknown @id ${reference}`);
    }
  }

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(decodeURIComponent(anchor))) error(`in-page link #${anchor} has no target`);
  }

  for (const image of tags(html, 'img')) {
    if (!('alt' in image)) error(`<img src="${image.src}"> has no alt attribute`);
  }
}

// 404 must not be indexed.
const notFound = await read('404.html');
if (!/noindex/.test(meta(notFound, 'name', 'robots') ?? '')) errors.push('404.html: must carry <meta name="robots" content="noindex">');

// Crawl files.
const robotsTxt = await read('robots.txt');
if (!robotsTxt.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) errors.push('robots.txt: missing or wrong Sitemap line');
if (/^Disallow:\s*\/\s*$/m.test(robotsTxt)) errors.push('robots.txt: disallows the whole site');

const sitemapIndex = await read('sitemap-index.xml');
const sitemapFiles = [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const sitemap = (await Promise.all(sitemapFiles.map(read))).join('\n');
for (const page of pages) {
  if (!sitemap.includes(`<loc>${page.url}</loc>`)) errors.push(`sitemap: missing ${page.url}`);
}
if (!sitemap.includes('hreflang=')) errors.push('sitemap: missing hreflang alternates');
if (!sitemap.includes('<lastmod>')) warnings.push('sitemap: no <lastmod>');
if (sitemap.includes('404')) errors.push('sitemap: must not list the 404 page');

const hasCname = await exists('CNAME');
if (PRODUCTION && (!hasCname || (await read('CNAME')).trim() !== new URL(PRODUCTION_ORIGIN).host)) {
  errors.push('CNAME: production build must contain the apex domain');
}
if (!PRODUCTION && hasCname) errors.push('CNAME: preview builds must not ship a CNAME file');

if (!(await read('llms.txt')).startsWith('# ')) errors.push('llms.txt: missing or empty');

const manifest = JSON.parse(await read('site.webmanifest'));
for (const icon of manifest.icons ?? []) {
  if (icon.src.startsWith('/')) errors.push(`site.webmanifest: icon ${icon.src} must be relative so it works under a base path`);
  else if (!(await exists(icon.src))) errors.push(`site.webmanifest: icon ${icon.src} is missing`);
}
for (const file of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png']) {
  if (!(await exists(file))) errors.push(`missing /${file}`);
}

for (const message of warnings) console.warn(`warn   ${message}`);
for (const message of errors) console.error(`error  ${message}`);
console.log(`\nSEO check: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
