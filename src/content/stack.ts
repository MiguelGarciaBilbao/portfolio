import type { Category, Localized } from './types';

export interface StackLayer {
  id: 'ui' | 'svc' | 'ai' | 'data' | 'cloud';
  category: Category;
  name: Localized<string>;
  what: Localized<string>;
  tags: Localized<string[]>;
  used: Localized<string[]>;
}

const same = (tags: string[]): Localized<string[]> => ({ es: tags, en: tags });

export const stackLayers: StackLayer[] = [
  {
    id: 'ui',
    category: 'frontend',
    name: { es: 'Interfaz', en: 'Interface' },
    what: {
      es: 'Aplicaciones Angular grandes, mantenibles y rápidas, de legacy a v20.',
      en: 'Large, maintainable, fast Angular applications, from legacy to v20.',
    },
    tags: same([
      'Angular v20',
      'Signals',
      'Standalone',
      'SSR / Hydration',
      'RxJS',
      'NgRx',
      'Signal Stores',
      'TypeScript',
      'Web Components',
      'SVG',
      'Micro-frontends',
      'Tailwind',
    ]),
    used: {
      es: [
        'Arquitectura frontend en nettrim',
        'Librería de Web Components para el despiece de piezas OEM en Softeca',
        'Migración legacy de 8 módulos a Angular',
      ],
      en: [
        'Frontend architecture at nettrim',
        'Web Components library for OEM parts breakdown at Softeca',
        '8-module legacy migration to Angular',
      ],
    },
  },
  {
    id: 'svc',
    category: 'backend',
    name: { es: 'Servicios', en: 'Services' },
    what: {
      es: 'APIs y lógica de negocio que conectan el frontend con los datos.',
      en: 'APIs and business logic connecting the frontend to the data.',
    },
    tags: same(['.NET / C#', 'Java (Spring)', 'Node.js', 'REST APIs', 'Entity Framework Core']),
    used: {
      es: [
        'Backends .NET y Java para las SPAs de Softeca',
        'Funcionalidades end-to-end con Node.js en nettrim',
      ],
      en: [
        ".NET and Java backends for Softeca's SPAs",
        'End-to-end features with Node.js at nettrim',
      ],
    },
  },
  {
    id: 'ai',
    category: 'ai',
    name: { es: 'IA aplicada', en: 'Applied AI' },
    what: {
      es: 'Sistemas que recuperan contexto y generan respuestas útiles sobre datos reales.',
      en: 'Systems that retrieve context and generate useful answers over real data.',
    },
    tags: {
      es: [
        'Python',
        'RAG',
        'Embeddings',
        'Amazon Bedrock',
        'Hugging Face',
        'Transformers',
        'OSINT',
        'Datos sintéticos',
        'Series temporales',
      ],
      en: [
        'Python',
        'RAG',
        'Embeddings',
        'Amazon Bedrock',
        'Hugging Face',
        'Transformers',
        'OSINT',
        'Synthetic data',
        'Time series',
      ],
    },
    used: {
      es: [
        'Pipeline RAG del Data Intelligence Hub (ESG)',
        'TFM: predicción de hipoglucemias con series temporales',
      ],
      en: [
        'Data Intelligence Hub RAG pipeline (ESG)',
        'Thesis: hypoglycaemia prediction with time series',
      ],
    },
  },
  {
    id: 'data',
    category: 'backend',
    name: { es: 'Datos', en: 'Data' },
    what: {
      es: 'Modelado y persistencia, relacional, documental y vectorial.',
      en: 'Modelling and storage: relational, document and vector.',
    },
    tags: {
      es: ['PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB', 'Capa vectorial'],
      en: ['PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB', 'Vector layer'],
    },
    used: {
      es: [
        'Modelo de datos ESG con embeddings en nettrim',
        'PostgreSQL en funcionalidades end-to-end',
      ],
      en: ['ESG data model with embeddings at nettrim', 'PostgreSQL in end-to-end features'],
    },
  },
  {
    id: 'cloud',
    category: 'product',
    name: { es: 'Cloud y entrega', en: 'Cloud & delivery' },
    what: {
      es: 'Cómo llega el código a producción y cómo se mantiene la calidad.',
      en: 'How code reaches production and how quality holds up.',
    },
    tags: same([
      'AWS (Bedrock, S3, ECS)',
      'Azure',
      'Docker',
      'Azure DevOps',
      'CI/CD',
      'Jest',
      'Cypress',
      'Playwright',
      'OWASP',
      'Claude Code',
    ]),
    used: {
      es: [
        'Despliegue automatizado con CI/CD en nettrim',
        'Code review como Technical Lead en Softeca',
        'Desarrollo asistido por agentes, con revisión de cada cambio',
      ],
      en: [
        'Automated CI/CD deployment at nettrim',
        'Code review as Technical Lead at Softeca',
        'Agent-assisted development, reviewing every change',
      ],
    },
  },
];
