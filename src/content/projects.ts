import type { Localized, ProjectSlug } from './types';

export interface ProjectSection {
  heading: string;
  body: string[];
}

export interface Project {
  slug: ProjectSlug;
  title: Localized<string>;
  summary: Localized<string>;
  cardLine: Localized<string>;
  role: Localized<string>;
  period: Localized<string>;
  org: string;
  stack: string[];
  sections: Localized<ProjectSection[]>;
  diagram: 'rag' | 'timeseries' | 'oem';
}

/**
 * Solo hechos de los CVs y del HTML de referencia (ver CLAUDE.md, regla 1).
 * Lo que falta (métricas del RAG, dataset y resultados del TFM, tecnología de
 * la librería OEM) se omite hasta que Miguel lo aporte.
 */
export const projects: Project[] = [
  {
    slug: 'rag-esg',
    title: { es: 'Pipeline RAG para consultoría ESG', en: 'RAG pipeline for ESG consulting' },
    summary: {
      es: 'Un pipeline RAG en Python que analiza los datos ESG de cada empresa y genera informes de sostenibilidad que se retroalimentan entre sí.',
      en: "A Python RAG pipeline that analyses each company's ESG data and produces sustainability reports that feed back into one another.",
    },
    cardLine: {
      es: 'Corpus, embeddings, capa vectorial y LLM sobre datos ESG reales.',
      en: 'Corpus, embeddings, vector layer and an LLM over real ESG data.',
    },
    role: { es: 'Senior Frontend Engineer · Data Intelligence Hub', en: 'Senior Frontend Engineer · Data Intelligence Hub' },
    period: { es: 'Feb 2026 – hoy', en: 'Feb 2026 – now' },
    org: 'nettrim technology',
    stack: ['Python', 'RAG', 'Embeddings', 'Amazon Bedrock', 'Hugging Face', 'OSINT'],
    diagram: 'rag',
    sections: {
      es: [
        {
          heading: 'Contexto',
          body: [
            'nettrim ofrece consultoría de datos ESG. En el Data Intelligence Hub trabajamos en una plataforma que analiza los datos de cada empresa y genera sus informes de sostenibilidad.',
          ],
        },
        {
          heading: 'Qué hice',
          body: [
            'Construí en Python el pipeline RAG de la plataforma: construcción del corpus documental, generación de embeddings, capa vectorial y capa de respuesta con LLM (Amazon Bedrock).',
            'Integré modelos de Hugging Face en el flujo de procesamiento y enriquecí el corpus con información pública obtenida mediante OSINT.',
          ],
        },
        {
          heading: 'Arquitectura',
          body: [
            'Fuentes y OSINT alimentan el corpus; el corpus se convierte en embeddings; la capa vectorial recupera los fragmentos más relevantes para cada consulta y el LLM redacta la respuesta apoyándose en ellos.',
            'Los informes (doble materialidad, IROs, PAO, huella hídrica) vuelven al corpus, de modo que cada análisis reutiliza los resultados de los anteriores.',
            'Se describe la arquitectura general: no se muestran datos de clientes.',
          ],
        },
        {
          heading: 'Resultados',
          body: [
            'Una consultoría de datos ESG en la que los informes se retroalimentan entre sí en lugar de empezar de cero cada vez.',
          ],
        },
      ],
      en: [
        {
          heading: 'Context',
          body: [
            "nettrim provides ESG data consulting. On the Data Intelligence Hub we work on a platform that analyses each company's data and produces its sustainability reports.",
          ],
        },
        {
          heading: 'What I did',
          body: [
            "Built the platform's RAG pipeline in Python: document corpus construction, embedding generation, vector layer and an LLM response layer (Amazon Bedrock).",
            'Integrated Hugging Face models into the processing workflow and enriched the corpus with public information gathered through OSINT.',
          ],
        },
        {
          heading: 'Architecture',
          body: [
            'Sources and OSINT feed the corpus; the corpus is turned into embeddings; the vector layer retrieves the most relevant chunks for each query and the LLM writes the answer grounded in them.',
            'Reports (double materiality, IROs, PAO, water footprint) go back into the corpus, so each analysis reuses the results of the previous ones.',
            'This describes the general architecture: no client data is shown.',
          ],
        },
        {
          heading: 'Outcome',
          body: [
            'An ESG data consulting workflow where reports feed back into one another instead of starting from scratch every time.',
          ],
        },
      ],
    },
  },
  {
    slug: 'tfm-hipoglucemia',
    title: {
      es: 'TFM: predicción personalizada de hipoglucemias',
      en: 'Thesis: personalised hypoglycaemia prediction',
    },
    summary: {
      es: 'Trabajo de fin de máster sobre la predicción personalizada de eventos de hipoglucemia con modelos de series temporales sobre datos de monitorización continua de glucosa.',
      en: "Master's thesis on personalised prediction of hypoglycaemia events using time-series models on continuous glucose monitoring data.",
    },
    cardLine: {
      es: 'Series temporales sobre datos de monitorización continua de glucosa.',
      en: 'Time-series models on continuous glucose monitoring data.',
    },
    role: { es: 'Trabajo de fin de máster', en: "Master's thesis" },
    period: { es: 'Marzo – noviembre de 2026', en: 'March – November 2026' },
    org: 'Universidad Alfonso X el Sabio (UAX)',
    stack: ['Python', 'Series temporales', 'CGM'],
    diagram: 'timeseries',
    sections: {
      es: [
        {
          heading: 'Contexto',
          body: [
            'TFM del Máster en Inteligencia Artificial de la Universidad Alfonso X el Sabio (marzo – noviembre de 2026).',
          ],
        },
        {
          heading: 'Qué hice',
          body: [
            'Predicción personalizada de eventos de hipoglucemia mediante modelos de series temporales sobre datos de monitorización continua de glucosa (CGM).',
          ],
        },
        {
          heading: 'Arquitectura',
          body: [
            'Lecturas de glucosa en el tiempo → modelo de series temporales personalizado → aviso ante un posible evento de hipoglucemia.',
            'Durante el máster también he trabajado con transformers, LLMs, RAG y generación de datos sintéticos.',
          ],
        },
      ],
      en: [
        {
          heading: 'Context',
          body: [
            "Thesis for the Master's in Artificial Intelligence at Universidad Alfonso X el Sabio (March – November 2026).",
          ],
        },
        {
          heading: 'What I did',
          body: [
            'Personalised prediction of hypoglycaemia events using time-series models on continuous glucose monitoring (CGM) data.',
          ],
        },
        {
          heading: 'Architecture',
          body: [
            'Glucose readings over time → personalised time-series model → warning ahead of a possible hypoglycaemia event.',
            'The programme also covered transformers, LLMs, RAG and synthetic data generation.',
          ],
        },
      ],
    },
  },
  {
    slug: 'web-components-oem',
    title: {
      es: 'Librería de Web Components para despiece OEM',
      en: 'Web Components library for OEM parts breakdown',
    },
    summary: {
      es: 'Diseño de una librería de Web Components para una aplicación de despiece gráfico de piezas OEM con imágenes SVG interactivas.',
      en: 'Design of a Web Components library for a graphical parts-breakdown application for OEM components with interactive SVG images.',
    },
    cardLine: {
      es: 'Despiece gráfico de piezas OEM con SVG interactivo.',
      en: 'Graphical OEM parts breakdown with interactive SVG.',
    },
    role: { es: 'Full Stack & Technical Lead', en: 'Full Stack & Technical Lead' },
    period: { es: 'Jun 2022 – Feb 2026', en: 'Jun 2022 – Feb 2026' },
    org: 'Softeca',
    stack: ['Web Components', 'SVG', 'TypeScript', 'Angular', '.NET', 'Java (Spring)'],
    diagram: 'oem',
    sections: {
      es: [
        {
          heading: 'Contexto',
          body: [
            'En Softeca desarrollábamos SPAs en Angular integradas con backends en .NET y Java (Spring) para clientes de distintos sectores. Una de ellas era una aplicación de despiece gráfico de piezas OEM.',
          ],
        },
        {
          heading: 'Qué hice',
          body: [
            'Diseñé una librería de Web Components para esa aplicación, con imágenes SVG interactivas que permiten recorrer el despiece de cada pieza.',
          ],
        },
        {
          heading: 'Arquitectura',
          body: [
            'Componentes web reutilizables con SVG interactivo, integrados en SPAs Angular sobre backends .NET y Java (Spring).',
            'La sección de stack de este portfolio usa la misma idea: un despiece por capas.',
          ],
        },
      ],
      en: [
        {
          heading: 'Context',
          body: [
            'At Softeca we built Angular SPAs integrated with .NET and Java (Spring) backends for clients across industries. One of them was a graphical parts-breakdown application for OEM components.',
          ],
        },
        {
          heading: 'What I did',
          body: [
            "Designed a Web Components library for that application, with interactive SVG images to explore each part's breakdown.",
          ],
        },
        {
          heading: 'Architecture',
          body: [
            'Reusable web components with interactive SVG, integrated into Angular SPAs on .NET and Java (Spring) backends.',
            "This portfolio's stack section uses the same idea: a layer-by-layer breakdown.",
          ],
        },
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
