/**
 * diputados-linker.ts
 * ───────────────────
 * Inserta automáticamente enlaces internos a perfiles de diputados
 * dentro del HTML del contenido de un artículo.
 *
 * Reglas:
 *  - Solo reemplaza en nodos de texto (entre > y <), nunca en atributos HTML
 *  - Nombres más largos primero para evitar matches parciales
 *  - Cada nombre se enlaza una sola vez por artículo (rel="noopener")
 *  - Ignora nombres < 8 chars para evitar falsos positivos
 */

export interface DiputadoMinimo {
  slug: string;
  nombre_completo: string;
}

export function linkDiputados(html: string, diputados: DiputadoMinimo[]): string {
  if (!diputados.length || !html) return html;

  // Ordenar por longitud descendente → los nombres compuestos se procesan primero
  const candidatos = [...diputados]
    .filter(d => (d.nombre_completo?.trim().length ?? 0) >= 8)
    .sort((a, b) => b.nombre_completo.length - a.nombre_completo.length);

  // Rastrear qué nombres ya se enlazaron (link juice: 1 link por nombre)
  const yaEnlazados = new Set<string>();

  // Operar solo sobre texto entre > y < (texto visible, no atributos)
  return html.replace(/>([^<]+)</g, (fullMatch, textContent: string) => {
    let processed = textContent;

    for (const { nombre_completo, slug } of candidatos) {
      if (yaEnlazados.has(slug)) continue;
      if (!processed.includes(nombre_completo)) continue;

      const escaped = nombre_completo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b${escaped}\\b`);

      if (re.test(processed)) {
        // Reemplazar solo la primera ocurrencia global del artículo
        processed = processed.replace(
          new RegExp(`\\b${escaped}\\b`, 'g'),
          `<a href="/asamblea/${slug}" title="Perfil legislativo de ${nombre_completo}" style="color:#0000A2;font-weight:600;border-bottom:1px solid rgba(0,0,162,0.3);text-decoration:none;">${nombre_completo}</a>`
        );
        yaEnlazados.add(slug);
      }
    }

    return `>${processed}<`;
  });
}
