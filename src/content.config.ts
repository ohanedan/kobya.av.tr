/**
 * The question-and-answer collection. Every file in content/questions/ becomes its own page, so the
 * attorney can publish a new question from the GitHub web interface without touching any code:
 * the file name is the URL, and the fields below are the whole contract. See the README next to
 * the YAML files for the author-facing version of this.
 *
 * Turkish is required and English is optional; a question without an `en` block is published in
 * Turkish only and says so on the English side.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const translation = z.object({
  question: z.string().min(1),
  summary: z.string().min(1),
  answer: z.string().min(1),
  imageAlt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  /** Overrides the file name in the URL of the English page. */
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

const questions = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './content/questions' }),
  schema: ({ image }) =>
    translation.extend({
      /** Relative to the YAML file, e.g. images/vekaletname.jpg. */
      image: image().optional(),
      date: z.coerce.date(),
      /** Keeps a question out of the build while it is being written. */
      draft: z.boolean().default(false),
      /** The contact block under the answer; turn it off per question. */
      contact: z.boolean().default(true),
      en: translation.optional(),
    }),
});

export const collections = { questions };
