import { getTranslations } from 'next-intl/server';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';
import { LangSwitch } from './LangSwitch';

const SECTIONS = ['stack', 'ai', 'projects', 'experience', 'contact'] as const;

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations('nav');
  const tc = await getTranslations('common');
  const links = SECTIONS.map((id) => ({ id, href: `/${locale}#${id}`, label: t(id) }));

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* nombre accesible = texto visible + nombre completo (WCAG 2.5.3, label in name) */}
        <a href={`/${locale}`} className="site-header__mark">
          {profile.initials}
          <span className="sr-only"> · {profile.name}</span>
        </a>
        <nav aria-label={tc('mainNav')} className="site-header__nav">
          {links.map((l) => (
            <a key={l.id} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="site-header__actions">
          <LangSwitch />
          <a href={profile.cv[locale]} className="btn btn--ghost btn--sm" download>
            {tc('downloadCv')}
          </a>
          <details className="site-header__menu">
            <summary aria-label={tc('menu')}>
              <span aria-hidden="true">☰</span>
            </summary>
            <nav aria-label={tc('menu')}>
              {links.map((l) => (
                <a key={l.id} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
