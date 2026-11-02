import { getTranslations } from 'next-intl/server';
import { metrics } from '@/content/metrics';
import type { Locale } from '@/content/types';
import { CountUp } from '@/components/fx/CountUp';

export async function Metrics({ locale }: { locale: Locale }) {
  const t = await getTranslations('metrics');
  return (
    <section id="metrics" aria-labelledby="metrics-title" className="metrics">
      <div className="wrap">
        <h2 id="metrics-title" className="sr-only">
          {t('title')}
        </h2>
        <dl className="metrics__list">
          {metrics.map((m) => (
            <div key={m.id} className="metrics__item">
              <dt className="metrics__label">{m.label[locale]}</dt>
              <dd className="metrics__value">
                <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix[locale]} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
