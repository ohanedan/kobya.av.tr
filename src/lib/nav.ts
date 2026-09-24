/**
 * Navigation hrefs. Every link is a full, base-aware path rather than a bare "#id", because the
 * same header and footer now render on the question pages as well; `main.ts` turns a link that
 * points at the current document into a smooth in-page scroll.
 */
import { content, type Lang, type NavKey } from '../i18n/content';
import { withBase } from './paths';

export const homePath = (lang: Lang) => withBase(lang === 'tr' ? '/' : '/en/');

export const navHref = (lang: Lang, key: NavKey) => {
  const t = content[lang];
  if (key === 'questions') return withBase(t.questions.path);
  return `${homePath(lang)}#${key === 'top' ? 'top' : t.ids[key]}`;
};
