import { getTranslations } from 'next-intl/server';

export async function SkipLink() {
  const t = await getTranslations('common');
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-mint)] focus:px-4 focus:py-2 focus:font-semibold focus:text-[#04121a]"
    >
      {t('skip')}
    </a>
  );
}
