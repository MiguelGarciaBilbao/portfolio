import type { ReactNode } from 'react';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata, Viewport } from 'next';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';
import { Header } from '@/components/ui/Header';
import { SkipLink } from '@/components/ui/SkipLink';
import { Aurora } from '@/components/fx/Aurora';
import { LensCursor } from '@/components/fx/LensCursor';
import { ConsoleSignature } from '@/components/fx/ConsoleSignature';
import { profile } from '@/content/profile';
import { SmoothScroll } from '@/components/fx/SmoothScroll';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  authors: [{ name: 'Miguel Alejandro García Bilbao' }],
  creator: 'Miguel Alejandro García Bilbao',
};

export const viewport: Viewport = { themeColor: '#05070f', colorScheme: 'dark' };

// Solo /es y /en: cualquier otro primer segmento (p. ej. /wp-login.php, que no pasa por el proxy) es 404.
export const dynamicParams = false;

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
  const tc = await getTranslations('console');

  return (
    <html lang={locale} className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <Aurora />
          <SkipLink />
          <Header locale={locale} />
          {children}
          <LensCursor />
          <ConsoleSignature
            hello={tc('hello')}
            repo={`${profile.github}/portfolio`}
            fit={tc('fit')}
            email={profile.email}
          />
          <SmoothScroll />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
