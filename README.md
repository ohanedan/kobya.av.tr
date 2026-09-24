# kobya.av.tr

The website of **Kobya Hukuk Bürosu / Kobya Law Office**, the law office of Av. Vedat Murathan Kobya
in Gölbaşı, Ankara. It is a single, bilingual page.

- Turkish: <https://kobya.av.tr/>
- English: <https://kobya.av.tr/en/>

The site is built with [Astro](https://astro.build) as fully static HTML. Animations use
[GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering). Fonts are self-hosted
through Astro's Fonts API. The site sets no cookies and loads no analytics or third-party scripts;
Google Maps loads only when a visitor asks for it.

> Contributors and AI assistants: read [CLAUDE.md](CLAUDE.md) first. It covers the legal constraints
> (the Turkish lawyer advertising ban), the architecture, SEO details and the decision log.

## Requirements

Node 24 (see `.nvmrc`). The browser-based scripts also need Microsoft Edge or Google Chrome installed.

## Development

```sh
nvm use 24
npm install
npm run dev          # http://localhost:4321
```

| Script               | What it does                                                                     |
| -------------------- | -------------------------------------------------------------------------------- |
| `npm run build`      | Builds the static site into `dist/`                                              |
| `npm run check:seo`  | Validates SEO invariants of `dist/`; runs in CI and blocks deploys on errors     |
| `npm run preview`    | Serves `dist/` locally in the background (`npx astro preview stop` stops it)     |
| `npm run test:smoke` | Browser smoke test against the preview server                                    |
| `npm run images`     | Regenerates social preview images, favicon.ico and app icons into `public/`      |

## Editing content

| What                                          | Where                                          |
| --------------------------------------------- | ---------------------------------------------- |
| Phone, e-mail, address, hours, bar, geo       | [src/data/firm.ts](src/data/firm.ts)           |
| All copy (TR + EN), practice areas            | [src/i18n/content.ts](src/i18n/content.ts)     |
| Questions and answers, one page each          | [content/questions/](content/questions/)       |
| Search-engine verification meta tags          | [src/data/seo.ts](src/data/seo.ts)             |
| Colours, typography, layout                   | [src/styles/global.css](src/styles/global.css) |
| Animations and interactions                   | [src/scripts/main.ts](src/scripts/main.ts)     |

Wrapping a word in `*asterisks*` inside the copy renders it as a brass italic accent.

Each YAML file in [content/questions/](content/questions/) becomes its own page under `/sorular/`
(and `/en/questions/` when it carries an `en` block), listed in the sitemap and marked up as a
`QAPage`. The fields are documented, in Turkish, in
[content/questions/README.md](content/questions/README.md), because the attorney adds these files
through the GitHub web interface.

> **Advertising ban:** Under Turkish Attorneys' Act art. 55 and the TBB advertising regulation, copy
> must stay informational. Do not add superlatives ("best", "expert"), success rates, testimonials,
> prices or "free consultation" offers.

## Deployment

Every push to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which
builds the site, runs the SEO check and publishes to GitHub Pages at <https://kobya.av.tr>.

## License

This project uses the [Kobya Attribution License 1.0](LICENSE), with the full text in English and
Turkish.

- **Pieces are free to reuse.** You may take pieces of this project, however small, and use them in
  your own, clearly different work for any purpose, including commercial use.
- **Credit is required.** Credit the project **clearly and visibly**, for example in your site
  footer, a credits page or your README:

  > Contains work from kobya.av.tr by Vedat Murathan Kobya – https://github.com/ohanedan/kobya.av.tr

  Source files that contain reused code must also keep a short notice comment (see
  [LICENSE](LICENSE), section 3.2).
- **Clones are not allowed.** Copying the site as a whole, or cloning its overall design and
  swapping in your own name and content, requires written permission, even with credit. So does
  selling or distributing the site as a template or theme.
- **Some material is not licensed at all:** the Kobya Hukuk Bürosu brand (name, "K" monogram,
  wordmark, seal), the attorney's personal and professional data, and the firm-specific texts.

Uncredited use and clones are not licensed.
