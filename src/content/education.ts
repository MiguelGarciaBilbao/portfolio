import type { Localized } from './types';

export interface EducationItem {
  id: 'master-ai' | 'bsc' | 'angular';
  title: Localized<string>;
  org: string;
  period: Localized<string>;
  detail?: Localized<string>;
}

export const education: EducationItem[] = [
  {
    id: 'master-ai',
    title: { es: 'Máster en Inteligencia Artificial', en: "Master's in Artificial Intelligence" },
    org: 'Universidad Alfonso X el Sabio (UAX)',
    period: { es: 'Marzo – noviembre de 2026', en: 'March – November 2026' },
    detail: {
      es: 'TFM: predicción personalizada de eventos de hipoglucemia mediante modelos de series temporales sobre datos de monitorización continua de glucosa. Durante el máster también he trabajado con transformers, LLMs, RAG y generación de datos sintéticos.',
      en: 'Thesis: personalised prediction of hypoglycaemia events using time-series models on continuous glucose monitoring data. The programme also covered transformers, LLMs, RAG and synthetic data generation.',
    },
  },
  {
    id: 'bsc',
    title: { es: 'Grado en Ingeniería Informática', en: 'BSc in Computer Engineering' },
    org: 'Universidad de Burgos (UBU)',
    period: { es: '2017–2021', en: '2017–2021' },
  },
  {
    id: 'angular',
    title: { es: 'Advanced Angular v18', en: 'Advanced Angular v18' },
    org: 'Imagina Formación',
    period: { es: 'Formación complementaria', en: 'Professional training' },
  },
];

export const languages: Localized<string> = {
  es: 'Español nativo · inglés B2',
  en: 'Spanish (native) · English (B2)',
};
