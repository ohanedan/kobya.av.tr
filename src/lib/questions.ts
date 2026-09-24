/**
 * Reads the question collection and flattens it per language.
 *
 * Turkish is the source language: every published question exists in Turkish. A question is only
 * published in English when its YAML carries an `en` block; the others still appear in the English
 * list, marked as Turkish-only and linking to the Turkish page.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/content';
import { withBase } from './paths';

type Entry = CollectionEntry<'questions'>;

export interface Question {
  /** The YAML file name, shared by both languages. */
  id: string;
  question: string;
  summary: string;
  answer: string;
  tags: string[];
  date: Date;
  image?: ImageMetadata;
  imageAlt?: string;
  contact: boolean;
  /** Path of this question's page in the requested language. */
  path: string;
  /** Path of the other language's page, when there is one. */
  altPath?: string;
  /** False when the English side falls back to the Turkish page. */
  translated: boolean;
  /** The language the copy above is written in. */
  copyLang: Lang;
}

/** Where a question lives, per language. The file name is the Turkish slug. */
const trPath = (entry: Entry) => withBase(`/sorular/${entry.id}/`);
const enSlug = (entry: Entry) => entry.data.en?.slug ?? entry.id;
const enPath = (entry: Entry) => withBase(`/en/questions/${enSlug(entry)}/`);

const published = async () => {
  const entries = await getCollection('questions', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
};

const toQuestion = (entry: Entry, lang: Lang): Question => {
  const { data } = entry;
  const en = data.en;
  const translated = lang === 'tr' || !!en;
  const copy = lang === 'en' && en ? en : data;

  return {
    id: entry.id,
    question: copy.question,
    summary: copy.summary,
    answer: copy.answer,
    // Tags also group the "other questions" block, so an untranslated tag list falls back.
    tags: copy.tags?.length ? copy.tags : data.tags,
    date: data.date,
    image: data.image,
    imageAlt: copy.imageAlt ?? data.imageAlt,
    contact: data.contact,
    path: lang === 'tr' ? trPath(entry) : translated ? enPath(entry) : trPath(entry),
    altPath: lang === 'tr' ? (en ? enPath(entry) : undefined) : trPath(entry),
    translated,
    copyLang: lang === 'en' && !en ? 'tr' : lang,
  };
};

/** Every published question, newest first, in the requested language. */
export const getQuestions = async (lang: Lang): Promise<Question[]> =>
  (await published()).map((entry) => toQuestion(entry, lang));

/** The questions that get their own page in this language. */
export const getQuestionPages = async (lang: Lang) => {
  const entries = await published();
  return entries
    .filter((entry) => lang === 'tr' || entry.data.en)
    .map((entry) => ({ slug: lang === 'tr' ? entry.id : enSlug(entry), question: toQuestion(entry, lang) }));
};

/** Up to `limit` other questions sharing a tag, falling back to the most recent ones. */
export const relatedQuestions = (all: Question[], current: Question, limit = 3) => {
  const others = all.filter((item) => item.id !== current.id);
  const tagged = others.filter((item) => item.tags.some((tag) => current.tags.includes(tag)));
  return [...tagged, ...others.filter((item) => !tagged.includes(item))].slice(0, limit);
};

/** Build-time formatted date, e.g. "24 Eylül 2026". */
export const formatDate = (date: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
