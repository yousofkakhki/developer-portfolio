import { EVIDENCE_STATUS, localized } from './career-facts';

export const projectCaseStudies = {
  'ai-hologram-realtime-backend': {
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    category: { en: 'Real-time applied AI', fa: 'هوش مصنوعی بلادرنگ کاربردی' },
    role: { en: 'Technical & AI Team Lead', fa: 'رهبر تیم فنی و هوش مصنوعی' },
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
      outcomes: {
        heading: { en: 'Outcomes', fa: 'نتایج' },
        body: {
          en: 'The installation was demonstrated at ITEX 2024 and received the Best Booth award. The award is the public outcome; implementation metrics remain private or unconfirmed.',
          fa: 'این نصب در ITEX 2024 نمایش داده شد و جایزهٔ بهترین غرفه را دریافت کرد. جایزه نتیجهٔ عمومی پروژه است؛ معیارهای پیاده‌سازی خصوصی یا تأییدنشده باقی می‌مانند.',
        },
      },
      evidence: {
        heading: { en: 'Evidence boundary', fa: 'مرز شواهد' },
        body: {
          en: 'The event photograph documents delivery and team context. It is not presented as a product screenshot or a benchmark report.',
          fa: 'عکس رویداد تحویل پروژه و زمینهٔ تیمی را مستند می‌کند. این تصویر به‌عنوان اسکرین‌شات محصول یا گزارش بنچمارک ارائه نمی‌شود.',
        },
      },
    },
    relatedWriting: ['ai-enhanced-sfu-for-low-latency-streaming'],
  },

  'investment-analytics-platform': {
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    category: { en: 'Transactional backend platform', fa: 'پلتفرم بک‌اند تراکنشی' },
    role: { en: 'Lead Backend Architect', fa: 'معمار ارشد بک‌اند' },
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
      outcomes: {
        heading: { en: 'Outcomes', fa: 'نتایج' },
        body: {
          en: 'The backend computational layer and investor dashboard workflows were delivered for Capitalino. No unsupported scale, cost, or performance number is published.',
          fa: 'لایهٔ محاسباتی بک‌اند و جریان‌های داشبورد سرمایه‌گذار برای کاپیتالینو تحویل شد. هیچ عدد تأییدنشده‌ای دربارهٔ مقیاس، هزینه یا عملکرد منتشر نمی‌شود.',
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
    relatedWriting: ['ai-routing-makes-payment-retries-harder'],
  },

  'crypto-fiat-payment-gateway': {
    evidenceStatus: EVIDENCE_STATUS.verifiedPublic,
    category: { en: 'Payments and ledger workflows', fa: 'جریان‌های پرداخت و دفترکل' },
    role: { en: 'Technical Architect', fa: 'معمار فنی' },
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
      outcomes: {
        heading: { en: 'Outcomes', fa: 'نتایج' },
        body: {
          en: 'Designed and implemented the backend and operational workflow for a crypto-to-fiat payment gateway, including idempotency, transaction boundaries, and reconciliation.',
          fa: 'بک‌اند و جریان عملیاتی یک درگاه رمزارز به فیات، شامل idempotency، مرزهای تراکنش و تطبیق، طراحی و پیاده‌سازی شد.',
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
    relatedWriting: ['idempotent-crypto-payments-in-frankfurt'],
  },
};

export function getProjectCaseStudy(slug, locale = 'en') {
  const caseStudy = projectCaseStudies[slug];
  if (!caseStudy) return null;

  return {
    ...caseStudy,
    category: localized(caseStudy.category, locale),
    role: localized(caseStudy.role, locale),
    sections: Object.fromEntries(
      Object.entries(caseStudy.sections).map(([key, section]) => [key, {
        heading: localized(section.heading, locale),
        body: localized(section.body, locale),
      }]),
    ),
  };
}
