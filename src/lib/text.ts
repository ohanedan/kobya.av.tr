const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => entities[char]);

/** Escapes text and turns `*word*` markers into `<em>` for brass italic accents. */
export const emphasize = (value: string) => escape(value).replace(/\*(.+?)\*/g, '<em>$1</em>');

/** Splits a sentence into emphasized word fragments for the scroll-highlight effect. */
export const words = (value: string) => value.split(/\s+/).filter(Boolean).map(emphasize);

export const pad = (value: number) => String(value).padStart(2, '0');

export const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
