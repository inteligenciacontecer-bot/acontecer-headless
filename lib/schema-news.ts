/**
 * schema-news.ts — Helper para generar JSON-LD NewsArticle reforzado
 *
 * Estrategia: enriquece el schema base con `mentions`, `about`, `speakable`,
 * `articleBody`, `citation` y entidades linkeadas a Wikipedia/Wikidata.
 *
 * Objetivo: que ChatGPT, Gemini, Perplexity y AI Overview de Google nos
 * citen como fuente cuando responden consultas sobre Costa Rica.
 */

// ── Entidades estructuradas con sameAs (linked data) ──────────────────────

const COSTA_RICA = {
  '@type': 'Country',
  name: 'Costa Rica',
  sameAs: [
    'https://es.wikipedia.org/wiki/Costa_Rica',
    'https://www.wikidata.org/wiki/Q800',
  ],
};

// Provincias con Wikidata IDs
const PROVINCIAS: Record<string, { name: string; sameAs: string[] }> = {
  'san josé':   { name: 'Provincia de San José',   sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_San_José',   'https://www.wikidata.org/wiki/Q83306'] },
  'san jose':   { name: 'Provincia de San José',   sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_San_José',   'https://www.wikidata.org/wiki/Q83306'] },
  'alajuela':   { name: 'Provincia de Alajuela',   sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_Alajuela',   'https://www.wikidata.org/wiki/Q199533'] },
  'cartago':    { name: 'Provincia de Cartago',    sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_Cartago',    'https://www.wikidata.org/wiki/Q463577'] },
  'heredia':    { name: 'Provincia de Heredia',    sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_Heredia',    'https://www.wikidata.org/wiki/Q199543'] },
  'guanacaste': { name: 'Provincia de Guanacaste', sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_Guanacaste', 'https://www.wikidata.org/wiki/Q463586'] },
  'puntarenas': { name: 'Provincia de Puntarenas', sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_Puntarenas', 'https://www.wikidata.org/wiki/Q199545'] },
  'limón':      { name: 'Provincia de Limón',      sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_Limón',      'https://www.wikidata.org/wiki/Q485271'] },
  'limon':      { name: 'Provincia de Limón',      sameAs: ['https://es.wikipedia.org/wiki/Provincia_de_Limón',      'https://www.wikidata.org/wiki/Q485271'] },
};

// Instituciones públicas más mencionadas
const INSTITUCIONES: Record<string, { name: string; sameAs: string[] }> = {
  'asamblea legislativa':  { name: 'Asamblea Legislativa de Costa Rica',         sameAs: ['https://es.wikipedia.org/wiki/Asamblea_Legislativa_de_Costa_Rica', 'https://www.wikidata.org/wiki/Q1639825'] },
  'mep':                   { name: 'Ministerio de Educación Pública',            sameAs: ['https://es.wikipedia.org/wiki/Ministerio_de_Educación_Pública_(Costa_Rica)'] },
  'ministerio de educación': { name: 'Ministerio de Educación Pública',           sameAs: ['https://es.wikipedia.org/wiki/Ministerio_de_Educación_Pública_(Costa_Rica)'] },
  'ccss':                  { name: 'Caja Costarricense de Seguro Social',         sameAs: ['https://es.wikipedia.org/wiki/Caja_Costarricense_del_Seguro_Social'] },
  'caja costarricense':    { name: 'Caja Costarricense de Seguro Social',         sameAs: ['https://es.wikipedia.org/wiki/Caja_Costarricense_del_Seguro_Social'] },
  'ice':                   { name: 'Instituto Costarricense de Electricidad',     sameAs: ['https://es.wikipedia.org/wiki/Instituto_Costarricense_de_Electricidad'] },
  'aya':                   { name: 'Instituto Costarricense de Acueductos y Alcantarillados', sameAs: ['https://es.wikipedia.org/wiki/Instituto_Costarricense_de_Acueductos_y_Alcantarillados'] },
  'mopt':                  { name: 'Ministerio de Obras Públicas y Transportes',  sameAs: ['https://es.wikipedia.org/wiki/Ministerio_de_Obras_Públicas_y_Transportes_(Costa_Rica)'] },
  'tse':                   { name: 'Tribunal Supremo de Elecciones',              sameAs: ['https://es.wikipedia.org/wiki/Tribunal_Supremo_de_Elecciones_de_Costa_Rica'] },
  'corte suprema':         { name: 'Corte Suprema de Justicia',                   sameAs: ['https://es.wikipedia.org/wiki/Corte_Suprema_de_Justicia_de_Costa_Rica'] },
  'banco central':         { name: 'Banco Central de Costa Rica',                 sameAs: ['https://es.wikipedia.org/wiki/Banco_Central_de_Costa_Rica'] },
  'bccr':                  { name: 'Banco Central de Costa Rica',                 sameAs: ['https://es.wikipedia.org/wiki/Banco_Central_de_Costa_Rica'] },
  'oij':                   { name: 'Organismo de Investigación Judicial',          sameAs: ['https://es.wikipedia.org/wiki/Organismo_de_Investigación_Judicial'] },
  'fuerza pública':        { name: 'Fuerza Pública de Costa Rica',                sameAs: ['https://es.wikipedia.org/wiki/Fuerza_Pública_de_Costa_Rica'] },
  'inder':                 { name: 'Instituto de Desarrollo Rural',               sameAs: [] },
  'ina':                   { name: 'Instituto Nacional de Aprendizaje',            sameAs: ['https://es.wikipedia.org/wiki/Instituto_Nacional_de_Aprendizaje'] },
};

// Personalidades públicas relevantes
const PERSONAS: Record<string, { name: string; sameAs: string[] }> = {
  'rodrigo chaves':       { name: 'Rodrigo Chaves Robles',        sameAs: ['https://es.wikipedia.org/wiki/Rodrigo_Chaves_Robles',        'https://www.wikidata.org/wiki/Q43203'] },
  'rodrigo chaves robles':{ name: 'Rodrigo Chaves Robles',        sameAs: ['https://es.wikipedia.org/wiki/Rodrigo_Chaves_Robles',        'https://www.wikidata.org/wiki/Q43203'] },
  'carlos alvarado':      { name: 'Carlos Alvarado Quesada',      sameAs: ['https://es.wikipedia.org/wiki/Carlos_Alvarado_Quesada'] },
  'laura chinchilla':     { name: 'Laura Chinchilla',             sameAs: ['https://es.wikipedia.org/wiki/Laura_Chinchilla'] },
  'óscar arias':          { name: 'Óscar Arias Sánchez',          sameAs: ['https://es.wikipedia.org/wiki/Óscar_Arias_Sánchez'] },
  'oscar arias':          { name: 'Óscar Arias Sánchez',          sameAs: ['https://es.wikipedia.org/wiki/Óscar_Arias_Sánchez'] },
  'fabricio alvarado':    { name: 'Fabricio Alvarado Muñoz',      sameAs: ['https://es.wikipedia.org/wiki/Fabricio_Alvarado_Muñoz'] },
  'otto guevara':         { name: 'Otto Guevara Guth',            sameAs: ['https://es.wikipedia.org/wiki/Otto_Guevara_Guth'] },
};

// ── Mapeo de categorías a topics ──────────────────────────────────────────

const CATEGORIA_TO_ABOUT: Record<string, { name: string; sameAs: string[] }> = {
  nacionales:       { name: 'Política de Costa Rica',           sameAs: ['https://es.wikipedia.org/wiki/Política_de_Costa_Rica'] },
  internacionales:  { name: 'Relaciones internacionales',       sameAs: ['https://es.wikipedia.org/wiki/Relaciones_internacionales'] },
  deportes:         { name: 'Deporte en Costa Rica',            sameAs: ['https://es.wikipedia.org/wiki/Deporte_en_Costa_Rica'] },
  economia:         { name: 'Economía de Costa Rica',           sameAs: ['https://es.wikipedia.org/wiki/Economía_de_Costa_Rica'] },
  entretenimiento:  { name: 'Cultura de Costa Rica',            sameAs: ['https://es.wikipedia.org/wiki/Cultura_de_Costa_Rica'] },
  salud:            { name: 'Salud pública',                    sameAs: ['https://es.wikipedia.org/wiki/Salud_pública'] },
  tecnologia:       { name: 'Tecnología',                       sameAs: ['https://es.wikipedia.org/wiki/Tecnología'] },
  opinion:          { name: 'Opinión periodística',             sameAs: [] },
  turismo:          { name: 'Turismo en Costa Rica',            sameAs: ['https://es.wikipedia.org/wiki/Turismo_en_Costa_Rica'] },
  tendencias:       { name: 'Cultura popular',                  sameAs: [] },
};

// ── Builders ──────────────────────────────────────────────────────────────

/** Detecta entidades en el texto plano y devuelve schema.org mentions */
export function buildMentions(opts: {
  plainText: string;
  tags: Array<{ name: string; slug: string }>;
  diputadosDetectados?: Array<{ nombre_completo: string; slug: string }>;
}): any[] {
  const lower = opts.plainText.toLowerCase();
  const mentions: any[] = [];
  const seen = new Set<string>();

  // 1. Personas pre-mapeadas (presidentes, expresidentes)
  for (const [key, info] of Object.entries(PERSONAS)) {
    if (lower.includes(key) && !seen.has(info.name)) {
      mentions.push({ '@type': 'Person', name: info.name, sameAs: info.sameAs });
      seen.add(info.name);
    }
  }

  // 2. Diputados detectados (vienen del linker)
  if (opts.diputadosDetectados) {
    for (const d of opts.diputadosDetectados.slice(0, 10)) {
      if (!seen.has(d.nombre_completo)) {
        mentions.push({
          '@type': 'Person',
          name: d.nombre_completo,
          url: `https://acontecer.co.cr/asamblea/diputado/${d.slug}`,
        });
        seen.add(d.nombre_completo);
      }
    }
  }

  // 3. Instituciones
  for (const [key, info] of Object.entries(INSTITUCIONES)) {
    // Solo si la mención es como palabra completa (evita falsos positivos)
    const re = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(opts.plainText) && !seen.has(info.name)) {
      mentions.push({
        '@type': 'GovernmentOrganization',
        name: info.name,
        sameAs: info.sameAs.length ? info.sameAs : undefined,
      });
      seen.add(info.name);
    }
  }

  // 4. Provincias (lugares)
  for (const [key, info] of Object.entries(PROVINCIAS)) {
    const re = new RegExp(`\\b${key}\\b`, 'i');
    if (re.test(opts.plainText) && !seen.has(info.name)) {
      mentions.push({ '@type': 'Place', name: info.name, sameAs: info.sameAs });
      seen.add(info.name);
    }
  }

  // 5. Tags de WordPress como Thing genérico (top 8 más relevantes)
  for (const t of opts.tags.slice(0, 8)) {
    if (!seen.has(t.name)) {
      mentions.push({
        '@type': 'Thing',
        name: t.name,
        url: `https://acontecer.co.cr/etiqueta/${t.slug}`,
      });
      seen.add(t.name);
    }
  }

  // Cap a 20 mentions (Google ignora arrays muy largos)
  return mentions.slice(0, 20);
}

/** Genera array `about` con categoría + Costa Rica como contexto */
export function buildAbout(catSlug: string, catName: string): any[] {
  const about: any[] = [];
  const cat = CATEGORIA_TO_ABOUT[catSlug];
  if (cat) {
    about.push({ '@type': 'Thing', name: cat.name, sameAs: cat.sameAs.length ? cat.sameAs : undefined });
  } else {
    about.push({ '@type': 'Thing', name: catName });
  }
  about.push(COSTA_RICA);
  return about;
}

/** SpeakableSpecification para Google Assistant / TTS */
export function buildSpeakable() {
  return {
    '@type': 'SpeakableSpecification',
    cssSelector: [
      '.nv2-article-title',
      '.nv2-article-subhead',
      '.nv2-article-body > .nv2-measure > p:first-of-type',
    ],
  };
}

/** Extrae enlaces externos del HTML como citation (omite cms/acontecer/social) */
export function extractCitations(htmlContent: string, max = 5): any[] {
  const links: string[] = [];
  const seen = new Set<string>();
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(htmlContent)) !== null) {
    const url = m[1];
    if (!/^https?:\/\//i.test(url)) continue;
    if (/acontecer\.co\.cr|facebook\.com|twitter\.com|x\.com|wa\.me|whatsapp\.com|t\.me|instagram\.com/i.test(url)) continue;
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, '');
      if (!seen.has(host + u.pathname)) {
        seen.add(host + u.pathname);
        links.push(url);
        if (links.length >= max) break;
      }
    } catch {}
  }
  return links.map((url) => ({ '@type': 'CreativeWork', url }));
}

/** Texto plano del cuerpo (limitado para no inflar HTML — Google solo lee primeros chars) */
export function buildArticleBody(htmlContent: string, maxChars = 5000): string {
  return htmlContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}
