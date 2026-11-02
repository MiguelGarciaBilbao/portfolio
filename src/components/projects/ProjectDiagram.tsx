/**
 * Diagrama de arquitectura de cada proyecto (spec §6). SVG estático, sin JS.
 * Las etiquetas llegan por props desde `project.diagramLabels[locale]`; aquí no hay texto.
 * Se pintan dos composiciones (ancha y alta) y el CSS muestra la que cabe.
 */

type Kind = 'rag' | 'timeseries' | 'oem';
type Tone = 'mint' | 'cyan' | 'violet';
type Pt = { x: number; y: number };

const TONES: Record<Kind, Tone[]> = {
  rag: ['cyan', 'mint', 'mint', 'cyan', 'violet', 'violet'],
  timeseries: ['cyan', 'violet', 'mint'],
  oem: ['mint', 'mint', 'cyan', 'cyan'],
};

const NODE_W = 220;
const NODE_H = 68;
const LINE_H = 19;

/** Parte la etiqueta en líneas de ~22 caracteres respetando palabras. */
function wrap(label: string, max = 22): string[] {
  const lines: string[] = [];
  for (const word of label.split(' ')) {
    const last = lines[lines.length - 1];
    if (last && (last + ' ' + word).length <= max) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
  }
  return lines;
}

interface Layout {
  w: number;
  h: number;
  nodes: Pt[];
  /** índice del nodo al que vuelve el último (bucle del RAG) */
  loopTo?: number;
}

function layoutFor(kind: Kind, n: number, shape: 'wide' | 'tall'): Layout {
  const pad = 24;
  if (kind === 'oem') {
    // capas en cascada, de la interfaz al backend: el mismo "despiece" del stack
    const off = 30;
    const nodes = Array.from({ length: n }, (_, i) => ({ x: pad + i * off, y: pad + i * 96 }));
    return { w: pad * 2 + (n - 1) * off + NODE_W, h: pad * 2 + (n - 1) * 96 + NODE_H, nodes };
  }
  const loopTo = kind === 'rag' ? 1 : undefined;
  if (shape === 'tall') {
    const nodes = Array.from({ length: n }, (_, i) => ({ x: pad, y: pad + i * 104 }));
    return { w: pad * 2 + NODE_W + 70, h: pad * 2 + (n - 1) * 104 + NODE_H, nodes, loopTo };
  }
  const cols = kind === 'rag' ? 3 : n;
  const nodes = Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = row % 2 === 0 ? i % cols : cols - 1 - (i % cols); // serpiente
    return { x: pad + col * (NODE_W + 56), y: pad + row * (NODE_H + 70) };
  });
  const rows = Math.ceil(n / cols);
  return {
    w: pad * 2 + cols * NODE_W + (cols - 1) * 56,
    h: pad * 2 + rows * NODE_H + (rows - 1) * 70 + (loopTo !== undefined ? 40 : 0),
    nodes,
    loopTo,
  };
}

/** Une el borde del nodo `a` con el del `b` siguiendo la dirección dominante. */
function connector(a: Pt, b: Pt): string {
  const ac = { x: a.x + NODE_W / 2, y: a.y + NODE_H / 2 };
  const bc = { x: b.x + NODE_W / 2, y: b.y + NODE_H / 2 };
  if (Math.abs(bc.x - ac.x) > Math.abs(bc.y - ac.y)) {
    const dir = Math.sign(bc.x - ac.x);
    return `M${ac.x + (dir * NODE_W) / 2},${ac.y} L${bc.x - (dir * NODE_W) / 2 - dir * 6},${bc.y}`;
  }
  const dir = Math.sign(bc.y - ac.y);
  return `M${ac.x},${ac.y + (dir * NODE_H) / 2} L${bc.x},${bc.y - (dir * NODE_H) / 2 - dir * 6}`;
}

function loopPath(l: Layout, shape: 'wide' | 'tall'): string | null {
  if (l.loopTo === undefined) return null;
  const from = l.nodes[l.nodes.length - 1];
  const to = l.nodes[l.loopTo];
  if (shape === 'tall') {
    const x = from.x + NODE_W + 34;
    return `M${from.x + NODE_W},${from.y + NODE_H / 2} H${x} V${to.y + NODE_H / 2} H${to.x + NODE_W + 6}`;
  }
  const y = from.y + NODE_H + 30;
  return `M${from.x + NODE_W / 2},${from.y + NODE_H} V${y} H${to.x + NODE_W / 2} V${to.y + NODE_H + 6}`;
}

function Composition({
  kind,
  labels,
  shape,
  markerId,
}: {
  kind: Kind;
  labels: string[];
  shape: 'wide' | 'tall';
  markerId: string;
}) {
  const l = layoutFor(kind, labels.length, shape);
  const tones = TONES[kind];
  const loop = loopPath(l, shape);
  return (
    <svg
      viewBox={`0 0 ${l.w} ${l.h}`}
      className={`project-diagram__svg project-diagram__svg--${shape}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" className="project-diagram__arrow" />
        </marker>
      </defs>
      {l.nodes.slice(1).map((b, i) => (
        <path
          key={i}
          d={connector(l.nodes[i], b)}
          className="project-diagram__edge"
          markerEnd={`url(#${markerId})`}
        />
      ))}
      {loop && (
        <path
          d={loop}
          className="project-diagram__edge project-diagram__edge--loop"
          markerEnd={`url(#${markerId})`}
        />
      )}
      {l.nodes.map((p, i) => {
        const lines = wrap(labels[i]);
        const top = p.y + NODE_H / 2 - ((lines.length - 1) * LINE_H) / 2;
        return (
          <g key={i} className="project-diagram__node" data-tone={tones[i % tones.length]}>
            <rect x={p.x} y={p.y} width={NODE_W} height={NODE_H} rx={14} />
            <text x={p.x + NODE_W / 2} y={top} textAnchor="middle" dominantBaseline="middle">
              {lines.map((line, j) => (
                <tspan key={j} x={p.x + NODE_W / 2} dy={j === 0 ? 0 : LINE_H}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ProjectDiagram({
  kind,
  labels,
  title,
}: {
  kind: Kind;
  labels: string[];
  title: string;
}) {
  // texto equivalente para lectores de pantalla: el flujo en orden
  const description = `${title}: ${labels.join(' → ')}${kind === 'rag' ? ` → ${labels[1]}` : ''}`;
  return (
    <figure
      className="project-diagram"
      data-kind={kind}
      data-testid="project-diagram"
      role="img"
      aria-label={description}
    >
      <Composition kind={kind} labels={labels} shape="wide" markerId={`arrow-${kind}-w`} />
      {kind !== 'oem' && (
        <Composition kind={kind} labels={labels} shape="tall" markerId={`arrow-${kind}-t`} />
      )}
    </figure>
  );
}
