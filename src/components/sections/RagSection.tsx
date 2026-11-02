import { getTranslations } from 'next-intl/server';
import { ragSteps } from '@/content/rag';
import type { Locale } from '@/content/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RagExplorer } from './RagExplorer';

export async function RagSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('rag');
  const steps = ragSteps.map((s) => ({
    id: s.id,
    label: s.label[locale],
    detail: s.detail[locale],
    tech: s.tech[locale],
  }));
  return (
    <section id="ai" aria-labelledby="ai-title" className="section">
      <div className="wrap">
        <SectionHeader id="ai" cat="ai" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
        <RagExplorer steps={steps} labels={{ steps: t('steps'), loop: t('loop') }} />
        <p className="rag-note">{t('note')}</p>
      </div>
    </section>
  );
}
