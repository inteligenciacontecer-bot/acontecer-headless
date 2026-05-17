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

// ═══════════════════════════════════════════════════════════════════════════
// FAQ PAGE — detecta H2/H3 que son preguntas y arma FAQPage
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Busca preguntas (H2/H3 terminados en ?) y extrae la respuesta del párrafo siguiente.
 * Si encuentra >= 2 preguntas, devuelve un schema FAQPage. Si no, null.
 *
 * Google muestra FAQPage como featured snippet/AI Overview.
 */
export function buildFAQPage(htmlContent: string): any | null {
  if (!htmlContent) return null;

  // Match H2/H3 con texto que contiene un signo de pregunta
  const headingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const faqs: Array<{ q: string; a: string }> = [];

  let match: RegExpExecArray | null;
  const headings: Array<{ end: number; text: string }> = [];
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text.includes('?') || text.includes('¿')) {
      headings.push({ end: match.index + match[0].length, text });
    }
  }

  // Para cada heading-pregunta: extraer el contenido HASTA el siguiente heading
  for (let i = 0; i < headings.length; i++) {
    const startPos = headings[i].end;
    const endPos = i + 1 < headings.length
      ? htmlContent.indexOf('<h', startPos + 1)
      : htmlContent.length;
    const slice = htmlContent.slice(startPos, endPos > 0 ? endPos : htmlContent.length);

    // Tomar el primer párrafo o los primeros 500 chars de texto plano
    const pMatch = slice.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const answer = pMatch
      ? pMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      : slice.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);

    if (answer.length >= 30) {
      faqs.push({
        q: headings[i].text,
        a: answer.slice(0, 700),
      });
    }
  }

  if (faqs.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SPORTS EVENT — detecta partidos en notas de deportes
// ═══════════════════════════════════════════════════════════════════════════

const EQUIPOS_CR: Record<string, { name: string; sameAs?: string[] }> = {
  'saprissa':         { name: 'Deportivo Saprissa',           sameAs: ['https://es.wikipedia.org/wiki/Deportivo_Saprissa'] },
  'alajuelense':      { name: 'Liga Deportiva Alajuelense',    sameAs: ['https://es.wikipedia.org/wiki/Liga_Deportiva_Alajuelense'] },
  'liga deportiva':   { name: 'Liga Deportiva Alajuelense',    sameAs: ['https://es.wikipedia.org/wiki/Liga_Deportiva_Alajuelense'] },
  'lda':              { name: 'Liga Deportiva Alajuelense' },
  'herediano':        { name: 'Club Sport Herediano',         sameAs: ['https://es.wikipedia.org/wiki/Club_Sport_Herediano'] },
  'cartaginés':       { name: 'Club Sport Cartaginés',        sameAs: ['https://es.wikipedia.org/wiki/Club_Sport_Cartaginés'] },
  'cartagines':       { name: 'Club Sport Cartaginés' },
  'limón':            { name: 'Limón FC' },
  'limon':            { name: 'Limón FC' },
  'liberia':          { name: 'Municipal Liberia' },
  'san carlos':       { name: 'Asociación Deportiva San Carlos' },
  'pérez zeledón':    { name: 'Municipal Pérez Zeledón' },
  'perez zeledon':    { name: 'Municipal Pérez Zeledón' },
  'puntarenas':       { name: 'Puntarenas FC' },
  'sporting':         { name: 'Sporting FC' },
  'guadalupe':        { name: 'Guadalupe FC' },
  'santos':           { name: 'Santos de Guápiles' },
  'selección':        { name: 'Selección de Fútbol de Costa Rica',  sameAs: ['https://es.wikipedia.org/wiki/Selección_de_fútbol_de_Costa_Rica'] },
  'seleccion':        { name: 'Selección de Fútbol de Costa Rica',  sameAs: ['https://es.wikipedia.org/wiki/Selección_de_fútbol_de_Costa_Rica'] },
  'la sele':          { name: 'Selección de Fútbol de Costa Rica',  sameAs: ['https://es.wikipedia.org/wiki/Selección_de_fútbol_de_Costa_Rica'] },
};

const ESTADIOS_CR: Record<string, string> = {
  'estadio nacional':        'Estadio Nacional de Costa Rica',
  'ricardo saprissa':        'Estadio Ricardo Saprissa Aymá',
  'morera soto':             'Estadio Alejandro Morera Soto',
  'rosabal cordero':         'Estadio Rosabal Cordero',
  'eladio rosabal cordero':  'Estadio Eladio Rosabal Cordero',
  'jose rafael fello meza':  'Estadio José Rafael "Fello" Meza',
  'fello meza':              'Estadio José Rafael "Fello" Meza',
};

/**
 * Detecta si la nota es sobre un partido de fútbol y devuelve schema SportsEvent.
 * Heurísticas:
 *  - categoria === 'deportes'
 *  - contiene "vs", "vence", "derrota", "marcador", "final", "campeón"
 *  - menciona >= 2 equipos
 */
export function buildSportsEvent(opts: {
  catSlug: string;
  title: string;
  plainText: string;
  datePublished: string;
  url: string;
  image?: string;
}): any | null {
  if (opts.catSlug !== 'deportes') return null;

  const lower = (opts.title + ' ' + opts.plainText).toLowerCase();
  const matchKeywords = /\b(vs\.?|vence(?:n|s)?|derrot[aó]|march[aó]|final|campe[oó]n|gol(?:es)?|marcador|empat[oó]|gana(?:ron|n)?|pierd[ea])\b/i;
  if (!matchKeywords.test(lower)) return null;

  // Detectar equipos (necesitamos >= 2 para que sea un partido)
  const detectados: Array<{ key: string; info: typeof EQUIPOS_CR['saprissa'] }> = [];
  const seenName = new Set<string>();
  for (const [key, info] of Object.entries(EQUIPOS_CR)) {
    const re = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(lower) && !seenName.has(info.name)) {
      detectados.push({ key, info });
      seenName.add(info.name);
    }
  }

  if (detectados.length < 2) return null;

  const [home, away] = detectados;

  // Detectar estadio
  let venueName: string | undefined;
  for (const [key, name] of Object.entries(ESTADIOS_CR)) {
    if (lower.includes(key)) { venueName = name; break; }
  }

  const event: any = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: opts.title.slice(0, 110),
    description: opts.title,
    sport: 'Fútbol',
    startDate: opts.datePublished,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    homeTeam: {
      '@type': 'SportsTeam',
      name: home.info.name,
      sameAs: home.info.sameAs,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: away.info.name,
      sameAs: away.info.sameAs,
    },
    url: opts.url,
  };
  if (opts.image) event.image = opts.image;
  if (venueName) {
    event.location = {
      '@type': 'Place',
      name: venueName,
      address: { '@type': 'PostalAddress', addressCountry: 'CR' },
    };
  }

  return event;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENT — detecta conciertos / festivales en entretenimiento
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detecta si la nota anuncia un evento (concierto, festival) y devuelve schema Event.
 * Heurísticas:
 *  - categoria === 'entretenimiento'
 *  - contiene "concierto", "festival", "presentación", "tour", "show"
 *  - busca fecha futura en el contenido
 */
export function buildEvent(opts: {
  catSlug: string;
  title: string;
  plainText: string;
  datePublished: string;
  url: string;
  image?: string;
}): any | null {
  if (opts.catSlug !== 'entretenimiento') return null;

  const lower = (opts.title + ' ' + opts.plainText).toLowerCase();
  const matchKeywords = /\b(concierto|festival|presentaci[oó]n|tour|show|gira|evento|recital|cantante|cantar[áa]|llegar[áa]|fecha[s]?\s+de)\b/i;
  if (!matchKeywords.test(lower)) return null;

  // Intentar detectar fecha en el texto: "el 15 de mayo", "23 de junio", "15/03/2026"
  let startDate: string | undefined;
  const dateMatch = opts.plainText.match(/\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)(?:\s+de\s+(\d{4}))?/i);
  if (dateMatch) {
    const meses: Record<string, string> = {
      enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
      julio: '07', agosto: '08', septiembre: '09', setiembre: '09', octubre: '10',
      noviembre: '11', diciembre: '12',
    };
    const day = dateMatch[1].padStart(2, '0');
    const month = meses[dateMatch[2].toLowerCase()];
    const year = dateMatch[3] || new Date().getFullYear();
    startDate = `${year}-${month}-${day}`;
  }

  // Si no encontró fecha, usar la de publicación
  if (!startDate) startDate = opts.datePublished;

  // Performer: heurístico — primera frase capitalizada antes de "presenta", "anuncia", "viene"
  let performer: string | undefined;
  const performerMatch = opts.title.match(/^([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚáéíóúñÑ\s]+?)(?:\s+(?:presenta|anuncia|llega|viene|cantará|cantar[áa]|en\s+concierto|en\s+Costa))/);
  if (performerMatch) {
    performer = performerMatch[1].trim();
  }

  const event: any = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: opts.title.slice(0, 110),
    description: opts.title,
    startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: opts.url,
    location: {
      '@type': 'Place',
      name: 'Costa Rica',
      address: { '@type': 'PostalAddress', addressCountry: 'CR' },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Acontecer.co.cr (cobertura)',
      url: 'https://acontecer.co.cr',
    },
  };
  if (opts.image) event.image = opts.image;
  if (performer) {
    event.performer = { '@type': 'PerformingGroup', name: performer };
  }

  return event;
}
