import type { Category } from '@/content/types';

/** Cabecera de sección: nodo de categoría (mismo color que en el cerebro) + h2 + intro. */
export function SectionHeader({
  id,
  cat,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  cat?: Category;
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="section-header">
      {eyebrow && (
        <p className="node-mark" data-cat={cat ?? 'product'}>
          {eyebrow}
        </p>
      )}
      <h2 id={`${id}-title`} className="h-section">
        {title}
      </h2>
      {intro && <p className="prose-muted section-header__intro">{intro}</p>}
    </header>
  );
}
