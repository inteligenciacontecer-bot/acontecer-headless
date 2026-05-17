/**
 * diputado-foto.ts — Helper para transformar URLs de fotos de diputados
 *
 * El API REST de la Asamblea (cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea/diputados)
 * devuelve foto_url apuntando a https://www.asamblea.go.cr/Diputados/SiteAssets/...
 * Ese servidor frecuentemente devuelve 500 (Semrush detecta 114 imágenes rotas).
 *
 * Esta función transforma la URL externa para que pase por nuestro proxy
 * /api/diputado-foto que tiene fallback automático a /imagen-no-disponible.jpg
 */

const FALLBACK = '/imagen-no-disponible.jpg';

export function fotoDiputadoUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl || typeof rawUrl !== 'string') return FALLBACK;

  // Si ya es una URL local o relativa, devolverla tal cual
  if (rawUrl.startsWith('/')) return rawUrl;

  // URLs de asamblea.go.cr → proxy a través de nuestro endpoint
  if (/^https?:\/\/(?:www\.)?asamblea\.go\.cr\//i.test(rawUrl)) {
    return `/api/diputado-foto?url=${encodeURIComponent(rawUrl)}`;
  }

  // Cualquier otra URL externa → devolver tal cual (probablemente CDN nuestro)
  return rawUrl;
}
