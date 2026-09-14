# CLAUDE.md

Working notes for this repository: what the site is, the rules it must follow, how it is built, and
why things are the way they are. Keep this file current when you change behaviour, add a decision,
or finish an open item.

## Project

- **What:** a single-page, bilingual website for **Kobya Hukuk Bürosu / Kobya Law Office**, the law
  office of **Av. Vedat Murathan Kobya** in Gölbaşı, Ankara (founded 2023, admitted 2022, Ankara Bar).
- **Who:** maintained by Ozan Hanedan (the attorney's cousin) in `github.com/ohanedan/kobya.av.tr`.
- **Where:** `https://kobya.av.tr` via GitHub Pages; DNS managed by Ozan on Cloudflare. The apex
  domain is canonical, `www` redirects to it. Until the domain's DNS is live, the site is served as
  a `noindex` preview at `https://ohanedan.github.io/kobya.av.tr/` (see "Deployment").
- **Languages:** Turkish is the default at `/`, English lives at `/en/`.

## Hard rules

These come from the client or from law. Do not change them without an explicit request.

1. **Lawyer advertising ban.** Turkish Attorneys' Act art. 55 and the TBB advertising-ban regulation
   allow informational content only. Never add "best"/"expert"/"leading" claims, success rates,
   case wins, client names, testimonials or reviews, prices, or "free consultation" offers.
2. **No cookies, no tracking, no third-party requests on page load.** No analytics. Fonts are
   self-hosted. Google Maps loads only after the visitor clicks "Show map". The footer tells
   visitors this, so the claim must stay true.
3. **No contact form.** Contact is phone, WhatsApp and e-mail links only.
4. **No attorney photo or office photos.** The monogram emblem is the visual identity.
5. **The attorney works in Turkish only** and does not target foreign clients. The English page says
   meetings are conducted in Turkish; never imply otherwise.
6. **English copy uses no gendered pronouns** for the attorney. Use the name or "Kobya".
7. **English for all code, comments and documentation.** Conversation with the maintainer happens in
   Turkish, but the repo is English. Only the page copy in `src/i18n/content.ts` is bilingual.
8. **Single page.** Do not split into sub-pages unless asked (see "Open items").

## Stack

| Piece        | Choice                                  | Notes                                                                                                                     |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Runtime      | Node 24 LTS (`.nvmrc`)                  | Astro 7 needs Node ≥ 22.12.                                                                                               |
| Framework    | Astro 7, fully static output            | Astro 5 was rejected because of critical advisories, including RCE in AVIF image optimisation. `npm audit` must stay clean. |
| Motion       | GSAP 3 + ScrollTrigger, Lenis           | Smooth scrolling and scroll-driven animation. Everything lives in `src/scripts/main.ts`.                                  |
| Fonts        | Astro Fonts API, `local` provider       | Reads Cormorant Garamond and Manrope files from the Fontsource packages in `node_modules`, with no network at build time. |
| Sitemap      | `@astrojs/sitemap`                      | Adds hreflang alternates and `lastmod`.                                                                                   |
| Tooling      | `playwright-core` (dev)                 | Used by the image generator and the smoke test. It drives an installed Edge or Chrome and downloads no browsers.           |

## Commands

```sh
npm install
npm run dev          # http://localhost:4321
npm run build        # static site in dist/
npm run check:seo    # static SEO validation of dist/ (also runs in CI)
npm run preview      # serves dist/; Astro 7 keeps it running in the background
npm run test:smoke   # browser smoke test against the preview server
npx astro preview stop
npm run images       # regenerate og.jpg, og-en.jpg, favicon.ico and app icons into public/
```

Scripts that drive a browser use Edge on Windows and Chrome elsewhere. Override with `PW_CHANNEL` or
`PW_EXECUTABLE_PATH`.

## Structure

```
astro.config.mjs          site/base from SITE_URL + BASE_PATH, i18n routing, Fonts API, sitemap, CNAME writer
src/
  data/firm.ts            NAP, geo, hours, bar, education: facts shared by both languages
  data/seo.ts             optional search-engine verification meta tokens
  i18n/content.ts         all copy (TR + EN), section ids per language, practice areas
  layouts/Base.astro      <head>: meta, canonical/hreflang, OG/Twitter, geo, JSON-LD @graph, fonts
  components/
    Site.astro            page composition, used by pages/index.astro and pages/en/index.astro
    Preloader, Header (+ mobile menu), LangSwitch, Hero, Office, Practice,
    Attorney (emblem), Approach (horizontal pin), Contact (channels + map facade), Footer
    Monogram, Lines (masked line reveals), SectionLabel
  pages/
    index.astro, en/index.astro, 404.astro (noindex)
    llms.txt.ts           generates /llms.txt from firm.ts and content.ts
    robots.txt.ts         generates /robots.txt with a base-aware sitemap URL
  scripts/main.ts         all client-side behaviour
  styles/global.css       design tokens and all styles (no scoped component styles)
  lib/text.ts             *emphasis* markers, word splitting, padding, roman numerals
  lib/paths.ts            withBase() for every internal URL; isProductionSite()
public/                   site.webmanifest (relative icon paths), favicons, icons, og images
scripts/
  generate-images.mjs     renders OG images and icons with the real fonts
  validate-seo.mjs        CI gate for SEO invariants
  smoke-test.mjs          interaction checks (nav, accordion, language switch, map, mobile menu, no-JS)
.github/workflows/deploy.yml   build → check:seo → deploy to GitHub Pages
```

## Editing content

- **Facts** such as phone, address, hours and bar go in `src/data/firm.ts`. Keep them identical to the
  Google Business Profile and other listings, because consistent NAP (name, address, phone) matters
  for local SEO.
- **Copy** goes in `src/i18n/content.ts`. `*word*` renders a brass italic accent. `tr` and `en` share
  one type, so a missing translation is a type error.
- **Section ids differ per language** (`#calisma-alanlari` and `#practice`). The language switch maps
  the current section through `ids`, so rename ids in both languages together.
- **Title and description limits:** titles should be 30–65 characters and descriptions 70–160.
  `check:seo` warns outside those ranges.
- **After changing brand text** used in the OG images, run `npm run images`.

## Design system

- **Palette** (tokens in `global.css`): ink navy `#0b1628`, bone `#f3eee6`, brass `#b8925a`, brass
  light `#d6bb8c` for use on dark, brass deep `#7a5c30` for text on light (AA contrast). Sections
  alternate dark and light: hero dark → office light → practice dark → attorney light → approach
  bone-2 → contact dark → footer dark.
- **Type:** Cormorant Garamond for display, with only the **300, 400 and 300-italic** cuts (six files
  across the latin and latin-ext subsets). Every extra cut is another request on first load, so do not
  add weights casually. Manrope Variable is the UI and body font. Serif display numerals use
  `font-variant-numeric: lining-nums`, because old-style "01" reads as "OI".
- **Signature elements:** the "K" monogram, drawn with `pathLength=1` so its strokes can animate; the
  rotating seal ring on the attorney emblem; outline numerals; the brass fill sweep on hover; and the
  footer "KOBYA" wordmark that fills on scroll.

## Motion architecture and gotchas

- **Root classes:**
  - `no-js` becomes `js` through an inline head script.
  - `motion` is set unless the visitor prefers reduced motion.
  - `intro-seen` comes from sessionStorage, so the preloader plays once per session.
  - `ready` is set when `main.ts` starts.
  - `menu-open` is set while the mobile menu is open.
- **Pre-reveal states** are CSS under `.motion`. If JavaScript never runs,
  `.motion:not(.ready)` failsafe animations reveal everything after about 3 s. With reduced motion
  there is no Lenis, no preloader and everything is static.
- **GSAP parses an existing CSS `transform` into pixel `x`/`y` values.** If CSS pre-sets
  `translateY(110%)` and you tween only `yPercent`, the pixel offset survives and the element never
  arrives. Pass `y: 0` explicitly, as in `heroIntro()`. This bug once hid the hero headline.
- **Performance rules:**
  - Hero copy (`data-hero-rise`) slides in but is never transparent, so it paints on first render
    and serves as the LCP element. Only the CTA uses `data-hero-fade`.
  - The preloader timeline is kept to about 2 s.
  - Statement words (`data-words`) dim only once the paragraph enters the viewport, so the page as
    loaded passes contrast audits. Scrolling behaviour is unchanged.
- **Layout-dependent effects:**
  - The Approach section pins and scrolls horizontally only at ≥ 900 px.
  - A ResizeObserver on `<main>` debounces `ScrollTrigger.refresh()`, which covers accordion height
    changes and font swaps.
- **Navigation:** in-page anchors go through `scrollToTarget()` (Lenis-aware) and move focus to the
  target. The header hides while scrolling down.
- **Map facade:** clicking injects the Google Maps iframe. Nothing Google-related loads before that.

## SEO: what is implemented

**On the page** (`Base.astro`):

- A unique title and description per language, with local keywords (Gölbaşı, Ankara, avukat/lawyer).
- A self-referencing canonical, and `hreflang` for tr, en and x-default pointing to `/`.
- `robots` set to `index, follow, max-image-preview:large, max-snippet:-1`.
- Open Graph and Twitter cards with a per-language 1200×630 JPEG (`og.jpg`, `og-en.jpg`) plus alt
  text.
- `geo.*` and `ICBM` meta tags for Gölbaşı.
- Optional verification meta tags from `src/data/seo.ts`.

**Structured data** is one JSON-LD `@graph`. Entity `@id`s are anchored on the Turkish URL so both
languages describe the same entities:

- `WebSite`
- `WebPage`
- `LegalService`: address with postal code 06830, `geo`, `hasMap`, `openingHoursSpecification`,
  `areaServed`, an `OfferCatalog` of the six practice areas, `contactPoint`, and founder/employee
  pointing to the person.
- `Person`: `honorificPrefix` "Av.", `alumniOf` Atılım University, `memberOf` Ankara Bar, `sameAs`
  LinkedIn.

**Semantics:**

- Exactly one `<h1>` (the hero headline, with the brand in a visually hidden prefix).
- Every section has an `<h2>`; the office section uses `SectionLabel heading`.
- No skipped heading levels.
- NAP is visible in the contact section and the footer.

**Crawl files:**

- `sitemap-index.xml` with hreflang and `lastmod`.
- `robots.txt` pointing to the sitemap.
- `/llms.txt`, generated from data, for AI assistants.
- `site.webmanifest`, `favicon.ico` (16/32/48), `favicon.svg`, the Apple touch icon, and 192, 512
  and maskable icons.
- 404 is `noindex` and excluded from the sitemap.

**Performance:**

- Static HTML with inlined CSS, so there are no render-blocking requests.
- The LCP serif cut is preloaded.
- Metric-matched fallback faces (`size-adjust`, ascent/descent overrides) keep CLS at about 0.
- About 52 KB of gzipped JavaScript, loaded as a deferred module.

**CI gate:** `scripts/validate-seo.mjs` fails the deploy on errors. It checks:

- Title and description.
- Canonical and hreflang reciprocity.
- One h1 and heading order.
- OG and Twitter tags, and that the image files exist.
- JSON-LD parses, has the required nodes, and every `@id` reference resolves.
- Anchors resolve.
- `robots.txt` and the sitemap.
- The manifest icons and favicons exist.

**Lighthouse baseline** (local preview, Lighthouse with Edge, 2026-09-14):

| Run                  | Performance | Accessibility | Best practices | SEO | Metrics                                                  |
| -------------------- | ----------- | ------------- | -------------- | --- | -------------------------------------------------------- |
| Mobile, `/`          | 89          | 100           | 100            | 100 | FCP 2.3 s · LCP 2.8 s · TBT ~170 ms · CLS 0.001 (simulated) |
| Desktop, `/en/`      | 99          | 100           | 100            | 100 | FCP 0.5 s · LCP 0.5 s · TBT 0 ms · CLS 0.001             |

- The mobile numbers come from Lighthouse's slow-4G, 4× CPU *simulation*. Observed FCP and LCP are
  about 0.23 s.
- The LCP element is the hero lead paragraph. The simulated gap comes from the six font files and
  the 52 KB script requested before first paint.
- The remaining TBT is one long task that initialises GSAP and ScrollTrigger in `main.ts`.
- If performance regresses, check these first: new font cuts, anything in the hero that starts at
  `opacity: 0`, and a longer preloader.

### Off-site SEO (manual, not code)

Local search ("Gölbaşı avukat", "Ankara avukat") is driven mostly by these:

1. **Google Search Console:** add a *domain* property, verify with a DNS TXT record in Cloudflare,
   then submit `https://kobya.av.tr/sitemap-index.xml`.
2. **Google Business Profile:** this has the biggest local impact. Use primary category "Avukat" or
   "Hukuk bürosu", NAP exactly as in `firm.ts`, website `https://kobya.av.tr`, and hours with a note
   that meetings are by appointment. Do not add review solicitations or testimonials to the site
   (advertising ban).
3. **Bing Webmaster Tools** (it can import from Search Console) and **Yandex Webmaster**, since Yandex
   has a meaningful share in Türkiye. Also consider **Yandex Business** and **Apple Business Connect**.
4. Put the website URL on the attorney's LinkedIn profile and on any bar or directory listing, with
   the same NAP.

## Deployment

- Every push to `main` runs `.github/workflows/deploy.yml`: `actions/configure-pages` →
  `npm ci` → `npm run build` → `npm run check:seo` → upload the Pages artifact → deploy.
- **The build follows wherever Pages serves the repo.** `configure-pages` reports the origin and base
  path, and the workflow passes them to Astro as `SITE_URL` and `BASE_PATH`. Local builds without
  these variables target the production domain.
  - **No custom domain set yet**, which is the current state: the site builds for
    `https://ohanedan.github.io` + `/kobya.av.tr`. Pages get `noindex, nofollow`, no `CNAME` is
    written, and canonical, hreflang, OG and sitemap URLs point at the preview URL.
  - **Custom domain set** in Settings → Pages: the site builds for `https://kobya.av.tr` + `/`. Pages
    become indexable, `dist/CNAME` is written by the `kobya:cname` integration, and GitHub redirects
    the old github.io URL to the domain.
  - `check:seo` enforces both modes: indexable with a CNAME in production, `noindex` without a CNAME
    in preview.
- **Code rule:** never hard-code root-relative URLs (`"/en/"`, `"/favicon.svg"`). Use `withBase()`
  from `src/lib/paths.ts`, and keep manifest icon paths relative. `check:seo` flags links that ignore
  the base path.
- **Try the preview build locally** in PowerShell. Git Bash rewrites `/kobya.av.tr` into a Windows
  path.
  ```powershell
  $env:SITE_URL='https://ohanedan.github.io'; $env:BASE_PATH='/kobya.av.tr'
  npm run build; npm run check:seo; npm run preview
  $env:SMOKE_URL='http://127.0.0.1:4321/kobya.av.tr'; npm run test:smoke
  ```
- **GitHub, one-time setup:**
  - Settings → Pages → Source: *GitHub Actions*. The repo must be public on a free plan.
  - When the domain's DNS works, set Custom domain `kobya.av.tr` and re-run the workflow. Do not set
    it earlier, or the github.io preview will redirect to a domain that does not resolve.
  - Enable *Enforce HTTPS* once the certificate exists.
  - Verify the domain under account Settings → Pages → Verified domains.
- **Cloudflare DNS** (DNS only, grey cloud):
  - Four `A` records for `@`: `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`.
  - Four `AAAA` records for `@`: `2606:50c0:8000::153` through `2606:50c0:8003::153`.
  - `CNAME www → ohanedan.github.io`.
- **Caching:** GitHub Pages sets a roughly 10-minute cache and custom headers are not possible. This
  is acceptable for this site.

## Verification workflow

Before calling a change done:

1. Run `npm run build && npm run check:seo`.
2. Run `npm run preview`, then `npm run test:smoke`.
3. For visual changes, capture screenshots at 1440 px and 390 px and look at them. Also check with
   reduced motion, where everything is static.
4. For performance or SEO changes, run Lighthouse against the preview:
   `CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" npx lighthouse http://127.0.0.1:4321/`
   (mobile), then again with `--preset=desktop`.
5. Stop the preview server with `npx astro preview stop`.

## Decision log

- **2026-09-14:**
  - Stack: Astro 7 and Node 24 instead of Astro 5, which had critical advisories.
  - Copy, facts and practice areas come from the attorney's questionnaire. The answers file was
    deleted at the maintainer's request.
  - Six practice areas: Corporate & Regulatory, Contract, Enforcement & Bankruptcy, Civil, Criminal,
    and Intellectual Property.
  - "Atılım Üni" was expanded to "Atılım Üniversitesi Hukuk Fakültesi" and the role written as
    "Kurucu Avukat". The English note "meetings are conducted in Turkish" was added. The attorney
    should confirm all three.
  - No photo, so a monogram emblem with a rotating seal ring was designed instead.
  - Google Maps sits behind a click-to-load facade so the site stays cookie-free.
  - Office geo coordinates (39.8243636, 32.7204337) were taken from Google Maps for the address.
- **2026-09-14, SEO pass:**
  - Moved fonts to the Astro Fonts API, with preload and metric fallbacks.
  - Trimmed fonts to three serif cuts.
  - Shortened the preloader.
  - Hero copy no longer fades from transparent.
  - Added keyword titles and descriptions, the JSON-LD graph, geo meta, per-language OG images,
    favicon.ico, manifest and icons, `llms.txt`, and sitemap `lastmod`.
  - Added footer NAP, the office section h2, `trailingSlash: 'always'`, the CI SEO gate and the
    smoke test.
- **2026-09-14, preview deployment:**
  - The registrar had not yet delegated `kobya.av.tr` to Cloudflare, but the maintainer wanted to
    show the site to the attorney.
  - The build became base-path aware (`SITE_URL`/`BASE_PATH` from `actions/configure-pages`), so it
    runs at `ohanedan.github.io/kobya.av.tr/` as `noindex`.
  - It switches to the domain automatically once the custom domain is set in the Pages settings.
  - `CNAME` and `robots.txt` moved from `public/` to build-time generation.

## Open items and ideas

- **Practice-area sub-pages** (e.g. `/icra-iflas-hukuku/`) would be the next big organic-search
  lever, but they contradict the single-page brief. Ask before doing this.
- **An FAQ section** would help long-tail and AI-answer visibility, but it needs real answers from the
  attorney (online meetings? fees policy wording?). Do not invent them.
- **A domain e-mail** (`info@kobya.av.tr`) through Cloudflare Email Routing is optional. If adopted,
  update `firm.ts`, the Google Business Profile and LinkedIn together.
