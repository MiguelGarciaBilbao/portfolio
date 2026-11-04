import { getTranslations } from 'next-intl/server';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';
import { CopyEmail } from '@/components/ui/CopyEmail';

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations('hero');
  const tc = await getTranslations('contact');
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
      {/* "Full Stack" no se parte entre líneas (el rol se equilibra con text-wrap: balance) */}
      <p className="hero__role">{profile.role[locale].replace('Full Stack', 'Full\u00a0Stack')}</p>
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
      <div className="hero__reach">
        <p className="hero__seeking">
          <span>{profile.seeking[locale]}</span>{' '}
          <span className="hero__where">{profile.location[locale]}</span>
        </p>
        <p className="hero__address">
          <a href={`mailto:${profile.email}`} className="hero__email">
            {profile.email}
          </a>
          <CopyEmail
            email={profile.email}
            label={tc('copy')}
            done={tc('copied')}
            className="btn btn--ghost btn--sm"
          />
        </p>
      </div>
    </section>
  );
}
