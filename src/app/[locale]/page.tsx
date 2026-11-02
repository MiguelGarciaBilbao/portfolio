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
import { AskCorpus } from '@/components/sections/AskCorpus';
import { CorpusProvider } from '@/components/corpus/CorpusProvider';
import { corpusNodes, corpusQA } from '@/content/corpus';
import { getTranslations } from 'next-intl/server';
import { BrainStage } from '@/components/three/BrainStage';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return homeMetadata(locale);
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ask');
  const qa = corpusQA.map((q) => ({
    id: q.id,
    question: q.question[locale],
    answer: q.answer[locale],
    sources: q.sources,
  }));
  const nodes = Object.fromEntries(
    corpusNodes.map((n) => [n.id, { id: n.id, category: n.category, title: n.title[locale], href: n.href }]),
  );
  const brainNodes = corpusNodes.map((n) => ({ id: n.id, category: n.category }));
  const brainTitles = Object.fromEntries(corpusNodes.map((n) => [n.id, n.title[locale]]));
  const items = qa.map((q) => ({ id: q.id, sources: q.sources, length: q.answer.length }));
  const askLabels = {
    title: t('title'),
    subtitle: t('subtitle'),
    questions: t('questions'),
    retrieving: t('retrieving'),
    sources: t('sources'),
    idle: t('idle'),
    disclaimer: t('disclaimer'),
  };
  return (
    <main id="main" tabIndex={-1}>
      <JsonLd data={personJsonLd(locale)} />
      {/* 01 + 02: columna izquierda (Hero, AskCorpus) y escenario fijo del cerebro (Task 8/9) */}
      <CorpusProvider items={items}>
        <div className="wrap hero-grid">
          <div className="hero-grid__hero">
            <Hero locale={locale} />
          </div>
          <div className="hero-grid__stage">
            <BrainStage nodes={brainNodes} titles={brainTitles} />
          </div>
          <div className="hero-grid__ask">
            <AskCorpus qa={qa} nodes={nodes} labels={askLabels} />
          </div>
        </div>
      </CorpusProvider>
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
