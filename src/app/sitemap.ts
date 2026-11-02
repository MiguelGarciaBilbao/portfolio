import type { MetadataRoute } from 'next';
import { LOCALES, PROJECT_SLUGS } from '@/content/types';
import { alternatesFor, type AppHref } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs: AppHref[] = [
    { pathname: '/' },
    ...PROJECT_SLUGS.map((slug) => ({ pathname: '/proyectos/[slug]' as const, params: { slug } })),
  ];
  return hrefs.flatMap((href) =>
    LOCALES.map((locale) => {
      const { canonical, languages } = alternatesFor(href, locale);
      return {
        url: canonical,
        changeFrequency: 'monthly' as const,
        priority: href.pathname === '/' ? 1 : 0.8,
        alternates: { languages: { es: languages.es, en: languages.en } },
      };
    }),
  );
}
