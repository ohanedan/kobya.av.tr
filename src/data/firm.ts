/**
 * Firm facts shared by both languages: name, address, phone (NAP), hours and credentials.
 * All page copy lives in src/i18n/content.ts.
 *
 * Keep NAP details identical to the Google Business Profile, LinkedIn and bar listings —
 * consistent NAP is a local-SEO ranking signal.
 *
 * Note: the site must not state when the office was founded (client request), so no founding
 * year or "since" marker belongs in this file.
 */

export const firm = {
  name: 'Kobya Hukuk Bürosu',
  nameEn: 'Kobya Law Office',
  attorney: 'Vedat Murathan Kobya',
  url: 'https://kobya.av.tr',

  phone: { display: '+90 530 672 06 61', tel: '+905306720661' },
  /** International format without "+" or spaces, as wa.me expects. */
  whatsapp: '905306720661',
  email: 'murathankobyaa@gmail.com',

  /** Personal profiles, shown under each team member's biography. */
  linkedin: {
    vedat: 'https://www.linkedin.com/in/vedat-murathan-kobya-336b22262/',
    aykut: 'https://www.linkedin.com/in/sait-aykut-hanedan-a8b484173/',
  },

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

  /** Structured-data form of the opening hours rendered in src/i18n/content.ts. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
    { days: ['Saturday'], opens: '10:00', closes: '15:00' },
  ],

  bar: { tr: 'Ankara Barosu', en: 'Ankara Bar Association', url: 'https://www.ankarabarosu.org.tr' },
  education: {
    tr: 'Atılım Üniversitesi Hukuk Fakültesi',
    en: 'Atılım University, Faculty of Law',
    url: 'https://www.atilim.edu.tr',
  },
} as const;

/** Public legal resources linked in the footer. Names are official, so they are not translated. */
export const resources = [
  { label: 'e-Devlet Kapısı', url: 'https://www.turkiye.gov.tr' },
  { label: 'UYAP Vatandaş Portalı', url: 'https://vatandas.uyap.gov.tr' },
  { label: 'Mevzuat Bilgi Sistemi', url: 'https://www.mevzuat.gov.tr' },
  { label: 'Türkiye Barolar Birliği', url: 'https://www.barobirlik.org.tr' },
  { label: 'Mağdur Bilgi Sistemi', url: 'https://magdurbilgi.adalet.gov.tr' },
  { label: 'Yargıtay İçtihat Merkezi', url: 'https://www.yargitayictihatmerkezi.gov.tr' },
  { label: 'Gelincik Projesi', url: 'https://www.gelincikprojesi.org.tr' },
] as const;

const query = encodeURIComponent(firm.address.mapsQuery);

export const links = {
  tel: `tel:${firm.phone.tel}`,
  mail: `mailto:${firm.email}`,
  whatsapp: (text: string) => `https://wa.me/${firm.whatsapp}?text=${encodeURIComponent(text)}`,
  maps: `https://www.google.com/maps/search/?api=1&query=${query}`,
  mapsEmbed: `https://www.google.com/maps?q=${query}&hl=tr&z=15&output=embed`,
};
