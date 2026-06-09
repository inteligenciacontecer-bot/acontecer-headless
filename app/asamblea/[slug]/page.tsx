import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fotoDiputadoUrl } from '@/lib/diputado-foto';

// Slug de comisión (igual algoritmo que el catálogo en el backend)
function comisionSlug(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const API    = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';
const WP_API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

// ── Paleta de partidos (CR) — indexada por nombre completo ──────────────────
const PARTIDOS: Record<string, { color: string; bg: string; dark: string; label: string }> = {
  'Partido Pueblo Soberano':          { color: '#fff', bg: '#0EA5E9', dark: '#0369A1', label: 'Pueblo Soberano' },
  'Partido Liberación Nacional':      { color: '#fff', bg: '#00AA44', dark: '#007730', label: 'Liberación Nacional' },
  'Partido Frente Amplio':            { color: '#1a1a1a', bg: '#EAB308', dark: '#854D0E', label: 'Frente Amplio' },
  'Partido Unidad Social Cristiana':  { color: '#fff', bg: '#2563EB', dark: '#1D4ED8', label: 'Unidad Social Cristiana' },
  'Partido Agenda Ciudadana':         { color: '#fff', bg: '#DC2626', dark: '#991B1B', label: 'Agenda Ciudadana' },
  'Coalición Agenda Ciudadana':       { color: '#fff', bg: '#DC2626', dark: '#991B1B', label: 'Agenda Ciudadana' },
  'Partido Acción Ciudadana':         { color: '#fff', bg: '#059669', dark: '#064e3b', label: 'Acción Ciudadana' },
  'Partido Nueva República':          { color: '#fff', bg: '#1d4ed8', dark: '#1e3a8a', label: 'Nueva República' },
  'Partido Restauración Nacional':    { color: '#fff', bg: '#1d4ed8', dark: '#1e3a8a', label: 'Restauración Nacional' },
  'Partido Nacional Democrático':     { color: '#fff', bg: '#059669', dark: '#064e3b', label: 'Nacional Democrático' },
  'Partido Liberal Progresista':      { color: '#fff', bg: '#7c3aed', dark: '#4c1d95', label: 'Liberal Progresista' },
  'Fuerza Democrática':               { color: '#fff', bg: '#b91c1c', dark: '#6b1111', label: 'Fuerza Democrática' },
  // Abreviaturas (compatibilidad)
  'PLN':    { color: '#fff', bg: '#00AA44', dark: '#007730', label: 'Liberación Nacional' },
  'PUSC':   { color: '#fff', bg: '#2563EB', dark: '#1D4ED8', label: 'Unidad Social Cristiana' },
  'FA':     { color: '#1a1a1a', bg: '#EAB308', dark: '#854D0E', label: 'Frente Amplio' },
  'PPS':    { color: '#fff', bg: '#0EA5E9', dark: '#0369A1', label: 'Pueblo Soberano' },
};

// ── Banderas oficiales (imágenes de asamblea.go.cr, servidas desde /public) ───
const FLAG_STYLE: React.CSSProperties = { width: 38, height: 25, flexShrink: 0, borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.3)', display: 'block', objectFit: 'cover' };
const PARTY_FLAG_SRC: Record<string, string> = {
  'Partido Liberación Nacional':     '/flag-PLN.png',
  'Partido Pueblo Soberano':         '/flag-PPS.png',
  'Partido Frente Amplio':           '/flag-FA.png',
  'Partido Unidad Social Cristiana': '/flag-PUSC.png',
  'Partido Agenda Ciudadana':        '/flag-CAC.png',
  'Coalición Agenda Ciudadana':      '/flag-CAC.png',
  'PLN':  '/flag-PLN.png',
  'PPS':  '/flag-PPS.png',
  'FA':   '/flag-FA.png',
  'PUSC': '/flag-PUSC.png',
};

function getPartyFlagSrc(fraccion: string, partido?: string): string | null {
  const src = fraccion || partido || '';
  if (PARTY_FLAG_SRC[src]) return PARTY_FLAG_SRC[src];
  const up = src.toUpperCase();
  if (up.includes('SOBERANO'))   return '/flag-PPS.png';
  if (up.includes('LIBERACI'))   return '/flag-PLN.png';
  if (up.includes('FRENTE AMP')) return '/flag-FA.png';
  if (up.includes('CRISTIANA'))  return '/flag-PUSC.png';
  if (up.includes('AGENDA'))     return '/flag-CAC.png';
  return null;
}

function getPartyFlag(fraccion: string, partido?: string): React.ReactNode {
  const imgSrc = getPartyFlagSrc(fraccion, partido);
  if (imgSrc) {
    return <img src={imgSrc} alt="" style={FLAG_STYLE} />;
  }
  // Fallback: colored rectangle
  const p = getPartido(fraccion || partido || '');
  return (
    <span style={{ ...FLAG_STYLE, background: p.bg, display: 'inline-block', borderRadius: 3 }} />
  );
}
function getPartido(fraccion: string, partido?: string) {
  const src = fraccion || partido || '';
  // Intento exacto primero
  if (PARTIDOS[src]) return PARTIDOS[src];
  // Búsqueda por palabras clave (para abreviaturas o nombres parciales)
  const up = src.toUpperCase();
  if (up.includes('SOBERANO'))   return PARTIDOS['Partido Pueblo Soberano'];
  if (up.includes('LIBERACI'))   return PARTIDOS['Partido Liberación Nacional'];
  if (up.includes('FRENTE AMP')) return PARTIDOS['Partido Frente Amplio'];
  if (up.includes('CRISTIANA'))  return PARTIDOS['Partido Unidad Social Cristiana'];
  if (up.includes('AGENDA'))     return PARTIDOS['Partido Agenda Ciudadana'];
  if (up.includes('NUEVA REP'))  return PARTIDOS['Partido Nueva República'];
  if (up.includes('RESTAURAC'))  return PARTIDOS['Partido Restauración Nacional'];
  if (up.includes('DEMOCR'))     return PARTIDOS['Fuerza Democrática'];
  if (up.includes('PLN'))        return PARTIDOS['PLN'];
  if (up.includes('PUSC'))       return PARTIDOS['PUSC'];
  if (up.includes(' FA') || up === 'FA') return PARTIDOS['FA'];
  return { color: '#fff', bg: '#334155', dark: '#0f172a', label: src || 'Independiente' };
}

// ── Fetches ───────────────────────────────────────────────────────────────────
async function getPerfil(slug: string) {
  try {
    const r = await fetch(`${API}/diputados/${slug}`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

async function getVotosIndividuales(slug: string) {
  try {
    const res = await fetch(
      `${API}/diputados/${slug}/votos?per_page=30`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getNoticias(nombreCompleto: string): Promise<any[]> {
  try {
    const partes = nombreCompleto.trim().split(/\s+/);
    // Primer apellido = penúltimo token (orden CR: Nombre Apellido1 Apellido2)
    const primerApellido = partes.length >= 2 ? partes[partes.length - 2] : partes[0];

    // Sin _fields para que _embed devuelva _embedded correctamente
    const [r1, r2] = await Promise.all([
      fetch(
        `${WP_API}/posts?search=${encodeURIComponent(nombreCompleto)}&per_page=10&_embed`,
        { next: { revalidate: 1800 } }
      ),
      fetch(
        `${WP_API}/posts?search=${encodeURIComponent(primerApellido)}&per_page=10&_embed`,
        { next: { revalidate: 1800 } }
      ),
    ]);

    const [posts1, posts2]: [any[], any[]] = await Promise.all([
      r1.ok ? r1.json() : [],
      r2.ok ? r2.json() : [],
    ]);

    // Combinar sin duplicados
    const seen = new Set<number>();
    const combinados: any[] = [];
    for (const p of [...posts1, ...posts2]) {
      if (!seen.has(p.id)) { seen.add(p.id); combinados.push(p); }
    }

    // Filtro: al menos un token del nombre (≥5 chars) en título o excerpt
    const tokens = nombreCompleto.toLowerCase().split(/\s+/).filter(t => t.length >= 4);
    const filtrados = combinados.filter((p: any) => {
      const haystack = (
        (p.title?.rendered || '') + ' ' + (p.excerpt?.rendered || '')
      ).toLowerCase().replace(/<[^>]+>/g, '');
      return tokens.some(t => haystack.includes(t));
    });

    // Convertir link a ruta relativa para que funcione con next/link
    return filtrados.slice(0, 10).map((p: any) => ({
      ...p,
      link: (p.link || '')
        .replace(/^https?:\/\/(www\.|cms\.)?acontecer\.co\.cr/, '')
        .replace(/\/$/, '') || '/',
    }));
  } catch { return []; }
}

// ── SSG ───────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const r = await fetch(`${API}/diputados`, { cache: 'no-store' });
    const list = r.ok ? await r.json() : [];
    return list.map((d: { slug: string }) => ({ slug: d.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPerfil(slug);
  if (!data) return { title: 'Diputado — Acontecer' };
  const d = data.diputado;
  const p = getPartido(d.fraccion, d.partido);

  // ── Título: incluye "diputado" + provincia que es lo que la gente busca ──
  const provinciaStr = d.provincia ? ` por ${d.provincia}` : '';
  const titulo = `${d.nombre_completo} | Diputado${provinciaStr} · ${p.label} | Acontecer.co.cr`;

  // ── Descripción ~155 chars con términos de búsqueda reales ───────────────
  const descripcion = `${d.nombre_completo}, diputado${provinciaStr} del ${p.label} en la Asamblea Legislativa de Costa Rica 2026-2030. Asistencia, gastos de combustible, votaciones y proyectos de ley.`;

  // ── Keywords: nombre completo + variaciones + términos legislativos ───────
  const nombrePartes = d.nombre_completo.split(' ');
  const keywords = [
    d.nombre_completo,
    // Apellidos solos (como la gente busca en Google)
    nombrePartes.slice(-2).join(' '),
    nombrePartes.slice(-1)[0],
    `diputado ${nombrePartes.slice(-2).join(' ')}`,
    `diputada ${nombrePartes.slice(-2).join(' ')}`,
    p.label,
    d.fraccion || '',
    d.provincia ? `diputado ${d.provincia}` : '',
    'Asamblea Legislativa Costa Rica',
    'diputados Costa Rica 2026',
    'Monitor Legislativo Acontecer',
  ].filter(Boolean).join(', ');

  // ── OG image ─────────────────────────────────────────────────────────────
  const ogImage = {
    url: `https://acontecer.co.cr/asamblea/${slug}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: `${d.nombre_completo} — Monitor Legislativo`,
  };

  return {
    title: titulo,
    description: descripcion,
    keywords,
    authors: [{ name: 'Acontecer.co.cr', url: 'https://acontecer.co.cr' }],
    alternates: { canonical: `https://acontecer.co.cr/asamblea/${slug}` },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: {
      type: 'profile',
      url: `https://acontecer.co.cr/asamblea/${slug}`,
      siteName: 'Acontecer.co.cr',
      title: `${d.nombre_completo} | Diputado${provinciaStr} — Monitor Legislativo`,
      description: descripcion,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${d.nombre_completo} | ${p.label}`,
      description: `Diputado${provinciaStr} · Asamblea Legislativa 2026-2030`,
      images: [ogImage.url],
    },
  };
}

export const revalidate = 3600;
export const dynamicParams = true;

// ── SVG icons (24×24, stroke-based) ──────────────────────────────────────────
const Icon = {
  MapPin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, flexShrink: 0 }}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  Mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, flexShrink: 0 }}>
      <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
    </svg>
  ),
  Briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, flexShrink: 0 }}>
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  Fuel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <path d="M3 22V6l9-4 9 4v16"/><path d="M3 11h18"/><path d="M12 6v5"/>
    </svg>
  ),
  Calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <path d="M3 22V3h18v19"/><path d="M9 22V12h6v10"/><rect x="9" y="6" width="2" height="2"/><rect x="13" y="6" width="2" height="2"/>
    </svg>
  ),
  FileText: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
    </svg>
  ),
  Vote: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <path d="M3 3h18v4H3z"/><path d="M5 7v14"/><path d="M19 7v14"/><path d="M8 11h8"/><path d="M8 15h5"/>
    </svg>
  ),
  Newspaper: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18"/><path d="M2 22h20"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
    </svg>
  ),
  Check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Minus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ width: 11, height: 11 }}>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  ExternalLink: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Person: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 52, height: 52 }}>
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
};

// Social icon paths (fill-based, brand icons)
const SOCIAL_PATHS: Record<string, string> = {
  twitter:  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  instagram:'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  tiktok:   'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z',
  youtube:  'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z',
};

// ── Página ────────────────────────────────────────────────────────────────────
export default async function DiputadoPerfil({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPerfil(slug);
  if (!data) notFound();

  const {
    diputado: d,
    votaciones  = [],
    expedientes = [],
    gasolina    = [],
    asistencia  = [],
    promedio_global_gasolina:     promedioGasolina   = 0,
    gasto_personal_promedio:      gastoPersonal      = 0,
    promedio_nacional_asistencia: promedioAsistencia = 0,
  } = data;

  const [noticias, votosIndData] = await Promise.all([
    getNoticias(d.nombre_completo).catch(() => []),
    getVotosIndividuales(slug),
  ]);

  const votosInd: any[]  = votosIndData?.votos ?? [];
  const votosResumen = votosIndData ?? null;

  const partido     = getPartido(d.fraccion, d.partido);
  const asistActual = asistencia?.[0] ?? null;
  const asistPct    = asistActual ? parseFloat(asistActual.porcentaje) : null;
  const sobreGas    = promedioGasolina > 0 && gastoPersonal > promedioGasolina * 1.1;
  const pctGas      = promedioGasolina > 0 && gastoPersonal > 0
    ? ((gastoPersonal - promedioGasolina) / promedioGasolina * 100) : null;
  const pctAsist    = promedioAsistencia > 0 && asistPct !== null
    ? (asistPct - promedioAsistencia) : null;
  const aprobadas   = votaciones.filter((v: any) => v.resultado === 'APROBADO').length;
  const rechazadas  = votaciones.filter((v: any) => v.resultado === 'RECHAZADO').length;

  const comisiones: string[] = d.comisiones
    ? d.comisiones.split(/[|\n]/).map((c: string) => c.trim()).filter(Boolean)
    : [];

  const redes = [
    d.twitter       && { key: 'twitter',   label: 'X / Twitter', href: d.twitter },
    d.facebook      && { key: 'facebook',  label: 'Facebook',    href: d.facebook },
    d.instagram     && { key: 'instagram', label: 'Instagram',   href: d.instagram },
    d.tiktok        && { key: 'tiktok',    label: 'TikTok',      href: d.tiktok },
    d.youtube_canal && { key: 'youtube',   label: 'YouTube',     href: d.youtube_canal },
  ].filter(Boolean) as { key: string; label: string; href: string }[];

  // Iniciales del partido para el badge
  const partidoSigla = (d.fraccion || d.partido || 'IND')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 4).toUpperCase();

  // ── Person Schema ─────────────────────────────────────────────────────────
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: d.nombre_completo,
    url: `https://acontecer.co.cr/asamblea/${slug}`,
    ...(d.foto_url && { image: d.foto_url }),
    ...(d.email    && { email: `mailto:${d.email}` }),
    jobTitle: d.cargo || 'Diputado',
    worksFor: {
      '@type': 'GovernmentOrganization',
      name: 'Asamblea Legislativa de Costa Rica',
      url: 'https://www.asamblea.go.cr',
    },
    memberOf: {
      '@type': 'Organization',
      name: d.fraccion || d.partido || 'Fracción independiente',
    },
    ...(d.provincia && { homeLocation: { '@type': 'AdministrativeArea', name: d.provincia } }),
    ...(d.twitter   && { sameAs: [d.twitter] }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${partido.dark} 0%, ${partido.bg} 55%, ${partido.bg}cc 100%)`,
      }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 20px 0' }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/asamblea" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Monitor Legislativo</Link>
            <span style={{ opacity: 0.4 }}>/</span>
            <Link href="/asamblea/diputados" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Diputados</Link>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{d.nombre_completo}</span>
          </nav>
        </div>

        {/* Perfil principal */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px 0' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>

            {/* Foto */}
            <div style={{
              width: 112, height: 112, borderRadius: '50%', flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.2)',
              background: 'rgba(0,0,0,0.25)',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              marginBottom: -20,
            }}>
              {d.foto_url
                ? <img src={fotoDiputadoUrl(d.foto_url)} alt={d.nombre_completo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    {Icon.Person}
                  </div>
              }
            </div>

            {/* Nombre + metadata */}
            <div style={{ flex: 1, minWidth: 220, paddingBottom: 28 }}>

              {/* Partido badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 0,
                marginBottom: 12, borderRadius: 5, overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              }}>
                <div style={{ background: 'rgba(255,255,255,0.18)', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {getPartyFlag(d.fraccion, d.partido)}
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '0.06em' }}>
                    {partidoSigla}
                  </span>
                  <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    {partido.label}
                  </span>
                </div>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 'clamp(22px, 4vw, 36px)',
                fontWeight: 900, color: 'white',
                margin: '0 0 10px', lineHeight: 1.05,
                textShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }}>
                {d.nombre_completo}
              </h1>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'rgba(255,255,255,0.55)', alignItems: 'center' }}>
                {d.provincia && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {Icon.MapPin} {d.provincia}
                  </span>
                )}
                {d.cargo && (
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: 20, fontWeight: 600, fontSize: 11 }}>
                    {d.cargo}
                  </span>
                )}
                {d.email && (
                  <a href={`mailto:${d.email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 11 }}>
                    {Icon.Mail} {d.email}
                  </a>
                )}
              </div>

              {/* Redes sociales */}
              {redes.length > 0 && (
                <div style={{ display: 'flex', gap: 7, marginTop: 14 }}>
                  {redes.map(r => (
                    <a key={r.key} href={r.href} target="_blank" rel="noopener nofollow" title={r.label} style={{
                      width: 34, height: 34,
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none',
                    }}>
                      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'rgba(255,255,255,0.8)' }}>
                        <path d={SOCIAL_PATHS[r.key] || ''} />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'rgba(0,0,0,0.28)',
            backdropFilter: 'blur(12px)',
            borderRadius: '10px 10px 0 0',
            marginTop: 22,
          }}>
            {[
              {
                val: asistPct !== null ? `${asistPct.toFixed(0)}%` : '—',
                label: 'Asistencia',
                sub: pctAsist !== null ? `${pctAsist >= 0 ? '+' : ''}${pctAsist.toFixed(1)}pp vs media` : 'sin datos',
                color: !asistPct ? '#94a3b8' : asistPct >= 80 ? '#4ade80' : asistPct >= 60 ? '#fbbf24' : '#f87171',
              },
              {
                val: gastoPersonal > 0 ? `₡${Math.round(gastoPersonal / 1000)}k` : '—',
                label: 'Combustible / mes',
                sub: pctGas !== null ? `${pctGas >= 0 ? '+' : ''}${pctGas.toFixed(0)}% vs media` : '',
                color: sobreGas ? '#f87171' : gastoPersonal > 0 ? '#4ade80' : '#94a3b8',
              },
              {
                val: expedientes.length > 0 ? String(expedientes.length) : '—',
                label: 'Proyectos',
                sub: 'en registro',
                color: 'rgba(255,255,255,0.9)',
              },
              {
                val: votaciones.length > 0 ? String(aprobadas) : '—',
                label: 'Aprobadas',
                sub: votaciones.length > 0 ? `${rechazadas} rechazadas` : 'sin registros',
                color: votaciones.length > 0 ? '#4ade80' : '#94a3b8',
              },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '14px 10px 12px',
                textAlign: 'center',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: 'clamp(18px, 2.5vw, 26px)',
                  fontWeight: 900, color: s.color, lineHeight: 1,
                }}>{s.val}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 5 }}>{s.label}</div>
                {s.sub && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CUERPO ───────────────────────────────────────────────────────────── */}
      <div style={{ background: '#f1f5f9', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 20px 56px' }}>
          <div className="perfil-grid">

            {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Tarjeta partido */}
              <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${partido.dark}, ${partido.bg})` }} />
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>Fracción Parlamentaria</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                      {getPartyFlag(d.fraccion, d.partido)}
                      <div style={{
                        padding: '2px 7px', borderRadius: 4,
                        background: `linear-gradient(135deg, ${partido.dark}, ${partido.bg})`,
                        boxShadow: `0 2px 6px ${partido.bg}55`,
                      }}>
                        <span style={{ fontSize: 9, fontWeight: 900, color: partido.color, letterSpacing: '0.05em' }}>
                          {partidoSigla}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>{partido.label}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{d.provincia}{d.provincia && (d.fraccion || d.partido) ? ' · ' : ''}{d.fraccion || d.partido}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comisiones */}
              {comisiones.length > 0 && (
                <SideCard title="Comisiones" icon={Icon.Building} accentColor={partido.bg}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {comisiones.map((c, i) => (
                      <Link key={i} href={`/asamblea/comisiones/${comisionSlug(c)}`} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#334155', lineHeight: 1.45, padding: '5px 0', borderBottom: i < comisiones.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration: 'none' }}>
                        <span style={{ color: partido.bg, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>·</span>
                        <span style={{ borderBottom: '1px dotted #cbd5e1' }}>{c}</span>
                      </Link>
                    ))}
                  </div>
                </SideCard>
              )}

              {/* Combustible */}
              {gasolina.length > 0 && (
                <SideCard
                  title="Combustible mensual"
                  icon={Icon.Fuel}
                  accentColor={partido.bg}
                  badge={sobreGas ? { text: `+${pctGas?.toFixed(0)}% media`, alert: true } : undefined}
                >
                  {promedioGasolina > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                      <span>Media nacional</span>
                      <strong style={{ color: '#64748b' }}>₡{Math.round(promedioGasolina).toLocaleString('es-CR')}</strong>
                    </div>
                  )}
                  {gasolina.slice(0, 6).map((g: any, i: number) => {
                    const m = parseFloat(g.monto);
                    const diff = promedioGasolina > 0 ? ((m - promedioGasolina) / promedioGasolina * 100) : 0;
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '5px 0', borderBottom: i < 5 ? '1px solid #f8fafc' : 'none' }}>
                        <span style={{ color: '#64748b' }}>
                          {new Date(g.periodo + 'T12:00:00').toLocaleDateString('es-CR', { month: 'short', year: '2-digit' })}
                        </span>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, color: diff > 10 ? '#dc2626' : '#0f172a' }}>₡{Math.round(m / 1000)}k</span>
                          {diff !== 0 && (
                            <span style={{ fontSize: 10, fontWeight: 600, color: diff > 10 ? '#dc2626' : diff < -10 ? '#059669' : '#94a3b8' }}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </SideCard>
              )}

              {/* Asistencia historial */}
              {asistencia.length > 0 && (
                <SideCard title="Asistencia por año" icon={Icon.Calendar} accentColor={partido.bg}>
                  {asistencia.map((a: any) => {
                    const pct = parseFloat(a.porcentaje);
                    const col = pct >= 80 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626';
                    return (
                      <div key={a.anio} style={{ marginBottom: 11 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                          <span style={{ color: '#334155', fontWeight: 700 }}>{a.anio}</span>
                          <span style={{ color: col, fontWeight: 800 }}>{pct.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: 3, background: '#e2e8f0', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 2, transition: 'width 0.4s ease' }} />
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{a.sesiones_asistidas} / {a.sesiones_total} sesiones</div>
                      </div>
                    );
                  })}
                </SideCard>
              )}
            </aside>

            {/* ── CONTENIDO CENTRAL ──────────────────────────────────────────── */}
            <main style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>

              {/* BIOGRAFÍA */}
              {d.bio && (
                <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                  <div style={{ padding: '14px 18px 13px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 3, height: 18, background: partido.bg, borderRadius: 2, flexShrink: 0 }} />
                    <svg viewBox="0 0 24 24" fill="none" stroke={partido.bg} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, color: partido.bg }}>
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                    <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Biografía
                    </h2>
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <p style={{ margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                      {d.bio.replace(/​/g, '').replace(/\s{3,}/g, ' ').trim()}
                    </p>
                  </div>
                </div>
              )}

              {/* PROYECTOS DE LEY */}
              <Section title="Proyectos de Ley" count={expedientes.length} icon={Icon.FileText}
                empty={expedientes.length === 0}
                emptyMsg="Los proyectos presentados por este diputado se sincronizan automáticamente desde la Asamblea Legislativa."
              >
                {expedientes.map((e: any, i: number) => (
                  <div key={i} style={{
                    padding: '14px 18px',
                    borderBottom: i < expedientes.length - 1 ? '1px solid #f1f5f9' : 'none',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: 14,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 5, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#0000A2', background: '#e0e7ff', padding: '2px 7px', borderRadius: 4, letterSpacing: '0.03em' }}>
                          Exp. {e.numero}
                        </span>
                        {e.tipo && <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{e.tipo}</span>}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.5, marginBottom: 5 }}>
                        {e.titulo?.slice(0, 150)}
                      </div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: '#94a3b8', alignItems: 'center' }}>
                        {e.comision && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {Icon.Building} {e.comision?.slice(0, 55)}
                          </span>
                        )}
                        {e.fecha_presentacion && (
                          <span>{new Date(e.fecha_presentacion + 'T12:00:00').toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        )}
                      </div>
                    </div>
                    {e.estado && <EstadoBadge estado={e.estado} />}
                  </div>
                ))}
              </Section>

              {/* HISTORIAL DE VOTACIONES INDIVIDUALES */}
              <Section
                title="Historial de Votaciones Individuales"
                count={votosInd.length}
                icon={Icon.Vote}
                empty={votosInd.length === 0}
                emptyMsg="No hay registro de votaciones individuales aún. Los datos se extraen de los PDFs oficiales de la Asamblea Legislativa."
              >
                {/* Resumen de stats */}
                {votosResumen && votosResumen.total > 0 && (
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { label: 'SI', count: votosResumen.si, bg: '#dcfce7', color: '#166534', border: '#86efac' },
                      { label: 'NO', count: votosResumen.no, bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
                      { label: 'ABSTENCIÓN', count: votosResumen.abstencion, bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
                      { label: 'AUSENTE', count: votosResumen.ausente, bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
                    ].map(s => (
                      <span key={s.label} style={{
                        background: s.bg, color: s.color,
                        border: `1px solid ${s.border}`,
                        padding: '4px 12px', borderRadius: 20,
                        fontSize: 11, fontWeight: 700,
                      }}>
                        {s.label}: {s.count}
                      </span>
                    ))}
                  </div>
                )}
                {/* Lista de últimas 30 votaciones */}
                {votosInd.map((v: any, i: number) => {
                  const VOTO_STYLE: Record<string, { bg: string; color: string; border: string }> = {
                    SI:         { bg: '#dcfce7', color: '#166534', border: '#86efac' },
                    NO:         { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
                    ABSTENCION: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
                    AUSENTE:    { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
                  };
                  const vs = VOTO_STYLE[v.voto] ?? VOTO_STYLE.AUSENTE;
                  const RESULT_STYLE: Record<string, [string, string]> = {
                    APROBADO:  ['#dcfce7', '#15803d'],
                    RECHAZADO: ['#fee2e2', '#991b1b'],
                  };
                  const [rbg, rfg] = RESULT_STYLE[v.resultado] ?? ['#dbeafe', '#1d4ed8'];
                  return (
                    <div key={i} style={{
                      padding: '12px 18px',
                      borderBottom: i < votosInd.length - 1 ? '1px solid #f1f5f9' : 'none',
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', gap: 12,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                          {v.expediente && (
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#0000A2', background: '#e0e7ff', padding: '1px 6px', borderRadius: 3, letterSpacing: '0.03em' }}>
                              Exp. {v.expediente}
                            </span>
                          )}
                          {v.fecha && (
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>
                              {new Date(v.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.45 }}>
                          {(v.titulo || '').slice(0, 80)}{(v.titulo || '').length > 80 ? '…' : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                        <span style={{ background: rbg, color: rfg, padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>
                          {v.resultado}
                        </span>
                        <span style={{ background: vs.bg, color: vs.color, border: `1px solid ${vs.border}`, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
                          {v.voto}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </Section>

              {/* VOTACIONES */}
              <Section title="Votaciones del Plenario" count={votaciones.length} icon={Icon.Vote}
                empty={votaciones.length === 0}
                emptyMsg="Las votaciones se registran automáticamente cada sesión plenaria. El próximo lunes a jueves se actualizará este apartado."
              >
                {votaciones.slice(0, 15).map((v: any, i: number) => (
                  <div key={i} style={{
                    padding: '14px 18px',
                    borderBottom: i < Math.min(votaciones.length, 15) - 1 ? '1px solid #f1f5f9' : 'none',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {v.expediente && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#0000A2', background: '#e0e7ff', padding: '1px 6px', borderRadius: 3, marginRight: 7, letterSpacing: '0.03em' }}>
                            {v.expediente}
                          </span>
                        )}
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.45 }}>
                          {(v.titulo || '').slice(0, 130)}
                        </span>
                      </div>
                      <ResultBadge resultado={v.resultado} />
                    </div>
                    <VotBar si={v.votos_si} no={v.votos_no} abst={v.votos_abstencion} />
                    <div style={{ display: 'flex', gap: 14, fontSize: 11, flexWrap: 'wrap', alignItems: 'center', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16a34a', fontWeight: 700 }}>
                        {Icon.Check} {v.votos_si}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#dc2626', fontWeight: 700 }}>
                        {Icon.X} {v.votos_no}
                      </span>
                      {v.votos_abstencion > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
                          {Icon.Minus} {v.votos_abstencion}
                        </span>
                      )}
                      {v.fecha && (
                        <span style={{ marginLeft: 'auto', color: '#cbd5e1', fontSize: 10 }}>
                          {new Date(v.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                      {v.url_pdf && (
                        <a href={v.url_pdf} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0000A2', textDecoration: 'none', fontSize: 11 }}>
                          {Icon.ExternalLink} Acta PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </Section>

              {/* NOTICIAS — vinculación bidireccional: perfil ↔ artículos */}
              <Section title="Noticias en Acontecer" count={noticias.length} icon={Icon.Newspaper}
                empty={noticias.length === 0}
                emptyMsg="No hay noticias publicadas sobre este diputado en Acontecer.co.cr"
              >
                {noticias.map((post: any, idx: number) => {
                  const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                  const extracto = (post.excerpt?.rendered || '')
                    .replace(/<[^>]+>/g, '').trim().slice(0, 120);
                  const titulo = (post.title?.rendered || '')
                    .replace(/&#(\d+);/g, (_: string, n: string) => String.fromCharCode(Number(n)))
                    .replace(/<[^>]+>/g, '');
                  // Link interno (ya canonicalizado en getNoticias)
                  const href = post.link || '#';

                  return (
                    <Link key={post.id} href={href}
                      style={{
                        display: 'flex', gap: 14, padding: '14px 18px',
                        borderBottom: idx < noticias.length - 1 ? '1px solid #f1f5f9' : 'none',
                        textDecoration: 'none', alignItems: 'flex-start',
                        transition: 'background 0.15s',
                      }}>
                      {img && (
                        <div style={{ width: 90, height: 62, flexShrink: 0, borderRadius: 8, overflow: 'hidden', background: '#f0f2f5' }}>
                          <img src={img} alt="" loading="lazy" decoding="async"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: 4 }}>{titulo}</div>
                        {extracto && (
                          <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>{extracto}{extracto.length >= 120 ? '…' : ''}</div>
                        )}
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span>📰 Acontecer.co.cr</span>
                          <span>·</span>
                          <span>{new Date(post.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </Section>

            </main>
          </div>
        </div>
      </div>

      <style>{`
        .perfil-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 14px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .perfil-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

// ── Componentes ───────────────────────────────────────────────────────────────

function VotBar({ si, no, abst }: { si: number; no: number; abst: number }) {
  const total = (si + no + abst) || 57;
  return (
    <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', gap: 1, margin: '0 0 8px', background: '#f1f5f9' }}>
      <div style={{ flex: si / total, background: '#22c55e', minWidth: si > 0 ? 3 : 0 }} />
      <div style={{ flex: no / total, background: '#ef4444', minWidth: no > 0 ? 3 : 0 }} />
      <div style={{ flex: abst / total, background: '#e2e8f0', minWidth: abst > 0 ? 2 : 0 }} />
    </div>
  );
}

function ResultBadge({ resultado }: { resultado: string }) {
  const styles: Record<string, [string, string]> = {
    APROBADO:  ['#dcfce7', '#15803d'],
    RECHAZADO: ['#fee2e2', '#991b1b'],
    VOTACION:  ['#dbeafe', '#1d4ed8'],
  };
  const [bg, fg] = styles[resultado] ?? styles.VOTACION;
  return (
    <span style={{ background: bg, color: fg, padding: '4px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '0.04em', flexShrink: 0 }}>
      {resultado}
    </span>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, [string, string]> = {
    'APROBADO':  ['#dcfce7', '#15803d'],
    'ARCHIVADO': ['#f1f5f9', '#64748b'],
    'VETADO':    ['#fee2e2', '#991b1b'],
    'VIGENTE':   ['#dbeafe', '#1d4ed8'],
    'COMISI':    ['#fef9c3', '#854d0e'],
    'PRIMER':    ['#e0f2fe', '#0369a1'],
    'SEGUNDO':   ['#fce7f3', '#9d174d'],
    'EN TR':     ['#f0fdf4', '#166534'],
    'EN AG':     ['#e0f2fe', '#075985'],
  };
  const key = Object.keys(map).find(k => estado?.toUpperCase().includes(k));
  const [bg, fg] = key ? map[key] : ['#f8fafc', '#64748b'];
  return (
    <span style={{ background: bg, color: fg, padding: '4px 9px', borderRadius: 5, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {estado?.slice(0, 22)}
    </span>
  );
}

function SideCard({ title, icon, badge, accentColor, children }: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
  badge?: { text: string; alert: boolean };
}) {
  return (
    <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '10px 14px 9px', display: 'flex', alignItems: 'center', gap: 7, borderBottom: '1px solid #f8fafc' }}>
        <span style={{ color: accentColor, display: 'flex', alignItems: 'center' }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', flex: 1 }}>{title}</span>
        {badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
            background: badge.alert ? '#fee2e2' : '#dcfce7',
            color: badge.alert ? '#991b1b' : '#15803d',
          }}>
            {badge.text}
          </span>
        )}
      </div>
      <div style={{ padding: '10px 14px' }}>{children}</div>
    </div>
  );
}

function Section({ title, count, icon, empty, emptyMsg, children }: {
  title: string;
  count: number;
  icon: React.ReactNode;
  empty: boolean;
  emptyMsg: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '14px 18px 13px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 3, height: 18, background: '#0000A2', borderRadius: 2, flexShrink: 0 }} />
        <span style={{ color: '#0000A2', display: 'flex', alignItems: 'center' }}>{icon}</span>
        <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, flex: 1 }}>
          {title}
        </h2>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 10,
          background: count > 0 ? '#e0e7ff' : '#f1f5f9',
          color: count > 0 ? '#0000A2' : '#94a3b8',
        }}>
          {count > 0 ? count : '—'}
        </span>
      </div>

      {empty
        ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, lineHeight: 1.7, maxWidth: 420, marginInline: 'auto' }}>{emptyMsg}</p>
          </div>
        )
        : <div>{children}</div>
      }
    </div>
  );
}
