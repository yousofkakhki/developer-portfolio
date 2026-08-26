import { ConversionLink, ConversionView } from '@/app/components/analytics/conversion-link';
import { personalData } from '@/utils/data/personal-data';
import { careerFacts, localized } from '@/utils/data/career-facts';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';

const copy = {
  en: {
    title: 'Work with Yousef Kakhki',
    metadataTitle: 'Hiring, Relocation & Architecture Support',
    description: 'Senior backend, platform, and real-time media engineering for teams building reliable distributed systems.',
    eyebrow: 'For engineering leaders and recruiters',
    intro: '',
    availability: 'Available for senior individual-contributor and hands-on technical-lead roles.',
    topCta: 'Discuss a role',
    downloadResume: 'Download résumé (PDF)',
    evidenceTitle: 'What I bring',
    evidence: [
      ['Real-time media', 'Architecture experience with LiveKit, WebRTC, delayed HLS playback, NATS JetStream, and Go on an educational platform serving {platformConcurrency} at platform level.'],
      ['Backend and platforms', '{backendExperience} years across Node.js, Go, Python, PostgreSQL, Kafka, NATS, infrastructure, and production operations.'],
      ['Technical leadership', 'Hands-on architecture and engineering leadership across backend, infrastructure, embedded Linux, and cross-functional delivery.'],
      ['ERP and business systems', 'Delivered self-hosted Odoo Enterprise, Persian/Jalali and Hijri calendar localization, and further CRM-addon development and customization for the Odoo CRM team at Holoo Corp.'],
    ],
    rolesTitle: 'Best-fit roles',
    roles: careerFacts.targetRoles,
    approachTitle: 'How I work',
    methodLabel: 'Method / 01',
    approach: 'I am most useful where architecture and implementation meet: defining boundaries, making trade-offs explicit, diagnosing failure modes, and continuing to contribute directly to production code.',
    cta: 'Discuss a role or engineering problem',
    email: 'Email directly',
    contactLabel: 'Contact / Direct',
    consultingTitle: 'Consulting and project-based architecture support',
    consultingIntro: 'Bounded reviews for teams that need a clear architecture decision, risk register, or implementation path.',
  },
  fa: {
    title: 'همکاری با یوسف کاخکی',
    metadataTitle: 'استخدام، مهاجرت کاری و مشاورهٔ معماری',
    description: 'مهندسی بک‌اند، پلتفرم و رسانهٔ بلادرنگ برای تیم‌هایی که سیستم‌های توزیع‌شدهٔ قابل‌اعتماد می‌سازند.',
    eyebrow: 'برای مدیران مهندسی و استخدام‌کنندگان',
    intro: '',
    availability: 'برای نقش‌های ارشد فردی و رهبری فنیِ همراه با مشارکت عملی آمادهٔ گفتگو هستم.',
    topCta: 'گفتگو دربارهٔ یک موقعیت',
    downloadResume: 'دریافت رزومه (PDF)',
    evidenceTitle: 'تجربه‌ای که ارائه می‌کنم',
    evidence: [
      ['رسانهٔ بلادرنگ', 'تجربهٔ معماری با LiveKit، WebRTC، بازپخش HLS با تأخیر، NATS JetStream و Go در یک پلتفرم آموزشی با {platformConcurrency} در سطح پلتفرم.'],
      ['بک‌اند و پلتفرم', 'بیش از ۱۰ سال تجربه در Node.js، Go، Python، PostgreSQL، Kafka، NATS، زیرساخت و عملیات تولید.'],
      ['رهبری فنی', 'معماری و رهبری مهندسی همراه با مشارکت عملی در بک‌اند، زیرساخت، لینوکس نهفته و تحویل بین‌تیمی.'],
      ['ERP و سامانه‌های کسب‌وکار', 'تحویل Odoo Enterprise خودمیزبان، بومی‌سازی تقویم‌های فارسی/جلالی و هجری، و توسعه و سفارشی‌سازی بیشتر افزونه‌های CRM برای تیم Odoo CRM شرکت هلو.'],
    ],
    rolesTitle: 'فرصت‌های مهندسی مناسب',
    roles: ['مهندس ارشد بک‌اند', 'مهندس Staff یا رهبر بک‌اند', 'مهندس پلتفرم', 'مهندس رسانهٔ بلادرنگ', 'معمار راهکار'],
    approachTitle: 'شیوهٔ همکاری من',
    methodLabel: 'روش همکاری / ۰۱',
    approach: 'بیشترین ارزش را در نقطهٔ اتصال معماری و پیاده‌سازی ایجاد می‌کنم: تعریف مرزها، شفاف‌کردن مصالحه‌ها، تحلیل حالت‌های خرابی و مشارکت مستقیم در کد تولید.',
    cta: 'گفتگو دربارهٔ موقعیت یا مسئلهٔ مهندسی',
    email: 'ارسال ایمیل مستقیم',
    contactLabel: 'تماس / مستقیم',
    consultingTitle: 'مشاورهٔ معماری سامانه به‌صورت پروژه‌ای یا پاره‌وقت',
    consultingIntro: 'بازبینی‌های محدود و مشخص برای تیم‌هایی که به تصمیم معماری، دفتر ثبت ریسک یا مسیر پیاده‌سازی روشن نیاز دارند.',
  },
};

function getCopy(language) {
  const base = copy[language];
  const platformConcurrency = localized(careerFacts.metrics.platformConcurrency.localizedValue, language);
  const backendExperience = localized(careerFacts.metrics.backendExperience.localizedValue, language);
  const relocation = localized(careerFacts.relocation.statement, language);
  const roles = language === 'en'
    ? careerFacts.targetRoles
    : base.roles;
  const consulting = careerFacts.consulting.map(service => ({
    title: localized(service.title, language),
    output: localized(service.output, language),
  }));

  return {
    ...base,
    intro: relocation,
    evidence: base.evidence.map(([title, detail]) => [
      title,
      detail
        .replace('{platformConcurrency}', platformConcurrency)
        .replace('{backendExperience}', backendExperience),
    ]),
    roles,
    consulting,
  };
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const language = locale === 'fa' ? 'fa' : 'en';
  const text = getCopy(language);
  const url = `${siteUrl}/${language}/work-with-me`;
  return {
    title: text.metadataTitle,
    description: text.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en/work-with-me`,
        fa: `${siteUrl}/fa/work-with-me`,
        'x-default': `${siteUrl}/en/work-with-me`,
      },
    },
    openGraph: {
      type: 'profile',
      url,
      title: text.title,
      description: text.description,
      locale: language === 'fa' ? 'fa_IR' : 'en_US',
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function WorkWithMePage({ params }) {
  const { locale } = await params;
  const language = locale === 'fa' ? 'fa' : 'en';
  const text = getCopy(language);
  const url = `${siteUrl}/${language}/work-with-me`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profile`,
        url,
        name: text.title,
        description: text.description,
        inLanguage: language === 'fa' ? 'fa-IR' : 'en-US',
        mainEntity: { '@id': `${siteUrl}/#person` },
        isPartOf: { '@id': `${siteUrl}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: language === 'fa' ? 'خانه' : 'Home', item: `${siteUrl}/${language}` },
          { '@type': 'ListItem', position: 2, name: text.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="brand-route brand-recruiter">
      <ConversionView eventName="work_with_me_view" source="work_with_me_page" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <header className="brand-route__header brand-recruiter__header">
        <div>
          <p className="brand-route__eyebrow">{text.eyebrow}</p>
          <h1 className="brand-route__title">{text.title}</h1>
        </div>
        <div className="brand-route__intro">
          <p className="brand-route__lead">{text.intro}</p>
          <p className="brand-route__availability">{text.availability}</p>
          <div className="brand-route__actions">
            <ConversionLink
              eventName="work_with_me_contact"
              source="work_with_me_header"
              href={`/${language}#contact`}
              className="brand-button brand-button--primary min-h-[44px]"
            >
              {text.topCta}
            </ConversionLink>
            <ConversionLink
              eventName="resume_download"
              source="work_with_me_header"
              href={careerFacts.resume.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-button min-h-[44px]"
            >
              {text.downloadResume}
            </ConversionLink>
          </div>
        </div>
      </header>

      <section className="brand-route__section" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="brand-route__section-title">{text.evidenceTitle}</h2>
        <div className="brand-evidence-sheet">
          {text.evidence.map(([title, detail], index) => (
            <article key={title} className="brand-evidence-sheet__row">
              <span className="brand-evidence-sheet__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-route__section brand-recruiter__split">
        <div>
          <h2 className="brand-route__section-title">{text.rolesTitle}</h2>
          <ul className="brand-role-list">
            {text.roles.map((role, index) => (
              <li key={role}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{role}</li>
            ))}
          </ul>
        </div>
        <div className="brand-method-note">
          <p className="brand-route__eyebrow">{text.methodLabel}</p>
          <h2>{text.approachTitle}</h2>
          <p>{text.approach}</p>
        </div>
      </section>

      <section className="brand-route__section" aria-labelledby="consulting-heading">
        <div className="brand-route__section-heading">
          <p className="brand-route__eyebrow">{text.methodLabel}</p>
          <h2 id="consulting-heading" className="brand-route__section-title">{text.consultingTitle}</h2>
          <p className="brand-route__lead">{text.consultingIntro}</p>
        </div>
        <div className="brand-evidence-sheet">
          {text.consulting.map((service, index) => (
            <article key={service.title} className="brand-evidence-sheet__row">
              <span className="brand-evidence-sheet__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{service.title}</h3>
              <p><strong>{language === 'fa' ? 'خروجی:' : 'Output:'}</strong> {service.output}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-route__cta" aria-labelledby="recruiter-contact-heading">
        <p className="brand-route__eyebrow">{text.contactLabel}</p>
        <h2 id="recruiter-contact-heading">{text.cta}</h2>
        <div className="brand-route__actions">
          <ConversionLink
            eventName="work_with_me_contact"
            source="work_with_me_page"
            href={`/${language}#contact`}
            className="brand-button brand-button--primary"
          >
            {text.cta}
          </ConversionLink>
          <ConversionLink
            eventName="contact_email_click"
            source="work_with_me_page"
            href={`mailto:${personalData.email}`}
            className="brand-button brand-button--inverse"
          >
            {text.email}
          </ConversionLink>
        </div>
      </section>
    </div>
  );
}
