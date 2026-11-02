import { getTranslations } from 'next-intl/server';
import { education, languages } from '@/content/education';
import type { Locale } from '@/content/types';
import { SectionHeader } from '@/components/ui/SectionHeader';

export async function Education({ locale }: { locale: Locale }) {
  const t = await getTranslations('education');
  return (
    <section id="education" aria-labelledby="education-title" className="section section--tight">
      <div className="wrap index-grid">
        <SectionHeader id="education" title={t('title')} />
        <div>
          <ul className="edu">
            {education.map((e) => (
              <li key={e.id} className="edu__item">
                <h3 className="edu__title">{e.title[locale]}</h3>
                <p className="edu__meta">
                  {e.org} <span aria-hidden="true">/</span> {e.period[locale]}
                </p>
                {e.detail && <p className="prose-muted edu__detail">{e.detail[locale]}</p>}
              </li>
            ))}
          </ul>
          <p className="edu__langs">
            <strong>{t('languages')}:</strong> {languages[locale]}
          </p>
        </div>
      </div>
    </section>
  );
}
