/**
 * /nota/[slug] — alias de compatibilidad
 *
 * Redirige permanentemente a la ruta canónica /{categoria}/{slug}
 * para que todas las vistas usen exactamente el mismo componente
 * y no haya inconsistencias visuales entre portada, buscador y notas viejas.
 */
import { permanentRedirect, notFound } from 'next/navigation';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

async function getPost(slug: string) {
  const res = await fetch(API + '/posts?slug=' + slug + '&_embed', { next: { revalidate: 60 } });
  const posts = await res.json();
  return posts[0] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Nota no encontrada' };

  const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
  const canonicalUrl = `https://acontecer.co.cr/${catSlug}/${slug}`;

  // Canonical apunta a la ruta real; robots no indexa el alias
  return {
    alternates: { canonical: canonicalUrl },
    robots: { index: false, follow: true },
  };
}

export default async function NotaRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();

  const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
  permanentRedirect(`/${catSlug}/${slug}`);
}
