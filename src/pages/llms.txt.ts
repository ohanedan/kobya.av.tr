import type { APIRoute } from 'astro';
import { firm } from '../data/firm';
import { content } from '../i18n/content';
import { withBase } from '../lib/paths';

/**
 * /llms.txt — a plain-Markdown summary for AI assistants and answer engines
 * (https://llmstxt.org). Generated from the same data as the pages so it never drifts.
 */
export const GET: APIRoute = ({ site }) => {
  const { tr, en } = content;
  const { address } = firm;
  const url = (path: string) => new URL(withBase(path), site).href;

  const body = [
    `# ${firm.name} (${firm.nameEn})`,
    '',
    `> ${en.meta.description}`,
    '',
    `Law office of attorney ${firm.attorney}, a member of the ${firm.bar.en}, in ${address.district}, ` +
      `${address.city}, Türkiye. Meetings are held by appointment.`,
    '',
    '## Pages',
    '',
    `- [Türkçe](${url('/')}): ${tr.meta.description}`,
    `- [English](${url('/en/')}): ${en.meta.description}`,
    '',
    '## Practice areas',
    '',
    ...en.practice.areas.map((area, index) => `- ${area.title} (${tr.practice.areas[index].title}): ${area.text}`),
    '',
    '## Team',
    '',
    ...en.team.members.map((member, index) => {
      const profile = (firm.linkedin as Record<string, string | undefined>)[member.key];
      return `- ${member.name} — ${member.role} (${tr.team.members[index].role})${profile ? `, ${profile}` : ''}`;
    }),
    '',
    '## Contact',
    '',
    `- Address: ${address.street}, ${address.postalCode} ${address.district}/${address.city}, Türkiye`,
    `- Phone / WhatsApp: ${firm.phone.display}`,
    `- E-mail: ${firm.email}`,
    ...en.contact.hoursRows.map((row) => `- ${row.day}: ${row.value}`),
    '',
    '## Notice',
    '',
    en.footer.declaration,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
