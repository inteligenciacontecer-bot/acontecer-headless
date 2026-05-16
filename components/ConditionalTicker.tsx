import { headers } from 'next/headers';
import type { ReactNode } from 'react';

/**
 * Oculta el ticker en páginas de notas individuales para evitar
 * el espacio en blanco lateral en móvil que causa el marquee animado.
 *
 * Notas tienen la forma /[categoria]/[slug] donde categoria NO es
 * una ruta reservada del sitio.
 *
 * Server Component: lee la ruta desde el header x-pathname que
 * inyecta el middleware (más confiable que usePathname en SSR).
 */
const RESERVED_FIRST_SEGMENTS = new Set([
  'agencia',
  'api',
  'asamblea',
  'autor',
  'buscar',
  'categoria',
  'contacto',
  'enlaces',
  'etiqueta',
  'feed',
  'news-sitemap.xml',
  'nosotros',
  'nota',
  'opengraph-image',
  'pauta',
  'politicas',
  'privacidad',
  'robots.txt',
  'sitemap.xml',
  'stories',
  '_next',
  'icon.png',
]);

export default async function ConditionalTicker({ children }: { children: ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-pathname') || '/';
  const segments = pathname.split('/').filter(Boolean);

  // Página de nota: exactamente 2 segmentos y el primero NO es reservado
  const isNotePage = segments.length === 2 && !RESERVED_FIRST_SEGMENTS.has(segments[0]);

  if (isNotePage) return null;
  return <>{children}</>;
}
