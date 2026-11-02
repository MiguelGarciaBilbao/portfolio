import { getTranslations } from 'next-intl/server';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations('hero');
  const [first, ...rest] = profile.name.split(' ');

  return (
    <section id="hero" aria-labelledby="hero-title" className="hero">
      <ul className="hero__status" aria-label={profile.location[locale]}>
        {profile.status[locale].map((s, i) => (
          <li key={s} className="node-mark" data-cat={i === 0 ? 'frontend' : 'ai'}>
            {s}
          </li>
        ))}
      </ul>
      <h1 id="hero-title" className="display hero__title">
        <span>{first}</span> <span>{rest.join(' ')}</span>
      </h1>
      <p className="hero__role">{profile.role[locale]}</p>
      <p className="lead hero__lead">{profile.lead[locale]}</p>
      <p className="prose-muted hero__body">{profile.body[locale]}</p>
      <div className="hero__actions">
        <a href="#projects" className="btn btn--primary">
          {t('ctaProjects')}
        </a>
        <a href={profile.cv[locale]} className="btn btn--ghost" download>
          {t('ctaCv')}
        </a>
        <a href={`mailto:${profile.email}`} className="btn btn--ghost">
          {t('ctaEmail')}
        </a>
      </div>
    </section>
  );
}
