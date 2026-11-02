import type { Localized } from './types';

export interface Metric {
  id: 'years' | 'team' | 'incidents' | 'legacyModules' | 'phpModules';
  value: number;
  prefix?: string;
  suffix: Localized<string>;
  label: Localized<string>;
}

/** Todas las cifras salen del CV. Un test las fija; no añadir cifras nuevas. */
export const metrics: Metric[] = [
  {
    id: 'years',
    value: 5,
    suffix: { es: ' años', en: ' years' },
    label: { es: 'de experiencia full stack', en: 'of full stack experience' },
  },
  {
    id: 'team',
    value: 5,
    suffix: { es: ' devs', en: ' devs' },
    label: { es: 'en el equipo que lideré', en: 'in the team I led' },
  },
  {
    id: 'incidents',
    value: 30,
    prefix: '−',
    suffix: { es: '%', en: '%' },
    label: { es: 'incidencias y tiempos tras la migración', en: 'incidents and turnaround after the migration' },
  },
  {
    id: 'legacyModules',
    value: 8,
    suffix: { es: ' módulos', en: ' modules' },
    label: { es: 'legacy migrados a .NET/Angular', en: 'legacy modules moved to .NET/Angular' },
  },
  {
    id: 'phpModules',
    value: 20,
    prefix: '+',
    suffix: { es: ' módulos', en: ' modules' },
    label: { es: 'PHP migrados a Angular + .NET', en: 'PHP modules migrated to Angular + .NET' },
  },
];
