/**
 * URL pública del sitio, sin barra final. Por orden: NEXT_PUBLIC_SITE_URL, el dominio de
 * producción de Vercel, la URL del despliegue y, en local, localhost.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  const raw = explicit || (vercel ? `https://${vercel}` : 'http://localhost:3000');
  return raw.replace(/\/+$/, '');
}
