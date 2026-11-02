import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function LocaleNotFound() {
  const t = await getTranslations('common');
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-6 py-32">
      <h1 className="display text-6xl">404</h1>
      <p className="mt-6">
        <Link href="/" className="underline">
          {t('home')}
        </Link>
      </p>
    </main>
  );
}
