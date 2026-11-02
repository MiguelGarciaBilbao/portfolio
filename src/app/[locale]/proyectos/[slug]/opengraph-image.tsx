import { getProject } from '@/content/projects';
import { profile } from '@/content/profile';
import { isLocale } from '@/content/types';
import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = `${profile.name} · proyecto / project`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : 'es';
  const project = getProject(slug);
  if (!project)
    return renderOg({ eyebrow: profile.name, title: profile.name, subtitle: profile.role[locale] });
  return renderOg({
    eyebrow: `${profile.name} · ${project.org}`,
    title: project.title[locale],
    subtitle: `${project.role[locale]} · ${project.period[locale]}`,
  });
}
