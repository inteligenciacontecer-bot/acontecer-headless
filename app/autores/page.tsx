import type { Metadata } from 'next';
import Link from 'next/link';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

export const metadata: Metadata = {
  title: 'Periodistas y autores',
  description: 'Conoce al equipo editorial de Acontecer.co.cr — periodistas, columnistas y colaboradores que cubren la actualidad de Costa Rica.',
  alternates: { canonical: 'https://acontecer.co.cr/autores' },
};

interface WPUser {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar_urls?: Record<string, string>;
  link?: string;
}

async function getAuthors(): Promise<WPUser[]> {
  try {
    const res = await fetch(`${API}/users?per_page=100&_fields=id,name,slug,description,avatar_urls`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function getPostCountByAuthor(authorId: number): Promise<number> {
  try {
    // HEAD request a posts?author=X devuelve el total en header X-WP-Total
    const res = await fetch(`${API}/posts?author=${authorId}&per_page=1&_fields=id`, {
      next: { revalidate: 3600 },
    });
    const total = res.headers.get('x-wp-total');
    return total ? parseInt(total, 10) : 0;
  } catch {
    return 0;
  }
}

export default async function AutoresPage() {
  const authors = await getAuthors();

  // Obtener conteo de notas por autor en paralelo (solo top 30)
  const authorsTop = authors.slice(0, 30);
  const counts = await Promise.all(authorsTop.map((a) => getPostCountByAuthor(a.id)));
  const authorsWithCount = authorsTop
    .map((a, i) => ({ ...a, count: counts[i] }))
    .filter((a) => a.count > 0)
    .sort((a, b) => b.count - a.count);

  // JSON-LD para SEO
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Equipo editorial de Acontecer.co.cr',
    description: metadata.description,
    url: 'https://acontecer.co.cr/autores',
    inLanguage: 'es-CR',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: authorsWithCount.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Person',
          name: a.name,
          url: `https://acontecer.co.cr/autor/${a.slug}`,
          image: a.avatar_urls?.['96'],
          description: a.description || undefined,
          jobTitle: 'Periodista',
          worksFor: { '@type': 'NewsMediaOrganization', name: 'Acontecer.co.cr' },
        },
      })),
    },
  };

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

      <header style={{ marginBottom: 40, textAlign: 'center' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0a73ce', marginBottom: 8 }}>
          Equipo editorial
        </p>
        <h1 style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: '#0a0e1a', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Periodistas y autores
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 16, color: '#4b5563', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
          Conoce al equipo que cubre la actualidad de Costa Rica en Acontecer.co.cr.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {authorsWithCount.map((author) => {
          const avatar = author.avatar_urls?.['96']?.replace('d=mm', 'd=404');
          const initial = (author.name || 'A').charAt(0).toUpperCase();
          return (
            <Link
              key={author.slug}
              href={`/autor/${author.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                padding: 24,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #0000A2, #0a73ce)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 30, fontWeight: 700, fontFamily: "var(--font-lora), serif", boxShadow: '0 0 0 4px #fff, 0 6px 20px rgba(0,0,162,.18)' }}>
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt={author.name} width={88} height={88} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initial
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: 18, fontWeight: 600, color: '#0a0e1a', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                  {author.name}
                </h2>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0a73ce', margin: 0 }}>
                  {author.count} {author.count === 1 ? 'nota' : 'notas'}
                </p>
                {author.description && (
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: '#4b5563', margin: '10px 0 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {author.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {authorsWithCount.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
          Cargando equipo editorial...
        </p>
      )}
    </main>
  );
}
