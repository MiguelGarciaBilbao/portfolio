import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { education } from '@/content/education';
import { getProject } from '@/content/projects';
import { profile } from '@/content/profile';
import type { Locale, ProjectSlug } from '@/content/types';
import { siteUrl } from './site';

export type AppHref =
  { pathname: '/' } | { pathname: '/proyectos/[slug]'; params: { slug: ProjectSlug } };

/** Ruta pública localizada a partir de routing.pathnames (fuente única). */
export function localizedPath(href: AppHref, locale: Locale): string {
  const entry = routing.pathnames[href.pathname];
  const template = typeof entry === 'string' ? entry : entry[locale];
  const path = 'params' in href ? template.replace('[slug]', href.params.slug) : template;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

export function alternatesFor(
  href: AppHref,
  locale: Locale,
): { canonical: string; languages: Record<'es' | 'en' | 'x-default', string> } {
  const base = siteUrl();
  const es = base + localizedPath(href, 'es');
  const en = base + localizedPath(href, 'en');
  return {
    canonical: locale === 'es' ? es : en,
    languages: { es, en, 'x-default': es },
  };
}

const OG_LOCALE: Record<Locale, string> = { es: 'es_ES', en: 'en_GB' };

export function clampDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export function buildMetadata(a: {
  locale: Locale;
  href: AppHref;
  title: string;
  description: string;
}): Metadata {
  const { canonical, languages } = alternatesFor(a.href, a.locale);
  const description = clampDescription(a.description);
  return {
    title: a.title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: a.href.pathname === '/' ? 'profile' : 'article',
      url: canonical,
      title: a.title,
      description,
      siteName: profile.name,
      locale: OG_LOCALE[a.locale],
      alternateLocale: OG_LOCALE[a.locale === 'es' ? 'en' : 'es'],
    },
    twitter: { card: 'summary_large_image', title: a.title, description },
  };
}

export const HOME_TITLE: Record<Locale, string> = {
  es: 'Miguel García Bilbao · Senior Software Engineer · IA aplicada (RAG, LLM) · Angular · .NET',
  en: 'Miguel García Bilbao · Senior Software Engineer · Applied AI (RAG, LLM) · Angular · .NET',
};

export function homeMetadata(locale: Locale): Metadata {
  return buildMetadata({
    locale,
    href: { pathname: '/' },
    title: HOME_TITLE[locale],
    description: profile.lead[locale],
  });
}

const KNOWS_ABOUT = [
  'Retrieval-Augmented Generation (RAG)',
  'Large Language Models',
  'Embeddings',
  'Amazon Bedrock',
  'Hugging Face',
  'Python',
  'Angular',
  'TypeScript',
  '.NET',
  'Java (Spring)',
  'Node.js',
  'PostgreSQL',
  'Web Components',
  'AWS',
  'Azure',
  'Time series forecasting',
];

export function personJsonLd(locale: Locale): Record<string, unknown> {
  const url = siteUrl() + localizedPath({ pathname: '/' }, locale);
  const unis = education.filter((e) => e.id === 'master-ai' || e.id === 'bsc');
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl()}/#person`,
    name: profile.fullName,
    alternateName: profile.name,
    jobTitle: profile.role[locale],
    description: profile.lead[locale],
    email: `mailto:${profile.email}`,
    url,
    image: `${url}/opengraph-image`,
    sameAs: [profile.linkedin, profile.github],
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: ['es', 'en'],
    alumniOf: unis.map((u) => ({ '@type': 'CollegeOrUniversity', name: u.org })),
    worksFor: { '@type': 'Organization', name: 'nettrim technology' },
    address: { '@type': 'PostalAddress', addressLocality: 'Burgos', addressCountry: 'ES' },
  };
}

export function projectJsonLd(slug: ProjectSlug, locale: Locale): Record<string, unknown>[] {
  const project = getProject(slug);
  if (!project) throw new Error(`Unknown project ${slug}`);
  const base = siteUrl();
  const url = base + localizedPath({ pathname: '/proyectos/[slug]', params: { slug } }, locale);
  const home = base + localizedPath({ pathname: '/' }, locale);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title[locale],
      description: project.summary[locale],
      url,
      inLanguage: locale,
      keywords: project.stack.join(', '),
      author: { '@type': 'Person', '@id': `${base}/#person`, name: profile.fullName },
      sourceOrganization: { '@type': 'Organization', name: project.org },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: locale === 'es' ? 'Inicio' : 'Home', item: home },
        {
          '@type': 'ListItem',
          position: 2,
          name: locale === 'es' ? 'Proyectos' : 'Projects',
          item: `${home}#projects`,
        },
        { '@type': 'ListItem', position: 3, name: project.title[locale], item: url },
      ],
    },
  ];
}
