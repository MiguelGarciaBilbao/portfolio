import type { Localized } from './types';

export interface ExperienceGroup {
  heading?: Localized<string>;
  bullets: Localized<string[]>;
}

export interface ExperienceItem {
  id: 'nettrim' | 'softeca-lead' | 'softeca-graduate';
  period: Localized<string>;
  title: Localized<string>;
  org: string;
  place: Localized<string>;
  groups: ExperienceGroup[];
}

export const experience: ExperienceItem[] = [
  {
    id: 'nettrim',
    period: { es: 'Feb 2026 – hoy', en: 'Feb 2026 – now' },
    title: { es: 'Senior Frontend Engineer', en: 'Senior Frontend Engineer' },
    org: 'nettrim technology',
    place: { es: 'En remoto', en: 'Remote' },
    groups: [
      {
        heading: {
          es: 'Data Intelligence Hub — IA aplicada a datos ESG',
          en: 'Data Intelligence Hub — Applied AI for ESG data',
        },
        bullets: {
          es: [
            'Construí en Python un pipeline RAG para la plataforma de consultoría ESG: corpus documental, embeddings, capa vectorial y capa de respuesta con LLM (Amazon Bedrock).',
            'Integré modelos de Hugging Face y enriquecí el corpus con información pública obtenida mediante OSINT.',
            'Mejoré la consultoría de datos ESG con una plataforma en la que los informes (doble materialidad, IROs, PAO, huella hídrica) se retroalimentan entre sí.',
          ],
          en: [
            'Built a Python RAG pipeline for the ESG consulting platform: document corpus, embeddings, vector layer and an LLM response layer (Amazon Bedrock).',
            'Integrated Hugging Face models and enriched the corpus with public information gathered through OSINT.',
            'Improved ESG data consulting with a platform where reports (double materiality, IROs, PAO, water footprint) feed back into one another.',
          ],
        },
      },
      {
        heading: { es: 'Frontend y producto', en: 'Frontend & product' },
        bullets: {
          es: [
            'Diseño la arquitectura frontend con Angular y TypeScript, priorizando escalabilidad y mantenibilidad.',
            'Gestiono estado complejo con NgRx, RxJS y Signal Stores, mejorando la velocidad de renderizado.',
            'Desarrollo funcionalidades end-to-end con Node.js y PostgreSQL, desplegadas mediante CI/CD, con un flujo asistido por agentes de código y revisión técnica de cada cambio.',
          ],
          en: [
            'Design the frontend architecture with Angular and TypeScript, prioritising scalability and maintainability.',
            'Manage complex state with NgRx, RxJS and Signal Stores, improving rendering speed.',
            'Deliver end-to-end features with Node.js and PostgreSQL, deployed through CI/CD, using an agent-assisted coding workflow with technical review of every change.',
          ],
        },
      },
    ],
  },
  {
    id: 'softeca-lead',
    period: { es: 'Jun 2022 – Feb 2026', en: 'Jun 2022 – Feb 2026' },
    title: {
      es: 'Ingeniero de Software — Full Stack & Technical Lead',
      en: 'Software Engineer — Full Stack & Technical Lead',
    },
    org: 'Softeca',
    place: { es: 'Burgos, híbrido', en: 'Burgos, hybrid' },
    groups: [
      {
        bullets: {
          es: [
            'Lideré técnicamente un equipo de 5 desarrolladores en Scrum: reparto de tareas, code review y desbloqueo técnico.',
            'Dirigí la migración de un sistema legacy de 8 módulos a .NET/Angular, con un 30% menos de incidencias y tiempos.',
            'Trabajé directamente con clientes de distintos sectores: necesidades, requisitos, alcance, estimaciones y demos de sprint.',
            'Diseñé una librería de Web Components para una aplicación de despiece gráfico de piezas OEM con SVG interactivo.',
            'Desarrollé SPAs en Angular sobre backends en .NET y Java (Spring).',
          ],
          en: [
            'Technical lead for a team of 5 developers in Scrum: task allocation, code review and unblocking.',
            'Led the migration of an 8-module legacy system to .NET/Angular, cutting incidents and turnaround times by 30%.',
            'Worked directly with clients across industries: needs, requirements, scoping, estimates and sprint demos.',
            'Designed a Web Components library for a graphical parts-breakdown application for OEM components with interactive SVG.',
            'Built Angular SPAs on .NET and Java (Spring) backends.',
          ],
        },
      },
    ],
  },
  {
    id: 'softeca-graduate',
    period: { es: 'Oct 2021 – Jun 2022', en: 'Oct 2021 – Jun 2022' },
    title: {
      es: 'Programa de Graduados — Desarrollo de Software',
      en: 'Graduate Programme — Software Development',
    },
    org: 'Softeca',
    place: { es: 'Burgos, presencial', en: 'Burgos, on-site' },
    groups: [
      {
        bullets: {
          es: [
            'Refactoricé 2 proyectos PHP hacia Angular + .NET, migrando más de 20 módulos y asumiendo progresivamente componentes completos de frontend.',
          ],
          en: [
            'Refactored 2 PHP projects into Angular + .NET, migrating 20+ modules and progressively taking ownership of complete frontend components.',
          ],
        },
      },
    ],
  },
];
