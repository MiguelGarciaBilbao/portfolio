import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { alternatesFor, buildMetadata, personJsonLd, projectJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { profile } from '@/content/profile';

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.dev/'));
afterEach(() => vi.unstubAllEnvs());

describe('siteUrl', () => {
  test('strips trailing slash', () => expect(siteUrl()).toBe('https://example.dev'));
  test('defaults to localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(siteUrl()).toBe('http://localhost:3000');
  });
});

describe('alternatesFor', () => {
  test('project page in en', () => {
    expect(
      alternatesFor({ pathname: '/proyectos/[slug]', params: { slug: 'rag-esg' } }, 'en'),
    ).toEqual({
      canonical: 'https://example.dev/en/projects/rag-esg',
      languages: {
        es: 'https://example.dev/es/proyectos/rag-esg',
        en: 'https://example.dev/en/projects/rag-esg',
        'x-default': 'https://example.dev/es/proyectos/rag-esg',
      },
    });
  });
  test('home canonical', () => {
    expect(alternatesFor({ pathname: '/' }, 'es').canonical).toBe('https://example.dev/es');
  });
});

describe('json-ld', () => {
  test('person', () => {
    const p = personJsonLd('es') as Record<string, unknown> & {
      sameAs: string[];
      alumniOf: unknown[];
      worksFor: { name: string };
    };
    expect(p).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Miguel Alejandro García Bilbao',
    });
    expect(p.sameAs).toContain(profile.linkedin);
    expect(p.sameAs).toContain(profile.github);
    expect(p.alumniOf).toHaveLength(2);
    expect(p.worksFor.name).toBe('nettrim technology');
    expect(p).not.toHaveProperty('telephone');
  });
  test('project breadcrumb has 3 items', () => {
    const [work, crumbs] = projectJsonLd('tfm-hipoglucemia', 'en') as [
      Record<string, unknown>,
      { itemListElement: unknown[] },
    ];
    expect(work['@type']).toBe('CreativeWork');
    expect(work).toHaveProperty('author');
    expect(crumbs.itemListElement).toHaveLength(3);
  });
});

describe('metadata', () => {
  test('openGraph locale and canonical', () => {
    const es = buildMetadata({ locale: 'es', href: { pathname: '/' }, title: 't', description: 'd' });
    const en = buildMetadata({ locale: 'en', href: { pathname: '/' }, title: 't', description: 'd' });
    expect((es.openGraph as { locale: string }).locale).toBe('es_ES');
    expect((en.openGraph as { locale: string }).locale).toBe('en_GB');
    expect(es.alternates?.canonical).toBe('https://example.dev/es');
    expect((es.twitter as { card: string }).card).toBe('summary_large_image');
  });
});

describe('sitemap & robots', () => {
  test('sitemap has 8 entries with both languages', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(8);
    for (const e of entries) {
      expect(e.alternates?.languages).toHaveProperty('es');
      expect(e.alternates?.languages).toHaveProperty('en');
    }
    expect(entries.map((e) => e.url)).toContain('https://example.dev/en/projects/web-components-oem');
  });
  test('robots allows all and links sitemap', () => {
    expect(robots()).toEqual({
      rules: [{ userAgent: '*', allow: '/' }],
      sitemap: 'https://example.dev/sitemap.xml',
    });
  });
});
