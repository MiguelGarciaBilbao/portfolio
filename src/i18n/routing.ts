import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/proyectos/[slug]': { es: '/proyectos/[slug]', en: '/projects/[slug]' },
  },
});
