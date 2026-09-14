/**
 * Firm facts shared by both languages: name, address, phone (NAP), hours and credentials.
 * All page copy lives in src/i18n/content.ts.
 *
 * Keep NAP details identical to the Google Business Profile, LinkedIn and bar listings —
 * consistent NAP is a local-SEO ranking signal.
 */

export const firm = {
  name: 'Kobya Hukuk Bürosu',
  nameEn: 'Kobya Law Office',
  attorney: 'Vedat Murathan Kobya',
  url: 'https://kobya.av.tr',

  founded: 2023,
  foundedRoman: 'MMXXIII',
  admitted: 2022,

  phone: { display: '+90 530 672 06 61', tel: '+905306720661' },
  /** International format without "+" or spaces, as wa.me expects. */
  whatsapp: '905306720661',
  email: 'murathankobyaa@gmail.com',
  linkedin: 'https://www.linkedin.com/in/vedat-murathan-kobya-336b22262/',

  address: {
    street: 'Kızılcaşar Mah. 1209. Sok. No: 11/41',
    district: 'Gölbaşı',
    city: 'Ankara',
    postalCode: '06830',
    country: 'TR',
    /** ISO 3166-2 subdivision code for Ankara. */
    region: 'TR-06',
    /** Simplified form that geocodes reliably on Google Maps. */
    mapsQuery: 'Kızılcaşar Mahallesi 1209. Sokak No:11, Gölbaşı, Ankara',
  },
  /** Coordinates Google Maps resolves for `address.mapsQuery`. */
  geo: { latitude: 39.8243636, longitude: 32.7204337 },

  hours: { tr: 'Hafta içi 09.00 – 18.00', en: 'Weekdays 09:00 – 18:00' },
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },

  bar: { tr: 'Ankara Barosu', en: 'Ankara Bar Association', url: 'https://www.ankarabarosu.org.tr' },
  education: {
    tr: 'Atılım Üniversitesi Hukuk Fakültesi',
    en: 'Atılım University, Faculty of Law',
    url: 'https://www.atilim.edu.tr',
  },
} as const;

const query = encodeURIComponent(firm.address.mapsQuery);

export const links = {
  tel: `tel:${firm.phone.tel}`,
  mail: `mailto:${firm.email}`,
  whatsapp: (text: string) => `https://wa.me/${firm.whatsapp}?text=${encodeURIComponent(text)}`,
  maps: `https://www.google.com/maps/search/?api=1&query=${query}`,
  mapsEmbed: `https://www.google.com/maps?q=${query}&hl=tr&z=15&output=embed`,
};
