import { profile } from './profile';
import type { Category, Localized, ProjectSlug, SectionId } from './types';

export interface CorpusNode {
  id: string;
  category: Category;
  title: Localized<string>;
  href: { section: SectionId } | { project: ProjectSlug };
  source: 'cv' | 'project' | 'education';
}

export interface CorpusQA {
  id: string;
  question: Localized<string>;
  answer: Localized<string>;
  sources: string[];
}

type Href = CorpusNode['href'];
const sec = (section: SectionId): Href => ({ section });
const proj = (project: ProjectSlug): Href => ({ project });

function node(
  id: string,
  category: Category,
  es: string,
  en: string,
  href: Href,
  source: CorpusNode['source'] = 'cv',
): CorpusNode {
  return { id, category, title: { es, en }, href, source };
}

/** Un nodo por bullet del CV, habilidad agrupada, proyecto y formación (spec §7.3). */
export const corpusNodes: CorpusNode[] = [
  // frontend (16)
  node(
    'frontend-angular-v20',
    'frontend',
    'Angular 2+ hasta v20',
    'Angular 2+ to v20',
    sec('stack'),
  ),
  node(
    'frontend-signals',
    'frontend',
    'Signals y Standalone Components',
    'Signals and Standalone Components',
    sec('stack'),
  ),
  node('frontend-ssr', 'frontend', 'SSR / Hydration', 'SSR / Hydration', sec('stack')),
  node(
    'frontend-ngrx',
    'frontend',
    'Estado complejo con NgRx, RxJS y Signal Stores',
    'Complex state with NgRx, RxJS and Signal Stores',
    sec('experience'),
  ),
  node(
    'frontend-architecture',
    'frontend',
    'Arquitectura frontend en nettrim',
    'Frontend architecture at nettrim',
    sec('experience'),
  ),
  node(
    'frontend-typescript',
    'frontend',
    'TypeScript y JavaScript',
    'TypeScript and JavaScript',
    sec('stack'),
  ),
  node(
    'frontend-web-components',
    'frontend',
    'Librería de Web Components OEM',
    'OEM Web Components library',
    proj('web-components-oem'),
    'project',
  ),
  node(
    'frontend-svg',
    'frontend',
    'SVG interactivo',
    'Interactive SVG',
    proj('web-components-oem'),
    'project',
  ),
  node('frontend-micro-frontends', 'frontend', 'Micro-frontends', 'Micro-frontends', sec('stack')),
  node(
    'frontend-tailwind',
    'frontend',
    'Tailwind y Bootstrap',
    'Tailwind and Bootstrap',
    sec('stack'),
  ),
  node('frontend-responsive', 'frontend', 'Responsive Design', 'Responsive Design', sec('stack')),
  node('frontend-performance', 'frontend', 'Web Performance', 'Web Performance', sec('stack')),
  node(
    'frontend-angular-spas',
    'frontend',
    'SPAs Angular sobre .NET y Java',
    'Angular SPAs on .NET and Java',
    sec('experience'),
  ),
  node('frontend-material', 'frontend', 'Angular Material', 'Angular Material', sec('stack')),
  node(
    'frontend-php-migration',
    'frontend',
    'Refactor de PHP a Angular + .NET (+20 módulos)',
    'PHP to Angular + .NET refactor (20+ modules)',
    sec('experience'),
  ),
  node(
    'frontend-advanced-angular',
    'frontend',
    'Advanced Angular v18',
    'Advanced Angular v18',
    sec('education'),
    'education',
  ),

  // backend & cloud (16)
  node('backend-dotnet', 'backend', '.NET / C#', '.NET / C#', sec('stack')),
  node('backend-java-spring', 'backend', 'Java (Spring)', 'Java (Spring)', sec('stack')),
  node('backend-node', 'backend', 'Node.js', 'Node.js', sec('stack')),
  node('backend-rest', 'backend', 'APIs REST', 'REST APIs', sec('stack')),
  node(
    'backend-ef-core',
    'backend',
    'Entity Framework Core',
    'Entity Framework Core',
    sec('stack'),
  ),
  node('backend-postgresql', 'backend', 'PostgreSQL', 'PostgreSQL', sec('stack')),
  node('backend-sql-server', 'backend', 'SQL Server', 'SQL Server', sec('stack')),
  node('backend-mysql-mongo', 'backend', 'MySQL y MongoDB', 'MySQL and MongoDB', sec('stack')),
  node(
    'backend-end-to-end',
    'backend',
    'Funcionalidades end-to-end con Node.js y PostgreSQL',
    'End-to-end features with Node.js and PostgreSQL',
    sec('experience'),
  ),
  node('backend-aws', 'backend', 'AWS (Bedrock, S3, ECS)', 'AWS (Bedrock, S3, ECS)', sec('stack')),
  node(
    'backend-azure',
    'backend',
    'Azure (App Services, SQL, Blob Storage, Functions)',
    'Azure (App Services, SQL, Blob Storage, Functions)',
    sec('stack'),
  ),
  node('backend-docker', 'backend', 'Docker', 'Docker', sec('stack')),
  node('backend-cicd', 'backend', 'CI/CD y Azure DevOps', 'CI/CD and Azure DevOps', sec('stack')),
  node(
    'backend-legacy-migration',
    'backend',
    'Migración legacy de 8 módulos a .NET/Angular',
    '8-module legacy migration to .NET/Angular',
    sec('experience'),
  ),
  node('backend-git', 'backend', 'Git', 'Git', sec('stack')),
  node(
    'backend-api-contracts',
    'backend',
    'Contratos de API y despliegue',
    'API contracts and deployment',
    sec('experience'),
  ),

  // applied AI (16)
  node(
    'ai-rag-pipeline',
    'ai',
    'Pipeline RAG en Python',
    'Python RAG pipeline',
    proj('rag-esg'),
    'project',
  ),
  node('ai-embeddings', 'ai', 'Embeddings', 'Embeddings', proj('rag-esg'), 'project'),
  node('ai-vector-layer', 'ai', 'Capa vectorial', 'Vector layer', sec('ai')),
  node(
    'ai-bedrock',
    'ai',
    'LLM con Amazon Bedrock',
    'LLM with Amazon Bedrock',
    proj('rag-esg'),
    'project',
  ),
  node(
    'ai-hugging-face',
    'ai',
    'Modelos de Hugging Face',
    'Hugging Face models',
    proj('rag-esg'),
    'project',
  ),
  node(
    'ai-osint',
    'ai',
    'Corpus enriquecido con OSINT',
    'Corpus enriched through OSINT',
    proj('rag-esg'),
    'project',
  ),
  node('ai-corpus', 'ai', 'Construcción de corpus', 'Corpus construction', sec('ai')),
  node(
    'ai-esg-reports',
    'ai',
    'Informes ESG que se retroalimentan',
    'Self-reinforcing ESG reports',
    proj('rag-esg'),
    'project',
  ),
  node('ai-python', 'ai', 'Python', 'Python', sec('stack')),
  node('ai-transformers', 'ai', 'Transformers', 'Transformers', sec('education'), 'education'),
  node('ai-llms', 'ai', 'LLMs', 'LLMs', sec('stack')),
  node(
    'ai-synthetic-data',
    'ai',
    'Generación de datos sintéticos',
    'Synthetic data generation',
    sec('education'),
    'education',
  ),
  node(
    'ai-time-series',
    'ai',
    'Series temporales',
    'Time series',
    proj('tfm-hipoglucemia'),
    'project',
  ),
  node(
    'ai-tfm',
    'ai',
    'TFM: predicción de hipoglucemias',
    'Thesis: hypoglycaemia prediction',
    proj('tfm-hipoglucemia'),
    'project',
  ),
  node(
    'ai-cgm',
    'ai',
    'Datos de monitorización continua de glucosa',
    'Continuous glucose monitoring data',
    proj('tfm-hipoglucemia'),
    'project',
  ),
  node(
    'ai-master',
    'ai',
    'Máster en Inteligencia Artificial (UAX)',
    "Master's in Artificial Intelligence (UAX)",
    sec('education'),
    'education',
  ),

  // product & leadership (12)
  node(
    'product-tech-lead',
    'product',
    'Technical Lead de un equipo de 5',
    'Technical Lead of a team of 5',
    sec('experience'),
  ),
  node('product-scrum', 'product', 'Scrum y Jira', 'Scrum and Jira', sec('experience')),
  node('product-code-review', 'product', 'Code review', 'Code review', sec('experience')),
  node(
    'product-clients',
    'product',
    'Interlocución directa con clientes',
    'Direct client work',
    sec('experience'),
  ),
  node(
    'product-requirements',
    'product',
    'Requisitos, alcance y estimaciones',
    'Requirements, scoping and estimates',
    sec('experience'),
  ),
  node('product-sprint-demos', 'product', 'Demos de sprint', 'Sprint demos', sec('experience')),
  node(
    'product-agents',
    'product',
    'Desarrollo asistido por agentes (Claude Code)',
    'Agent-assisted development (Claude Code)',
    sec('stack'),
  ),
  node(
    'product-testing',
    'product',
    'Jest, Jasmine/Karma, Cypress, Playwright',
    'Jest, Jasmine/Karma, Cypress, Playwright',
    sec('stack'),
  ),
  node('product-owasp', 'product', 'Secure Coding (OWASP)', 'Secure Coding (OWASP)', sec('stack')),
  node(
    'product-bsc',
    'product',
    'Grado en Ingeniería Informática (UBU)',
    'BSc in Computer Engineering (UBU)',
    sec('education'),
    'education',
  ),
  node(
    'product-languages',
    'product',
    'Español nativo · inglés B2',
    'Spanish (native) · English (B2)',
    sec('education'),
    'education',
  ),
  node(
    'product-remote',
    'product',
    'En remoto desde España',
    'Working remotely from Spain',
    sec('contact'),
  ),
];

/** Respuestas escritas por Miguel a partir de su CV (spec §5.02, §7.2). */
export const corpusQA: CorpusQA[] = [
  {
    id: 'ai-production',
    question: { es: '¿Ha llevado IA a producción?', en: 'Has he shipped AI to production?' },
    answer: {
      es: 'Sí. En el Data Intelligence Hub de nettrim construí en Python un pipeline RAG para la plataforma de consultoría ESG: corpus documental, embeddings, capa vectorial y respuesta con LLM en Amazon Bedrock. Integré modelos de Hugging Face, enriquecí el corpus con OSINT y los informes se retroalimentan entre sí.',
      en: "Yes. On nettrim's Data Intelligence Hub I built a Python RAG pipeline for the ESG consulting platform: document corpus, embeddings, vector layer and an LLM response layer on Amazon Bedrock. I integrated Hugging Face models, enriched the corpus through OSINT, and the reports feed back into one another.",
    },
    sources: ['ai-rag-pipeline', 'ai-bedrock', 'ai-hugging-face', 'ai-osint', 'ai-esg-reports'],
  },
  {
    id: 'cloud',
    question: { es: '¿Qué experiencia tiene en cloud?', en: 'What cloud experience does he have?' },
    answer: {
      es: 'He trabajado con AWS (Bedrock, S3, ECS) y con Azure (App Services, SQL, Blob Storage, Functions), además de Docker y Azure DevOps. En nettrim las funcionalidades se despliegan mediante CI/CD.',
      en: 'I have worked with AWS (Bedrock, S3, ECS) and Azure (App Services, SQL, Blob Storage, Functions), plus Docker and Azure DevOps. At nettrim features ship through CI/CD.',
    },
    sources: ['backend-aws', 'backend-azure', 'backend-docker', 'backend-cicd'],
  },
  {
    id: 'leadership',
    question: { es: '¿Ha liderado equipos?', en: 'Has he led teams?' },
    answer: {
      es: 'Sí. En Softeca fui Technical Lead de un equipo de 5 desarrolladores en Scrum: reparto de tareas, code review y desbloqueo técnico. También dirigí la migración de un sistema legacy de 8 módulos a .NET/Angular, con un 30% menos de incidencias y tiempos.',
      en: 'Yes. At Softeca I was Technical Lead for a team of 5 developers in Scrum: task allocation, code review and unblocking. I also led the migration of an 8-module legacy system to .NET/Angular, cutting incidents and turnaround times by 30%.',
    },
    sources: [
      'product-tech-lead',
      'product-scrum',
      'product-code-review',
      'backend-legacy-migration',
    ],
  },
  {
    id: 'angular',
    question: { es: '¿Qué nivel tiene en Angular?', en: 'How strong is he in Angular?' },
    answer: {
      es: 'Trabajo con Angular desde la versión 2 hasta la v20: Signals, Standalone Components, SSR/Hydration, RxJS y NgRx. En nettrim diseño la arquitectura frontend y gestiono estado complejo con NgRx, RxJS y Signal Stores; en Softeca diseñé una librería de Web Components con SVG interactivo.',
      en: 'I have worked with Angular from version 2 to v20: Signals, Standalone Components, SSR/Hydration, RxJS and NgRx. At nettrim I design the frontend architecture and manage complex state with NgRx, RxJS and Signal Stores; at Softeca I designed a Web Components library with interactive SVG.',
    },
    sources: [
      'frontend-angular-v20',
      'frontend-signals',
      'frontend-ngrx',
      'frontend-ssr',
      'frontend-web-components',
    ],
  },
  {
    id: 'legacy',
    question: { es: '¿Ha hecho migraciones de legacy?', en: 'Has he done legacy migrations?' },
    answer: {
      es: 'Sí, varias. Dirigí la migración de un sistema legacy de 8 módulos a arquitectura .NET/Angular, reduciendo un 30% las incidencias y los tiempos. Antes, en el programa de graduados, refactoricé 2 proyectos PHP hacia Angular + .NET, migrando más de 20 módulos.',
      en: 'Yes, several. I led the migration of an 8-module legacy system to a .NET/Angular architecture, reducing incidents and turnaround times by 30%. Earlier, in the graduate programme, I refactored 2 PHP projects into Angular + .NET, migrating 20+ modules.',
    },
    sources: ['backend-legacy-migration', 'frontend-php-migration', 'backend-dotnet'],
  },
  {
    id: 'backend',
    question: { es: '¿Y backend?', en: 'What about backend?' },
    answer: {
      es: 'Desarrollo backend con .NET / C#, Java (Spring) y Node.js, con APIs REST y bases de datos como PostgreSQL y SQL Server. En nettrim llevo funcionalidades end-to-end con Node.js y PostgreSQL, desde el contrato de API hasta el despliegue.',
      en: 'I build backends with .NET / C#, Java (Spring) and Node.js, with REST APIs and databases such as PostgreSQL and SQL Server. At nettrim I deliver end-to-end features with Node.js and PostgreSQL, from the API contract to deployment.',
    },
    sources: [
      'backend-dotnet',
      'backend-java-spring',
      'backend-node',
      'backend-postgresql',
      'backend-end-to-end',
    ],
  },
  {
    id: 'clients',
    question: {
      es: '¿Cómo trabaja con negocio y clientes?',
      en: 'How does he work with business and clients?',
    },
    answer: {
      es: 'Con trato directo: en Softeca fui interlocutor con clientes de distintos sectores para captar necesidades, definir requisitos, alcance y estimaciones y presentar las demos de sprint. Entiendo la necesidad de negocio, la convierto en requisitos y la llevo a producción.',
      en: 'Directly: at Softeca I was the point of contact for clients across industries for needs discovery, requirements, scoping, estimates and sprint demos. I understand the business need, turn it into requirements and take it to production.',
    },
    sources: ['product-clients', 'product-requirements', 'product-sprint-demos'],
  },
  {
    id: 'studying',
    question: { es: '¿Qué está estudiando?', en: 'What is he studying?' },
    answer: {
      es: 'El Máster en Inteligencia Artificial de la UAX (marzo – noviembre de 2026). Mi TFM trata sobre la predicción personalizada de eventos de hipoglucemia con modelos de series temporales sobre datos de monitorización continua de glucosa. En el máster también he trabajado con transformers, LLMs, RAG y datos sintéticos.',
      en: "The Master's in Artificial Intelligence at UAX (March – November 2026). My thesis is on personalised prediction of hypoglycaemia events using time-series models on continuous glucose monitoring data. The programme also covered transformers, LLMs, RAG and synthetic data.",
    },
    sources: ['ai-master', 'ai-tfm', 'ai-time-series', 'ai-transformers'],
  },
  {
    id: 'looking-for',
    question: { es: '¿Qué busca ahora?', en: 'What is he looking for?' },
    answer: profile.lookingFor,
    sources: ['product-remote', 'ai-rag-pipeline', 'frontend-architecture'],
  },
];
