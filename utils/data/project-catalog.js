import { careerFacts, localized } from './career-facts';
import publicationManifest from './project-publication-manifest.cjs';
import mediaManifest from './project-media-manifest.cjs';
import artifactManifest from './project-artifact-manifest.cjs';

export const { PROJECT_PUBLICATION_TYPES } = publicationManifest;
const { getPublishableProjectMedia } = mediaManifest;
const {
  getApprovedProjectArtifacts,
  projectSourceAvailability,
} = artifactManifest;

export const PROJECT_EVIDENCE_LEVELS = Object.freeze({
  publicEvidence: 'public-evidence',
  boundedPublicSummary: 'bounded-public-summary',
  ownerConfirmationRequired: 'owner-confirmation-required',
});

const projectContent = [
  {
    id: 9,
    slug: 'real-time-learning-platform',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.publicEvidence,
    outcomeType: 'implementation-scope',
    visualKind: 'realtime-learning',
    featured: true,
    updatedAt: '2026-08-31',
    factIds: ['honar.platform-concurrency', 'honar.live-webrtc', 'honar.delayed-hls'],
    name: {
      en: 'Real-Time Learning Platform',
      fa: 'پلتفرم آموزش بلادرنگ',
    },
    summary: {
      en: 'Designed the backend and media architecture for an educational platform serving more than 5,000 concurrent users at platform level, with interactive WebRTC/LiveKit sessions, Go and NATS JetStream coordination, and HLS playback available only after the session.',
      fa: 'معماری بک‌اند و رسانهٔ یک پلتفرم آموزشی با بیش از ۵٬۰۰۰ کاربر همزمان در سطح پلتفرم را طراحی کردم؛ نشست‌های تعاملی با WebRTC/LiveKit، هماهنگی کاربرد با Go و NATS JetStream، و بازپخش HLS فقط پس از پایان نشست ارائه می‌شد.',
    },
    role: { en: 'Solutions Architect & Technical Lead', fa: 'معمار راهکار و رهبر فنی' },
    technologies: ['WebRTC', 'LiveKit', 'Go', 'NATS JetStream', 'HLS'],
    outcome: {
      en: 'Implementation scope covered live interactive delivery, application coordination, and a separate delayed post-session playback path.',
      fa: 'محدودهٔ پیاده‌سازی تحویل تعاملی زنده، هماهنگی لایهٔ کاربرد و مسیر جداگانهٔ بازپخش با تأخیر پس از نشست را پوشش می‌داد.',
    },
  },
  {
    id: 1,
    slug: 'ai-hologram-realtime-backend',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.publicEvidence,
    outcomeType: 'observed-outcome',
    visualKind: 'ai',
    featured: true,
    updatedAt: '2026-08-26',
    factIds: ['capitalino.team-size', 'hologram.itex-2024', 'hologram.best-booth'],
    name: {
      en: 'Interactive AI Hologram Installation',
      fa: 'نصب هولوگرام تعاملی هوش مصنوعی',
    },
    summary: {
      en: 'Led backend and AI integration for an interactive hologram installation presented at ITEX 2024. The installation received the event’s Best Booth award.',
      fa: 'رهبری یکپارچه‌سازی بک‌اند و هوش مصنوعی برای یک نصب هولوگرام تعاملی ارائه‌شده در ITEX 2024 را بر عهده داشتم. این نصب جایزهٔ بهترین غرفهٔ رویداد را دریافت کرد.',
    },
    role: { en: 'Technical & AI Team Lead', fa: 'رهبر تیم فنی و هوش مصنوعی' },
    technologies: ['Python', 'AI/ML', 'FastAPI', 'WebSocket', 'Docker'],
    outcome: {
      en: 'Presented at ITEX 2024; the installation received the event’s Best Booth award.',
      fa: 'این نصب در ITEX 2024 ارائه شد و جایزهٔ بهترین غرفهٔ رویداد را دریافت کرد.',
    },
  },
  {
    id: 2,
    slug: 'investment-analytics-platform',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.boundedPublicSummary,
    outcomeType: 'implementation-scope',
    visualKind: 'analytics',
    featured: true,
    updatedAt: '2026-08-26',
    factIds: ['capitalino.investment-dashboard', 'capitalino.backend-ownership'],
    name: { en: 'Investment Analytics Platform', fa: 'پلتفرم تحلیل سرمایه‌گذاری' },
    summary: {
      en: 'Designed the backend computational workflows for an investor dashboard, separating portfolio logic and background processing from the presentation layer.',
      fa: 'جریان‌های محاسباتی بک‌اند یک داشبورد سرمایه‌گذاری را طراحی کردم تا منطق پورتفولیو و پردازش پس‌زمینه از لایهٔ نمایش جدا بماند.',
    },
    role: { en: 'Lead Backend Architect', fa: 'معمار ارشد بک‌اند' },
    technologies: ['Node.js', 'TypeScript', 'REST APIs', 'MongoDB', 'Docker'],
    outcome: {
      en: 'Implementation scope included the backend computational layer and investor-dashboard workflows.',
      fa: 'محدودهٔ پیاده‌سازی شامل لایهٔ محاسباتی بک‌اند و جریان‌های داشبورد سرمایه‌گذاری بود.',
    },
  },
  {
    id: 3,
    slug: 'crypto-fiat-payment-gateway',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.boundedPublicSummary,
    outcomeType: 'implementation-scope',
    visualKind: 'payments',
    featured: true,
    updatedAt: '2026-08-26',
    factIds: ['capitalino.gateway', 'gateway.idempotency', 'gateway.reconciliation'],
    name: { en: 'Crypto-to-Fiat Payment Gateway', fa: 'درگاه پرداخت رمزارز به فیات' },
    summary: {
      en: careerFacts.roles.find(role => role.id === 'capitalino').summary.en[2],
      fa: careerFacts.roles.find(role => role.id === 'capitalino').summary.fa[2],
    },
    role: { en: 'Technical Architect', fa: 'معمار فنی' },
    technologies: ['Node.js', 'REST APIs', 'Transaction State', 'Reconciliation', 'Nginx'],
    outcome: {
      en: 'Implementation scope covered backend services, transaction-state handling, reconciliation, and the supporting operational workflow.',
      fa: 'محدودهٔ پیاده‌سازی سرویس‌های بک‌اند، مدیریت وضعیت تراکنش، تطبیق و جریان عملیاتی پشتیبان را پوشش می‌داد.',
    },
  },
  {
    id: 4,
    slug: 'realtime-game-platform',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.boundedPublicSummary,
    outcomeType: 'implementation-scope',
    visualKind: 'realtime',
    factIds: ['trading-gamification.backend-scope'],
    name: { en: 'Trading Gamification Platform', fa: 'پلتفرم گیمیفیکیشن معاملات' },
    summary: {
      en: 'Worked on backend and WebSocket workflows for a financial-trading simulation and gamification product.',
      fa: 'روی جریان‌های بک‌اند و WebSocket برای یک محصول شبیه‌سازی معاملات و گیمیفیکیشن کار کردم.',
    },
    role: { en: 'Senior Software Engineer', fa: 'مهندس نرم‌افزار ارشد' },
    technologies: ['Node.js', 'React', 'Next.js', 'WebSocket'],
    outcome: {
      en: 'Public scope: real-time backend workflows for a trading-simulation experience.',
      fa: 'محدودهٔ عمومی: جریان‌های بک‌اند بلادرنگ برای یک تجربهٔ شبیه‌سازی معاملات.',
    },
  },
  {
    id: 5,
    slug: 'embedded-linux-ota',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.boundedPublicSummary,
    outcomeType: 'implementation-scope',
    visualKind: 'embedded',
    factIds: ['batna.atomic-ota', 'batna.embedded-linux'],
    name: { en: 'Embedded Linux OTA Platform', fa: 'پلتفرم OTA لینوکس نهفته' },
    summary: {
      en: 'Worked on atomic OTA workflows for embedded Linux, including A/B partitioning, rollback safeguards, firmware delivery, and release-pipeline integration.',
      fa: 'روی جریان‌های OTA اتمیک برای لینوکس نهفته، شامل پارتیشن‌بندی A/B، بازگشت امن، تحویل firmware و یکپارچه‌سازی خط انتشار کار کردم.',
    },
    role: { en: 'Systems Engineer', fa: 'مهندس سیستم' },
    technologies: ['Linux', 'Yocto', 'C++', 'Bash', 'CI/CD'],
    outcome: {
      en: 'Public scope: atomic update, rollback, firmware-delivery, and embedded-Linux release workflows.',
      fa: 'محدودهٔ عمومی: جریان‌های به‌روزرسانی اتمیک، بازگشت، تحویل firmware و انتشار لینوکس نهفته.',
    },
  },
  {
    id: 6,
    slug: 'learning-platform',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.boundedPublicSummary,
    outcomeType: 'implementation-scope',
    visualKind: 'learning',
    factIds: ['education.greedy-learner-thesis'],
    name: { en: 'GreedyLearner', fa: 'GreedyLearner' },
    summary: {
      en: 'Developed an Android master’s-thesis project exploring gamified instruction for greedy algorithms.',
      fa: 'یک پروژهٔ اندرویدی در قالب پایان‌نامهٔ کارشناسی ارشد برای بررسی آموزش گیمیفای‌شدهٔ الگوریتم‌های حریصانه توسعه دادم.',
    },
    role: { en: 'Developer & Researcher', fa: 'توسعه‌دهنده و پژوهشگر' },
    technologies: ['Java', 'Android SDK', 'Gamification', 'NoSQL'],
    outcome: {
      en: 'Public scope: thesis research and Android application development.',
      fa: 'محدودهٔ عمومی: پژوهش پایان‌نامه و توسعهٔ اپلیکیشن اندروید.',
    },
  },
  {
    id: 7,
    slug: 'transaction-ledger-system',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.boundedPublicSummary,
    outcomeType: 'implementation-scope',
    visualKind: 'ledger',
    factIds: ['avin-avisa.p2p-trading', 'avin-avisa.transaction-state'],
    name: { en: 'P2P Trading Platform', fa: 'پلتفرم معاملات همتا‌به‌همتا' },
    summary: {
      en: 'Built backend workflows for peer-to-peer trading, including transaction state in MongoDB and Web3.js integration.',
      fa: 'جریان‌های بک‌اند معاملات همتا‌به‌همتا، شامل وضعیت تراکنش در MongoDB و یکپارچه‌سازی Web3.js را توسعه دادم.',
    },
    role: { en: 'Lead Backend Developer', fa: 'توسعه‌دهندهٔ ارشد بک‌اند' },
    technologies: ['Node.js', 'TypeScript', 'MongoDB', 'Web3.js', 'Docker'],
    outcome: {
      en: 'Public scope: backend transaction workflows and blockchain integration.',
      fa: 'محدودهٔ عمومی: جریان‌های تراکنشی بک‌اند و یکپارچه‌سازی بلاک‌چین.',
    },
  },
  {
    id: 8,
    slug: 'blockchain-backend-platform',
    evidenceLevel: PROJECT_EVIDENCE_LEVELS.boundedPublicSummary,
    outcomeType: 'implementation-scope',
    visualKind: 'blockchain',
    factIds: ['academic.hyperledger-prototype'],
    name: { en: 'Blockchain Rewards Prototype', fa: 'نمونهٔ اولیهٔ سامانهٔ پاداش بلاک‌چینی' },
    summary: {
      en: 'Built a permissioned-blockchain proof of concept with Hyperledger Sawtooth and Node.js in an academic setting.',
      fa: 'یک نمونهٔ اولیهٔ بلاک‌چین مجاز با Hyperledger Sawtooth و Node.js در یک محیط دانشگاهی توسعه دادم.',
    },
    role: { en: 'Researcher & Developer', fa: 'پژوهشگر و توسعه‌دهنده' },
    technologies: ['Hyperledger Sawtooth', 'Node.js', 'REST APIs'],
    outcome: {
      en: 'Public scope: academic proof-of-concept development.',
      fa: 'محدودهٔ عمومی: توسعهٔ نمونهٔ اولیه در محیط دانشگاهی.',
    },
  },
];

export const projectCatalog = publicationManifest.projectPublicationManifest.map(publication => {
  const content = projectContent.find(project => project.id === publication.id);
  if (!content || content.slug !== publication.slug) {
    throw new Error(`Project publication manifest does not match project content for ID ${publication.id}.`);
  }
  return {
    ...content,
    ...publication,
    media: getPublishableProjectMedia(publication.slug),
    artifacts: getApprovedProjectArtifacts(publication.slug),
    sourceAvailability: projectSourceAvailability[publication.slug],
  };
});

export const caseStudyProjects = projectCatalog.filter(
  project => project.publicationType === PROJECT_PUBLICATION_TYPES.caseStudy,
);

export const projectSnapshots = projectCatalog.filter(
  project => project.publicationType === PROJECT_PUBLICATION_TYPES.projectSnapshot,
);

export const getProjectById = id => projectCatalog.find(project => project.id === Number(id));
export const getProjectBySlug = slug => projectCatalog.find(project => project.slug === slug);

export function getLocalizedProject(project, locale = 'en') {
  if (!project) return null;
  return {
    ...project,
    name: localized(project.name, locale),
    description: localized(project.summary, locale),
    role: localized(project.role, locale),
    tools: project.technologies.slice(),
    outcome: localized(project.outcome, locale),
    media: (project.media || []).map(item => ({
      ...item,
      locale,
      alt: localized(item.alt, locale),
      caption: localized(item.caption, locale),
    })),
    artifacts: (project.artifacts || []).map(item => ({
      ...item,
      url: item.urlByLocale?.[locale] || item.url,
      label: localized(item.label, locale),
      description: localized(item.description, locale),
    })),
  };
}

export function isCaseStudyProject(project) {
  return project?.publicationType === PROJECT_PUBLICATION_TYPES.caseStudy;
}
