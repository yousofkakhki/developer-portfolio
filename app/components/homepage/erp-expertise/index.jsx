// @flow strict
import { getTranslations } from 'next-intl/server';
import { erpExpertise } from '@/utils/data/erp-expertise';

const capabilityIndexes = ['01', '02', '03'];

export default async function ERPExpertise() {
  const t = await getTranslations('erpExpertise');
  const capabilities = erpExpertise.capabilities.map((key, index) => ({
    key,
    index: capabilityIndexes[index],
    title: t(`capabilities.${key}.title`),
    description: t(`capabilities.${key}.description`),
  }));

  return (
    <section
      id="erp-expertise"
      aria-labelledby="erp-expertise-heading"
      className="brand-section"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400">
            {t('eyebrow')}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-slate-700" />
          <span className="brand-chip font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-200">
            {t('deliveryBadge')}
          </span>
        </div>

        <h2 id="erp-expertise-heading" className="brand-section__title mb-4 text-3xl font-semibold text-slate-100">
          {t('title')}
        </h2>
        <p className="mb-10 max-w-3xl leading-relaxed text-slate-300">
          {t('intro')}
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {capabilities.map(capability => (
            <article
              key={capability.key}
              className="brand-panel group p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-400">{capability.index}</span>
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan-400/70 transition-transform group-hover:scale-125" />
              </div>
              <h3 className="mb-3 text-lg font-medium text-slate-100">
                {capability.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {capability.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
