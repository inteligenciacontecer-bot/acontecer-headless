/**
 * /etiqueta/[slug] — Archivo de etiqueta/tag
 *
 * Muestra las notas asociadas a una etiqueta de WordPress.
 * - Si la etiqueta no existe → 404
 * - Si tiene < 3 notas → noindex (contenido delgado)
 * - Si tiene 3+ notas → página indexable con SEO completo
 */
import { notFound } from 'next/navigation';

const API  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const BASE = 'https://acontecer.co.cr';
const PER_PAGE = 12;

async function getTag(slug: string) {
  try {
    const res = await fetch(`${API}/tags?slug=${slug}&_fields=id,name,slug,count,description`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const tags = await res.json();
    return tags[0] || null;
  } catch { return null; }
}

async function getTagPosts(tagId: number, page: number) {
  try {
    const res = await fetch(
      `${API}/posts?tags=${tagId}&per_page=${PER_PAGE}&page=${page}&_embed&_fields=id,slug,title,date,excerpt,categories,_links,_embedded`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return { posts: [], totalPages: 1, total: 0 };
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const total      = parseInt(res.headers.get('X-WP-Total') || '0', 10);
    const posts      = await res.json();
    return { posts: Array.isArray(posts) ? posts : [], totalPages, total };
  } catch { return { posts: [], totalPages: 1, total: 0 }; }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) return { title: 'Etiqueta no encontrada' };

  const titulo      = `${tag.name} — Noticias`;
  const descripcion = tag.description
    ? tag.description
    : `Todas las noticias etiquetadas con "${tag.name}" en Acontecer.co.cr`;
  const canonicalUrl = `${BASE}/etiqueta/${slug}`;
  const isDelgado    = tag.count < 3;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Acontecer.co.cr',
    },
    robots: isDelgado
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function EtiquetaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug }          = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));

  const tag = await getTag(slug);
  if (!tag) return notFound();

  const { posts, totalPages, total } = await getTagPosts(tag.id, page);

  const getFeaturedImg = (post: any) =>
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

  return (
    <>
      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
              { '@type': 'ListItem', position: 2, name: tag.name, item: `${BASE}/etiqueta/${slug}` },
            ],
          }),
        }}
      />

      {/* Hero del tag */}
      <div style={{ background: 'linear-gradient(135deg,#0000A2,#0a73ce)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}
          >
            🏷️
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
              Etiqueta
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', color: 'white', fontWeight: '900', marginBottom: '6px' }}>
              {tag.name}
            </h1>
            {tag.description ? (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: 0 }}
                dangerouslySetInnerHTML={{ __html: tag.description }} />
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: 0, lineHeight: 1.5 }}>
                Todas las noticias relacionadas con <strong style={{ color: 'white' }}>{tag.name}</strong> publicadas por Acontecer.co.cr.
                Cobertura editorial de actualidad costarricense, contexto político, declaraciones de fuentes y análisis periodístico.
                Encontrá aquí los {total} artículos más recientes sobre este tema, ordenados cronológicamente.
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontSize: '13px', flexShrink: 0 }}>
            <strong style={{ display: 'block', fontSize: '32px', color: 'white', fontFamily: 'Fraunces, serif' }}>
              {total}
            </strong>
            artículos
          </div>
        </div>
      </div>

      {/* Grilla de notas */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '60px 0' }}>
            No hay artículos para esta etiqueta todavía.
          </p>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post: any) => {
                const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
                const img     = getFeaturedImg(post);
                return (
                  <a key={post.id} href={`/${catSlug}/${post.slug}`} className="post-card">
                    {img
                      ? <img src={img} alt={post.title?.rendered?.replace(/<[^>]+>/g, '') || ''} className="post-card-img" />
                      : <div className="post-card-placeholder">
                          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.2} strokeLinecap="round" style={{ width: 32, height: 32 }}>
                            <path d="M4 22V4h16v18M9 22V12h6v10" />
                          </svg>
                        </div>}
                    <div className="post-card-body">
                      <h3
                        style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', lineHeight: 1.4, color: '#111', marginBottom: '8px' }}
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <div style={{ fontSize: '11px', color: '#aaa' }}>
                        {new Date(post.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '32px 0 16px', flexWrap: 'wrap' }}>
                {page > 1 && (
                  <a
                    href={`/etiqueta/${slug}?page=${page - 1}`}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e0e0', background: 'white', color: '#0000A2', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
                  >
                    ← Anterior
                  </a>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                  .map(n => (
                    <a
                      key={n}
                      href={`/etiqueta/${slug}?page=${n}`}
                      style={{
                        padding: '8px 14px', borderRadius: '8px',
                        border: n === page ? 'none' : '1px solid #e0e0e0',
                        background: n === page ? '#0000A2' : 'white',
                        color: n === page ? 'white' : '#333',
                        textDecoration: 'none', fontWeight: '600', fontSize: '14px',
                      }}
                    >
                      {n}
                    </a>
                  ))}
                {page < totalPages && (
                  <a
                    href={`/etiqueta/${slug}?page=${page + 1}`}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e0e0', background: 'white', color: '#0000A2', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
                  >
                    Siguiente →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
