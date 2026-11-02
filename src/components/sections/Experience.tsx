import { getTranslations } from 'next-intl/server';
import { experience } from '@/content/experience';
import type { Locale } from '@/content/types';
import { SectionHeader } from '@/components/ui/SectionHeader';

export async function Experience({ locale }: { locale: Locale }) {
  const t = await getTranslations('experience');
  return (
    <section id="experience" aria-labelledby="experience-title" className="section">
      <div className="wrap index-grid">
        <SectionHeader id="experience" title={t('title')} intro={t('intro')} />
        <ol className="timeline">
          {experience.map((job) => (
            <li key={job.id}>
              <article className="timeline__item">
                <p className="timeline__period">
                  <time>{job.period[locale]}</time>
                </p>
                <h3 className="timeline__title">{job.title[locale]}</h3>
                <p className="timeline__org">
                  {job.org}, {job.place[locale]}
                </p>
                <details className="timeline__details">
                  <summary>{t('details')}</summary>
                  {job.groups.map((g, gi) => (
                    <div key={gi} className="timeline__group">
                      {g.heading && <h4>{g.heading[locale]}</h4>}
                      <ul>
                        {g.bullets[locale].map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </details>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
