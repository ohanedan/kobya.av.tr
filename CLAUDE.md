# CLAUDE.md

Working notes for this repository: what the site is, the rules it must follow, how it is built, and
why things are the way they are. Keep this file current when you change behaviour, add a decision,
or finish an open item.

## Project

- **What:** a single-page, bilingual website for **Kobya Hukuk Bürosu / Kobya Law Office**, the law
  office of **Av. Vedat Murathan Kobya** in Gölbaşı, Ankara, registered with the Ankara Bar. Two
  attorneys and one consultant (see `content.<lang>.team`).
- **Who:** maintained by Ozan Hanedan (the attorney's cousin) in `github.com/ohanedan/kobya.av.tr`.
- **Where:** live at `https://kobya.av.tr` via GitHub Pages since 2026-09-20; DNS on Cloudflare.
  The apex domain is canonical; `www`, plain http and the old github.io path all redirect to it.
- **Languages:** Turkish is the default at `/`, English lives at `/en/`.

## Hard rules

These come from the client or from law. Do not change them without an explicit request.

1. **Lawyer advertising ban.** Turkish Attorneys' Act art. 55 and the TBB advertising-ban regulation
   allow informational content only. Never add "best"/"expert"/"leading" claims, success rates,
   case wins, client names, testimonials or reviews, prices, or "free consultation" offers.
2. **No cookies, no tracking, no third-party requests on page load.** No analytics. Fonts are
   self-hosted. Google Maps loads only after the visitor clicks "Show map". The footer tells
   visitors this, so the claim must stay true.
3. **No contact form.** Contact is phone, WhatsApp and e-mail links only. The attorney asked for one
   on 2026-09-20 and the maintainer declined the same day, so the site collects no visitor data and
   the cookie-free claim in the footer stays simple.
4. **No attorney photo or office photos.** The monogram emblem is the visual identity.
5. **Never state when the office was founded.** No founding year, no "since", no roman-numeral year
   on the emblem, no `foundingDate` in the structured data. Client request, 2026-09-20.
6. **The office works in Turkish**, with English (B2) and German (C1) within the team (Aykut Sait
   Hanedan). Do not promise service in other languages, and do not claim a Turkish-only practice.
7. **English copy uses no gendered pronouns** for any team member. Use the name or the surname.
8. **English for all code, comments and documentation.** Conversation with the maintainer happens in
   Turkish, but the repo is English. Only the page copy in `src/i18n/content.ts` is bilingual.
9. **Single page, with one exception.** The home page stays one page. The agreed exception is the
   question-and-answer area (`/sorular/`, `/en/questions/`), where every question is its own page
   so it can be indexed separately. Do not add further sub-pages unless asked.
10. **Licensing.** The repo is public under the custom, bilingual **Kobya Attribution License 1.0**
   (`LICENSE`). It is source-available rather than OSI open source. The **licensor and copyright
   holder is Av. Vedat Murathan Kobya**, not the maintainer. Attribution notices name the attorney.
   - Parts may be reused, with visible credit and a source notice, in clearly different work.
   - Substantial copies are forbidden without written permission. This covers the whole site, a
     look-alike clone with names or content swapped, and resale as a template or theme.
   - It excludes the brand, the attorney's personal and professional data, and the firm-specific copy.
   - Do not replace it with a standard license, or change its terms, without an explicit request.
   - Keep third-party code and assets under their own licenses.

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
content/questions/        one YAML file per question (+ images/), written by the attorney
src/
  content.config.ts       the questions collection: its schema and the glob loader
  data/firm.ts            NAP, geo, opening hours, bar, education, LinkedIn URLs, footer resources
  data/seo.ts             optional search-engine verification meta tokens
  i18n/content.ts         all copy (TR + EN), section ids per language, practice areas
  layouts/Base.astro      <head>: meta, canonical/hreflang, OG/Twitter, geo, JSON-LD @graph, fonts
  components/
    Site.astro            page composition, used by pages/index.astro and pages/en/index.astro
    Preloader, Header (+ mobile menu), LangSwitch, Hero, Office (principles),
    Practice, Team (emblem + three people), Approach (horizontal pin),
    Contact (channels, hours, map facade), Footer (links + practice statement)
    Monogram, Lines (masked line reveals)
  components/
    QuestionList.astro    the question index (both languages)
    QuestionArticle.astro one question's page (both languages)
  pages/
    index.astro, en/index.astro, 404.astro (noindex)
    sorular/index.astro, sorular/[slug].astro          Turkish questions
    en/questions/index.astro, en/questions/[slug].astro English questions
    llms.txt.ts           generates /llms.txt from firm.ts and content.ts
    robots.txt.ts         generates /robots.txt with a base-aware sitemap URL
  scripts/main.ts         all client-side behaviour
  styles/global.css       design tokens and all styles (no scoped component styles)
  lib/text.ts             *emphasis* markers and zero-padded numbers
  lib/paths.ts            withBase() for every internal URL; isProductionSite()
  lib/nav.ts              navHref(): full, base-aware hrefs, since the header renders on every page
  lib/questions.ts        the question collection flattened per language
  lib/richtext.ts         the small text format the YAML answers are written in
public/                   site.webmanifest (relative icon paths), favicons, icons, og images
scripts/
  generate-images.mjs     renders OG images and icons with the real fonts
  validate-seo.mjs        CI gate for SEO invariants
  smoke-test.mjs          interaction checks (nav, accordion, language switch, map, mobile menu, no-JS)
.github/workflows/deploy.yml   build → check:seo → deploy to GitHub Pages
LICENSE                   Kobya Attribution License 1.0 (English + Turkish; Turkish prevails)
```

## Editing content

- **Facts** such as phone, address, hours and bar go in `src/data/firm.ts`. Keep them identical to the
  Google Business Profile and other listings, because consistent NAP (name, address, phone) matters
  for local SEO.
- **Copy** goes in `src/i18n/content.ts`. `*word*` renders a brass italic accent. `tr` and `en` share
  one type, so a missing translation is a type error.
- **Section ids differ per language** (`#calisma-alanlari` and `#practice`). The language switch maps
  the current section through `ids`, so rename ids in both languages together. Navigation items use
  `nav[].key`, where `top` means the hero and every other key is a section id.
- **Team members** live in `content.<lang>.team.members`; their LinkedIn URLs live in
  `firm.linkedin`, keyed by the same `key`. A member without a URL simply shows no profile link.
- **Title and description limits:** titles should be 30–65 characters and descriptions 70–160.
  `check:seo` warns outside those ranges.
- **After changing brand text** used in the OG images, run `npm run images`.

## Questions (soru-cevap)

The only part of the site the attorney maintains alone. The brief: a frequently-asked-questions
area — **never called a blog** — where each question is a separately indexable page, added by
committing a YAML file through the GitHub web interface.

- **Content:** `content/questions/*.yml`, images in `content/questions/images/`. The file name is
  the Turkish slug and therefore the URL. `content/questions/README.md` is the author-facing guide
  and is the one Turkish document in the repo, because its reader is the attorney.
- **Schema:** `src/content.config.ts`. Required: `question`, `summary`, `date`, `answer`.
  Optional: `tags`, `image` + `imageAlt`, `contact` (the contact block under the answer, on by
  default), `draft`, and `en` (question, summary, answer, optional tags and `slug`).
- **Turkish is the source language.** A question without an `en` block is not published in English;
  it still appears in the English list, marked "available in Turkish only" and linking to the
  Turkish page. Do not machine-translate answers.
- **Answer format** (`src/lib/richtext.ts`): blank line = paragraph, `- ` = bullet (items may wrap),
  `*word*` = brass italic, `[text](url)` = link (http, https, mailto, tel only). Everything is
  escaped first. It is deliberately not Markdown: the rules have to fit on one screen for the author.
- **URLs:** `/sorular/<slug>/` and `/en/questions/<slug>/`. Because the path segment differs per
  language, `@astrojs/sitemap` cannot pair them and emits no alternates for these pages; the
  `<link rel="alternate" hreflang>` tags in the HTML carry the pairing, which is what search engines
  read. Do not "fix" this by giving both languages the same path.
- **Structured data:** a question page is a `QAPage` whose `mainEntity` is a `Question` with an
  `acceptedAnswer`; the index is a `CollectionPage` with an `ItemList`. Both add a `BreadcrumbList`.
  `Base.astro` takes `paths`, `pageType`, `mainEntityId` and `graph` for this.
- **Navigation:** the header renders on these pages too, so every nav href is a full base-aware path
  (`/#iletisim`), built by `navHref()`. `main.ts` turns a link that points at the current document
  into a smooth in-page scroll. The language switch receives explicit targets (`langPaths`), so it
  stays on the same question instead of dropping the visitor on the home page.
- **Images** go through `astro:assets`, so they are resized to WebP with intrinsic width and height
  (no layout shift). `imageAlt` is required whenever an image is used.
- **The answers are legal copy.** The advertising ban applies in full (hard rule 1), and the texts
  must come from the attorney. The three questions currently in the repo were drafted as examples
  and still need the attorney's confirmation.

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
  rotating seal ring on the team emblem; outline numerals; and the brass fill sweep on hover.
- **Alignment:** the client asked for a strictly tidy layout, so sections share one rhythm — the
  5fr/7fr aside-and-list grid for practice and team, centred principles, one hairline per group, and
  no decorative indents.

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
- **Layout-dependent effects:**
  - The Approach section pins and scrolls horizontally only at ≥ 900 px. The pinned distance is
    55% of the track width, because the client found a 1:1 scroll too slow.
  - The team emblem is sticky, so its stroke-draw scrub has to finish early (`top 35%`); otherwise
    visitors see a half-drawn monogram.
  - A ResizeObserver on `<main>` debounces `ScrollTrigger.refresh()`, which covers accordion height
    changes and font swaps.
- **Navigation:** in-page anchors go through `scrollToTarget()` (Lenis-aware) and move focus to the
  target. The header never hides: it is the only way between sections, so it stays on screen at
  every scroll position and only condenses (88 px → 70 px) and takes its translucent background
  once the page has moved. Do not reintroduce a hide-on-scroll header (client request, 2026-09-24).
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
- Every section has an `<h2>`: the office section uses "İlkelerimiz", the contact section a visually
  hidden "İletişim", and the footer one per panel. The client removed every numbered section label.
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
  - **No custom domain set**: the site builds for `https://ohanedan.github.io` + `/kobya.av.tr`.
    Pages get `noindex, nofollow`, no `CNAME` is written, and canonical, hreflang, OG and sitemap
    URLs point at the preview URL.
  - **Custom domain set** in Settings → Pages, the current state: the site builds for
    `https://kobya.av.tr` + `/`. Pages become indexable, `dist/CNAME` is written by the
    `kobya:cname` integration, and GitHub redirects the old github.io URL to the domain.
  - **Protocol trap (fixed 2026-09-20):** `configure-pages` reports `http://kobya.av.tr` until
    GitHub's *Enforce HTTPS* is switched on. The production check therefore matches on the **host**
    and forces `https:`, in `astro.config.mjs`, `src/lib/paths.ts` and `scripts/validate-seo.mjs`
    alike. Before that fix the live site shipped `noindex, nofollow` and an `http://` canonical even
    though the domain was serving correctly. If these three ever disagree, the site silently
    de-indexes itself, so change them together.
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
- **HTTPS redirect:** the maintainer sets the HTTP → HTTPS redirect in Cloudflare; nothing in this
  repo handles it.
- **Cloudflare DNS** (DNS only, grey cloud):
  - Four `A` records for `@`: `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`.
  - Four `AAAA` records for `@`: `2606:50c0:8000::153` through `2606:50c0:8003::153`.
  - `CNAME www → ohanedan.github.io`.
- **Caching:** GitHub Pages sets a roughly 10-minute cache and custom headers are not possible. This
  is acceptable for this site.

## Verification workflow

Before calling a change done:

1. Run `npm run build && npm run check:seo`.
2. Run `npm run preview`, then `npm run test:smoke`. Astro's preview binds to `localhost`; if the
   smoke test reports no server, run it with `SMOKE_URL=http://localhost:4321`.
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
- **2026-09-15, license:**
  - The repo is going public. The maintainer wanted anyone to be free to reuse any part, however
    small, but only with clear, visible credit, and to be able to act against uncredited use.
  - No standard license fits:
    - MIT and Apache only require notices kept in the source, not visible credit.
    - CPAL requires visible credit but is copyleft.
  - So `LICENSE` is a custom bilingual attribution license:
    - Reuse of parts is allowed for any purpose, including commercial use.
    - A "no wholesale copying" clause forbids substantial copies. This covers reproducing the site as
      a whole, cloning its overall look and feel, and distributing it as a template. This makes the
      license source-available rather than OSI open source. It was added at the maintainer's request
      ("don't let them steal it one-to-one").
    - Visible credit is required whenever the work is made available, plus a source-code notice.
    - Changes must be marked, and no endorsement may be implied.
    - The brand, the attorney's personal and professional data, firm-specific copy and third-party
      material are excluded.
    - Rights terminate automatically on breach, with a 30-day cure period.
    - Enforcement relies on FSEK (Law No. 5846) and the unfair-competition provisions of the
      Turkish Commercial Code (TTK); Turkish law applies, with Ankara courts and enforcement offices.
    - The Turkish text prevails.
  - The licensor is Av. Vedat Murathan Kobya, as the maintainer specified. Permission requests go to
    the firm e-mail. Because the maintainer wrote the code, a written assignment of economic rights
    to the attorney is advisable (FSEK art. 52 requires written form).
  - GitHub shows it as "Other" because it is not OSI-approved. The attorney should review the text.
- **2026-09-20, client revision round** (a review document from the attorney, applied item by item):
  - Hero headline is now "Münakaşadan müzakere"; the eyebrow and the "Ankara · Kuruluş" line are gone.
  - Every mention of the founding year was removed, including the emblem's MMXXIII (hard rule 5).
  - The office section lost its numbered label and its display statement; the principles are centred
    under a single hairline, with no roman numerals.
  - Practice areas: "Şirketler Hukuku ve Regülasyon" and "Sözleşmeler Hukuku" merged into
    "Sözleşmeler Hukuku ve Mevzuat Uyum"; all descriptions replaced; the counter and the closing note
    removed. Five areas remain.
  - The attorney section became the team section: Av. Vedat Murathan Kobya, Av. Aykut Sait Hanedan and
    consultant Refik Cemal Hanedan, each with a LinkedIn link under the biography. The facts list,
    the "Kurucu Avukat" role and the emblem caption are gone.
  - Navigation is Anasayfa / Çalışma Alanları / Ekibimiz / İletişim; "Süreç" is no longer linked but
    the section stays.
  - Contact: no label, no display headline, opening hours listed per day (Saturday 10.00–15.00,
    Sunday closed), the bar block removed.
  - Footer: the giant "KOBYA" wordmark was replaced by the "Serbest Avukat Beyanı" statement, plus a
    "Diğer Bağlantılar" list of seven public legal resources.
  - The English contact lead no longer claims meetings are held in Turkish, because the team now
    includes English and German speakers.
  - The maintainer declined the requested contact form the same day; the phone/WhatsApp/e-mail
    buttons stay (hard rule 3).
- **2026-09-20, indexing fix:** the live domain was serving the site while the published HTML still
  said `noindex, nofollow` with an `http://` canonical, because `configure-pages` had reported the
  http origin. The production check now matches on host and forces https (see "Deployment"). Verified
  by building with `SITE_URL=http://kobya.av.tr`, with the default, and with the github.io preview.
- **2026-09-24, client revision round two:**
  - The footer resource list lost Gelincik Projesi.
  - The e-mail moved from the Gmail address to `murathan.kobya@kobya.av.tr`.
  - The hero headline reads "Münakaşadan müzakereye"; the English one is unchanged.
  - Body copy is justified where the client asked for it: the hero lead, practice-area
    descriptions, team biographies, approach steps and the Serbest Avukat Beyanı. The single rule
    lives in the primitives block and keeps `hyphens: auto`, without which the narrow columns tear
    open. Chromium has no Turkish hyphenation dictionary, so phone-width columns still show wide
    word gaps; left as asked.
  - The client could not get back to the navigation after jumping into a section. A fixed shortcut
    rail on the right edge was built first and then removed the same day: the client found it too
    easy to miss. The header is permanently visible instead, which also fixes it on phones, where
    the rail would not have appeared at all.
  - The smoke test now ignores console errors from other origins, because Google's map iframe logs
    its own network failures once the facade is clicked.

- **2026-09-24, questions area:** the client asked for "a blog that is not called a blog": a
  question-and-answer area where each question is indexed separately, so the site has more entry
  points in search. Decisions:
  - Content lives in `content/questions/*.yml` (English field names, Turkish copy) because the
    attorney has to be able to add a question from the GitHub web interface. The site parses the
    folder at build time; nothing else to do after committing a file.
  - English is optional per question, since requiring it would double the attorney's work.
  - Every question page ends with a contact block that the YAML can switch off per question.
  - The answers are written as a tiny text format rather than Markdown, to keep the author's rules
    short and the output escaped.
  - `check:seo` now discovers pages from `dist/` instead of a hard-coded list, so every new question
    is covered by the SEO gate automatically.

## Open items and ideas

- **A KVKK notice** may still arrive from the attorney. Without a form the site collects nothing, so
  such a text would be informational only; decide with the maintainer where it should live.
- **Practice-area sub-pages** (e.g. `/icra-iflas-hukuku/`) would be the next big organic-search
  lever, but they contradict the single-page brief. Ask before doing this.
- **Question texts:** the three questions in `content/questions/` are drafts written to show the
  mechanism. The attorney has to confirm or replace them, and writes every further question.
- **Per-question OG images** would make shared links look better than the generic `og.jpg`;
  `scripts/generate-images.mjs` could render one per question if this ever matters.
- **A domain e-mail:** the site now publishes `murathan.kobya@kobya.av.tr`, so the mailbox has to
  exist — set up Cloudflare Email Routing for the domain. Keep `firm.ts`, the Google Business
  Profile and LinkedIn in step.
