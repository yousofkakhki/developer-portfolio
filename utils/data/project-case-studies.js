import { EVIDENCE_STATUS, localized } from './career-facts';

export const projectCaseStudies = {
  'real-time-learning-platform': {
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    category: { en: 'Real-time learning infrastructure', fa: 'زیرساخت آموزش بلادرنگ' },
    relatedWriting: ['honar-amoozesh-5000-concurrent-webrtc-case-study'],
    sections: {
      context: {
        heading: { en: 'Context', fa: 'زمینه' },
        body: {
          en: 'An educational media platform needed interactive live participation while serving more than 5,000 concurrent users across the platform.',
          fa: 'یک پلتفرم رسانه‌ای آموزشی باید مشارکت تعاملی زنده را در کنار خدمت‌رسانی به بیش از ۵٬۰۰۰ کاربر همزمان در سطح کل پلتفرم فراهم می‌کرد.',
        },
      },
      problem: {
        heading: { en: 'Problem', fa: 'مسئله' },
        body: {
          en: 'Live interaction, application coordination, and later playback had different timing and reliability needs and could not be represented honestly as one interchangeable delivery path.',
          fa: 'تعامل زنده، هماهنگی لایهٔ کاربرد و بازپخش بعدی نیازهای زمانی و قابلیت اطمینان متفاوتی داشتند و نمی‌شد آن‌ها را صادقانه یک مسیر تحویل قابل‌تعویض نشان داد.',
        },
      },
      constraints: {
        heading: { en: 'Constraints', fa: 'محدودیت‌ها' },
        body: {
          en: 'The verified public record establishes platform-level concurrency, not one 5,000-person room, 5,000 publishers, or one SFU. It does not establish public latency, uptime, cost, or load-test figures.',
          fa: 'سابقهٔ عمومی تأییدشده همزمانی در سطح پلتفرم را اثبات می‌کند، نه یک اتاق ۵٬۰۰۰ نفره، ۵٬۰۰۰ ناشر یا یک SFU. همچنین عدد عمومی برای تأخیر، آپ‌تایم، هزینه یا آزمون بار ثبت نشده است.',
        },
      },
      ownership: {
        heading: { en: 'My role and ownership', fa: 'نقش و مالکیت من' },
        body: {
          en: 'As solutions architect, I shaped the backend and media boundaries and remained hands-on across LiveKit/WebRTC delivery, Go services, and NATS JetStream application coordination.',
          fa: 'به‌عنوان معمار راهکار، مرزهای بک‌اند و رسانه را طراحی کردم و در تحویل LiveKit/WebRTC، سرویس‌های Go و هماهنگی کاربرد با NATS JetStream مشارکت عملی داشتم.',
        },
      },
      architecture: {
        heading: { en: 'Architecture', fa: 'معماری' },
        body: {
          en: 'Live session: interactive participation → WebRTC/LiveKit ↔ Go services and NATS JetStream coordination. Post-session: recorded output → processing and packaging → HLS playback available later.',
          fa: 'نشست زنده: مشارکت تعاملی ← WebRTC/LiveKit ↔ سرویس‌های Go و هماهنگی NATS JetStream. پس از نشست: خروجی ضبط‌شده ← پردازش و بسته‌بندی ← بازپخش HLS که بعداً در دسترس قرار می‌گرفت.',
        },
      },
      tradeoffs: {
        heading: { en: 'Key decisions and trade-offs', fa: 'تصمیم‌ها و مصالحه‌های کلیدی' },
        body: {
          en: 'Keeping delayed playback separate from live participation made the operating boundary explicit. It avoided presenting HLS as a current-session fallback that the verified implementation did not provide.',
          fa: 'جدا نگه‌داشتن بازپخش با تأخیر از مشارکت زنده، مرز عملیاتی را روشن کرد و از معرفی نادرست HLS به‌عنوان fallback همان نشست جلوگیری کرد.',
        },
      },
      safeguards: {
        heading: { en: 'Failure modes and safeguards', fa: 'حالت‌های خرابی و سازوکارهای حفاظتی' },
        body: {
          en: 'Application coordination and media delivery remained separate concerns. The public case study documents those boundaries without inventing failover behavior, measured service levels, or deployment topology.',
          fa: 'هماهنگی کاربرد و تحویل رسانه دو دغدغهٔ جدا باقی ماندند. مطالعهٔ عمومی این مرزها را بدون ساختن رفتار failover، سطح خدمت اندازه‌گیری‌شده یا توپولوژی استقرار مستند می‌کند.',
        },
      },
      evidence: {
        heading: { en: 'Evidence boundary', fa: 'مرز شواهد' },
        body: {
          en: 'The diagram is a sanitized representation of the verified implementation boundary. It is not a benchmark, deployment map, or hypothetical live HLS architecture.',
          fa: 'نمودار، نمایش پاک‌سازی‌شدهٔ مرز پیاده‌سازی تأییدشده است؛ نه بنچمارک، نقشهٔ استقرار یا معماری فرضی HLS زنده.',
        },
      },
    },
  },

  'ai-hologram-realtime-backend': {
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    category: { en: 'Real-time applied AI', fa: 'هوش مصنوعی بلادرنگ کاربردی' },
    visualAlt: {
      en: 'Sanitized architecture of the interactive hologram perception, control, projection, and fallback pipeline',
      fa: 'معماری پاک‌سازی‌شدهٔ خط ادراک، کنترل، پروجکشن و fallback هولوگرام تعاملی',
    },
    visualCaption: {
      en: 'Sanitized project-specific architecture; event photographs remain private pending explicit approval.',
      fa: 'معماری پاک‌سازی‌شده و مختص پروژه؛ عکس‌های رویداد تا زمان تأیید صریح خصوصی باقی می‌مانند.',
    },
    sections: {
      context: {
        heading: { en: 'Context', fa: 'زمینه' },
        body: {
          en: 'An interactive hologram installation needed to turn a camera feed into a responsive projected experience at a public technology event.',
          fa: 'یک نصب هولوگرام تعاملی باید جریان دوربین را به تجربه‌ای پاسخ‌گو روی پروجکشن در یک رویداد فناوری عمومی تبدیل می‌کرد.',
        },
      },
      problem: {
        heading: { en: 'Problem', fa: 'مسئله' },
        body: {
          en: 'The pipeline had to connect perception, application control, and projection without making the presentation depend on a fragile collection of unrelated scripts.',
          fa: 'این خط پردازش باید ادراک، کنترل کاربرد و پروجکشن را به هم متصل می‌کرد، بدون اینکه نمایش به مجموعه‌ای شکننده از اسکریپت‌های نامرتبط وابسته باشد.',
        },
      },
      constraints: {
        heading: { en: 'Constraints', fa: 'محدودیت‌ها' },
        body: {
          en: 'The system ran in an event environment with changing lighting, a bounded compute budget, and a visible user experience that had to fail gracefully.',
          fa: 'سامانه در محیط رویداد با نور متغیر، بودجهٔ محاسباتی محدود و تجربه‌ای قابل مشاهده اجرا می‌شد که باید در هنگام خطا نیز به‌نرمی ادامه می‌یافت.',
        },
      },
      ownership: {
        heading: { en: 'My role and ownership', fa: 'نقش و مالکیت من' },
        body: {
          en: 'I led the technical and AI work, shaped the service boundary, and connected the perception pipeline to the projection control path with a small delivery team.',
          fa: 'رهبری بخش فنی و هوش مصنوعی، تعریف مرز سرویس‌ها و اتصال خط پردازش ادراک به مسیر کنترل پروجکشن را با یک تیم کوچک بر عهده داشتم.',
        },
      },
      architecture: {
        heading: { en: 'Architecture', fa: 'معماری' },
        body: {
          en: 'Camera → pose estimation → API/WebSocket control → projection. The perception step produced bounded application events; the projection layer remained responsible for presentation and fallback behavior.',
          fa: 'دوربین ← تخمین وضعیت بدن ← کنترل API/WebSocket ← پروجکشن. مرحلهٔ ادراک رویدادهای محدود کاربردی تولید می‌کرد و لایهٔ پروجکشن مسئول نمایش و رفتار جایگزین باقی می‌ماند.',
        },
      },
      tradeoffs: {
        heading: { en: 'Key decisions and trade-offs', fa: 'تصمیم‌ها و مصالحه‌های کلیدی' },
        body: {
          en: 'Keeping the model-facing work outside the projection renderer made the visible experience easier to control. A simpler event contract was preferred over exposing model internals to the presentation layer.',
          fa: 'جدا نگه‌داشتن پردازش مدل از رندرکنندهٔ پروجکشن، کنترل تجربهٔ قابل مشاهده را ساده‌تر کرد. قرارداد رویداد ساده به‌جای آشکارکردن جزئیات مدل به لایهٔ نمایش انتخاب شد.',
        },
      },
      safeguards: {
        heading: { en: 'Failure modes and safeguards', fa: 'حالت‌های خرابی و سازوکارهای حفاظتی' },
        body: {
          en: 'The system could fall back to a stable presentation state when camera input, inference, or transport was unavailable. The public record does not establish a measured latency benchmark, so no latency number is claimed here.',
          fa: 'در صورت در دسترس نبودن ورودی دوربین، استنتاج یا انتقال، سامانه می‌توانست به وضعیت پایدار نمایش بازگردد. در سوابق عمومی معیار اندازه‌گیری تأخیر به‌طور قطعی ثبت نشده است؛ بنابراین عددی ادعا نمی‌شود.',
        },
      },
      evidence: {
        heading: { en: 'Evidence boundary', fa: 'مرز شواهد' },
        body: {
          en: 'The public visuals are sanitized architecture diagrams grounded in the documented pipeline and failure boundaries. Event photographs are not published without explicit approval represented in the content model.',
          fa: 'تصاویر عمومی نمودارهای معماری پاک‌سازی‌شده و مبتنی بر خط پردازش و مرزهای خرابی مستند هستند. عکس‌های رویداد بدون تأیید صریح ثبت‌شده در مدل محتوا منتشر نمی‌شوند.',
        },
      },
    },
  },

  'investment-analytics-platform': {
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    category: { en: 'Transactional backend platform', fa: 'پلتفرم بک‌اند تراکنشی' },
    visualAlt: { en: '', fa: '' },
    visualCaption: {
      en: 'Category illustration; client screens and data remain private.',
      fa: 'تصویر دسته‌بندی پروژه؛ صفحه‌های محصول و داده‌های مشتری خصوصی هستند.',
    },
    sections: {
      context: {
        heading: { en: 'Context', fa: 'زمینه' },
        body: {
          en: 'Capitalino needed an investor-facing dashboard backed by computationally heavy portfolio and market workflows.',
          fa: 'کاپیتالینو به داشبوردی برای سرمایه‌گذاران نیاز داشت که پشتوانهٔ آن جریان‌های محاسباتی سنگین پورتفولیو و بازار باشد.',
        },
      },
      problem: {
        heading: { en: 'Problem', fa: 'مسئله' },
        body: {
          en: 'The product needed responsive analytics without making the interface responsible for business rules, data consistency, or long-running calculations.',
          fa: 'محصول به تحلیل پاسخ‌گو نیاز داشت، بدون اینکه رابط کاربری مسئول قوانین کسب‌وکار، سازگاری داده یا محاسبات طولانی باشد.',
        },
      },
      constraints: {
        heading: { en: 'Constraints', fa: 'محدودیت‌ها' },
        body: {
          en: 'The public project record does not disclose client data volumes, production latency, or investment performance. This case study stays at the architecture and ownership level.',
          fa: 'سوابق عمومی پروژه حجم دادهٔ مشتری، تأخیر تولید یا عملکرد سرمایه‌گذاری را افشا نمی‌کند. این مطالعه در سطح معماری و مالکیت باقی می‌ماند.',
        },
      },
      ownership: {
        heading: { en: 'My role and ownership', fa: 'نقش و مالکیت من' },
        body: {
          en: 'I owned the backend architecture and the core computational logic, translating product needs into service boundaries and reviewable data flows.',
          fa: 'مالکیت معماری بک‌اند و منطق محاسباتی اصلی را بر عهده داشتم و نیازهای محصول را به مرز سرویس‌ها و جریان‌های دادهٔ قابل بازبینی تبدیل کردم.',
        },
      },
      architecture: {
        heading: { en: 'Architecture', fa: 'معماری' },
        body: {
          en: 'Client dashboard → authenticated API boundary → portfolio and analytics services → persistence and background computation. The interface consumed domain-shaped results rather than reimplementing financial rules.',
          fa: 'داشبورد کاربر ← مرز API احراز هویت‌شده ← سرویس‌های پورتفولیو و تحلیل ← ذخیره‌سازی و محاسبات پس‌زمینه. رابط کاربری نتایج شکل‌گرفته بر اساس دامنه را مصرف می‌کرد و قوانین مالی را دوباره پیاده نمی‌کرد.',
        },
      },
      tradeoffs: {
        heading: { en: 'Key decisions and trade-offs', fa: 'تصمیم‌ها و مصالحه‌های کلیدی' },
        body: {
          en: 'Separating computation from presentation improved change ownership and kept expensive work out of the request-facing UI path. The trade-off was more explicit coordination between API responses and background jobs.',
          fa: 'جداکردن محاسبات از نمایش، مالکیت تغییرات را روشن‌تر کرد و کار پرهزینه را از مسیر پاسخ‌گوی رابط کاربری بیرون برد. مصالحه، نیاز به هماهنگی صریح‌تر میان پاسخ API و وظایف پس‌زمینه بود.',
        },
      },
      safeguards: {
        heading: { en: 'Failure modes and safeguards', fa: 'حالت‌های خرابی و سازوکارهای حفاظتی' },
        body: {
          en: 'Stale analytics, partial calculations, and unavailable dependencies were treated as states to represent explicitly rather than silently rendering an apparently complete portfolio view.',
          fa: 'تحلیل‌های قدیمی، محاسبات ناقص و وابستگی‌های در دسترس‌نبودنی به‌عنوان وضعیت‌هایی صریح در نظر گرفته شدند، نه اینکه بی‌صدا نمایشی ظاهراً کامل از پورتفولیو تولید شود.',
        },
      },
      evidence: {
        heading: { en: 'Evidence boundary', fa: 'مرز شواهد' },
        body: {
          en: 'The team photograph is delivery evidence and is intentionally not used as the product image. Product screens and client data remain private.',
          fa: 'عکس تیمی شواهد تحویل پروژه است و عمداً به‌عنوان تصویر محصول استفاده نمی‌شود. صفحه‌های محصول و داده‌های مشتری خصوصی باقی می‌مانند.',
        },
      },
    },
  },

  'crypto-fiat-payment-gateway': {
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    category: { en: 'Payments and ledger workflows', fa: 'جریان‌های پرداخت و دفترکل' },
    stateTransitions: {
      title: { en: 'Payment state transitions', fa: 'گذارهای وضعیت پرداخت' },
      columns: [
        { en: 'Trigger', fa: 'محرک' },
        { en: 'Durable state', fa: 'وضعیت پایدار' },
        { en: 'Next action', fa: 'اقدام بعدی' },
      ],
      rows: [
        {
          id: 'initial-request',
          trigger: { en: 'New request with an idempotency key', fa: 'درخواست جدید با کلید idempotency' },
          state: { en: 'Persisted payment intent', fa: 'قصد پرداخت ذخیره‌شده' },
          action: { en: 'Call the relevant external adapter', fa: 'فراخوانی آداپتور بیرونی مرتبط' },
        },
        {
          id: 'duplicate-request',
          trigger: { en: 'Repeated idempotency key', fa: 'کلید idempotency تکراری' },
          state: { en: 'Existing intent state', fa: 'وضعیت قصد موجود' },
          action: { en: 'Return persisted state without creating another intent', fa: 'بازگرداندن وضعیت ذخیره‌شده بدون ایجاد قصد جدید' },
        },
        {
          id: 'provider-timeout',
          trigger: { en: 'Provider timeout or uncertain response', fa: 'timeout ارائه‌دهنده یا پاسخ نامطمئن' },
          state: { en: 'Pending reconciliation', fa: 'در انتظار تطبیق' },
          action: { en: 'Reconcile before assigning a terminal state', fa: 'تطبیق پیش از تعیین وضعیت نهایی' },
        },
        {
          id: 'classified-result',
          trigger: { en: 'Classified provider result', fa: 'نتیجهٔ دسته‌بندی‌شدهٔ ارائه‌دهنده' },
          state: { en: 'Retryable or terminal', fa: 'قابل تلاش مجدد یا نهایی' },
          action: { en: 'Retry only retryable states; retain terminal states', fa: 'تلاش مجدد فقط برای وضعیت‌های مجاز و حفظ وضعیت‌های نهایی' },
        },
      ],
    },
    visualAlt: { en: '', fa: '' },
    visualCaption: {
      en: 'Category illustration; provider and production details remain private.',
      fa: 'تصویر دسته‌بندی پروژه؛ جزئیات ارائه‌دهندگان و محیط بهره‌برداری خصوصی هستند.',
    },
    sections: {
      context: {
        heading: { en: 'Context', fa: 'زمینه' },
        body: {
          en: 'A crypto-to-fiat gateway had to coordinate blockchain events with conventional fiat payment workflows and operational review.',
          fa: 'یک درگاه رمزارز به فیات باید رویدادهای بلاک‌چین را با جریان‌های متعارف پرداخت فیات و بازبینی عملیاتی هماهنگ می‌کرد.',
        },
      },
      problem: {
        heading: { en: 'Problem', fa: 'مسئله' },
        body: {
          en: 'Retries, duplicate callbacks, asynchronous settlement, and uncertain external responses make a payment flow unsafe when it is modelled as one simple request.',
          fa: 'تلاش مجدد، callbackهای تکراری، تسویهٔ ناهمگام و پاسخ‌های نامطمئن سرویس‌های بیرونی، مدل‌کردن پرداخت به‌صورت یک درخواست ساده را ناامن می‌کند.',
        },
      },
      constraints: {
        heading: { en: 'Constraints', fa: 'محدودیت‌ها' },
        body: {
          en: 'The system handled sensitive transaction state. Public materials do not establish regulated-production authorization, payment volume, or a reliability SLO.',
          fa: 'سامانه با وضعیت حساس تراکنش سروکار داشت. منابع عمومی مجوز بهره‌برداری قانون‌گذاری‌شده، حجم پرداخت یا SLO قابلیت اطمینان را اثبات نمی‌کنند.',
        },
      },
      ownership: {
        heading: { en: 'My role and ownership', fa: 'نقش و مالکیت من' },
        body: {
          en: 'I shaped the backend service boundaries, transaction-state handling, and operational infrastructure with a four-person engineering team.',
          fa: 'با یک تیم مهندسی چهار نفره، مرز سرویس‌های بک‌اند، مدیریت وضعیت تراکنش و زیرساخت عملیاتی را طراحی کردم.',
        },
      },
      architecture: {
        heading: { en: 'Architecture', fa: 'معماری' },
        body: {
          en: 'Request → idempotency key → persisted intent → external crypto/fiat adapters → reconciliation state. Each boundary returned a durable state transition instead of assuming that a remote response was final.',
          fa: 'درخواست ← کلید idempotency ← قصد ذخیره‌شده ← آداپتورهای بیرونی رمزارز/فیات ← وضعیت تطبیق. هر مرز یک تغییر وضعیت پایدار برمی‌گرداند و پاسخ دوردست را نهایی فرض نمی‌کرد.',
        },
      },
      tradeoffs: {
        heading: { en: 'Key decisions and trade-offs', fa: 'تصمیم‌ها و مصالحه‌های کلیدی' },
        body: {
          en: 'Durable state and reconciliation add bookkeeping, but they make retries and manual review explainable. The design favoured explicit recovery over pretending external systems were synchronous.',
          fa: 'وضعیت پایدار و تطبیق، ثبت دادهٔ بیشتری می‌خواهد اما تلاش مجدد و بازبینی دستی را قابل توضیح می‌کند. طراحی، بازیابی صریح را به‌جای فرض همگام‌بودن سیستم‌های بیرونی ترجیح داد.',
        },
      },
      safeguards: {
        heading: { en: 'Failure modes and safeguards', fa: 'حالت‌های خرابی و سازوکارهای حفاظتی' },
        body: {
          en: 'Duplicate requests, delayed callbacks, and mismatched settlement states were treated as recoverable workflow states. Idempotency and reconciliation were the safeguards; no five-nines claim is made.',
          fa: 'درخواست‌های تکراری، callbackهای دیررس و وضعیت‌های نامنطبق تسویه به‌عنوان حالت‌های قابل بازیابی در نظر گرفته شدند. idempotency و تطبیق سازوکارهای حفاظتی بودند؛ ادعای پنج نه منتشر نمی‌شود.',
        },
      },
      evidence: {
        heading: { en: 'Evidence boundary', fa: 'مرز شواهد' },
        body: {
          en: 'The public case study documents design ownership and safeguards. Provider names, transaction volumes, compliance details, and production evidence remain confidential.',
          fa: 'این مطالعهٔ عمومی مالکیت طراحی و سازوکارهای حفاظتی را مستند می‌کند. نام ارائه‌دهندگان، حجم تراکنش، جزئیات انطباق و شواهد تولید محرمانه باقی می‌مانند.',
        },
      },
    },
  },
};

export function getProjectCaseStudy(slug, locale = 'en') {
  const caseStudy = projectCaseStudies[slug];
  if (!caseStudy) return null;

  return {
    ...caseStudy,
    category: localized(caseStudy.category, locale),
    visualAlt: localized(caseStudy.visualAlt, locale),
    visualCaption: localized(caseStudy.visualCaption, locale),
    stateTransitions: caseStudy.stateTransitions ? {
      title: localized(caseStudy.stateTransitions.title, locale),
      columns: caseStudy.stateTransitions.columns.map(column => localized(column, locale)),
      rows: caseStudy.stateTransitions.rows.map(row => ({
        id: row.id,
        trigger: localized(row.trigger, locale),
        state: localized(row.state, locale),
        action: localized(row.action, locale),
      })),
    } : null,
    sections: Object.fromEntries(
      Object.entries(caseStudy.sections).map(([key, section]) => [key, {
        heading: localized(section.heading, locale),
        body: localized(section.body, locale),
      }]),
    ),
  };
}
