/**
 * Base-aware URLs. The site is built either for the domain root (https://kobya.av.tr/) or for the
 * GitHub Pages project URL (https://ohanedan.github.io/kobya.av.tr/) while the domain is not live.
 * Build every internal link and asset URL through `withBase()` — never hard-code a leading "/".
 */

export const PRODUCTION_ORIGIN = 'https://kobya.av.tr';

const rawBase = import.meta.env.BASE_URL;
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/** Prefixes a root-relative path ("/en/", "favicon.svg") with the configured base path. */
export const withBase = (path: string) => `${base}${path.replace(/^\//, '')}`;

const PRODUCTION_HOST = new URL(PRODUCTION_ORIGIN).host;

/**
 * True only for the real domain build; preview builds must not be indexed.
 * Matches on the host, because GitHub reports http:// for a custom domain until "Enforce HTTPS" is on.
 */
export const isProductionSite = (site: URL | undefined) => site?.host === PRODUCTION_HOST && base === '/';
