import { getTranslations } from 'next-intl/server';
import { stackLayers } from '@/content/stack';
import type { Locale } from '@/content/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StackExplorer } from './StackExplorer';

export async function StackSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('stack');
  const layers = stackLayers.map((l) => ({
    id: l.id,
    category: l.category,
    name: l.name[locale],
    what: l.what[locale],
    tags: l.tags[locale],
    used: l.used[locale],
  }));
  return (
    <section id="stack" aria-labelledby="stack-title" className="section">
      <div className="wrap">
        <SectionHeader id="stack" cat="frontend" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
        <StackExplorer layers={layers} labels={{ layers: t('layers'), used: t('used') }} />
      </div>
    </section>
  );
}
