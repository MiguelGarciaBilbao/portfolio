import { getTranslations } from 'next-intl/server';
import { projects } from '@/content/projects';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectArt } from '@/components/projects/ProjectArt';
import { TiltCard } from '@/components/projects/TiltCard';

const THRESHOLD: Record<Locale, string> = {
  es: 'umbral de hipoglucemia',
  en: 'hypoglycaemia threshold',
};

export async function Projects({ locale }: { locale: Locale }) {
  const t = await getTranslations('projects');
  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="wrap">
        <SectionHeader id="projects" cat="backend" eyebrow={t('eyebrow')} title={t('title')} />
        <ul className="project-grid">
          {projects.map((p) => (
            <li key={p.slug}>
              <TiltCard className="project-card">
                <Link
                  href={{ pathname: '/proyectos/[slug]', params: { slug: p.slug } }}
                  className="project-card__link"
                >
                  <div className="project-card__art">
                    <ProjectArt kind={p.diagram} thresholdLabel={THRESHOLD[locale]} />
                  </div>
                  <div className="project-card__body">
                    <p className="project-card__org">{p.org}</p>
                    <h3 className="project-card__title">{p.title[locale]}</h3>
                    <p className="project-card__line">{p.cardLine[locale]}</p>
                    <ul className="chip-list" aria-label={t('stack')}>
                      {p.stack.slice(0, 4).map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <span className="project-card__cta">{t('view')}</span>
                  </div>
                </Link>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
