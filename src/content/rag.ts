import type { Localized } from './types';

export interface RagStep {
  id: 'sources' | 'corpus' | 'embeddings' | 'vector' | 'llm' | 'reports';
  label: Localized<string>;
  detail: Localized<string>;
  tech: Localized<string>;
}

export const ragSteps: RagStep[] = [
  {
    id: 'sources',
    label: { es: 'Fuentes + OSINT', en: 'Sources + OSINT' },
    detail: {
      es: 'La documentación ESG de cada empresa, ampliada con información pública recogida mediante OSINT.',
      en: "Each company's ESG documentation, extended with public information gathered through OSINT.",
    },
    tech: { es: 'OSINT', en: 'OSINT' },
  },
  {
    id: 'corpus',
    label: { es: 'Corpus', en: 'Corpus' },
    detail: {
      es: 'Construcción en Python del corpus documental sobre el que trabaja todo el pipeline.',
      en: 'A document corpus built in Python that the whole pipeline works on.',
    },
    tech: { es: 'Python, construcción de corpus', en: 'Python, corpus construction' },
  },
  {
    id: 'embeddings',
    label: { es: 'Embeddings', en: 'Embeddings' },
    detail: {
      es: 'El modelo de datos ESG se convierte en embeddings para poder buscar por significado y no solo por palabras.',
      en: 'The ESG data model is turned into embeddings so it can be searched by meaning, not just keywords.',
    },
    tech: {
      es: 'Amazon Bedrock, modelos de Hugging Face',
      en: 'Amazon Bedrock, Hugging Face models',
    },
  },
  {
    id: 'vector',
    label: { es: 'Capa vectorial', en: 'Vector layer' },
    detail: {
      es: 'Ante cada consulta recupera los fragmentos del corpus más relevantes.',
      en: 'For each query it retrieves the most relevant chunks of the corpus.',
    },
    tech: { es: 'Búsqueda por similitud', en: 'Similarity search' },
  },
  {
    id: 'llm',
    label: { es: 'Respuesta con LLM', en: 'LLM answer' },
    detail: {
      es: 'El LLM redacta la respuesta a partir del contexto recuperado, de modo que se apoya en los datos de la empresa.',
      en: "The LLM writes the answer from the retrieved context, so it stays grounded in the company's data.",
    },
    tech: { es: 'Amazon Bedrock', en: 'Amazon Bedrock' },
  },
  {
    id: 'reports',
    label: { es: 'Informes ESG', en: 'ESG reports' },
    detail: {
      es: 'Doble materialidad, IROs, PAO, huella hídrica e informe completo. Cada resultado vuelve al corpus, así que el siguiente informe parte de lo que ya se ha analizado.',
      en: "Double materiality, IROs, PAO, water footprint and the full report. Each result goes back into the corpus, so the next report builds on what's already been analysed.",
    },
    tech: { es: 'Informes que se retroalimentan', en: 'Self-reinforcing reports' },
  },
];
