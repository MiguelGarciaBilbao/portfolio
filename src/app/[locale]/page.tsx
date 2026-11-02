import { setRequestLocale } from 'next-intl/server';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main" tabIndex={-1}>
      <h1>{profile.name}</h1>
    </main>
  );
}
