import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { homeMetadata, personJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { Metrics } from '@/components/sections/Metrics';
import { Experience } from '@/components/sections/Experience';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { StackSection } from '@/components/sections/StackSection';
import { RagSection } from '@/components/sections/RagSection';
import { Projects } from '@/components/sections/Projects';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return homeMetadata(locale);
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main" tabIndex={-1}>
      <JsonLd data={personJsonLd(locale)} />
      {/* 01 + 02: columna izquierda (Hero, AskCorpus) y escenario fijo del cerebro (Task 8/9) */}
      <div className="wrap hero-grid">
        <div className="hero-grid__content">
          <Hero locale={locale} />
        </div>
        <div className="hero-grid__stage" aria-hidden="true" />
      </div>
      <Metrics locale={locale} />
      <StackSection locale={locale} />
      <RagSection locale={locale} />
      <Projects locale={locale} />
      <Experience locale={locale} />
      <Education locale={locale} />
      <Contact locale={locale} />
    </main>
  );
}
