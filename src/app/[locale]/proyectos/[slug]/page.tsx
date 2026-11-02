import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProject, projects } from '@/content/projects';
import { LOCALES, type Category, type Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { buildMetadata, projectJsonLd } from '@/lib/seo';
import { profile } from '@/content/profile';
import { JsonLd } from '@/components/ui/JsonLd';
import { ProjectArt } from '@/components/projects/ProjectArt';
import { ProjectDiagram } from '@/components/projects/ProjectDiagram';

type Params = Promise<{ locale: Locale; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

const CATEGORY: Record<'rag' | 'timeseries' | 'oem', Category> = {
  rag: 'ai',
  timeseries: 'ai',
  oem: 'frontend',
};

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    href: { pathname: '/proyectos/[slug]', params: { slug: project.slug } },
    title: `${project.title[locale]} · ${profile.name}`,
    description: project.summary[locale],
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const tc = await getTranslations('common');

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const title = project.title[locale];

  return (
    <main id="main" tabIndex={-1} className="project-page">
      <JsonLd data={projectJsonLd(project.slug, locale)} />
      <div className="wrap">
        <nav aria-label={t('breadcrumb')} className="breadcrumb">
          <ol>
            <li>
              <Link href="/">{tc('home')}</Link>
            </li>
            <li>
              <Link href={{ pathname: '/', hash: 'projects' }}>{t('eyebrow')}</Link>
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>

        <header className="project-hero">
          <div className="project-hero__text">
            <p className="node-mark" data-cat={CATEGORY[project.diagram]}>
              {project.org}
            </p>
            <h1 className="display project-hero__title">{title}</h1>
            <p className="lead project-hero__lead">{project.summary[locale]}</p>
            <dl className="project-facts" aria-label={t('details')}>
              <div>
                <dt>{t('role')}</dt>
                <dd>{project.role[locale]}</dd>
              </div>
              <div>
                <dt>{t('period')}</dt>
                <dd>{project.period[locale]}</dd>
              </div>
              <div>
                <dt>{t('org')}</dt>
                <dd>{project.org}</dd>
              </div>
            </dl>
          </div>
          <div className="project-hero__art">
            <ProjectArt kind={project.diagram} thresholdLabel={t('threshold')} />
          </div>
        </header>

        <div className="project-body">
          {project.sections[locale].map((s) => (
            <Fragment key={s.id}>
              <section aria-labelledby={`${s.id}-title`} className="project-section">
                <h2 id={`${s.id}-title`} className="project-section__title">
                  {s.heading}
                </h2>
                <div className="project-section__body">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {s.id === 'architecture' && (
                    <ProjectDiagram
                      kind={project.diagram}
                      labels={project.diagramLabels[locale]}
                      title={t('diagram')}
                    />
                  )}
                </div>
              </section>
              {/* §6: Stack va justo después de Arquitectura */}
              {s.id === 'architecture' && (
                <section aria-labelledby="stack-title" className="project-section">
                  <h2 id="stack-title" className="project-section__title">
                    {t('stack')}
                  </h2>
                  <ul className="chip-list project-section__body">
                    {project.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </Fragment>
          ))}
        </div>

        <footer className="project-next">
          <Link
            href={{ pathname: '/proyectos/[slug]', params: { slug: next.slug } }}
            className="project-next__link"
          >
            <span className="project-next__label">{t('next')}</span>
            <span className="project-next__title">{next.title[locale]}</span>
          </Link>
          <div className="project-next__talk">
            <p>{t('talk')}</p>
            <a href={`/${locale}#contact`} className="btn btn--ghost">
              {t('contact')}
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
