import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { homeMetadata, personJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { Metrics } from '@/components/sections/Metrics';
import { Experience } from '@/components/sections/Experience';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';

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
      {/* 04 Stack · 05 RAG · 06 Proyectos (Task 7b) */}
      <Experience locale={locale} />
      <Education locale={locale} />
      <Contact locale={locale} />
    </main>
  );
}
