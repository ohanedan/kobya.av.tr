import { firm } from '../data/firm';

export type Lang = 'tr' | 'en';
export type SectionKey = 'office' | 'practice' | 'team' | 'approach' | 'contact';
/**
 * Navigation targets: "top" is the hero and the other section keys are ids on the home page,
 * while "questions" is the only entry that leads to a page of its own.
 */
export type NavKey = 'top' | SectionKey | 'questions';

/*
 * All site copy, per language. Wrapping a word in `*asterisks*` renders it as a brass italic accent.
 *
 * Legal constraint: Turkish Attorneys' Act art. 55 and the TBB advertising-ban regulation require
 * purely informational copy — no "best"/"expert" claims, success rates, client testimonials,
 * case wins, prices or "free consultation" offers.
 *
 * Client constraint: the site must never state when the office was founded.
 *
 * SEO: keep `meta.title` within ~65 characters and `meta.description` within ~160
 * (`npm run check:seo` warns otherwise).
 */

const tr = {
  locale: 'tr_TR',
  brand: firm.name,
  skip: 'İçeriğe geç',
  meta: {
    title: 'Kobya Hukuk Bürosu | Av. Vedat Murathan Kobya – Ankara Avukat',
    description:
      'Kobya Hukuk Bürosu, Ankara: sözleşmeler ve mevzuat uyum, icra-iflas, medeni hukuk, ceza hukuku ve fikri mülkiyet alanlarında danışmanlık ve dava takibi.',
    imageAlt: 'Kobya Hukuk Bürosu — Av. Vedat Murathan Kobya, Gölbaşı / Ankara',
  },
  ids: {
    office: 'buro',
    practice: 'calisma-alanlari',
    team: 'ekibimiz',
    approach: 'surec',
    contact: 'iletisim',
  } satisfies Record<SectionKey, string>,
  nav: [
    { key: 'top', label: 'Anasayfa' },
    { key: 'practice', label: 'Çalışma Alanları' },
    { key: 'team', label: 'Ekibimiz' },
    { key: 'questions', label: 'Sorular' },
    { key: 'contact', label: 'İletişim' },
  ] as { key: NavKey; label: string }[],
  header: {
    sub: 'Hukuk Bürosu',
    cta: 'Bize ulaşın',
    menuOpen: 'Menüyü aç',
    menuClose: 'Menüyü kapat',
    navLabel: 'Ana menü',
    langLabel: 'Dil seçimi',
  },
  hero: {
    titleLines: ['Münakaşadan', '*müzakereye*'],
    lead: 'Ankara’da faaliyet gösteren Kobya Hukuk Bürosu, müvekkillerine; mevzuat uyum danışmanlığından sözleşme süreçlerinin yönetimine, medeni ve ceza hukukundan icra-iflas hukukuna uzanan geniş bir yelpazede; KVKK danışmanlığı, sözleşmelerin hazırlanması ve müzakeresi, iş hukuku alanında danışmanlık, ticari uyuşmazlıklar ile dava ve tahkim, fikri mülkiyet ve rekabet hukuku, gayrimenkul-kira ve icra-tahsilat süreçleri ile tüketici hukuku ve e-ticaret uyumu başta olmak üzere pek çok alanda güvenilir ve etkin hukuki destek sağlamaktadır.',
    cta: 'İletişime geçin',
  },
  office: {
    principlesLabel: 'İlkelerimiz',
    principles: [
      { title: 'Gizlilik', text: 'Büroyla paylaşılan her bilgi, meslek sırrı kapsamında titizlikle korunur.' },
      { title: 'Özen', text: 'Her dosya, mevzuat ve güncel yargı kararları ışığında ayrıntılı biçimde incelenir.' },
      { title: 'Açıklık', text: 'Süreç, olası sonuçlar ve riskler anlaşılır bir dille paylaşılır.' },
      { title: 'Ulaşılabilirlik', text: 'Müvekkiller, dosyalarındaki gelişmelerden zamanında haberdar edilir.' },
    ],
  },
  practice: {
    titleLines: ['Çalışma', '*alanları*'],
    intro:
      'Büro, aşağıdaki alanlarda hukuki danışmanlık ve dava takibi hizmeti vermektedir. Ayrıntılar için başlıkları açabilirsiniz.',
    areas: [
      {
        title: 'Sözleşmeler Hukuku ve Mevzuat Uyum',
        text: 'Ticari ve bireysel sözleşmelerin hazırlanması, müzakeresi ve incelenmesinden yürürlükteki mevzuata uyum süreçlerine kadar danışmanlık sunuyor; olası hukuki riskleri önceden tespit ederek tarafların haklarını güvence altına alıyoruz.',
      },
      {
        title: 'İcra ve İflas Hukuku',
        text: 'Alacakların takibi, icra takip süreçlerinin yürütülmesi, itiraz ve şikâyet başvuruları, haciz ve tahsilat işlemleri ile iflas ve konkordato süreçlerinde alacaklı ve borçlu taraflara etkin hukuki destek sağlıyor; hak kayıplarını önlemek adına süreci baştan sona titizlikle takip ediyoruz.',
      },
      {
        title: 'Medeni Hukuk',
        text: 'Kişiler hukuku, aile hukuku, miras hukuku ve eşya hukuku başta olmak üzere medeni hukukun tüm alanlarında danışmanlık ve dava takibi hizmeti sunuyoruz; boşanma, velayet, nafaka, mal paylaşımı, miras paylaşımı ve mülkiyet uyuşmazlıkları gibi konularda müvekkillerimize hukuki destek sağlıyoruz.',
      },
      {
        title: 'Ceza Hukuku',
        text: 'Soruşturma ve kovuşturma aşamalarında şüpheli, sanık ve mağdur taraflara hukuki destek sunuyoruz; gözaltı ve tutukluluk süreçlerinden duruşma takibine, itiraz ve istinaf başvurularına kadar ceza yargılamasının her aşamasında hukuki temsil sağlıyoruz.',
      },
      {
        title: 'Fikri Mülkiyet Hukuku',
        text: 'Marka, patent, tasarım ve telif hakları başta olmak üzere fikri mülkiyet haklarının tesciline, korunmasına ve devrine ilişkin süreçlerde danışmanlık sunuyoruz; hak ihlallerine karşı açılan davalarda ve lisans sözleşmelerinin hazırlanmasında hukuki temsil sağlıyoruz.',
      },
    ],
  },
  team: {
    titleLines: ['*Ekibimiz*'],
    ring: 'KOBYA HUKUK BÜROSU · ANKARA · ',
    profileLabel: 'LinkedIn profili',
    members: [
      {
        key: 'vedat' as const,
        prefix: 'Av.',
        name: 'Vedat Murathan Kobya',
        role: 'Avukat',
        bio: [
          'Av. Vedat Murathan Kobya, Atılım Üniversitesi Hukuk Fakültesi mezunudur. Mesleğe başlamadan önce çeşitli hukuk bürolarında stajyer olarak çalışmış; bankacılık, sigorta ve telekomünikasyon sektörlerine ait icra takip dosyalarının yürütülmesi, sözleşme süreçlerinin yönetimi ile dilekçe ve ihtarname hazırlığı konularında deneyim kazanmıştır.',
          'Kobya Hukuk Bürosu’nu kurarak serbest avukatlık faaliyetine geçmiştir. Farklı dönemlerde teknoloji ve elektronik para sektörlerinde faaliyet gösteren şirketlerde şirket avukatı olarak görev alarak hukuki danışmanlık sağlamıştır.',
          'Büro avukatlığı ile şirket bünyesinde avukatlık deneyimini bir araya getiren bu birikim, büronun çalışma anlayışının temelini oluşturur.',
        ],
      },
      {
        key: 'aykut' as const,
        prefix: 'Av.',
        name: 'Aykut Sait Hanedan',
        role: 'Avukat',
        bio: [
          'Ankara Üniversitesi Hukuk Fakültesi mezunu olup, aynı üniversitede Özel Hukuk (Sigorta Hukuku) alanında yüksek lisansını tamamlamıştır. Aldığı burs ile Almanya’da dil eğitimi alarak yurt dışı deneyimi kazanmıştır.',
          'Mesleki hayatı boyunca icra ve iflas hukuku, iş hukuku, şirketler hukuku, ticaret hukuku, sigorta hukuku, tüketici hukuku, fikri ve sınai mülkiyet hukuku ile kamulaştırma hukuku gibi farklı alanlarda çalışma fırsatı bulmuş; iflas idareleri bünyesinde vekillik ve iflas idare memurluğu görevlerini üstlenmiş, sigorta uyuşmazlıklarında Sigorta Tahkim Komisyonu ve mahkemeler nezdinde vekillik yapmıştır.',
          'İngilizce (B2) ve Almanca (C1) seviyesinde yabancı dil bilgisine sahiptir. Farklı hukuk bürolarında edindiği çok yönlü deneyim, sunduğu hukuki hizmetin temelini oluşturmaktadır.',
        ],
      },
      {
        key: 'refik' as const,
        prefix: '',
        name: 'Refik Cemal Hanedan',
        role: 'Danışman',
        bio: [
          'Refik Cemal Hanedan, kariyerine ticaret hukuku alanında hâkimlik yaparak devam etmiş ve bir dönem Ankara Ticaret Mahkemesi Başkanlığı görevini yürütmüştür.',
          '2010 yılında Hâkimler ve Savcılar Yüksek Kurulu tarafından yapılan seçimle Yargıtay üyeliğine seçilmiş, 2014 yılında ise 11. Hukuk Dairesi Üyesi sıfatıyla Yargıtay Birinci Başkanlık Kurulu’na yeniden seçilerek bu kuruldaki görevini sürdürmüştür.',
          'Uzun yıllara dayanan yargı tecrübesiyle ticaret hukuku ile icra ve iflas hukuku başta olmak üzere çeşitli alanlarda önemli içtihatların oluşmasına katkı sağlamış, kariyerini Yargıtay 12. Hukuk Dairesi Üyesi olarak tamamlayarak emekliye ayrılmıştır.',
          'Hâlihazırda Sigorta Tahkim Komisyonu bünyesinde Uyuşmazlık Hakemi olarak görev yapmakta, aynı zamanda Kobya Hukuk Bürosu’na danışmanlık vermektedir.',
        ],
      },
    ],
  },
  approach: {
    titleLines: ['Çalışma', '*şeklimiz*'],
    intro: 'Her dosyada izlenen yol; sade, öngörülebilir ve dört adımdan oluşur.',
    steps: [
      {
        title: 'İlk görüşme',
        text: 'Randevu ile yapılan ilk görüşmede talebinizi dinler, elinizdeki belge ve bilgileri birlikte gözden geçiririz.',
      },
      {
        title: 'Hukuki değerlendirme',
        text: 'Konunun hukuki çerçevesini, izlenebilecek yolları ve olası riskleri açık bir dille ortaya koyarız.',
      },
      {
        title: 'Takip',
        text: 'Dosyanızı mevzuat ve güncel yargı kararları ışığında, her aşamasında titizlikle yürütürüz.',
      },
      {
        title: 'Bilgilendirme',
        text: 'Süreçteki her önemli gelişmeyi zamanında ve anlaşılır biçimde sizinle paylaşırız.',
      },
    ],
    ctaTitle: 'Görüşme için randevu alın',
    ctaAction: 'İletişim bilgileri',
  },
  contact: {
    heading: 'İletişim',
    lead: 'Görüşmeler randevu ile yapılmaktadır. Randevu ve bilgi talepleriniz için telefon, WhatsApp veya e-posta yoluyla büroya ulaşabilirsiniz.',
    phone: { label: 'Telefon', action: 'Arayın' },
    whatsapp: { label: 'WhatsApp', action: 'Mesaj gönderin', message: 'Merhaba, randevu almak istiyorum.' },
    email: { label: 'E-posta', action: 'E-posta gönderin' },
    address: 'Adres',
    appointment: 'Randevu ile',
    hours: 'Çalışma saatleri',
    hoursRows: [
      { day: 'Pazartesi', value: '09.00 – 18.00' },
      { day: 'Salı', value: '09.00 – 18.00' },
      { day: 'Çarşamba', value: '09.00 – 18.00' },
      { day: 'Perşembe', value: '09.00 – 18.00' },
      { day: 'Cuma', value: '09.00 – 18.00' },
      { day: 'Cumartesi', value: '10.00 – 15.00' },
      { day: 'Pazar', value: 'Kapalı' },
    ],
    map: {
      load: 'Haritayı göster',
      open: 'Google Haritalar’da aç',
      notice: 'Harita, Google Haritalar üzerinden yüklenir.',
      frameTitle: 'Kobya Hukuk Bürosu konumu',
    },
  },
  /*
   * The question-and-answer area. The questions themselves live in content/questions/ as YAML, so
   * the attorney can publish one without touching the code; this block is only the frame around
   * them. It is never called a blog.
   */
  questions: {
    /** Path of the index page, per language. Both are also the URL prefix of every question. */
    path: '/sorular/',
    meta: {
      title: 'Sorular | Kobya Hukuk Bürosu – Ankara',
      description:
        'Kobya Hukuk Bürosu’na sık sorulan sorular ve bilgilendirici cevapları: randevu ve vekaletname süreçleri, belgeler, dava ve icra takibi hakkında merak edilenler.',
    },
    titleLines: ['Sık sorulan', '*sorular*'],
    intro:
      'Büroya en çok ulaşan sorular ve bilgilendirici cevapları. Metinler genel niteliktedir; somut bir olay için avukata danışılması gerekir.',
    empty: 'Sorular hazırlanıyor.',
    readMore: 'Cevabı okuyun',
    all: 'Tüm sorular',
    related: 'Diğer sorular',
    dateLabel: 'Güncellenme',
    tagsLabel: 'Etiketler',
    turkishOnly: 'Bu sorunun cevabı yalnızca Türkçe.',
    turkishOnlyAction: 'Türkçe cevabı görün',
    backHome: 'Anasayfa',
    cta: {
      title: 'Sorunuz burada yok mu?',
      text: 'Durumunuza özgü sorular için büroya doğrudan ulaşabilirsiniz. Görüşmeler randevu ile yapılır.',
      action: 'İletişim bilgileri',
    },
  },
  footer: {
    resourcesTitle: 'Diğer Bağlantılar',
    declarationTitle: 'Serbest Avukat Beyanı',
    declaration:
      'Kobya Hukuk Bürosu; 5651 sayılı Kanun’un ek 4. maddesi veya başkaca mevzuat kapsamında hiçbir müvekkilinin temsilcisi, irtibat bürosu ya da şubesi değildir; büromuz avukatları, müvekkillerinin vekâletnamesiyle sınırlı yetki dâhilinde, onların talimatları ve Avukatlık Kanunu çerçevesinde bağımsız avukatlık hizmeti vermektedir. Türk hukukunda avukatların belirli alanlarla sınırlı çalışması zorunlu olmadığından, sitede yer alan çalışma alanları yalnızca büromuzun hâlihazırda yürüttüğü işleri göstermek amacıyla belirtilmiştir. Sitedeki bilgiler, değişen mevzuat ve içtihatlar karşısında güncelliği garanti edilmeksizin sunulmakta olup, somut ihtiyaçlarda avukata danışılması gerekmekte ve bu içeriklerden doğabilecek herhangi bir sorumluluk kabul edilmemektedir.',
    privacy: 'Bu site çerez kullanmaz. Harita, yalnızca talep etmeniz hâlinde Google Haritalar üzerinden yüklenir.',
    rights: 'Tüm hakları saklıdır.',
    backToTop: 'Başa dön',
  },
};

const en: typeof tr = {
  locale: 'en_US',
  brand: firm.nameEn,
  skip: 'Skip to content',
  meta: {
    title: 'Kobya Law Office | Vedat Murathan Kobya, Lawyer in Ankara',
    description:
      'Kobya Law Office, Ankara: advice and litigation in contracts and compliance, enforcement and bankruptcy, civil law, criminal law and intellectual property.',
    imageAlt: 'Kobya Law Office — Attorney Vedat Murathan Kobya, Gölbaşı / Ankara',
  },
  ids: {
    office: 'firm',
    practice: 'practice',
    team: 'team',
    approach: 'process',
    contact: 'contact',
  },
  nav: [
    { key: 'top', label: 'Home' },
    { key: 'practice', label: 'Practice Areas' },
    { key: 'team', label: 'Our Team' },
    { key: 'questions', label: 'Questions' },
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
    titleLines: ['From dispute', 'to *negotiation*'],
    lead: 'Based in Ankara, Kobya Law Office provides reliable and effective legal support across a wide range of matters: from regulatory compliance advice to the management of contract processes, from civil and criminal law to enforcement and bankruptcy law, including data protection (KVKK) advice, the drafting and negotiation of contracts, employment law advice, commercial disputes, litigation and arbitration, intellectual property and competition law, real estate and lease matters, enforcement and collection, consumer law and e-commerce compliance.',
    cta: 'Get in touch',
  },
  office: {
    principlesLabel: 'Our principles',
    principles: [
      {
        title: 'Confidentiality',
        text: 'Everything shared with the office is protected under the duty of professional secrecy.',
      },
      { title: 'Diligence', text: 'Every matter is examined in detail in light of current legislation and case law.' },
      { title: 'Clarity', text: 'The process, possible outcomes and risks are explained in plain terms.' },
      { title: 'Accessibility', text: 'Clients are kept informed of developments in their matter in a timely manner.' },
    ],
  },
  practice: {
    titleLines: ['Practice', '*areas*'],
    intro: 'The office provides legal counsel and representation in the areas below. Open a heading for more detail.',
    areas: [
      {
        title: 'Contracts & Regulatory Compliance',
        text: 'We advise on everything from the drafting, negotiation and review of commercial and individual contracts to compliance with applicable legislation, identifying legal risks in advance and securing the rights of the parties.',
      },
      {
        title: 'Enforcement & Bankruptcy',
        text: 'We support creditors and debtors in debt collection, enforcement proceedings, objections and complaints, attachment and collection, and in bankruptcy and composition proceedings, following each matter closely from start to finish to prevent any loss of rights.',
      },
      {
        title: 'Civil Law',
        text: 'We advise and litigate across civil law, including the law of persons, family law, inheritance law and property law: divorce, custody, alimony, division of matrimonial property, inheritance shares and ownership disputes.',
      },
      {
        title: 'Criminal Law',
        text: 'We support suspects, defendants and victims at the investigation and prosecution stages, with representation at every phase of criminal proceedings, from custody and detention to hearings, objections and appeals.',
      },
      {
        title: 'Intellectual Property',
        text: 'We advise on the registration, protection and transfer of intellectual property rights, including trademarks, patents, designs and copyright, and provide representation in infringement actions and in the drafting of licence agreements.',
      },
    ],
  },
  team: {
    titleLines: ['*Our team*'],
    ring: 'KOBYA LAW OFFICE · ANKARA · ',
    profileLabel: 'LinkedIn profile',
    members: [
      {
        key: 'vedat',
        prefix: '',
        name: 'Vedat Murathan Kobya',
        role: 'Attorney',
        bio: [
          'Vedat Murathan Kobya is a graduate of Atılım University Faculty of Law. Before admission to the bar, Kobya trained at several law firms, gaining experience in enforcement proceedings for the banking, insurance and telecommunications sectors, in contract management, and in the drafting of petitions and formal notices.',
          'Kobya founded Kobya Law Office as an independent practice, and has also served as in-house counsel for companies in the technology and electronic money sectors.',
          'This combination of law-firm and in-house experience forms the foundation of the way the office works.',
        ],
      },
      {
        key: 'aykut',
        prefix: '',
        name: 'Aykut Sait Hanedan',
        role: 'Attorney',
        bio: [
          'Aykut Sait Hanedan is a graduate of Ankara University Faculty of Law and holds a master’s degree in Private Law (Insurance Law) from the same university, with language studies in Germany on a scholarship.',
          'Professional practice has spanned enforcement and bankruptcy law, employment law, corporate law, commercial law, insurance law, consumer law, intellectual and industrial property law and expropriation law, including service as counsel and as a bankruptcy administrator within bankruptcy estates, and representation before the Insurance Arbitration Commission and the courts in insurance disputes.',
          'Languages: English (B2) and German (C1). The breadth of experience gained at different law firms forms the basis of the legal service provided.',
        ],
      },
      {
        key: 'refik',
        prefix: '',
        name: 'Refik Cemal Hanedan',
        role: 'Consultant',
        bio: [
          'Refik Cemal Hanedan served as a judge in the field of commercial law and, for a period, presided over the Ankara Commercial Court.',
          'Elected to the Court of Cassation in 2010 by the Council of Judges and Prosecutors, and re-elected in 2014 to the First Presidency Board of the Court of Cassation as a member of its 11th Civil Chamber.',
          'Decades of judicial experience contributed to significant case law, particularly in commercial law and in enforcement and bankruptcy law. The career concluded as a member of the 12th Civil Chamber of the Court of Cassation.',
          'Currently serves as an arbitrator at the Insurance Arbitration Commission and advises Kobya Law Office.',
        ],
      },
    ],
  },
  approach: {
    titleLines: ['How we', '*work*'],
    intro: 'Every matter follows a clear and predictable path of four steps.',
    steps: [
      {
        title: 'First meeting',
        text: 'At an initial meeting, held by appointment, we listen to your request and review your documents together.',
      },
      {
        title: 'Legal assessment',
        text: 'We set out the legal framework, the available options and the possible risks in plain language.',
      },
      {
        title: 'Handling',
        text: 'We conduct your matter carefully at every stage, in light of current legislation and case law.',
      },
      {
        title: 'Keeping you informed',
        text: 'We share every significant development with you promptly and in clear terms.',
      },
    ],
    ctaTitle: 'Arrange an appointment',
    ctaAction: 'Contact details',
  },
  contact: {
    heading: 'Contact',
    lead: 'Meetings are held by appointment. To arrange an appointment or request information, please reach the office by phone, WhatsApp or e-mail.',
    phone: { label: 'Phone', action: 'Call' },
    whatsapp: { label: 'WhatsApp', action: 'Send a message', message: 'Hello, I would like to make an appointment.' },
    email: { label: 'E-mail', action: 'Write to us' },
    address: 'Address',
    appointment: 'By appointment',
    hours: 'Office hours',
    hoursRows: [
      { day: 'Monday', value: '09:00 – 18:00' },
      { day: 'Tuesday', value: '09:00 – 18:00' },
      { day: 'Wednesday', value: '09:00 – 18:00' },
      { day: 'Thursday', value: '09:00 – 18:00' },
      { day: 'Friday', value: '09:00 – 18:00' },
      { day: 'Saturday', value: '10:00 – 15:00' },
      { day: 'Sunday', value: 'Closed' },
    ],
    map: {
      load: 'Show map',
      open: 'Open in Google Maps',
      notice: 'The map is loaded from Google Maps.',
      frameTitle: 'Kobya Law Office location',
    },
  },
  questions: {
    path: '/en/questions/',
    meta: {
      title: 'Questions | Kobya Law Office – Ankara',
      description:
        'Frequently asked questions answered by Kobya Law Office in Ankara: appointments, powers of attorney, documents, litigation and enforcement proceedings.',
    },
    titleLines: ['Frequently asked', '*questions*'],
    intro:
      'The questions the office is asked most often, answered for information only. Each answer is general; specific matters call for advice from an attorney.',
    empty: 'Questions are on their way.',
    readMore: 'Read the answer',
    all: 'All questions',
    related: 'Other questions',
    dateLabel: 'Updated',
    tagsLabel: 'Tags',
    turkishOnly: 'This answer is available in Turkish only.',
    turkishOnlyAction: 'Read it in Turkish',
    backHome: 'Home',
    cta: {
      title: 'Not the question you had?',
      text: 'For questions about your own situation, please contact the office directly. Meetings are held by appointment.',
      action: 'Contact details',
    },
  },
  footer: {
    resourcesTitle: 'Other links',
    declarationTitle: 'Independent Practice Statement',
    declaration:
      'Kobya Law Office is not the representative, liaison office or branch of any client within the meaning of additional article 4 of Law No. 5651 or any other legislation. The attorneys of the office provide independent legal services within the limits of the authority granted by their clients’ powers of attorney, in line with their clients’ instructions and within the framework of the Attorneys’ Act. Since Turkish law does not require attorneys to restrict themselves to particular fields, the practice areas listed on this site are given only to show the work the office currently handles. The information on this site is provided without any guarantee that it remains current in the face of changing legislation and case law; an attorney should be consulted for specific needs, and no liability is accepted for anything arising from this content.',
    privacy: 'This site uses no cookies. The map is loaded from Google Maps only if you request it.',
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },
};

export const content: Record<Lang, typeof tr> = { tr, en };
