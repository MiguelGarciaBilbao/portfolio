import { profile } from '@/content/profile';
import { isLocale } from '@/content/types';
import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = `${profile.name} · Senior Software Engineer`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : 'es';
  return renderOg({
    eyebrow: profile.location[locale],
    title: profile.name,
    subtitle: profile.role[locale],
  });
}
