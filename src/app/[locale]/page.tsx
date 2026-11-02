import { setRequestLocale } from 'next-intl/server';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';
import { homeMetadata, personJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return homeMetadata(locale);
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main" tabIndex={-1}>
      <JsonLd data={personJsonLd(locale)} />
      <h1>{profile.name}</h1>
    </main>
  );
}
