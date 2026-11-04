import type { Localized } from './types';

export const profile: {
  name: string;
  fullName: string;
  initials: string;
  role: Localized<string>;
  lead: Localized<string>;
  body: Localized<string>;
  email: string;
  linkedin: string;
  github: string;
  location: Localized<string>;
  status: Localized<string[]>;
  lookingFor: Localized<string>;
  cv: Localized<string>;
  portrait: {
    image: string;
    width: number;
    height: number;
    video: { webm: string; mp4: string };
    alt: Localized<string>;
  };
} = {
  name: 'Miguel García Bilbao',
  fullName: 'Miguel Alejandro García Bilbao',
  initials: 'MGB',
  role: {
    es: 'Senior Software Engineer · Full Stack & IA aplicada (LLM · RAG)',
    en: 'Senior Software Engineer · Full Stack & Applied AI (LLM · RAG)',
  },
  lead: {
    es: 'Ingeniero de software full stack. Cinco años llevando a producción aplicaciones con Angular, .NET y Java, y ahora también los sistemas de IA que hay detrás.',
    en: 'Full stack software engineer. Five years shipping Angular, .NET and Java applications to production, and now the AI systems behind them too.',
  },
  body: {
    es: 'Trabajo en el Data Intelligence Hub de nettrim, donde construyo pipelines RAG sobre datos de consultoría ESG. Antes fui Technical Lead en Softeca, al frente de un equipo de 5 desarrolladores.',
    en: "I work on nettrim's Data Intelligence Hub, building RAG pipelines over ESG consulting data. Before that I was a Technical Lead at Softeca, leading a team of 5 developers.",
  },
  email: 'miguel99bilbao@gmail.com',
  linkedin: 'https://www.linkedin.com/in/miguelgarciabilbao',
  github: 'https://github.com/MiguelGarciaBilbao',
  location: { es: 'Burgos, España · en remoto', en: 'Burgos, Spain · remote' },
  status: {
    es: ['Ahora: nettrim · Data Intelligence Hub', 'Máster IA · UAX, nov 2026'],
    en: ['Now: nettrim · Data Intelligence Hub', "Master's in AI · UAX, Nov 2026"],
  },
  lookingFor: {
    es: 'Busco puestos de ingeniería de software con IA aplicada o de frontend senior. La forma más rápida de contactarme es por correo.',
    en: "I'm looking for software engineering roles in applied AI or senior frontend. Email is the fastest way to reach me.",
  },
  cv: { es: '/cv/miguel-garcia-bilbao-es.pdf', en: '/cv/miguel-garcia-bilbao-en.pdf' },
  portrait: {
    image: '/img/retrato-constelacion.webp',
    width: 1200,
    height: 1200,
    video: { webm: '/img/retrato-constelacion.webm', mp4: '/img/retrato-constelacion.mp4' },
    alt: {
      es: 'Retrato de Miguel García Bilbao dibujado con puntos de luz sobre un cielo con aurora',
      en: 'Portrait of Miguel García Bilbao drawn in points of light against an aurora sky',
    },
  },
};
