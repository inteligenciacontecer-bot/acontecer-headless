import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../gobierno.css';
import './perfil.css';
import { FUNCIONARIOS, getFuncionario, funcionarioSlug, curriculoFuncionario, recorteFuncionario, ACCENT, GRUPO_LABEL, type Funcionario } from '@/lib/gobierno';

export const revalidate = 1800; // refresca notas relacionadas cada 30 min

const BASE = 'https://acontecer.co.cr';
const WP_API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

function iniciales(nombre: string): string {
  const p = nombre.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[p.length - 1]?.[0] || '')).toUpperCase();
}

const cmsToLocal = (u: string) => (u || '')
  .replace(/^https?:\/\/(www\.|cms\.)?acontecer\.co\.cr/, '')
  .replace(/\/$/, '') || '/';

interface Nota { id: number; titulo: string; extracto: string; img: string | null; link: string; date: string; }

// Notas que le hemos sacado al funcionario (búsqueda en el CMS por nombre + apellido).
async function getNotas(nombre: string): Promise<Nota[]> {
  try {
    const partes = nombre.trim().split(/\s+/);
    const primerApellido = partes.length >= 2 ? partes[partes.length - 2] : partes[0];
    const [r1, r2] = await Promise.all([
      fetch(`${WP_API}/posts?search=${encodeURIComponent(nombre)}&per_page=10&_embed`, { next: { revalidate: 1800 } }),
      fetch(`${WP_API}/posts?search=${encodeURIComponent(primerApellido)}&per_page=10&_embed`, { next: { revalidate: 1800 } }),
    ]);
    const [p1, p2]: [any[], any[]] = await Promise.all([r1.ok ? r1.json() : [], r2.ok ? r2.json() : []]);
    const seen = new Set<number>();
    const todos: any[] = [];
    for (const p of [...p1, ...p2]) if (!seen.has(p.id)) { seen.add(p.id); todos.push(p); }
    // Filtro: al menos un token del nombre (≥4 chars) en título o excerpt
    const tokens = nombre.toLowerCase().split(/\s+/).filter((t) => t.length >= 4);
    return todos.filter((p: any) => {
      const hay = ((p.title?.rendered || '') + ' ' + (p.excerpt?.rendered || '')).toLowerCase().replace(/<[^>]+>/g, '');
      return tokens.some((t) => hay.includes(t));
    }).slice(0, 8).map((p: any) => ({
      id: p.id,
      titulo: (p.title?.rendered || '').replace(/&#(\d+);/g, (_: string, n: string) => String.fromCharCode(Number(n))).replace(/<[^>]+>/g, ''),
      extracto: (p.excerpt?.rendered || '').replace(/<[^>]+>/g, '').trim().slice(0, 120),
      img: p._embedded?.['wp:featuredmedia']?.[0]?.source_url ? cmsToLocal(p._embedded['wp:featuredmedia'][0].source_url) : null,
      link: cmsToLocal(p.link || ''),
      date: p.date,
    }));
  } catch { return []; }
}

export function generateStaticParams() {
  return FUNCIONARIOS.flatMap((f) => [
    { slug: funcionarioSlug(f) },
    ...(f.aliases ?? []).map((slug) => ({ slug })),
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = getFuncionario(slug);
  if (!f) return { title: 'Funcionario no encontrado' };
  const canonicalSlug = funcionarioSlug(f);
  const url = `${BASE}/gobierno/${canonicalSlug}`;
  const ogImage = `${url}/opengraph-image`;
  const titulo = `${f.nombre}, ${f.cargo} | Perfil y currículo`;
  const desc = `${f.nombre}: perfil, currículo, cargo actual y noticias como ${f.cargo} en el Gobierno de Costa Rica 2026-2030${f.institucion ? `, ${f.institucion}` : ''}.`;
  return {
    title: titulo,
    description: desc,
    alternates: { canonical: url },
    keywords: [f.nombre, f.cargo, f.institucion || 'Gobierno de Costa Rica', 'ministro Costa Rica', 'gabinete Costa Rica'],
    openGraph: {
      type: 'profile',
      url,
      title: titulo,
      description: desc,
      locale: 'es_CR',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${f.nombre} — ${f.cargo}` }],
    },
    twitter: { card: 'summary_large_image', title: `${f.nombre} — ${f.cargo}`, description: desc, images: [ogImage] },
  };
}

export default async function PerfilGobiernoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = getFuncionario(slug);
  if (!f) return notFound();

  const canonicalSlug = funcionarioSlug(f);
  const url = `${BASE}/gobierno/${canonicalSlug}`;
  const accent = ACCENT[f.grupo];
  const notas = await getNotas(f.nombre);
  const descriptor = `${f.nombre} ocupa el cargo de ${f.cargo} en el Gobierno de Costa Rica, en la administración de la presidenta Laura Fernández Delgado (2026-2030)${f.institucion ? `, al frente de ${f.institucion}` : ''}.`;
  const textoPerfil = curriculoFuncionario(f) || descriptor;
  const parrafosPerfil = textoPerfil.split(/\n+/).map((parrafo) => parrafo.trim()).filter(Boolean);
  const fotoAbs = f.foto ? `${BASE}${f.foto}` : undefined;
  const recorte = recorteFuncionario(f);
  const fotoPerfil = recorte || f.foto;
  const fotoClass = [
    'gp-foto',
    recorte ? 'gp-foto--cutout' : '',
    f.grupo === 'presidencia' ? 'gp-foto--presidencia' : '',
  ].filter(Boolean).join(' ');
  const fuentes = f.fuentes?.length
    ? f.fuentes
    : f.fuenteUrl
      ? [{ nombre: f.fuenteNombre || 'fuente oficial', url: f.fuenteUrl }]
      : [];

  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person',
    '@id': `${url}#person`,
    name: f.nombre, jobTitle: f.cargo, url,
    ...(fotoAbs ? { image: fotoAbs } : {}),
    description: textoPerfil,
    ...(fuentes.length ? { sameAs: fuentes.map((fuente) => fuente.url) } : {}),
    worksFor: { '@type': 'GovernmentOrganization', name: f.institucion || 'Gobierno de Costa Rica' },
    nationality: { '@type': 'Country', name: 'Costa Rica' },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Gobierno', item: `${BASE}/gobierno` },
      { '@type': 'ListItem', position: 3, name: f.nombre, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="gb-hero" style={{ background: `linear-gradient(135deg, ${accent}, #0000A2)` }}>
        <div className="gb-hero-inner">
          <span className="gb-hero-eyebrow">{GRUPO_LABEL[f.grupo]}</span>
          <h1 className="gb-hero-title">{f.nombre}</h1>
          <p className="gb-hero-sub">{f.cargo} · Gobierno de Costa Rica 2026–2030</p>
        </div>
      </div>

      <main className="gb-wrap">
        <nav className="gb-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <Link href="/gobierno">Gobierno</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{f.nombre}</span>
        </nav>

        {/* Ficha: foto + datos */}
        <section className="gp-ficha">
          <div className="gp-foto-col">
            <div className={fotoClass} style={{ background: recorte ? undefined : accent + '15', color: accent, borderColor: accent }}>
              {fotoPerfil
                ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={fotoPerfil} alt={f.nombre} />
                : <span className="gp-iniciales">{iniciales(f.nombre)}</span>}
            </div>
            {f.foto && f.fotoCredito && (
              <p className="gp-credito">
                Foto:{' '}
                {f.fuenteUrl
                  ? <a href={f.fuenteUrl} target="_blank" rel="noopener noreferrer">{f.fotoCredito}</a>
                  : f.fotoCredito}
              </p>
            )}
          </div>
          <div className="gp-datos">
            <div className="gp-dato"><span className="gp-dato-lbl">Cargo</span><span className="gp-dato-val">{f.cargo}</span></div>
            {f.institucion && <div className="gp-dato"><span className="gp-dato-lbl">Institución</span><span className="gp-dato-val">{f.institucion}</span></div>}
            <div className="gp-dato"><span className="gp-dato-lbl">Administración</span><span className="gp-dato-val">Laura Fernández (2026–2030)</span></div>
            <div className="gp-descriptor">
              <p>{descriptor}</p>
            </div>
          </div>
        </section>

        {/* Currículo */}
        <section className="gp-curriculo-card" aria-labelledby="curriculo">
          <div className="gp-card-head" style={{ '--accent': accent } as React.CSSProperties}>
            <span className="gp-card-accent" aria-hidden="true" />
            <span className="gp-card-icon" aria-hidden="true">CV</span>
            <h2 id="curriculo">Currículo</h2>
          </div>
          <div className="gp-card-body">
            {parrafosPerfil.map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
            {fuentes.length > 0 && (
              <p className="gp-fuente">
                {fuentes.length === 1 ? 'Fuente del currículo:' : 'Fuentes del currículo:'}{' '}
                {fuentes.map((fuente, i) => (
                  <span key={fuente.url}>
                    {i > 0 ? ' · ' : ''}
                    <a href={fuente.url} target="_blank" rel="noopener noreferrer">
                      {fuente.nombre}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        </section>

        {/* Notas relacionadas */}
        <section className="gp-notas" aria-label={`Noticias sobre ${f.nombre}`}>
          <h2 className="gb-section-title">Noticias sobre {f.nombre}</h2>
          {notas.length > 0 ? (
            <div className="gp-notas-list">
              {notas.map((n) => (
                <Link key={n.id} href={n.link} className="gp-nota">
                  {n.img && <div className="gp-nota-img"><img src={n.img} alt="" loading="lazy" decoding="async" /></div>}
                  <div className="gp-nota-body">
                    <div className="gp-nota-titulo">{n.titulo}</div>
                    {n.extracto && <div className="gp-nota-extracto">{n.extracto}{n.extracto.length >= 120 ? '…' : ''}</div>}
                    <div className="gp-nota-meta">📰 Acontecer.co.cr · {new Date(n.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="gp-sin-notas">Aún no hay notas publicadas sobre {f.nombre} en Acontecer.co.cr. Cuando publiquemos, aparecerán aquí automáticamente.</p>
          )}
        </section>

        <section className="gb-prose">
          <p className="gb-disclaimer">
            <strong>Importante:</strong> este perfil es informativo y se basa en los nombramientos oficiales del Gobierno
            de Costa Rica. Ante cualquier cambio, la referencia es la Presidencia de la República y Casa Presidencial.
          </p>
        </section>

        <footer className="gb-footer">
          <p className="gb-links">
            <Link href="/gobierno">← Volver al directorio del Gobierno</Link> ·{' '}
            <Link href="/asamblea">Monitor Legislativo</Link> ·{' '}
            <Link href="/">Portada</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
