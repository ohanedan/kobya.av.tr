import { firm } from '../data/firm';

export type Lang = 'tr' | 'en';
export type SectionKey = 'office' | 'practice' | 'attorney' | 'approach' | 'contact';

/*
 * All site copy, per language. Wrapping a word in `*asterisks*` renders it as a brass italic accent.
 *
 * Legal constraint: Turkish Attorneys' Act art. 55 and the TBB advertising-ban regulation require
 * purely informational copy — no "best"/"expert" claims, success rates, client testimonials,
 * case wins, prices or "free consultation" offers.
 *
 * SEO: keep `meta.title` within ~65 characters and `meta.description` within ~160
 * (`npm run check:seo` warns otherwise).
 */

const tr = {
  locale: 'tr_TR',
  brand: firm.name,
  prefix: 'Av.',
  skip: 'İçeriğe geç',
  meta: {
    title: 'Kobya Hukuk Bürosu | Av. Vedat Murathan Kobya – Ankara Avukat',
    description:
      'Kobya Hukuk Bürosu, Gölbaşı/Ankara: Av. Vedat Murathan Kobya ile şirketler, sözleşmeler, icra-iflas, medeni ve ceza hukukunda danışmanlık ve dava takibi.',
    imageAlt: 'Kobya Hukuk Bürosu — Av. Vedat Murathan Kobya, Gölbaşı / Ankara',
  },
  ids: {
    office: 'buro',
    practice: 'calisma-alanlari',
    attorney: 'avukat',
    approach: 'surec',
    contact: 'iletisim',
  } satisfies Record<SectionKey, string>,
  nav: [
    { key: 'office', label: 'Büro' },
    { key: 'practice', label: 'Çalışma Alanları' },
    { key: 'attorney', label: 'Avukat' },
    { key: 'approach', label: 'Süreç' },
    { key: 'contact', label: 'İletişim' },
  ] as { key: SectionKey; label: string }[],
  header: {
    sub: 'Hukuk Bürosu',
    cta: 'Bize ulaşın',
    menuOpen: 'Menüyü aç',
    menuClose: 'Menüyü kapat',
    navLabel: 'Ana menü',
    langLabel: 'Dil seçimi',
  },
  hero: {
    eyebrow: 'Avukatlık ve Hukuki Danışmanlık',
    place: `Ankara · Kuruluş ${firm.founded}`,
    titleLines: ['Hukuki süreçlerde', '*özen*, açıklık', 've güven.'],
    lead: 'Gölbaşı, Ankara’da faaliyet gösteren Kobya Hukuk Bürosu; şirketlere ve bireylere regülasyon ve sözleşme süreçlerinde danışmanlık, medeni hukuk, ceza hukuku ile icra ve iflas hukuku alanlarında hukuki destek sunmaktadır.',
    cta: 'İletişime geçin',
  },
  office: {
    label: 'Büro',
    statement:
      'Her dosyanın ardında bir hayat, bir emek ya da bir işletmenin geleceği vardır. Bu nedenle her talebi *dikkatle* dinler, hukuki durumu *açık* bir dille ortaya koyar ve süreci baştan sona *özenle* takip ederiz.',
    principlesLabel: 'İlkelerimiz',
    principles: [
      { title: 'Gizlilik', text: 'Büroyla paylaşılan her bilgi, meslek sırrı kapsamında titizlikle korunur.' },
      { title: 'Özen', text: 'Her dosya, mevzuat ve güncel yargı kararları ışığında ayrıntılı biçimde incelenir.' },
      { title: 'Açıklık', text: 'Süreç, olası sonuçlar ve riskler anlaşılır bir dille paylaşılır.' },
      { title: 'Ulaşılabilirlik', text: 'Müvekkiller, dosyalarındaki gelişmelerden zamanında haberdar edilir.' },
    ],
  },
  practice: {
    label: 'Çalışma Alanları',
    titleLines: ['Çalışma', '*alanları*'],
    intro: 'Büro, aşağıdaki alanlarda hukuki danışmanlık ve dava takibi hizmeti vermektedir. Ayrıntılar için başlıkları açabilirsiniz.',
    note: 'Listede yer almayan konulardaki talepleriniz için de büroyla iletişime geçebilirsiniz.',
    areas: [
      {
        title: 'Şirketler Hukuku ve Regülasyon',
        text: 'Şirketlerin faaliyetleri boyunca ihtiyaç duyabileceği regülasyon ve uyum süreçlerinde danışmanlık; hissedar sözleşmeleri, genel kurul ve yönetim kurulu işlemleri ile halka arz süreçlerinde hukuki destek.',
      },
      {
        title: 'Sözleşmeler Hukuku',
        text: 'Ticari ve bireysel sözleşmelerin hazırlanması, incelenmesi ve müzakeresi; sözleşme süreçlerinin yönetimi ve sözleşmeden doğan uyuşmazlıklar.',
      },
      {
        title: 'İcra ve İflas Hukuku',
        text: 'Alacakların icra yoluyla takibi, takibe itiraz süreçleri, itirazın iptali ve kaldırılması davaları ile ihtarname hazırlığı.',
      },
      {
        title: 'Medeni Hukuk',
        text: 'Aile, miras, eşya ve borçlar hukukundan kaynaklanan uyuşmazlıklarda danışmanlık ve dava takibi.',
      },
      {
        title: 'Ceza Hukuku',
        text: 'Soruşturma ve kovuşturma aşamalarında şüpheli ve sanık müdafiliği ile müşteki ve katılan vekilliği.',
      },
      {
        title: 'Fikri Mülkiyet Hukuku',
        text: 'Marka ve diğer fikri mülkiyet başvurularının hazırlanması ve takibi; fikri mülkiyet haklarına ilişkin sözleşmeler.',
      },
    ],
  },
  attorney: {
    label: 'Avukat',
    honorific: 'Avukat',
    role: 'Kurucu Avukat',
    ring: `KOBYA HUKUK BÜROSU · ANKARA · ${firm.foundedRoman} · `,
    bio: [
      'Av. Vedat Murathan Kobya, Atılım Üniversitesi Hukuk Fakültesi mezunudur. Mesleğe başlamadan önce çeşitli hukuk bürolarında stajyer olarak çalışmış; bankacılık, sigorta ve telekomünikasyon sektörlerine ait icra takip dosyalarının yürütülmesi, sözleşme süreçlerinin yönetimi ile dilekçe ve ihtarname hazırlığı konularında deneyim kazanmıştır.',
      `${firm.admitted} yılında avukatlığa başlamış, ${firm.founded} yılında Kobya Hukuk Bürosu’nu kurarak serbest avukatlık faaliyetine geçmiştir. Farklı dönemlerde teknoloji ve elektronik para sektörlerinde faaliyet gösteren şirketlerde şirket avukatı olarak görev almış; sözleşme yönetimi, hissedar sözleşmeleri, halka arz süreçleri ve fikri mülkiyet başvuruları konularında hukuki danışmanlık sağlamıştır.`,
      'Büro avukatlığı ile şirket içi avukatlık deneyimini bir araya getiren bu birikim, büronun çalışma anlayışının temelini oluşturur.',
    ],
    facts: [
      { label: 'Baro', value: firm.bar.tr },
      { label: 'Eğitim', value: firm.education.tr },
      { label: 'Mesleğe başlangıç', value: String(firm.admitted) },
      { label: 'Büro kuruluşu', value: String(firm.founded) },
    ],
  },
  approach: {
    label: 'Süreç',
    titleLines: ['Çalışma', '*şeklimiz*'],
    intro: 'Her dosyada izlenen yol; sade, öngörülebilir ve dört adımdan oluşur.',
    steps: [
      { title: 'İlk görüşme', text: 'Randevu ile yapılan ilk görüşmede talebinizi dinler, elinizdeki belge ve bilgileri birlikte gözden geçiririz.' },
      { title: 'Hukuki değerlendirme', text: 'Konunun hukuki çerçevesini, izlenebilecek yolları ve olası riskleri açık bir dille ortaya koyarız.' },
      { title: 'Takip', text: 'Dosyanızı mevzuat ve güncel yargı kararları ışığında, her aşamasında titizlikle yürütürüz.' },
      { title: 'Bilgilendirme', text: 'Süreçteki her önemli gelişmeyi zamanında ve anlaşılır biçimde sizinle paylaşırız.' },
    ],
    ctaTitle: 'Görüşme için randevu alın',
    ctaAction: 'İletişim bilgileri',
  },
  contact: {
    label: 'İletişim',
    titleLines: ['Hukuki sorunuzu', '*birlikte*', 'değerlendirelim.'],
    lead: 'Görüşmeler randevu ile yapılmaktadır. Randevu ve bilgi talepleriniz için telefon, WhatsApp veya e-posta yoluyla büroya ulaşabilirsiniz.',
    phone: { label: 'Telefon', action: 'Arayın' },
    whatsapp: { label: 'WhatsApp', action: 'Mesaj gönderin', message: 'Merhaba, randevu almak istiyorum.' },
    email: { label: 'E-posta', action: 'E-posta gönderin' },
    address: 'Adres',
    appointment: 'Randevu ile',
    hours: 'Çalışma saatleri',
    bar: 'Baro',
    social: 'LinkedIn',
    socialAction: 'Profili görüntüle',
    map: {
      load: 'Haritayı göster',
      open: 'Google Haritalar’da aç',
      notice: 'Harita, Google Haritalar üzerinden yüklenir.',
      frameTitle: 'Kobya Hukuk Bürosu konumu',
    },
  },
  footer: {
    disclaimer:
      'Bu internet sitesi, 1136 sayılı Avukatlık Kanunu ve Türkiye Barolar Birliği meslek kuralları çerçevesinde yalnızca bilgilendirme amacıyla hazırlanmıştır. Sitedeki içerik hukuki görüş niteliği taşımaz.',
    privacy: 'Bu site çerez kullanmaz. Harita, yalnızca talep etmeniz hâlinde Google Haritalar üzerinden yüklenir.',
    rights: 'Tüm hakları saklıdır.',
    backToTop: 'Başa dön',
  },
};

const en: typeof tr = {
  locale: 'en_US',
  brand: firm.nameEn,
  prefix: 'Attorney',
  skip: 'Skip to content',
  meta: {
    title: 'Kobya Law Office | Vedat Murathan Kobya, Lawyer in Ankara',
    description:
      'Kobya Law Office, Gölbaşı/Ankara: attorney Vedat Murathan Kobya provides counsel and litigation in corporate, contract, enforcement, civil and criminal law.',
    imageAlt: 'Kobya Law Office — Attorney Vedat Murathan Kobya, Gölbaşı / Ankara',
  },
  ids: {
    office: 'firm',
    practice: 'practice',
    attorney: 'attorney',
    approach: 'process',
    contact: 'contact',
  },
  nav: [
    { key: 'office', label: 'The Firm' },
    { key: 'practice', label: 'Practice Areas' },
    { key: 'attorney', label: 'Attorney' },
    { key: 'approach', label: 'Process' },
    { key: 'contact', label: 'Contact' },
  ],
  header: {
    sub: 'Law Office',
    cta: 'Contact',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    navLabel: 'Main menu',
    langLabel: 'Language',
  },
  hero: {
    eyebrow: 'Attorneys & Legal Counsel',
    place: `Ankara · Est. ${firm.founded}`,
    titleLines: ['Legal matters,', 'handled with *care*', 'and clarity.'],
    lead: 'Based in Gölbaşı, Ankara, Kobya Law Office advises companies and individuals on regulatory and contractual matters, and provides legal support in civil law, criminal law, and enforcement & bankruptcy law.',
    cta: 'Get in touch',
  },
  office: {
    label: 'The Firm',
    statement:
      'Behind every case there is a life, a livelihood or the future of a business. That is why we listen *carefully* to every request, explain the legal position in *plain* language and follow the process *diligently* from start to finish.',
    principlesLabel: 'Our principles',
    principles: [
      { title: 'Confidentiality', text: 'Everything shared with the office is protected under the duty of professional secrecy.' },
      { title: 'Diligence', text: 'Every matter is examined in detail in light of current legislation and case law.' },
      { title: 'Clarity', text: 'The process, possible outcomes and risks are explained in plain terms.' },
      { title: 'Accessibility', text: 'Clients are kept informed of developments in their matter in a timely manner.' },
    ],
  },
  practice: {
    label: 'Practice Areas',
    titleLines: ['Practice', '*areas*'],
    intro: 'The office provides legal counsel and representation in the areas below. Open a heading for more detail.',
    note: 'For matters not listed here, you are also welcome to contact the office.',
    areas: [
      {
        title: 'Corporate & Regulatory',
        text: 'Counsel on the regulatory and compliance processes a company may need throughout its operations; legal support on shareholder agreements, general assembly and board matters, and public offerings.',
      },
      {
        title: 'Contract Law',
        text: 'Drafting, reviewing and negotiating commercial and individual contracts; contract management and disputes arising from contracts.',
      },
      {
        title: 'Enforcement & Bankruptcy',
        text: 'Debt collection through enforcement proceedings, objections to enforcement, actions for the annulment and removal of objections, and formal notices.',
      },
      {
        title: 'Civil Law',
        text: 'Advice and litigation in disputes arising from family, inheritance, property and obligations law.',
      },
      {
        title: 'Criminal Law',
        text: 'Defence of suspects and defendants, and representation of complainants and intervening parties, at the investigation and prosecution stages.',
      },
      {
        title: 'Intellectual Property',
        text: 'Preparation and follow-up of trademark and other intellectual property applications; agreements relating to intellectual property rights.',
      },
    ],
  },
  attorney: {
    label: 'Attorney',
    honorific: 'Attorney at Law',
    role: 'Founding Attorney',
    ring: `KOBYA LAW OFFICE · ANKARA · ${firm.foundedRoman} · `,
    bio: [
      'Vedat Murathan Kobya is a graduate of Atılım University Faculty of Law. Before admission to the bar, Kobya trained at several law firms, gaining experience in enforcement proceedings for the banking, insurance and telecommunications sectors, contract management, and the drafting of petitions and formal notices.',
      `Admitted to practice in ${firm.admitted}, Kobya founded Kobya Law Office in ${firm.founded} as an independent practice. At different times, Kobya has also served as in-house counsel for companies in the technology and electronic money sectors, advising on contract management, shareholder agreements, public offering processes and intellectual property applications.`,
      'This combination of law-firm and in-house experience forms the foundation of the way the office works.',
    ],
    facts: [
      { label: 'Bar', value: firm.bar.en },
      { label: 'Education', value: firm.education.en },
      { label: 'Admitted', value: String(firm.admitted) },
      { label: 'Office founded', value: String(firm.founded) },
    ],
  },
  approach: {
    label: 'Process',
    titleLines: ['How we', '*work*'],
    intro: 'Every matter follows a clear and predictable path of four steps.',
    steps: [
      { title: 'First meeting', text: 'At an initial meeting, held by appointment, we listen to your request and review your documents together.' },
      { title: 'Legal assessment', text: 'We set out the legal framework, the available options and the possible risks in plain language.' },
      { title: 'Handling', text: 'We conduct your matter carefully at every stage, in light of current legislation and case law.' },
      { title: 'Keeping you informed', text: 'We share every significant development with you promptly and in clear terms.' },
    ],
    ctaTitle: 'Arrange an appointment',
    ctaAction: 'Contact details',
  },
  contact: {
    label: 'Contact',
    titleLines: ['Let us review', 'your matter', '*together*.'],
    lead: 'Meetings are by appointment and are conducted in Turkish. To arrange an appointment or request information, please reach the office by phone, WhatsApp or e-mail.',
    phone: { label: 'Phone', action: 'Call' },
    whatsapp: { label: 'WhatsApp', action: 'Send a message', message: 'Hello, I would like to make an appointment.' },
    email: { label: 'E-mail', action: 'Write to us' },
    address: 'Address',
    appointment: 'By appointment',
    hours: 'Office hours',
    bar: 'Bar',
    social: 'LinkedIn',
    socialAction: 'View profile',
    map: {
      load: 'Show map',
      open: 'Open in Google Maps',
      notice: 'The map is loaded from Google Maps.',
      frameTitle: 'Kobya Law Office location',
    },
  },
  footer: {
    disclaimer:
      'This website has been prepared for information purposes only, in accordance with Attorneys’ Act No. 1136 and the professional rules of the Union of Turkish Bar Associations. Its content does not constitute legal advice.',
    privacy: 'This site uses no cookies. The map is loaded from Google Maps only if you request it.',
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },
};

export const content: Record<Lang, typeof tr> = { tr, en };
