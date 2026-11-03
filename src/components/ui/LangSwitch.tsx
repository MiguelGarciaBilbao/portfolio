'use client';

import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LangSwitch() {
  const t = useTranslations('common');
  const locale = useLocale();
  const params = useParams<{ slug?: string }>();

  // Solo con el slug de la ruta: usePathname() devuelve la ruta interna (/proyectos/…) en las
  // páginas EN renderizadas en servidor y el href acababa apuntando a la home.
  const href = params.slug
    ? { pathname: '/proyectos/[slug]' as const, params: { slug: params.slug } }
    : { pathname: '/' as const };

  return (
    <nav aria-label={t('language')} className="lang-switch">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={href}
          locale={l}
          aria-current={l === locale ? 'true' : undefined}
          hrefLang={l}
          lang={l}
          className="lang-switch__item"
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
