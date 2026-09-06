const PROJECT_MEDIA_TYPES = Object.freeze({
  architectureDiagram: 'architecture-diagram',
  productScreenshot: 'product-screenshot',
  installationPhoto: 'installation-photo',
  deliveryPhoto: 'delivery-photo',
  fieldEvidence: 'field-evidence',
  document: 'document',
  socialCard: 'social-card',
});

const PROJECT_MEDIA_EVIDENCE_ROLES = Object.freeze({
  architecture: 'architecture',
  product: 'product',
  delivery: 'delivery',
  teamContext: 'team-context',
  fieldContext: 'field-context',
  supportingOnly: 'supporting-only',
});

const projectMediaManifest = Object.freeze({
  'real-time-learning-platform': Object.freeze([
    Object.freeze({
      id: 'honar-live-post-session-architecture',
      type: PROJECT_MEDIA_TYPES.architectureDiagram,
      src: '/project-media/honar-live-post-session.svg',
      alt: Object.freeze({
        en: 'Architecture diagram separating live WebRTC participation from HLS playback produced after the session',
        fa: 'نمودار معماری با تفکیک مشارکت زندهٔ WebRTC از بازپخش HLS تولیدشده پس از نشست',
      }),
      caption: Object.freeze({
        en: 'Verified boundary: LiveKit and WebRTC served the live session; HLS playback became available only after post-session processing.',
        fa: 'مرز تأییدشده: LiveKit و WebRTC نشست زنده را ارائه می‌کردند؛ بازپخش HLS فقط پس از پردازش بعد از نشست در دسترس قرار می‌گرفت.',
      }),
      technicalTerms: Object.freeze(['LiveKit', 'WebRTC', 'HLS']),
      evidenceRole: PROJECT_MEDIA_EVIDENCE_ROLES.architecture,
      primary: true,
      publicApproved: true,
      sensitive: false,
      aspectRatio: '16:9',
      width: 1600,
      height: 900,
      sourceDate: '2026-08-31',
    }),
  ]),
  'crypto-fiat-payment-gateway': Object.freeze([
    Object.freeze({
      id: 'payment-idempotency-reconciliation-architecture',
      type: PROJECT_MEDIA_TYPES.architectureDiagram,
      src: '/project-media/payment-idempotency-reconciliation.svg',
      alt: Object.freeze({
        en: 'Payment workflow diagram showing idempotency, persisted intent, provider adapters, retries, and reconciliation',
        fa: 'نمودار جریان پرداخت شامل idempotency، قصد ذخیره‌شده، آداپتورهای ارائه‌دهنده، تلاش مجدد و تطبیق',
      }),
      caption: Object.freeze({
        en: 'Sanitized architecture view of durable payment state, retry classification, and reconciliation recovery.',
        fa: 'نمای معماری پاک‌سازی‌شده از وضعیت پایدار پرداخت، دسته‌بندی تلاش مجدد و بازیابی از مسیر تطبیق.',
      }),
      technicalTerms: Object.freeze(['idempotency']),
      evidenceRole: PROJECT_MEDIA_EVIDENCE_ROLES.architecture,
      primary: true,
      publicApproved: true,
      sensitive: false,
      aspectRatio: '16:9',
      width: 1600,
      height: 900,
      sourceDate: '2026-08-31',
    }),
  ]),
  'ai-hologram-realtime-backend': Object.freeze([
    Object.freeze({
      id: 'hologram-delivery-architecture',
      type: PROJECT_MEDIA_TYPES.architectureDiagram,
      src: '/project-media/hologram-delivery-architecture.svg',
      alt: Object.freeze({
        en: 'Hologram installation pipeline from camera input through pose estimation and application control to projection fallback',
        fa: 'خط پردازش نصب هولوگرام از ورودی دوربین و تخمین وضعیت بدن تا کنترل کاربرد، پروجکشن و رفتار جایگزین',
      }),
      caption: Object.freeze({
        en: 'Sanitized delivery architecture separating perception, application control, projection, and stable fallback behavior.',
        fa: 'معماری پاک‌سازی‌شدهٔ تحویل با تفکیک ادراک، کنترل کاربرد، پروجکشن و رفتار پایدار جایگزین.',
      }),
      evidenceRole: PROJECT_MEDIA_EVIDENCE_ROLES.architecture,
      primary: true,
      publicApproved: true,
      sensitive: false,
      aspectRatio: '16:9',
      width: 1600,
      height: 900,
      sourceDate: '2026-08-31',
    }),
    Object.freeze({
      id: 'hologram-perception-control',
      type: PROJECT_MEDIA_TYPES.architectureDiagram,
      src: '/project-media/hologram-perception-control.svg',
      alt: Object.freeze({
        en: 'Diagram of the bounded event contract between pose estimation and projection control',
        fa: 'نمودار قرارداد رویداد محدود میان تخمین وضعیت بدن و کنترل پروجکشن',
      }),
      caption: Object.freeze({
        en: 'Perception emits bounded application events across the API/WebSocket control boundary.',
        fa: 'لایهٔ ادراک رویدادهای محدود کاربردی را از مرز کنترل API/WebSocket عبور می‌دهد.',
      }),
      technicalTerms: Object.freeze(['API/WebSocket']),
      evidenceRole: PROJECT_MEDIA_EVIDENCE_ROLES.architecture,
      primary: false,
      publicApproved: true,
      sensitive: false,
      aspectRatio: '16:9',
      width: 1600,
      height: 900,
      sourceDate: '2026-08-31',
    }),
    Object.freeze({
      id: 'hologram-installation-readiness',
      type: PROJECT_MEDIA_TYPES.architectureDiagram,
      src: '/project-media/hologram-installation-readiness.svg',
      alt: Object.freeze({
        en: 'Diagram of camera, lighting, compute, and transport readiness before projection activation',
        fa: 'نمودار آمادگی دوربین، نور، توان پردازشی و انتقال پیش از فعال‌سازی پروجکشن',
      }),
      caption: Object.freeze({
        en: 'Event-environment constraints enter an explicit readiness gate before the projected experience activates.',
        fa: 'محدودیت‌های محیط رویداد پیش از فعال‌شدن تجربهٔ پروجکشن وارد درگاه صریح آمادگی می‌شوند.',
      }),
      evidenceRole: PROJECT_MEDIA_EVIDENCE_ROLES.architecture,
      primary: false,
      publicApproved: true,
      sensitive: false,
      aspectRatio: '16:9',
      width: 1600,
      height: 900,
      sourceDate: '2026-08-31',
    }),
    Object.freeze({
      id: 'hologram-fallback-states',
      type: PROJECT_MEDIA_TYPES.architectureDiagram,
      src: '/project-media/hologram-fallback-states.svg',
      alt: Object.freeze({
        en: 'Diagram showing stable projection fallback when input, inference, or transport is unavailable',
        fa: 'نمودار وضعیت پایدار جایگزین پروجکشن هنگام نبود ورودی، استنتاج یا انتقال',
      }),
      caption: Object.freeze({
        en: 'The projection layer owns visible recovery and can return to a stable presentation state.',
        fa: 'لایهٔ پروجکشن مالک بازیابی قابل مشاهده است و می‌تواند به وضعیت پایدار نمایش بازگردد.',
      }),
      evidenceRole: PROJECT_MEDIA_EVIDENCE_ROLES.architecture,
      primary: false,
      publicApproved: true,
      sensitive: false,
      aspectRatio: '16:9',
      width: 1600,
      height: 900,
      sourceDate: '2026-08-31',
    }),
  ]),
  'investment-analytics-platform': Object.freeze([]),
  'realtime-game-platform': Object.freeze([]),
  'embedded-linux-ota': Object.freeze([
    Object.freeze({
      id: 'atomic-ab-ota-architecture',
      type: PROJECT_MEDIA_TYPES.architectureDiagram,
      src: '/project-media/atomic-ab-ota.svg',
      alt: Object.freeze({
        en: 'Atomic A/B update workflow from signed artifact through health check, commit, or rollback',
        fa: 'جریان به‌روزرسانی اتمیک A/B از artifact امضاشده تا بررسی سلامت، ثبت نهایی یا بازگشت',
      }),
      caption: Object.freeze({
        en: 'Verified workflow boundary for signed artifacts, inactive-partition writes, health checks, and rollback.',
        fa: 'مرز تأییدشدهٔ جریان برای artifact امضاشده، نوشتن روی پارتیشن غیرفعال، بررسی سلامت و بازگشت.',
      }),
      technicalTerms: Object.freeze(['A/B', 'artifact']),
      evidenceRole: PROJECT_MEDIA_EVIDENCE_ROLES.architecture,
      primary: true,
      publicApproved: true,
      sensitive: false,
      aspectRatio: '16:9',
      width: 1600,
      height: 900,
      sourceDate: '2026-08-31',
    }),
    Object.freeze({
      id: 'ota-device-update-field-evidence',
      type: PROJECT_MEDIA_TYPES.fieldEvidence,
      src: '/ota-1.jpg',
      alt: Object.freeze({
        en: 'Device screen showing an update package verification and installation sequence',
        fa: 'صفحهٔ دستگاه در حال نمایش توالی بررسی و نصب بستهٔ به‌روزرسانی',
      }),
      caption: Object.freeze({
        en: 'Supporting device evidence; architecture is represented by the sanitized diagram.',
        fa: 'شواهد تکمیلی دستگاه؛ معماری در نمودار پاک‌سازی‌شده نمایش داده شده است.',
      }),
      evidenceRole: PROJECT_MEDIA_EVIDENCE_ROLES.fieldContext,
      primary: false,
      publicApproved: true,
      sensitive: false,
      aspectRatio: '16:9',
      width: 598,
      height: 338,
      credit: 'Owner-approved project archive',
    }),
  ]),
  'learning-platform': Object.freeze([]),
  'transaction-ledger-system': Object.freeze([]),
  'blockchain-backend-platform': Object.freeze([]),
});

const CASE_STUDY_SLUGS = Object.freeze([
  'real-time-learning-platform',
  'crypto-fiat-payment-gateway',
  'ai-hologram-realtime-backend',
]);

function validateLocalizedText(value, field, id, errors) {
  for (const locale of ['en', 'fa']) {
    if (typeof value?.[locale] !== 'string' || !value[locale].trim()) {
      errors.push(`${id}: ${field}.${locale} is required.`);
    }
  }
}

function validateProjectMediaManifest() {
  const errors = [];
  const ids = new Set();
  const typeValues = new Set(Object.values(PROJECT_MEDIA_TYPES));
  const roleValues = new Set(Object.values(PROJECT_MEDIA_EVIDENCE_ROLES));
  const allowedRatios = new Set(['16:9', '4:3', '3:2', 'portrait']);

  for (const [slug, items] of Object.entries(projectMediaManifest)) {
    if (!Array.isArray(items)) {
      errors.push(`${slug}: media must be an array.`);
      continue;
    }
    for (const item of items) {
      if (!item?.id || ids.has(item.id)) errors.push(`${slug}: media IDs must be unique and non-empty.`);
      ids.add(item?.id);
      if (!typeValues.has(item?.type)) errors.push(`${item?.id}: unsupported media type.`);
      if (!roleValues.has(item?.evidenceRole)) errors.push(`${item?.id}: unsupported evidence role.`);
      if (typeof item?.src !== 'string' || !item.src.startsWith('/')) errors.push(`${item?.id}: src must be an absolute public path.`);
      validateLocalizedText(item?.alt, 'alt', item?.id, errors);
      validateLocalizedText(item?.caption, 'caption', item?.id, errors);
      if (typeof item?.primary !== 'boolean') errors.push(`${item?.id}: primary must be boolean.`);
      if (typeof item?.publicApproved !== 'boolean') errors.push(`${item?.id}: publicApproved must be boolean.`);
      if (typeof item?.sensitive !== 'boolean') errors.push(`${item?.id}: sensitive must be boolean.`);
      if (item?.publicApproved && item?.sensitive) errors.push(`${item?.id}: sensitive media cannot be public-approved.`);
      if (item?.primary && !((item.width && item.height) || allowedRatios.has(item.aspectRatio))) {
        errors.push(`${item?.id}: primary media needs dimensions or a supported aspect ratio.`);
      }
      if (item?.type === PROJECT_MEDIA_TYPES.productScreenshot && [
        PROJECT_MEDIA_EVIDENCE_ROLES.teamContext,
        PROJECT_MEDIA_EVIDENCE_ROLES.delivery,
        PROJECT_MEDIA_EVIDENCE_ROLES.fieldContext,
      ].includes(item?.evidenceRole)) {
        errors.push(`${item?.id}: a product screenshot cannot represent team, delivery, or field evidence.`);
      }
    }
  }

  for (const slug of CASE_STUDY_SLUGS) {
    const primaries = (projectMediaManifest[slug] || []).filter(
      item => item.primary && item.publicApproved && !item.sensitive,
    );
    if (primaries.length !== 1) errors.push(`${slug}: exactly one approved primary media item is required.`);
  }
  return errors;
}

function getPublishableProjectMedia(slug) {
  return (projectMediaManifest[slug] || []).filter(item => item.publicApproved && !item.sensitive);
}

module.exports = {
  CASE_STUDY_SLUGS,
  PROJECT_MEDIA_EVIDENCE_ROLES,
  PROJECT_MEDIA_TYPES,
  getPublishableProjectMedia,
  projectMediaManifest,
  validateProjectMediaManifest,
};
