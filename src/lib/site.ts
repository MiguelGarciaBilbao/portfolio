/** URL pública del sitio, sin barra final (NEXT_PUBLIC_SITE_URL o localhost). */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (raw || 'http://localhost:3000').replace(/\/+$/, '');
}
