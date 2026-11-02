export type Locale = 'es' | 'en';
export const LOCALES: readonly Locale[] = ['es', 'en'];
export type Localized<T> = Record<Locale, T>;
export type Category = 'frontend' | 'backend' | 'ai' | 'product';
export type SectionId =
  | 'hero'
  | 'ask'
  | 'metrics'
  | 'stack'
  | 'ai'
  | 'projects'
  | 'experience'
  | 'education'
  | 'contact';
export type ProjectSlug = 'rag-esg' | 'tfm-hipoglucemia' | 'web-components-oem';
export const PROJECT_SLUGS: readonly ProjectSlug[] = [
  'rag-esg',
  'tfm-hipoglucemia',
  'web-components-oem',
];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
