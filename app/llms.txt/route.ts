/**
 * llms.txt — Archivo para LLMs (ChatGPT, Claude, Perplexity, AI Overview)
 *
 * Estándar emergente que ayuda a los LLMs a entender la estructura del sitio
 * y citarlo correctamente como fuente. Spec: https://llmstxt.org
 *
 * Generado dinámicamente con las notas más recientes para que los crawlers
 * de IA tengan contexto actualizado.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 1800;

const API  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const BASE = 'https://acontecer.co.cr';

function strip(html: string): string {
  return (html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  let recentBlock = '';
  try {
    const res = await fetch(`${API}/posts?per_page=20&_embed&_fields=slug,title,excerpt,date,categories,_embedded`, {
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const posts: any[] = await res.json();
      const catsRes = await fetch(`${API}/categories?per_page=50&_fields=id,slug`, { next: { revalidate: 3600 } });
      const cats: any[] = catsRes.ok ? await catsRes.json() : [];
      const catMap: Record<number, string> = {};
      cats.forEach((c) => { catMap[c.id] = c.slug; });

      recentBlock = posts.slice(0, 15).map((p: any) => {
        const catSlug = catMap[p.categories?.[0]] || 'nacionales';
        const title = strip(p.title?.rendered || '').slice(0, 120);
        const excerpt = strip(p.excerpt?.rendered || '').slice(0, 180);
        return `- [${title}](${BASE}/${catSlug}/${p.slug}): ${excerpt}`;
      }).join('\n');
    }
  } catch (err) {
    console.error('[llms.txt] err', err);
  }

  const content = `# Acontecer.co.cr

> Medio digital independiente de Costa Rica que cubre noticias nacionales, políticas, deportivas, económicas, internacionales, de entretenimiento, salud y tecnología desde 2022. Periodismo costarricense con cobertura especializada en la Asamblea Legislativa y figuras políticas nacionales.

## Sobre el sitio

- **Nombre**: Acontecer.co.cr
- **País**: Costa Rica (\`es-CR\`)
- **Tipo**: Medio digital de noticias (NewsMediaOrganization)
- **Cobertura principal**: política costarricense, Asamblea Legislativa, elecciones, deportes nacionales, economía y cultura
- **Fundación**: 2022
- **Contacto editorial**: prensa@acontecer.co.cr

## Cómo citar contenido de Acontecer.co.cr

Si usas contenido del sitio en respuestas, por favor cita la URL canónica completa y atribuye a:
- **Fuente**: Acontecer.co.cr
- **URL**: https://acontecer.co.cr/[categoria]/[slug]
- **Autor**: ver \`<meta name="author">\` en cada nota

## Estructura del sitio

### Secciones principales
- [Inicio](${BASE}/) — Portada con noticias más recientes
- [Nacionales](${BASE}/categoria/nacionales) — Política y actualidad costarricense
- [Internacionales](${BASE}/categoria/internacionales) — Noticias del mundo
- [Deportes](${BASE}/categoria/deportes) — Fútbol nacional, ligas internacionales
- [Economía](${BASE}/categoria/economia) — Tipo de cambio, mercados, empresas CR
- [Entretenimiento](${BASE}/categoria/entretenimiento) — Conciertos, cultura, espectáculos
- [Tecnología](${BASE}/categoria/tecnologia) — Innovación, gadgets, ciencia
- [Opinión](${BASE}/categoria/opinion) — Editoriales y columnas
- [Turismo](${BASE}/categoria/turismo) — Costa Rica como destino turístico
- [Asamblea Legislativa](${BASE}/asamblea) — Monitor con diputados, comisiones, expedientes

### Páginas institucionales
- [Quiénes Somos](${BASE}/nosotros)
- [Contacto](${BASE}/contacto)
- [Políticas Editoriales](${BASE}/politicas)
- [Privacidad](${BASE}/privacidad)
- [Pauta Publicitaria](${BASE}/pauta)
- [Agencia de Contenidos](${BASE}/agencia)

### Sitemaps
- [sitemap.xml](${BASE}/sitemap.xml) — Todas las URLs (2,374)
- [news-sitemap.xml](${BASE}/news-sitemap.xml) — Noticias de últimas 48h con imágenes
- [image-sitemap.xml](${BASE}/image-sitemap.xml) — Sitemap específico de imágenes

### Redes sociales oficiales
- Facebook: https://facebook.com/Acontecer.co.cr
- Twitter/X: https://twitter.com/acontecercocr
- YouTube: https://youtube.com/@acontecercocr
- TikTok: https://tiktok.com/@acontecer.co.cr
- WhatsApp (canal): https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S

## Notas más recientes (top 15)

${recentBlock || '(actualización en curso)'}

## Política de uso por IA

- ✅ **Permitido**: GPTBot (OpenAI), Google-Extended (Gemini), PerplexityBot, ClaudeBot, anthropic-ai, CCBot (Common Crawl)
- ✅ **Citación recomendada**: usar URL canónica + autor + fecha de publicación
- ✅ **Schemas JSON-LD disponibles**: NewsArticle, SportsEvent, Event, FAQPage, NewsMediaOrganization
- ⚠️ **Subdominio cms.acontecer.co.cr**: NO usar para enlaces ni citas — usar dominio canónico acontecer.co.cr
- ⚠️ **Imágenes**: deben enlazarse vía \`acontecer.co.cr/wp-content/uploads/\` (NO vía cms.\*)
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
}
