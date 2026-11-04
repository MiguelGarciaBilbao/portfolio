'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from '@/i18n/navigation';
import type { Category, ProjectSlug, SectionId } from '@/content/types';
import { useCorpus } from '@/components/corpus/CorpusProvider';

export interface AskQAView {
  id: string;
  question: string;
  answer: string;
  sources: string[];
}

export interface AskNodeView {
  id: string;
  category: Category;
  title: string;
  href: { section: SectionId } | { project: ProjectSlug };
}

/** Alto del fundido bajo el cerebro fijo en una columna (`.hero-grid__stage::before`). */
const STAGE_FADE = 24;

export function AskCorpus({
  qa,
  nodes,
  labels,
}: {
  qa: AskQAView[];
  nodes: Record<string, AskNodeView>;
  labels: {
    title: string;
    subtitle: string;
    questions: string;
    retrieving: string;
    sources: string;
    idle: string;
    disclaimer: string;
  };
}) {
  const { state, select, setHovered } = useCorpus();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  // La pregunta automática no se anuncia: el lector de pantalla solo oye lo que el visitante pidió.
  const [userAsked, setUserAsked] = useState(false);
  const latest = useRef({ qaId: state.qaId, select });
  useEffect(() => {
    latest.current = { qaId: state.qaId, select };
  }, [state.qaId, select]);

  // Al entrar el panel en pantalla, el corpus responde la primera pregunta (una sola vez y solo si
  // el visitante aún no ha elegido): la demostración no espera a que alguien descubra los botones.
  const firstId = qa[0]?.id;
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !firstId || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        if (!latest.current.qaId) latest.current.select(firstId);
      },
      { threshold: 0.6 },
    );
    io.observe(panel);
    return () => io.disconnect();
  }, [firstId]);

  const questionsRef = useRef<HTMLDivElement>(null);
  // En una columna el cerebro queda fijo arriba: si la respuesta no cabe bajo él, la página se
  // coloca para que la fila de preguntas quede justo debajo del cerebro y el panel a continuación.
  // Solo tras una elección del visitante; la respuesta automática nunca mueve el scroll.
  const reveal = () => {
    const row = questionsRef.current;
    const panel = panelRef.current;
    if (!row || !panel || !window.matchMedia('(max-width: 1023px)').matches) return;
    const stage = row.closest('.hero-grid')?.querySelector('.hero-grid__stage');
    const top = (stage?.getBoundingClientRect().bottom ?? 0) + STAGE_FADE;
    const rowTop = row.getBoundingClientRect().top;
    const panelBottom = panel.getBoundingClientRect().bottom;
    if (rowTop >= top - 1 && panelBottom <= window.innerHeight) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollBy({ top: rowTop - top, behavior: reduce ? 'auto' : 'smooth' });
  };

  const choose = (id: string) => {
    setUserAsked(true);
    select(id);
    reveal();
  };
  const current = qa.find((q) => q.id === state.qaId);
  const selectedIndex = qa.findIndex((q) => q.id === state.qaId);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    const next = (i + delta + qa.length) % qa.length;
    refs.current[next]?.focus();
    choose(qa[next].id);
  };

  const showSources =
    state.status === 'retrieving' || state.status === 'answering' || state.status === 'done';

  return (
    <section id="ask" aria-labelledby="ask-title" className="ask">
      <h2 id="ask-title" className="ask__title">
        {labels.title}
      </h2>
      <p className="prose-muted ask__subtitle">{labels.subtitle}</p>

      <div
        ref={questionsRef}
        role="radiogroup"
        aria-label={labels.questions}
        className="ask__questions"
      >
        {qa.map((q, i) => {
          const checked = q.id === state.qaId;
          return (
            <button
              key={q.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked || (selectedIndex === -1 && i === 0) ? 0 : -1}
              className="ask__q"
              onClick={() => choose(q.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {q.question}
            </button>
          );
        })}
      </div>

      <div className="ask__panel" data-status={state.status} ref={panelRef}>
        <div className="ask__live">
          <p className="ask__prompt mono" aria-hidden="true">
            <span className="ask__caret">&gt;</span> query:{' '}
            {current ? (
              `"${current.question}"`
            ) : (
              <span className="ask__placeholder">{labels.idle}</span>
            )}
          </p>

          {state.status === 'retrieving' && (
            <p className="ask__retrieving mono" role="status">
              {labels.retrieving}
            </p>
          )}

          {current && (state.status === 'answering' || state.status === 'done') && (
            <>
              <p className="ask__answer" aria-hidden="true" data-testid="ask-answer">
                {current.answer.slice(0, state.shown)}
                {state.status === 'answering' && <span className="ask__cursor" />}
              </p>
            </>
          )}
          <p className="sr-only" aria-live="polite">
            {userAsked && current && state.status === 'done' ? current.answer : ''}
          </p>

          {current && showSources && (
            <div className="ask__sources" data-testid="ask-sources">
              <p className="ask__sources-label">{labels.sources}</p>
              <ul className="chip-list">
                {current.sources.map((id, i) => {
                  const node = nodes[id];
                  if (!node) return null;
                  const href =
                    'project' in node.href
                      ? {
                          pathname: '/proyectos/[slug]' as const,
                          params: { slug: node.href.project },
                        }
                      : { pathname: '/' as const, hash: node.href.section };
                  return (
                    <li key={id} style={{ animationDelay: `${i * 90}ms` }} className="ask__source">
                      <Link
                        href={href}
                        className="chip ask__source-link"
                        data-cat={node.category}
                        onPointerEnter={() => setHovered(id)}
                        onPointerLeave={() => setHovered(null)}
                        onFocus={() => setHovered(id)}
                        onBlur={() => setHovered(null)}
                      >
                        {node.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {/* Medida: todas las respuestas apiladas e invisibles en la misma celda. El panel mide lo
            que la más larga en cualquier idioma y ancho, y no salta al cambiar de pregunta. */}
        <div className="ask__sizer" aria-hidden="true" inert>
          {qa.map((q) => (
            <div key={q.id}>
              <p className="ask__prompt mono">&gt; query: &quot;{q.question}&quot;</p>
              <p className="ask__answer">{q.answer}</p>
              <div className="ask__sources">
                <p className="ask__sources-label">{labels.sources}</p>
                <ul className="chip-list">
                  {q.sources.map((id) =>
                    nodes[id] ? (
                      <li key={id}>
                        <span className="chip ask__source-link" data-cat={nodes[id].category}>
                          {nodes[id].title}
                        </span>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="ask__disclaimer">{labels.disclaimer}</p>
    </section>
  );
}
