import { getTranslations } from 'next-intl/server';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';
import { CopyEmail } from '@/components/ui/CopyEmail';
import { Portrait } from '@/components/ui/Portrait';

export async function Contact({ locale }: { locale: Locale }) {
  const t = await getTranslations('contact');
  const tc = await getTranslations('common');
  return (
    <section id="contact" aria-labelledby="contact-title" className="section contact">
      <div className="wrap contact__grid">
        <h2 id="contact-title" className="display contact__title">
          {t('title')}
        </h2>
        <div className="contact__body">
          <p className="lead contact__lead">{profile.lookingFor[locale]}</p>
          <a href={`mailto:${profile.email}`} className="contact__email">
            {profile.email}
          </a>
          <div className="contact__actions">
            <CopyEmail email={profile.email} label={t('copy')} done={t('copied')} />
            <a href={profile.cv.es} className="btn btn--ghost" download hrefLang="es">
              {t('cvEs')}
            </a>
            <a href={profile.cv.en} className="btn btn--ghost" download hrefLang="en">
              {t('cvEn')}
            </a>
            <a href={profile.linkedin} className="btn btn--ghost" rel="me noopener" target="_blank">
              LinkedIn
            </a>
            <a href={profile.github} className="btn btn--ghost" rel="me noopener" target="_blank">
              GitHub
            </a>
          </div>
        </div>
        <Portrait
          image={profile.portrait.image}
          width={profile.portrait.width}
          height={profile.portrait.height}
          video={profile.portrait.video}
          alt={profile.portrait.alt[locale]}
        />
      </div>
      <footer className="wrap site-footer">
        <p>{tc('copyright')}</p>
        <p>{profile.location[locale]}</p>
      </footer>
    </section>
  );
}
