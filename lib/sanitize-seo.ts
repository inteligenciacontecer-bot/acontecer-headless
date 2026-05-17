/**
 * sanitize-seo.ts — Limpia metadata SEO heredada de Yoast/WP
 *
 * Yoast SEO usa placeholders como %title%, %sep%, %sitename% que el plugin
 * resuelve en runtime. Si la nota se importa desde otra fuente, o el plugin
 * no procesa correctamente, los placeholders quedan como texto literal en
 * los metadatos.
 *
 * Esta utilidad detecta esos placeholders y rechaza el valor si contiene
 * cualquier patrón sospechoso. El caller debe hacer fallback a `rawTitle`
 * o al excerpt natural cuando esta función devuelve null.
 */

// Placeholders comunes de Yoast SEO y otros plugins WP
const PLACEHOLDER_PATTERNS = [
  /%title%/i,
  /%sep%/i,
  /%sitename%/i,
  /%site_name%/i,
  /%page%/i,
  /%category%/i,
  /%tag%/i,
  /%date%/i,
  /%author%/i,
  /%excerpt%/i,
  /%pagetotal%/i,
  /%currenttime%/i,
  /%currentdate%/i,
  /\{\{.*?\}\}/,           // Handlebars/Mustache leftover
  /íƒÂ°í|ââ‚¬|í\u{2026}/u, // mojibake típico de doble-encoding UTF-8 → latin1
];

/**
 * Devuelve la cadena saneada si es válida, o `null` si contiene placeholders
 * o caracteres corruptos. El caller debe hacer fallback.
 */
export function cleanSeoString(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.length < 3) return null;
  for (const re of PLACEHOLDER_PATTERNS) {
    if (re.test(trimmed)) return null;
  }
  return trimmed;
}

/**
 * Alias semántico para titles. Devuelve el title saneado o null.
 */
export function cleanSeoTitle(raw: string | null | undefined): string | null {
  return cleanSeoString(raw);
}

/**
 * Alias semántico para descriptions. Mismas reglas + límite de 200 chars.
 */
export function cleanSeoDesc(raw: string | null | undefined): string | null {
  const cleaned = cleanSeoString(raw);
  if (!cleaned) return null;
  return cleaned.slice(0, 200);
}
