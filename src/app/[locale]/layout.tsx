import type { ReactNode } from 'react';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/ui/Header';
import { SkipLink } from '@/components/ui/SkipLink';
import { Aurora } from '@/components/fx/Aurora';
import { StarCursor } from '@/components/fx/StarCursor';
import { SmoothScroll } from '@/components/fx/SmoothScroll';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <Aurora />
          <SkipLink />
          <Header locale={locale} />
          {children}
          <StarCursor />
          <SmoothScroll />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
