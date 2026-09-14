/**
 * Search-engine ownership tokens.
 *
 * Prefer DNS TXT verification in Cloudflare (no code change needed). Fill a value here only
 * when a tool insists on the meta-tag method; empty strings render nothing.
 */
export const verification = {
  /** Google Search Console — `google-site-verification` */
  google: '',
  /** Bing Webmaster Tools — `msvalidate.01` */
  bing: '',
  /** Yandex Webmaster — `yandex-verification` (Yandex has a meaningful share in Türkiye) */
  yandex: '',
};
