import resumeManifest from './resume-manifest.cjs';

/**
 * Canonical, evidence-aware professional facts.
 *
 * Localized copy can still live in the message catalog, but repeated facts
 * (titles, dates, metrics, routes, and architecture boundaries) belong here.
 * Consumers must check `publish` before exposing a fact publicly.
 */

export const EVIDENCE_STATUS = Object.freeze({
  verifiedPublic: 'verifiedPublic',
  verifiedPrivate: 'verifiedPrivate',
  hypothetical: 'hypothetical',
  unconfirmed: 'unconfirmed',
  doNotPublish: 'doNotPublish',
});

export const careerFacts = Object.freeze({
  identity: {
    name: 'Yousef Kakhki',
    localizedName: {
      en: 'Yousef Kakhki',
      fa: 'یوسف کاخکی',
    },
    primaryTitle: {
      en: 'Senior Backend Engineer & Technical Lead',
      fa: 'مهندس ارشد بک‌اند و رهبر فنی',
    },
    specializations: [
      'Distributed Systems',
      'Real-Time Media',
      'Platform Engineering',
      'Embedded Linux',
    ],
    description: {
      en: 'Senior backend engineer and technical lead working across distributed systems, real-time media, platform engineering, and Linux.',
      fa: 'مهندس ارشد بک‌اند و رهبر فنی در حوزهٔ سیستم‌های توزیع‌شده، رسانهٔ بلادرنگ، مهندسی پلتفرم و لینوکس.',
    },
    surfaces: ['homepage', 'work', 'resume', 'metadata', 'structuredData'],
  },

  contact: {
    location: 'Tehran, Iran',
    email: 'me@kakhki.me',
    website: 'https://kakhki.me',
    linkedin: 'https://www.linkedin.com/in/yousefkakhki',
  },

  metrics: {
    backendExperience: {
      id: 'backendExperience',
      value: '10+',
      localizedValue: { en: '10+', fa: '۱۰+' },
      label: { en: 'years in backend and systems', fa: 'سال تجربهٔ بک‌اند و سیستم‌ها' },
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { homepage: true, work: true, resume: true, metadata: true },
    },
    platformConcurrency: {
      id: 'platformConcurrency',
      value: '5,000+',
      localizedValue: { en: '5,000+', fa: '۵٬۰۰۰+' },
      label: { en: 'platform-level concurrent users', fa: 'کاربر همزمان در سطح پلتفرم' },
      qualifier: {
        en: 'Platform-level concurrency; not 5,000 publishers, one room, or one SFU.',
        fa: 'همزمانی در سطح پلتفرم؛ نه ۵٬۰۰۰ ناشر، یک اتاق یا یک SFU.',
      },
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { homepage: true, work: true, resume: true, caseStudy: true, metadata: false },
    },
    orderMatchingLatency: {
      id: 'orderMatchingLatency',
      value: 'sub-100 ms',
      localizedValue: { en: 'sub-100 ms', fa: 'کمتر از ۱۰۰ میلی‌ثانیه' },
      label: { en: 'matching-engine latency', fa: 'تأخیر موتور تطبیق سفارش' },
      evidenceStatus: EVIDENCE_STATUS.unconfirmed,
      publish: { homepage: false, work: false, resume: false, caseStudy: false },
    },
    uptime: {
      id: 'uptime',
      value: '99.9%',
      localizedValue: { en: '99.9%', fa: '۹۹٫۹٪' },
      label: { en: 'uptime', fa: 'آپ‌تایم' },
      evidenceStatus: EVIDENCE_STATUS.unconfirmed,
      publish: { homepage: false, work: false, resume: false, caseStudy: false },
    },
  },

  technologyGroups: [
    {
      id: 'distributed-backend',
      label: { en: 'Distributed backend', fa: 'بک‌اند توزیع‌شده' },
      technologies: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'NATS JetStream'],
    },
    {
      id: 'realtime-media',
      label: { en: 'Real-time media', fa: 'رسانهٔ بلادرنگ' },
      technologies: ['WebRTC', 'LiveKit', 'HLS'],
    },
    {
      id: 'transactional-systems',
      label: { en: 'Transactional systems', fa: 'سامانه‌های تراکنشی' },
      technologies: ['Ledgers', 'Idempotency', 'Reconciliation'],
    },
    {
      id: 'linux-edge',
      label: { en: 'Linux and edge', fa: 'لینوکس و سامانه‌های لبه' },
      technologies: ['Embedded Linux', 'OTA', 'Networking'],
    },
    {
      id: 'delivery-operations',
      label: { en: 'Delivery and operations', fa: 'تحویل و عملیات' },
      technologies: ['Docker', 'CI/CD', 'Observability'],
    },
  ],

  relocation: {
    statement: {
      en: 'Open to employer-supported relocation in Germany and the Netherlands, plus selected remote engineering or consulting engagements.',
      fa: 'برای جابه‌جایی با حمایت کارفرما به آلمان و هلند، و همچنین همکاری‌های منتخب مهندسی یا مشاورهٔ دورکار آمادهٔ گفتگو هستم.',
    },
    targetLocations: ['Germany', 'Netherlands'],
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    publish: { homepage: true, work: true, resume: true, metadata: false },
  },

  roles: [
    {
      id: 'honar-amoozesh',
      company: 'HonarAmoozesh',
      engagementType: 'project contract',
      title: { en: 'Solutions Architect', fa: 'معمار راهکار' },
      publicDate: { en: '2025 · project contract', fa: '۲۰۲۵ · قرارداد پروژه‌ای' },
      conflictingSourceVariants: ['Jul 2025 - Nov 2025', 'Sep 2025 - Present'],
      technologies: ['WebRTC (LiveKit)', 'delayed HLS playback', 'NATS JetStream', 'Go'],
      summary: {
        en: [
          'Architected live WebRTC delivery for 5,000+ concurrent users at platform level.',
          'Used NATS JetStream and Go for application coordination; HLS playback was a separate post-session path available hours later.',
        ],
        fa: [
          'معماری تحویل زندهٔ WebRTC را برای بیش از ۵٬۰۰۰ کاربر همزمان در سطح پلتفرم انجام دادم.',
          'برای هماهنگی لایهٔ کاربرد از NATS JetStream و Go استفاده شد؛ بازپخش HLS یک مسیر جداگانهٔ پس از جلسه بود که چند ساعت بعد در دسترس قرار می‌گرفت.',
        ],
      },
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { homepage: true, work: true, resume: true, caseStudy: true, metadata: false },
    },
    {
      id: 'capitalino',
      company: 'Capitalino',
      engagementType: 'employment',
      title: { en: 'Head of Software & AI Development', fa: 'رئیس توسعهٔ نرم‌افزار و هوش مصنوعی' },
      publicDate: { en: 'Oct 2023 – Jun 2025', fa: 'اکتبر ۲۰۲۳ – ژوئن ۲۰۲۵' },
      technologies: ['Docker Swarm', 'Python', 'Node.js'],
      summary: {
        en: [
          'Led a four-person team delivering a crypto-to-fiat payment gateway and AI hologram installation.',
          'Led a four-person team across backend engineering, infrastructure, and event delivery. The AI hologram installation received the Best Booth award at ITEX 2024.',
          'Designed and implemented the backend and operational workflow for a crypto-to-fiat payment gateway, including idempotency, transaction boundaries, and reconciliation.',
        ],
        fa: [
          'رهبری تیمی چهار نفره برای تحویل درگاه پرداخت رمزارز به فیات و نصب هولوگرام هوش مصنوعی.',
          'رهبری تیمی چهار نفره در مهندسی بک‌اند، زیرساخت و تحویل رویداد. نصب هولوگرام هوش مصنوعی در ITEX 2024 جایزهٔ بهترین غرفه را دریافت کرد.',
          'بک‌اند و جریان عملیاتی یک درگاه رمزارز به فیات، شامل idempotency، مرزهای تراکنش و تطبیق، را طراحی و پیاده‌سازی کردم.',
        ],
      },
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { homepage: true, work: true, resume: true, caseStudy: true, metadata: false },
    },
    {
      id: 'avin-avisa',
      company: 'Avin Avisa',
      engagementType: 'employment',
      title: { en: 'Senior Backend Engineer', fa: 'مهندس ارشد بک‌اند' },
      publicDate: { en: 'Apr 2021 – Sep 2023', fa: 'آوریل ۲۰۲۱ – سپتامبر ۲۰۲۳' },
      technologies: ['Node.js', 'Web3.js', 'PostgreSQL', 'Redis'],
      summary: {
        en: [
          'Built backend workflows for financial trading and transactional systems with PostgreSQL, Redis, and Web3.js.',
          'Worked on matching workflows, order-book recovery, and transactional ledger semantics.',
        ],
        fa: [
          'ساخت جریان‌های بک‌اند برای سامانه‌های معاملات مالی و تراکنشی با PostgreSQL، Redis و Web3.js.',
          'کار روی جریان‌های تطبیق سفارش، بازیابی دفتر سفارش و منطق دفترکل تراکنشی.',
        ],
      },
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { homepage: true, work: true, resume: true, caseStudy: true, metadata: false },
    },
    {
      id: 'batna',
      company: 'Batna',
      engagementType: 'employment',
      title: { en: 'Systems Engineer (Embedded Linux)', fa: 'مهندس سیستم (لینوکس نهفته)' },
      publicDate: { en: 'Sep 2019 – Mar 2021', fa: 'سپتامبر ۲۰۱۹ – مارس ۲۰۲۱' },
      technologies: ['Yocto', 'C++', 'Linux Kernel'],
      summary: {
        en: ['Modified embedded Linux distributions and designed atomic OTA workflows spanning firmware delivery, rollback safeguards, kernel integration, and release pipelines.'],
        fa: ['توزیع‌های لینوکس نهفته را تغییر دادم و جریان‌های OTA اتمیک شامل تحویل firmware، بازگشت امن، یکپارچه‌سازی هسته و خط انتشار را طراحی کردم.'],
      },
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { homepage: false, work: false, resume: true, caseStudy: true, metadata: false },
    },
    {
      id: 'azma-data-structure',
      company: 'Azma Data Structure',
      engagementType: 'employment',
      title: { en: 'Android Systems Developer', fa: 'توسعه‌دهندهٔ سیستم‌های اندروید' },
      publicDate: { en: 'Apr 2016 – Aug 2019', fa: 'آوریل ۲۰۱۶ – اوت ۲۰۱۹' },
      technologies: ['Android NDK', 'C++', 'Java'],
      summary: {
        en: ['Developed native modules and offline-first synchronization systems.'],
        fa: ['توسعهٔ ماژول‌های native و سامانه‌های همگام‌سازی offline-first.'],
      },
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { homepage: false, work: false, resume: true, caseStudy: true, metadata: false },
    },
  ],

  architecture: {
    honarAmoozesh: {
      actual: {
        label: { en: 'Actual engagement', fa: 'پیاده‌سازی واقعی' },
        livePath: { en: 'LiveKit/WebRTC served interactive participation.', fa: 'LiveKit/WebRTC مشارکت تعاملی را در جلسهٔ زنده ارائه می‌کرد.' },
        coordinationPath: { en: 'NATS JetStream and Go supported application coordination.', fa: 'NATS JetStream و Go از هماهنگی لایهٔ کاربرد پشتیبانی می‌کردند.' },
        delayedPath: { en: 'HLS was a separate post-session playback path available later.', fa: 'HLS مسیر جداگانهٔ بازپخش پس از جلسه بود که بعداً در دسترس قرار می‌گرفت.' },
        excludedInterpretation: { en: 'Do not describe HLS as a current-session fallback.', fa: 'HLS نباید به‌عنوان fallback همان جلسه توصیف شود.' },
      },
      referenceDesign: {
        label: { en: 'Hypothetical reference design', fa: 'معماری مرجع فرضی' },
        publish: false,
        evidenceStatus: EVIDENCE_STATUS.hypothetical,
      },
    },
  },

  targetRoles: [
    'Senior Backend Engineer',
    'Staff / Lead Backend Engineer',
    'Platform Engineer',
    'Real-Time Media Engineer',
    'Solutions Architect',
  ],

  consulting: [
    {
      id: 'realtime-media-review',
      title: { en: 'WebRTC / LiveKit architecture and capacity review', fa: 'بازبینی معماری و ظرفیت WebRTC / LiveKit' },
      output: { en: 'Architecture brief, capacity model, and prioritized risks.', fa: 'بریف معماری، مدل ظرفیت و فهرست ریسک‌های اولویت‌بندی‌شده.' },
    },
    {
      id: 'backend-reliability-review',
      title: { en: 'Distributed backend reliability and failure-mode review', fa: 'بازبینی قابلیت اطمینان و حالت‌های خرابی بک‌اند توزیع‌شده' },
      output: { en: 'Risk register, failure-mode map, and implementation roadmap.', fa: 'دفتر ثبت ریسک، نقشهٔ حالت‌های خرابی و نقشهٔ راه پیاده‌سازی.' },
    },
    {
      id: 'payment-workflow-review',
      title: { en: 'Payment workflow and idempotency architecture review', fa: 'بازبینی معماری جریان پرداخت و idempotency' },
      output: { en: 'Sequence diagrams, transaction-boundary notes, and code/configuration review.', fa: 'نمودارهای توالی، یادداشت مرزهای تراکنش و بازبینی کد و پیکربندی.' },
    },
    {
      id: 'linux-ota-review',
      title: { en: 'Linux / OTA delivery architecture review', fa: 'بازبینی معماری تحویل Linux / OTA' },
      output: { en: 'Delivery architecture brief and safeguard checklist.', fa: 'بریف معماری تحویل و چک‌لیست سازوکارهای حفاظتی.' },
    },
  ],

  languages: [
    { name: 'English', level: 'IELTS 7.5', evidenceStatus: EVIDENCE_STATUS.verifiedPrivate, publish: true },
    { name: 'Persian', level: 'Native', evidenceStatus: EVIDENCE_STATUS.verifiedPublic, publish: true },
    { name: 'French', level: 'Basic', evidenceStatus: EVIDENCE_STATUS.unconfirmed, publish: false },
  ],

  education: [
    {
      degree: 'M.Sc. in Computer Science (System Design)',
      institution: 'Amirkabir University of Technology (Tehran Polytechnic)',
      location: 'Tehran, Iran',
      publicDate: '2018 – 2021',
      detail: 'GPA 3.8/4.0',
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { resume: true },
    },
    {
      degree: 'B.Sc. in Computer Science',
      institution: 'University of Bojnurd',
      location: 'Bojnurd, Iran',
      publicDate: '2012 – 2017',
      evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
      publish: { resume: true },
    },
  ],

  testimonials: [
    {
      id: 'ali-mohammadian',
      displayedName: 'Ali Mohammadian',
      displayedRole: 'CEO, Capitalino',
      asset: '/recommendation-ali-mohammadian.jpg',
      evidenceStatus: EVIDENCE_STATUS.unconfirmed,
      publish: false,
      reason: 'Attribution and exact source wording require owner confirmation.',
    },
    {
      id: 'emran-mohades',
      displayedName: 'Emran Mohades',
      displayedRole: 'COO, Capitalino',
      asset: '/recommendation-sara-mozaffari.jpg',
      evidenceStatus: EVIDENCE_STATUS.unconfirmed,
      publish: false,
      reason: 'The asset filename and displayed attribution do not currently establish provenance.',
    },
  ],

  resume: {
    publicUrl: resumeManifest.publicUrl,
    legacyUrls: resumeManifest.legacyUrls,
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    publish: true,
  },
});

export function localized(value, locale = 'en') {
  if (typeof value === 'string') return value;
  return value?.[locale] || value?.en || '';
}

export function getLocalizedRole(role, locale = 'en') {
  return {
    ...role,
    title: localized(role.title, locale),
    publicDate: localized(role.publicDate, locale),
    summary: (role.summary?.[locale] || role.summary?.en || []).slice(),
  };
}

export function getPublishableMetric(metric, surface) {
  return Boolean(metric?.publish?.[surface]) && metric.evidenceStatus === EVIDENCE_STATUS.verifiedPublic;
}
