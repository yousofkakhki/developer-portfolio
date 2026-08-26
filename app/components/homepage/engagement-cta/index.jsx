import { getLocale, getTranslations } from 'next-intl/server';
import { ConversionLink } from '@/app/components/analytics/conversion-link';

export default async function EngagementCta() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'engagementCta' });

  return (
    <section className="brand-section" aria-labelledby="engagement-heading">
      <div className="brand-route__cta mx-auto max-w-5xl">
        <h2 id="engagement-heading">{t('title')}</h2>
        <p>{t('description')}</p>
        <ConversionLink
          eventName="work_with_me_view"
          source="homepage_engagement_cta"
          href={`/${locale}/work-with-me`}
          className="brand-button brand-button--primary"
        >
          {t('action')}
        </ConversionLink>
      </div>
    </section>
  );
}
