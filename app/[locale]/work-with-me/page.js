import { ConversionLink, ConversionView } from '@/app/components/analytics/conversion-link';
import { personalData } from '@/utils/data/personal-data';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';

const copy = {
  en: {
    title: 'Work with Yousef Kakhki',
    description: 'Senior backend, platform, and real-time media engineering for teams building reliable distributed systems.',
    eyebrow: 'For engineering leaders and recruiters',
    intro: 'Open to senior backend, platform, and real-time media opportunities in Germany and the Netherlands, including roles that support relocation.',
    evidenceTitle: 'What I bring',
    evidence: [
      ['Real-time media', 'Architecture experience with LiveKit, WebRTC, HLS, NATS JetStream, and Go on an educational platform serving 5,000+ concurrent users.'],
      ['Backend and platforms', 'Ten years across Node.js, Go, Python, PostgreSQL, Kafka, NATS, infrastructure, and production operations.'],
      ['Technical leadership', 'Hands-on architecture and engineering leadership across backend, infrastructure, embedded Linux, and cross-functional delivery.'],
    ],
    rolesTitle: 'Best-fit roles',
    roles: ['Senior Backend Engineer', 'Staff / Lead Backend Engineer', 'Platform Engineer', 'Real-Time Media Engineer', 'Solutions Architect'],
    approachTitle: 'How I work',
    approach: 'I am most useful where architecture and implementation meet: defining boundaries, making trade-offs explicit, diagnosing failure modes, and continuing to contribute directly to production code.',
    cta: 'Discuss a role or engineering problem',
    email: 'Email directly',
  },
  fa: {
    title: 'همکاری با یوسف کاخکی',
    description: 'مهندسی بک‌اند، پلتفرم و رسانهٔ بلادرنگ برای تیم‌هایی که سیستم‌های توزیع‌شدهٔ قابل‌اعتماد می‌سازند.',
    eyebrow: 'برای مدیران مهندسی و استخدام‌کنندگان',
    intro: 'برای فرصت‌های مهندسی ارشد بک‌اند، پلتفرم و رسانهٔ بلادرنگ در آلمان و هلند، از جمله موقعیت‌های همراه با جابه‌جایی، آمادهٔ گفتگو هستم.',
    evidenceTitle: 'تجربه‌ای که ارائه می‌کنم',
    evidence: [
      ['رسانهٔ بلادرنگ', 'تجربهٔ معماری با LiveKit، WebRTC، HLS، NATS JetStream و Go در یک پلتفرم آموزشی با بیش از ۵٬۰۰۰ کاربر همزمان.'],
      ['بک‌اند و پلتفرم', 'ده سال تجربه با Node.js، Go، Python، PostgreSQL، Kafka، NATS، زیرساخت و عملیات تولید.'],
      ['رهبری فنی', 'معماری و رهبری مهندسی همراه با مشارکت عملی در بک‌اند، زیرساخت، لینوکس نهفته و تحویل بین‌تیمی.'],
    ],
    rolesTitle: 'فرصت‌های مهندسی مناسب',
    roles: ['مهندس ارشد بک‌اند', 'مهندس Staff یا رهبر بک‌اند', 'مهندس پلتفرم', 'مهندس رسانهٔ بلادرنگ', 'معمار راهکار'],
    approachTitle: 'شیوهٔ همکاری من',
    approach: 'بیشترین ارزش را در نقطهٔ اتصال معماری و پیاده‌سازی ایجاد می‌کنم: تعریف مرزها، شفاف‌کردن مصالحه‌ها، تحلیل حالت‌های خرابی و مشارکت مستقیم در کد تولید.',
    cta: 'گفتگو دربارهٔ موقعیت یا مسئلهٔ مهندسی',
    email: 'ارسال ایمیل مستقیم',
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const language = locale === 'fa' ? 'fa' : 'en';
  const text = copy[language];
  const url = `${siteUrl}/${language}/work-with-me`;
  return {
    title: text.title,
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
  const text = copy[language];
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
    <div className="py-16 max-w-4xl mx-auto px-4">
      <ConversionView eventName="work_with_me_view" source="work_with_me_page" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <header className="mb-12">
        <p className="text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">{text.eyebrow}</p>
        <h1 className="text-4xl font-semibold text-slate-50 mb-5">{text.title}</h1>
        <p className="text-lg leading-relaxed text-slate-300 max-w-3xl">{text.intro}</p>
      </header>

      <section className="mb-12" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="text-2xl font-semibold text-slate-100 mb-6">{text.evidenceTitle}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {text.evidence.map(([title, detail]) => (
            <article key={title} className="border border-slate-700 bg-slate-800/50 rounded p-5">
              <h3 className="font-medium text-slate-100 mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2 mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">{text.rolesTitle}</h2>
          <ul className="space-y-2 text-slate-300">
            {text.roles.map(role => <li key={role}>— {role}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">{text.approachTitle}</h2>
          <p className="leading-relaxed text-slate-400">{text.approach}</p>
        </div>
      </section>

      <section className="border border-cyan-800/60 bg-cyan-950/20 rounded p-6">
        <h2 className="text-xl font-medium text-slate-100 mb-4">{text.cta}</h2>
        <div className="flex flex-wrap gap-4">
          <ConversionLink
            eventName="work_with_me_contact"
            source="work_with_me_page"
            href={`/${language}#contact`}
            className="inline-flex px-5 py-3 rounded bg-cyan-700 text-white hover:bg-cyan-600 transition-colors"
          >
            {text.cta}
          </ConversionLink>
          <ConversionLink
            eventName="contact_email_click"
            source="work_with_me_page"
            href={`mailto:${personalData.email}`}
            className="inline-flex px-5 py-3 rounded border border-slate-600 text-slate-200 hover:border-slate-400 transition-colors"
          >
            {text.email}
          </ConversionLink>
        </div>
      </section>
    </div>
  );
}
