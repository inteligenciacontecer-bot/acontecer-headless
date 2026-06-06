import './nota.css';
import { redirect, permanentRedirect, notFound } from 'next/navigation';
import TextToSpeech from '@/components/TextToSpeech';
import Sidebar, { type Heading } from '@/components/Sidebar';
import ArticleScrollTracker from '@/components/ArticleScrollTracker';
import NotaInteractive from '@/components/NotaInteractive';
import ThemeToggle from '@/components/ThemeToggle';
import AuthorAvatar from '@/components/AuthorAvatar';
import { linkDiputados, type DiputadoMinimo } from '@/lib/diputados-linker';
import { cleanSeoDesc } from '@/lib/sanitize-seo';
import { buildMentions, buildAbout, buildSpeakable, extractCitations, buildArticleBody, buildFAQPage, buildSportsEvent, buildEvent } from '@/lib/schema-news';

// SEO: reescribir URLs del CMS a dominio principal
const cmsToLocal = (u?: string | null) => u ? u.replace(/^https?:\/\/cms\.acontecer\.co\.cr\//i, 'https://acontecer.co.cr/') : u;


const API          = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const ASAMBLEA_API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

/* ── Helpers ────────────────────────────────────────────────────────────── */

/**
 * toISO — garantiza timezone en fechas WordPress.
 * WordPress REST API devuelve `date` como "2026-05-28T10:00:00" (sin zona).
 * Costa Rica es UTC−6 sin horario de verano → siempre -06:00.
 * Google News requiere ISO 8601 con timezone para validar frescura.
 */
const toISO = (d: string) =>
  d && !d.includes('+') && !d.endsWith('Z') ? d + '-06:00' : (d || '');

/**
 * fechaModEfectiva — evita que artículos VIEJOS se muestren como «actualizados hoy».
 * Si el artículo se publicó hace menos de 90 días, usa la fecha de modificación real
 * (frescura legítima). Si es más viejo, devuelve la fecha de publicación original,
 * de modo que corregir un dato o agregar un enlace NO lo reposicione como nuevo en
 * Google ni cambie su fecha visible. Mismo umbral que el sitemap (coherencia).
 */
const MOD_FRESCO_MS = 90 * 24 * 60 * 60 * 1000;
function fechaModEfectiva(date: string, modified: string): string {
  if (!date) return modified || '';
  const pub = new Date(toISO(date)).getTime();
  if (!Number.isFinite(pub)) return date;
  return (Date.now() - pub) < MOD_FRESCO_MS ? (modified || date) : date;
}

/** Decodifica entidades HTML numéricas y nombradas comunes */
function decodeEntities(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»');
}

function truncarHTML(html: string, maxParas = 3): string {
  const parts = html.split('</p>');
  if (parts.length <= maxParas) return html;
  return parts.slice(0, maxParas).join('</p>') + '</p>';
}

function extraerPrimerH2(html: string): { subtitulo: string | null; resto: string } {
  const match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!match) return { subtitulo: null, resto: html };
  const subtitulo = decodeEntities(match[1].replace(/<[^>]+>/g, '').trim());
  const resto = html.replace(match[0], '').trim();
  return { subtitulo, resto };
}

function extraerEncabezados(html: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<h([23])[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const text = decodeEntities(match[3].replace(/<[^>]+>/g, '').trim());
    if (text) headings.push({ id: match[2], text, level: parseInt(match[1]) });
  }
  return headings;
}

/**
 * insertarBannerWA — inyecta el banner del canal de WhatsApp después
 * del N-ésimo párrafo del contenido (default 3). Si el artículo tiene
 * menos párrafos, devuelve el HTML sin cambios.
 *
 * ⚠️ ZONA PROTEGIDA — Banner de canal WA oficial de Acontecer.
 * El CTA apunta a https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S
 * Aparece en el artículo principal después del 3er párrafo.
 * El estilo visual está en nota.css (.nv2-wa-cta).
 */
function insertarBannerWA(html: string, despuesDelParrafo = 3): string {
  const banner = `<aside class="nv2-wa-cta"><a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener noreferrer" aria-label="Unirse al canal oficial de WhatsApp de Acontecer.co.cr"><span class="nv2-wa-cta-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.84.98h.01a7.94 7.94 0 0 0 7.94-7.92 7.88 7.88 0 0 0-2.39-5.64zm-5.55 12.21h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.49.65.66-2.43-.16-.25a6.6 6.6 0 0 1-1.01-3.51 6.62 6.62 0 0 1 11.3-4.68 6.58 6.58 0 0 1 1.94 4.68 6.62 6.62 0 0 1-6.63 6.6zm3.62-4.94c-.2-.1-1.17-.58-1.35-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.12.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.12-1.38-.12-.2-.01-.31.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12-.01-.25-.01-.39-.01a.75.75 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.07.1.13 1.42 2.16 3.43 3.03.48.21.85.33 1.14.42.48.15.92.13 1.26.08.39-.06 1.17-.48 1.34-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23z"/></svg></span><span class="nv2-wa-cta-body"><strong class="nv2-wa-cta-title">Únase al canal de WhatsApp</strong><span class="nv2-wa-cta-desc">Reciba las noticias al instante · canal oficial · sin grupos ni spam</span></span><span class="nv2-wa-cta-arrow" aria-hidden="true">→</span></a></aside>`;
  // Separar por </p> conservando posibles atributos: usamos regex case-insensitive
  const parts = html.split(/<\/p>/i);
  if (parts.length <= despuesDelParrafo) return html;
  const antes = parts.slice(0, despuesDelParrafo).join('</p>') + '</p>';
  const despues = parts.slice(despuesDelParrafo).join('</p>');
  return antes + banner + despues;
}

/**
 * limpiarContenido — sanitiza el HTML de WordPress para el render
 * @param addHeadingIds  true sólo para el artículo principal (activa TOC IDs)
 *
 * ⚠️ ZONA PROTEGIDA — NO eliminar ni simplificar ninguna línea de esta función.
 * Cada regex tiene un motivo documentado. Historial de bugs:
 *
 *  • wp-block-embed / iframe   → embeds de video que no renderizan en headless
 *  • blockquote.tiktok-embed   → tiene min-width:325px fijo → overflow móvil
 *  • blockquote.twitter-tweet  → tiene min-width fijo → overflow móvil
 *  • blockquote.instagram-media → ídem
 *  • ins.adsbygoogle            → anuncios "fluid" que cargan iframes dinámicos
 *  • <script> en contenido      → adsbygoogle.js, embed.js, etc.
 *  • data-src → src             → imágenes lazy de artículos 2021 con placeholder gif
 *  • noscript                   → lazyload plugin duplica imágenes visualmente
 *  • cita-destacada             → párrafos con «guillemets» o "comillas tipográficas"
 *                                  reciben clase nv2-cita-destacada para estilo visual
 *
 * La defensa es DOBLE: limpiarContenido la elimina en server-side,
 * y nota.css tiene reglas display:none!important como fallback de caché.
 */
function limpiarContenido(html: string, addHeadingIds = false) {
  let sectionCount = 0;
  return html
    // SEO: reescribir URLs absolutas del CMS → dominio principal
    //   (next.config tiene rewrite /wp-content/* → cms.acontecer.co.cr/wp-content/*)
    .replace(/https?:\/\/cms\.acontecer\.co\.cr\/wp-content\//gi, 'https://acontecer.co.cr/wp-content/')
    // Elimina embeds de video/redes que no renderizamos
    .replace(/<figure[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    // Elimina embeds de TikTok (blockquote.tiktok-embed + su script de carga)
    .replace(/<blockquote[^>]*class="[^"]*tiktok-embed[^"]*"[^>]*>[\s\S]*?<\/blockquote>/gi, '')
    // Elimina embeds de Twitter/X (blockquote.twitter-tweet)
    .replace(/<blockquote[^>]*class="[^"]*twitter-tweet[^"]*"[^>]*>[\s\S]*?<\/blockquote>/gi, '')
    // Elimina embeds de Instagram (blockquote.instagram-media con min-width fijo)
    .replace(/<blockquote[^>]*class="[^"]*instagram-media[^"]*"[^>]*>[\s\S]*?<\/blockquote>/gi, '')
    // Elimina bloques de Google AdSense (<ins class="adsbygoogle">)
    .replace(/<ins[^>]*class="[^"]*adsbygoogle[^"]*"[^>]*>[\s\S]*?<\/ins>/gi, '')
    // Elimina <ins> auto-cerrado sin </ins> (variante de AdSense)
    .replace(/<ins[^>]*class="[^"]*adsbygoogle[^"]*"[^>]*\/>/gi, '')
    // Elimina <script> del contenido (adsbygoogle.js, embed.js, etc.)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    // Canonicaliza links internos del CMS al dominio principal
    .replace(/href="https?:\/\/(www\.|cms\.)?acontecer\.co\.cr/gi, 'href="https://acontecer.co.cr')
    // SEO+SEC: rel="noopener noreferrer" + target="_blank" en links externos
    //   Detecta <a href="http..."> que NO apunte a acontecer.co.cr
    .replace(/<a([^>]*?)href="(https?:\/\/(?!(?:www\.|cms\.)?acontecer\.co\.cr)[^"]+)"([^>]*)>/gi,
      (m: string, pre: string, url: string, post: string) => {
        const all = pre + post;
        // Si ya tiene rel, mergear; si no, agregar
        const hasRel    = /\brel\s*=/i.test(all);
        const hasTarget = /\btarget\s*=/i.test(all);
        const extras: string[] = [];
        if (!hasRel)    extras.push('rel="noopener noreferrer"');
        if (!hasTarget) extras.push('target="_blank"');
        return `<a${pre}href="${url}"${post}${extras.length ? ' ' + extras.join(' ') : ''}>`;
      })
    // Agrega IDs a H2/H3 que no los tengan (para TOC)
    .replace(/<h([23])([^>]*)>/gi, (_: string, level: string, attrs: string) => {
      if (!addHeadingIds) return `<h${level}${attrs}>`;
      if (/\bid\s*=/.test(attrs)) return `<h${level}${attrs}>`;
      sectionCount++;
      return `<h${level}${attrs} id="nv2-s${sectionCount}">`;
    })
    // ── Audio nativo: WP/Elementor genera bloques MEJS que requieren JS propietario.
    //    En el frontend headless los convertimos a <audio controls> del navegador.
    // Paso 1: <mediaelementwrapper> contiene el <audio> real → extraer src y reemplazar todo
    .replace(
      /<mediaelementwrapper[^>]*>[\s\S]*?<audio[^>]*?\bsrc="([^"?]+)[^"]*"[\s\S]*?<\/mediaelementwrapper>/gi,
      (_: string, src: string) =>
        `<audio controls preload="metadata" src="${src}" ` +
        `style="width:100%;max-width:100%;display:block;margin:12px 0;border-radius:8px;"></audio>`
    )
    // Paso 2: quitar el height fijo del mejs-container (ya no contiene el player propio)
    .replace(
      /(<div[^>]*class="[^"]*mejs-container[^"]*"[^>]*)\sstyle="[^"]*"/gi,
      '$1'
    )
    // Paso 3: <audio> sueltos sin controls (wp-block-audio, shortcodes básicos)
    .replace(/<audio([^>]*)>/gi, (_: string, attrs: string) => {
      if (/\bcontrols\b/i.test(attrs)) return `<audio${attrs}>`;
      return `<audio${attrs} controls preload="metadata" ` +
        `style="width:100%;max-width:100%;display:block;margin:12px 0;border-radius:8px;">`;
    })
    // Posts 2021: eliminar <noscript> (lazyload plugin los inserta como fallback;
    // con dangerouslySetInnerHTML se renderizan visibles duplicando imágenes)
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, '')
    // Imágenes: convertir data-src→src (lazyload viejo), aplicar max-width responsivo
    .replace(/<img([^>]*)>/gi, (_: string, attrs: string) => {
      let a = attrs;
      // Posts 2021: src contiene placeholder gif, data-src contiene la URL real
      if (/data-src=/.test(a)) {
        a = a.replace(/\bsrc="data:[^"]*"/, '');
        a = a.replace(/\bsrc='data:[^']*'/, '');
        a = a.replace(/\bdata-src=/, 'src=');
        a = a.replace(/\bdata-srcset=/, 'srcset=');
        a = a.replace(/\bsizes="[^"]*"/, '');
      }
      // B6/CLS: si la img no tiene width+height numéricos, reservar espacio con aspect-ratio
      const wMatch = a.match(/\bwidth=["']?(\d+)["']?/);
      const hMatch = a.match(/\bheight=["']?(\d+)["']?/);
      const ar = (wMatch && hMatch) ? '' : 'aspect-ratio:16/9;';
      return `<img${a} loading="lazy" decoding="async" style="max-width:100%;height:auto;${ar}border-radius:8px;margin:16px 0;display:block;">`;
    })
    // ── Cita destacada: párrafo que inicia con " y termina con " → clase visual
    .replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (_: string, attrs: string, content: string) => {
      const texto = content.replace(/<[^>]+>/g, '').trim();
      const abre   = /^(?:“|&#8220;|&ldquo;|«|&#171;|&laquo;)/.test(texto);
      // cierra: Spanish quotes end mid-paragraph (», attribution after) — opening alone is sufficient
      const cierra = /»|&#187;|&raquo;|”|&#8221;|&rdquo;/.test(texto);
      if (!abre || !cierra) return `<p${attrs}>${content}</p>`;
      const hasCls = /\bclass\s*=\s*"/.test(attrs);
      const newAttrs = hasCls
        ? attrs.replace(/(\bclass\s*=\s*")/, '$1nv2-cita-destacada ')
        : `${attrs} class="nv2-cita-destacada"`;
      return `<p${newAttrs}>${content}</p>`;
    });
}

/* ── API fetches ────────────────────────────────────────────────────────── */

async function getPost(slug: string) {
  // Soft 404 protection: si la API falla o devuelve vacío, retornamos null
  // y NotaPage llamará notFound() para emitir HTTP 404 real (no 200 vacío)
  try {
    const res = await fetch(API + '/posts?slug=' + slug + '&_embed', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;
    return posts[0] ?? null;
  } catch (err) {
    console.error('[getPost]', slug, err);
    return null;
  }
}

async function getRelated(categoryIds: number[], currentId: number) {
  try {
    const res = await fetch(
      API + '/posts?categories=' + categoryIds.join(',') + '&per_page=4&_embed&exclude=' + currentId,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

async function getDiputadosMinimos(): Promise<DiputadoMinimo[]> {
  try {
    const res = await fetch(`${ASAMBLEA_API}/diputados?_fields=slug,nombre_completo`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

/* ── Metadata ───────────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Promise<{ slug: string; categoria: string }> }) {
  const { slug, categoria } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Nota no encontrada' };
  const featuredImg = cmsToLocal(post._embedded?.['wp:featuredmedia']?.[0]?.source_url) || 'https://acontecer.co.cr/opengraph-image';
  const rawTitle   = decodeEntities(post.title.rendered.replace(/<[^>]+>/g, ''));
  const rawExcerpt = decodeEntities(post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '').slice(0, 160);
  const seoDesc    = cleanSeoDesc(post.meta?._acontecer_seo_desc)   || '';
  // Title = titular COMPLETO del artículo (con su gancho), NO la versión SEO corta.
  // Decisión editorial: el titular con gancho genera más CTR aunque Google lo trunque a ~60.
  const titulo     = rawTitle;
  const descripcion = seoDesc || rawExcerpt;
  const realCatSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || categoria;
  const canonicalUrl = `https://acontecer.co.cr/${realCatSlug}/${slug}`;
  const tags    = post._embedded?.['wp:term']?.[1]?.map((t: any) => t.name) || [];
  const autorNombre = post._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';

  return {
    // Sin sufijo "| Acontecer.co.cr" — el title de notas ya es descriptivo
    // y el sufijo solo consume chars en SERPs causando truncado a 60 chars
    title: { absolute: titulo },
    description: descripcion,
    keywords: tags.join(', ') || undefined,
    authors: [{ name: autorNombre }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: rawTitle,
      description: descripcion,
      url: canonicalUrl,
      siteName: 'Acontecer.co.cr',
      images: [{ url: featuredImg, width: 1200, height: 630, alt: rawTitle }],
      type: 'article',
      publishedTime:  toISO(post.date),
      modifiedTime:   toISO(fechaModEfectiva(post.date, post.modified)),
      authors: [autorNombre],
      section: realCatSlug,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: rawTitle,
      description: descripcion,
      images: [featuredImg],
    },
    robots: {
      // max-image-preview:large aquí Y en googleBot — Discover lee ambos
      index: true, follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  };
}

/* ── Page component ─────────────────────────────────────────────────────── */

/* ── Edad relativa de la nota ───────────────────────────────────────────── */
function edadNota(fechaISO: string): string | null {
  const diffMs  = Date.now() - new Date(fechaISO).getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDias < 14) return null;                       // menos de 2 semanas: no mostrar
  if (diffDias < 60)  return `hace ${Math.floor(diffDias / 7)} semana${Math.floor(diffDias / 7) === 1 ? "" : "s"}`;
  const meses = Math.floor(diffDias / 30);
  if (meses < 24)     return `hace ${meses} mes${meses === 1 ? "" : "es"}`;
  const anios = Math.floor(diffDias / 365);
  return `hace ${anios} año${anios === 1 ? "" : "s"}`;
}

export default async function NotaPage({ params }: { params: Promise<{ slug: string; categoria: string }> }) {
  const { slug, categoria } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();

  // Redirect a la URL canónica si la categoría en la URL no coincide
  const realCat = post._embedded?.['wp:term']?.[0]?.[0]?.slug;
  if (realCat && realCat !== categoria) permanentRedirect(`/${realCat}/${slug}`);

  const [related, diputados] = await Promise.all([
    getRelated(post.categories, post.id),
    getDiputadosMinimos(),
  ]);

  const DEFAULT_IMG  = 'https://acontecer.co.cr/opengraph-image';
  const featuredImg = cmsToLocal(post._embedded?.['wp:featuredmedia']?.[0]?.source_url) || DEFAULT_IMG;
  const authorName   = post._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';
  const authorSlug   = post._embedded?.author?.[0]?.slug || 'editor';
  const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'] || null;
  const authorBio    = post._embedded?.author?.[0]?.description || '';
  const catName      = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Nacionales';
  const catSlug      = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
  const tags         = (post._embedded?.['wp:term']?.[1] || []) as any[];
  const fecha = new Date(post.date).toLocaleDateString('es-CR', { day:'numeric', month:'long', year:'numeric' });
  const shareUrl   = 'https://acontecer.co.cr/' + catSlug + '/' + slug;
  const shareTitle = encodeURIComponent(post.title.rendered.replace(/<[^>]+>/g, ''));

  const tituloPlano = post.title.rendered
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_: string, n: string) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ');

  const palabras      = post.content.rendered.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const tiempoLectura = Math.max(1, Math.ceil(palabras / 200));
  const edadStr       = edadNota(post.date);

  const { subtitulo, resto } = extraerPrimerH2(post.content.rendered);
  const conIDs         = limpiarContenido(resto, true);        // con IDs para TOC
  // Inyectar banner WhatsApp después del 3er párrafo (solo artículo principal)
  const conBanner       = insertarBannerWA(linkDiputados(conIDs, diputados), 3);
  const contenidoLimpio = conBanner;
  const headings       = extraerEncabezados(conIDs);

  /* ── SVG icons ─────────────────────────────────────────────────────────── */
  const IcFb = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:13,height:13}} aria-hidden="true"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.029H9.101z"/></svg>;
  const IcWa = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:13,height:13}} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>;
  const IcX  = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:13,height:13}} aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>;
  const IcTg = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:13,height:13}} aria-hidden="true"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.27 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>;
  const IcArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:11,height:11}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

  return (
    <>
      {/* SCHEMA.ORG — BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type':'ListItem', position:1, name:'Inicio',  item:'https://acontecer.co.cr' },
          { '@type':'ListItem', position:2, name:catName,   item:`https://acontecer.co.cr/categoria/${catSlug}` },
          { '@type':'ListItem', position:3, name:tituloPlano, item:`https://acontecer.co.cr/${catSlug}/${slug}` },
        ],
      })}} />

      {/* SCHEMA.ORG — NewsArticle (reforzado: mentions, about, speakable, citation, articleBody) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline:    tituloPlano.slice(0, 110),
        description: decodeEntities(post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '').slice(0, 160),
        url:         `https://acontecer.co.cr/${catSlug}/${slug}`,
        datePublished:  toISO(post.date),
        dateModified:   toISO(fechaModEfectiva(post.date, post.modified)),
        // @id → referencia cruzada al Person schema de /autor/[slug]#person
        // Google une este nodo con la entidad del periodista sin duplicar datos.
        author: {
          '@type': 'Person',
          '@id': `https://acontecer.co.cr/autor/${authorSlug}#person`,
          name: authorName,
          url: `https://acontecer.co.cr/autor/${authorSlug}`,
        },
        publisher: {
          '@type': 'NewsMediaOrganization',
          '@id': 'https://acontecer.co.cr/#organization',
          name: 'Acontecer.co.cr',
          url: 'https://acontecer.co.cr',
          logo: { '@type':'ImageObject', url:'https://acontecer.co.cr/logo.png', width:600, height:94 },
        },
        image: featuredImg ? { '@type':'ImageObject', url:featuredImg, width:1200, height:630 } : undefined,
        mainEntityOfPage: { '@type':'WebPage', '@id':`https://acontecer.co.cr/${catSlug}/${slug}` },
        keywords:        tags.map((t: any) => t.name).join(', ') || undefined,
        articleSection:  catName,
        wordCount:       palabras,
        articleBody:     buildArticleBody(post.content.rendered),
        inLanguage:      'es-CR',
        isAccessibleForFree: true,
        copyrightHolder: { '@type':'Organization', name:'Acontecer.co.cr' },
        copyrightYear:   new Date(post.date).getFullYear(),
        // Refuerzo SEO/AI ↓
        mentions: buildMentions({
          plainText: buildArticleBody(post.content.rendered, 8000) + ' ' + tituloPlano,
          tags: tags.map((t: any) => ({ name: t.name, slug: t.slug })),
        }),
        about: buildAbout(catSlug, catName),
        speakable: buildSpeakable(),
        citation: extractCitations(post.content.rendered, 5),
      })}} />

      {/* SCHEMA.ORG — FAQPage (auto-detectado desde H2/H3 con preguntas) */}
      {(() => {
        const faq = buildFAQPage(post.content.rendered);
        return faq ? <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faq)}} /> : null;
      })()}

      {/* SCHEMA.ORG — SportsEvent (auto-detectado en notas de deportes) */}
      {(() => {
        const ev = buildSportsEvent({
          catSlug, title: tituloPlano, plainText: buildArticleBody(post.content.rendered, 8000),
          datePublished: post.date, url: `https://acontecer.co.cr/${catSlug}/${slug}`,
          image: featuredImg,
        });
        return ev ? <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ev)}} /> : null;
      })()}

      {/* SCHEMA.ORG — Event (auto-detectado en entretenimiento: conciertos/festivales) */}
      {(() => {
        const ev = buildEvent({
          catSlug, title: tituloPlano, plainText: buildArticleBody(post.content.rendered, 8000),
          datePublished: post.date, url: `https://acontecer.co.cr/${catSlug}/${slug}`,
          image: featuredImg,
        });
        return ev ? <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ev)}} /> : null;
      })()}

      {/* BARRA DE PROGRESO FIJA */}
      <div className="nv2-progress" aria-hidden="true">
        <div className="nv2-progress-bar" id="nv2-bar" />
      </div>

      {/* BREADCRUMB — barra azul estilo portada */}
      <nav aria-label="Ruta de navegación" className="nv2-crumb-blue">
        <div className="nv2-crumb-blue-inner">
          <a href="/" className="nv2-crumb-blue-link">Inicio</a>
          <span className="nv2-crumb-blue-sep">›</span>
          <a href={`/categoria/${catSlug}`} className="nv2-crumb-blue-link nv2-crumb-blue-cat">{catName}</a>
          <span className="nv2-crumb-blue-sep nv2-crumb-blue-sep-title">›</span>
          <span className="nv2-crumb-blue-title">{tituloPlano}</span>
        </div>
      </nav>

      {/* MINI HEADER (slides in al hacer scroll) */}
      <div className="nv2-minibar" id="nv2-minibar" aria-hidden="true">
        <div className="nv2-minibar-inner">
          <span className="nv2-minibar-cat">{catName}</span>
          <span className="nv2-minibar-title">{tituloPlano}</span>
          <div className="nv2-minibar-share">
            <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener" title="WhatsApp">
              <IcWa />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" title="Facebook">
              <IcFb />
            </a>
          </div>
        </div>
      </div>

      {/* Client: progreso + minibar + TOC spy */}
      <NotaInteractive />

      {/* GRID PRINCIPAL */}
      <div className="nv2-article-wrap">
        <main>
              {/* ──────────────────────── ARTÍCULO PRINCIPAL ──────────────────── */}
          <article className="nv2-article" id="nv2-main-article">

            {/* HEAD: categoría · título · subtítulo */}
            <div className="nv2-article-head">
              <a href={`/categoria/${catSlug}`} className="nv2-cat-pill">{catName}</a>
              <h1
                id="nv2-article-title"
                className="nv2-article-title"
                dangerouslySetInnerHTML={{__html: post.title.rendered}}
              />
              {subtitulo && (
                <p className="nv2-article-subhead">{subtitulo}</p>
              )}
            </div>

            {/* HERO IMAGE */}
            <div className="nv2-article-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredImg}
                alt={tituloPlano}
                width={1200}
                height={675}
                // @ts-ignore
                fetchpriority="high"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* AVISO NOTA VIEJA */}
            {edadStr && (
              <div className="nv2-age-notice">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Esta noticia es de {edadStr}
              </div>
            )}

            {/* META: autor + compartir */}
            <div className="nv2-article-meta-block">
              <div className="nv2-meta-row">
                <div className="nv2-meta-author">
                  <a href={`/autor/${authorSlug}`} className="nv2-meta-avatar">
                    <AuthorAvatar src={authorAvatar} name={authorName} size={44} />
                  </a>
                  <div>
                    <a href={`/autor/${authorSlug}`} className="nv2-meta-name" style={{textDecoration:'none',color:'inherit'}}>
                      {authorName}
                    </a>
                    <div className="nv2-meta-info">
                      <span>{fecha}</span>
                      <span className="nv2-meta-dot">·</span>
                      <span>{tiempoLectura} min de lectura</span>
                    </div>
                  </div>
                </div>
                <div className="nv2-meta-share">
                  <ThemeToggle />
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-fb" aria-label="Facebook">
                    <IcFb /> <span>Facebook</span>
                  </a>
                  <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-wa" aria-label="WhatsApp">
                    <IcWa /> <span>WhatsApp</span>
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-x" aria-label="X">
                    <IcX /> <span>X</span>
                  </a>
                </div>
              </div>

              {/* TTS */}
              <TextToSpeech slug={slug} readingTime={tiempoLectura} />
            </div>

            {/* CUERPO: split para inyectar Lea más en móvil */}
            {(() => {
              // Split article HTML after 3rd </p> to inject inline lea-mas
              let p1 = contenidoLimpio, p2 = '';
              if (related.length > 0) {
                let idx = 0, count = 0;
                while (count < 3) {
                  const next = contenidoLimpio.indexOf('</p>', idx);
                  if (next === -1) break;
                  idx = next + 4; count++;
                }
                if (count === 3) { p1 = contenidoLimpio.slice(0, idx); p2 = contenidoLimpio.slice(idx); }
              }
              return (
                <div className="nv2-article-body">
                  <div className="nv2-measure" dangerouslySetInnerHTML={{__html: p1}} />
                  {/* ⚠️ ZONA PROTEGIDA — Bloque "Lea también" mid-article (solo móvil).
                       Se inyecta después del 3er párrafo si hay artículos relacionados.
                       En desktop está oculto (display:none via @media min-width:900px en nota.css).
                       NO eliminar: es la única sección de relacionadas que ve el usuario móvil
                       sin bajar hasta el sidebar. */}
                  {p2 && related.length > 0 && (
                    <div className="nv2-measure nv2-lea-mas-wrap">
                      <div className="nv2-lea-mas">
                        <div className="nv2-lea-mas-label">Lea también</div>
                        {related.slice(0, 3).map((rp: any) => {
                          const rpCat = rp._embedded?.['wp:term']?.[0]?.[0]?.slug || catSlug;
                          return (
                            <a key={rp.id} href={`/${rpCat}/${rp.slug}`} className="nv2-lea-mas-item">
                              <svg className="nv2-lea-mas-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}><polyline points="9 18 15 12 9 6"/></svg>
                              <span dangerouslySetInnerHTML={{__html: rp.title.rendered}} />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {p2 && <div className="nv2-measure" dangerouslySetInnerHTML={{__html: p2}} />}
                </div>
              );
            })()}

            {/* TAGS */}
            {tags.length > 0 && (
              <div className="nv2-article-body" style={{paddingTop:0, paddingBottom:0}}>
                <div className="nv2-measure">
                  <div className="nv2-article-tags">
                    <span className="nv2-article-tags-lbl">Etiquetas</span>
                    {tags.map((t: any) => (
                      <a key={t.id} href={`/etiqueta/${t.slug}`} className="nv2-tag">{t.name}</a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AUTHOR CARD */}
            <div className="nv2-author-card">
              <div className="nv2-author-card-avatar">
                <AuthorAvatar src={authorAvatar} name={authorName} size={88} />
              </div>
              <div className="nv2-author-card-body">
                <div className="nv2-author-card-eyebrow">Escrito por</div>
                <a href={`/autor/${authorSlug}`} className="nv2-author-card-name" style={{textDecoration:'none',color:'inherit',display:'block'}}>
                  {authorName}
                </a>
                {authorBio && <p className="nv2-author-card-bio">{authorBio}</p>}
                <div className="nv2-author-card-foot">
                  <a href={`/autor/${authorSlug}`} className="nv2-author-card-link">
                    Ver todas sus notas <IcArrow />
                  </a>
                </div>
              </div>
            </div>

            {/* ⚠️ ZONA PROTEGIDA — Paute inline (banner "Paute con nosotros").
                 Visible en móvil antes del share bar final.
                 WhatsApp: 50662889467. Estilo: nota.css (.nv2-paute-inline).
                 NO eliminar: es ingreso publicitario directo. */}
            {/* PAUTE INLINE — visible en móvil */}
            <div className="nv2-article-body" style={{paddingTop:0, paddingBottom:0}}>
              <div className="nv2-measure">
                <div className="nv2-paute-inline">
                  <div className="nv2-paute-inline-text">
                    <div className="nv2-paute-inline-eyebrow">Espacio publicitario</div>
                    <div className="nv2-paute-inline-title">Paute con nosotros</div>
                    <p className="nv2-paute-inline-desc">Llegue a miles de lectores costarricenses. +15M vistas mensuales en nuestras plataformas.</p>
                  </div>
                  <a
                    href="https://wa.me/50662889467?text=Hola%2C+me+interesa+pautar+en+Acontecer.co.cr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nv2-paute-inline-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16,flexShrink:0}}>
                      <path d="M20.5 3.5A11 11 0 0 0 3.5 17l-1.4 5 5-1.4a11 11 0 0 0 13.4-17z"/>
                    </svg>
                    Escribir por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* BOTTOM SHARE */}
            <div className="nv2-bottom-share">
              <span className="nv2-bottom-share-lbl">Compartir esta nota</span>
              <div className="nv2-bottom-share-row">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-fb"><IcFb /> Facebook</a>
                <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-wa"><IcWa /> WhatsApp</a>
                <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-x"><IcX /> X</a>
                <a href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-tg"><IcTg /> Telegram</a>
              </div>
            </div>

          </article>

          {/* ──────────────────────── NOTAS SIGUIENTES ────────────────────── */}
          {related.map((p: any) => {
            const pImg      = cmsToLocal(p._embedded?.['wp:featuredmedia']?.[0]?.source_url) || DEFAULT_IMG;
            const pCat      = p._embedded?.['wp:term']?.[0]?.[0]?.slug || catSlug;
            const pCatName  = p._embedded?.['wp:term']?.[0]?.[0]?.name || catName;
            const pAuthor   = p._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';
            const pAuthorSlug  = p._embedded?.author?.[0]?.slug || 'editor';
            const pAuthorAvatar = p._embedded?.author?.[0]?.avatar_urls?.['96'] || null;
            const pFecha    = new Date(p.date).toLocaleDateString('es-CR', { day:'numeric', month:'long', year:'numeric' });
            const pUrl      = `https://acontecer.co.cr/${pCat}/${p.slug}`;
            const pTitleEnc = encodeURIComponent(p.title.rendered.replace(/<[^>]+>/g, ''));
            const { subtitulo: pSub, resto: pResto } = extraerPrimerH2(p.content.rendered);
            const pContenido = linkDiputados(limpiarContenido(pResto), diputados);
            const pPalabras  = p.content.rendered.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
            const pLectura   = Math.max(1, Math.ceil(pPalabras / 200));

            return (
              <div key={p.id}>
                {/* Separador */}
                <div className="nv2-sigue-sep">
                  <div className="nv2-sigue-sep-line" />
                  <a href={`/${pCat}/${p.slug}`} className="nv2-sigue-sep-tag">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12}}><polyline points="6 9 12 15 18 9"/></svg>
                    Siga leyendo
                  </a>
                  <div className="nv2-sigue-sep-line" />
                </div>

                <ArticleScrollTracker url={`/${pCat}/${p.slug}`} title={p.title.rendered.replace(/<[^>]+>/g, '')} />

                <article className="nv2-article">
                  {/* Hero 21:9 para las siguientes */}
                  <div className="nv2-article-hero" style={{aspectRatio:'21/9', maxHeight:'320px'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pImg} alt={p.title?.rendered?.replace(/<[^>]+>/g, '') || ''} loading="lazy" decoding="async" />
                  </div>

                  {/* Head */}
                  <div className="nv2-article-head" style={{paddingTop:28}}>
                    <a href={`/categoria/${pCat}`} className="nv2-cat-pill">{pCatName}</a>
                    <h2
                      className="nv2-article-title"
                      style={{fontSize:'clamp(24px, 3vw, 38px)'}}
                      dangerouslySetInnerHTML={{__html: p.title.rendered}}
                    />
                    {pSub && <p className="nv2-article-subhead">{pSub}</p>}
                  </div>

                  {/* Meta */}
                  <div className="nv2-article-meta-block">
                    <div className="nv2-meta-row">
                      <div className="nv2-meta-author">
                        <a href={`/autor/${pAuthorSlug}`} className="nv2-meta-avatar">
                          <AuthorAvatar src={pAuthorAvatar} name={pAuthor} size={44} />
                        </a>
                        <div>
                          <a href={`/autor/${pAuthorSlug}`} className="nv2-meta-name" style={{textDecoration:'none',color:'inherit'}}>{pAuthor}</a>
                          <div className="nv2-meta-info">
                            <span>{pFecha}</span>
                            <span className="nv2-meta-dot">·</span>
                            <span>{pLectura} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="nv2-meta-share">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${pUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-fb"><IcFb /></a>
                        <a href={`https://wa.me/?text=${pTitleEnc}%20${pUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-wa"><IcWa /></a>
                        <a href={`https://twitter.com/intent/tweet?text=${pTitleEnc}&url=${pUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-x"><IcX /></a>
                      </div>
                    </div>
                  </div>

                  {/* Body (parcial) */}
                  <div className="nv2-article-body">
                    <div className="nv2-measure">
                      <div dangerouslySetInnerHTML={{__html: truncarHTML(pContenido)}} />
                      <p style={{textAlign:'center', margin:'28px 0'}}>
                        <a
                          href={`/${pCat}/${p.slug}`}
                          style={{
                            display:'inline-flex', alignItems:'center', gap:8,
                            padding:'12px 24px',
                            background:'var(--azul)', color:'#fff',
                            borderRadius:999, fontSize:13, fontWeight:600,
                            textDecoration:'none', border:'none',
                          }}
                        >
                          Continuar leyendo <IcArrow />
                        </a>
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </main>

        {/* SIDEBAR */}
        <Sidebar
          related={related}
          catSlug={catSlug}
          headings={headings}
          readingTime={tiempoLectura}
        />
      </div>
    </>
  );
}
