/**
 * The tiny text format the question YAML files are written in. It is deliberately not Markdown:
 * the attorney writes these through the GitHub web editor, so the rules have to fit on one screen
 * (see content/questions/README.md).
 *
 *   blank line   new paragraph
 *   "- " line    bullet list
 *   *word*       brass italic accent
 *   [text](url)  link (http, https, mailto and tel only)
 *
 * Everything is escaped first, so a stray < or & in the copy can never become markup.
 */
const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => entities[char]);

const SAFE_URL = /^(https?:\/\/|mailto:|tel:)/i;

/** Applies the inline markers to already-escaped text. */
const inline = (value: string) =>
  value
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, text: string, href: string) => {
      if (!SAFE_URL.test(href)) return text;
      const external = /^https?:/i.test(href);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
    })
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

/** Renders one answer into HTML paragraphs and lists. */
export const renderAnswer = (value: string) =>
  escape(value.replace(/\r\n/g, '\n'))
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      // A block that opens with "- " is a list; one item may wrap over several lines.
      if (lines[0]?.startsWith('- ')) {
        const items: string[] = [];
        for (const line of lines) {
          if (line.startsWith('- ')) items.push(line.slice(2));
          else if (items.length) items[items.length - 1] += ` ${line}`;
        }
        return `<ul>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`;
      }
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('');

/** Plain text of an answer, for meta descriptions and structured data. */
export const answerText = (value: string) =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/^\s*-\s+/gm, '')
    .replace(/^[ \t]+/gm, '')
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .split(/\n\s*\n/)
    .map((block) => block.split('\n').map((line) => line.trim()).join(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
