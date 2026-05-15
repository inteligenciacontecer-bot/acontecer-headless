import { NextResponse } from 'next/server';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const LOGO = 'https://cms.acontecer.co.cr/wp-content/uploads/2026/03/FAVS.png';
const FALLBACK_IMG = 'https://acontecer.co.cr/opengraph-image';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/\s+/g, ' ').trim();
}

function primerOracion(texto: string, max = 160): string {
  const punto = texto.search(/[.!?]/);
  const frase = punto > 0 && punto < max ? texto.slice(0, punto + 1) : texto.slice(0, max);
  return frase.trim();
}

// Escapa caracteres que romperían atributos HTML o JSON dentro de template literals
function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let post: any;
  try {
    const res = await fetch(`${API}/posts?slug=${encodeURIComponent(slug)}&_embed`, {
      next: { revalidate: 300 },
    });
    const posts = await res.json();
    post = posts[0];
  } catch {
    return new NextResponse('Error fetching post', { status: 502 });
  }

  if (!post) return new NextResponse('Not found', { status: 404 });

  const titulo     = stripHtml(post.title?.rendered || 'Sin título');
  const tituloCorto = titulo.length > 80 ? titulo.slice(0, 77) + '…' : titulo;
  const catName    = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Noticias';
  const catSlug    = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
  const imagenUrl  = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || FALLBACK_IMG;
  const autorNombre = post._embedded?.author?.[0]?.name || 'Redacción ACONTECER';
  const excerptRaw = stripHtml(post.excerpt?.rendered || '');
  const datoTexto  = primerOracion(excerptRaw, 150);
  const extracto   = excerptRaw.slice(0, 220) + (excerptRaw.length > 220 ? '…' : '');
  const fecha      = new Date(post.date).toLocaleDateString('es-CR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const articuloUrl = `https://acontecer.co.cr/${catSlug}/${slug}`;

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: titulo,
    image: [imagenUrl],
    datePublished: post.date,
    dateModified: post.modified,
    author: [{ '@type': 'Person', name: autorNombre }],
    publisher: {
      '@type': 'Organization',
      name: 'Acontecer.co.cr',
      logo: { '@type': 'ImageObject', url: LOGO, width: 512, height: 512 },
    },
    url: articuloUrl,
  });

  const html = `<!doctype html>
<html amp lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <link rel="canonical" href="${articuloUrl}">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <title>${esc(titulo)}</title>
  <meta name="robots" content="max-image-preview:large">
  <style amp-custom>
    /* ── tipografía base ── */
    body { font-family: 'Helvetica Neue', Arial, sans-serif; }

    /* ── portada ── */
    .l-portada-overlay {
      background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 55%, transparent 100%);
      padding: 20px 20px 44px;
    }
    .portada-bottom { margin-top: auto; }
    .badge {
      display: inline-block;
      background: #0000A2;
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 4px;
      margin-bottom: 14px;
    }
    .story-title {
      color: #fff;
      font-size: 22px;
      font-weight: 800;
      line-height: 1.3;
      margin: 0 0 12px;
    }
    .story-meta { color: rgba(255,255,255,.75); font-size: 12px; }

    /* ── dato ── */
    .l-dato-bg { background: linear-gradient(135deg, #0000A2 0%, #0a73ce 100%); }
    .l-dato-content { padding: 48px 28px; justify-content: center; }
    .dato-label {
      color: rgba(255,255,255,.65);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 22px;
    }
    .dato-quote {
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.55;
      margin: 0;
    }

    /* ── contexto ── */
    .l-ctx-overlay { background: rgba(0, 0, 150, .72); }
    .l-ctx-content { padding: 48px 28px; justify-content: center; }
    .ctx-label {
      color: rgba(255,255,255,.65);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .ctx-text { color: #fff; font-size: 15px; line-height: 1.75; margin: 0 0 18px; }
    .ctx-autor { color: rgba(255,255,255,.65); font-size: 13px; }

    /* ── CTA ── */
    .l-cta-bg { background: linear-gradient(160deg, #00008a 0%, #0a73ce 100%); }
    .l-cta-content { padding: 60px 28px 28px; align-items: center; text-align: center; }
    .logo-wrap {
      width: 80px;
      height: 80px;
      border-radius: 14px;
      overflow: hidden;
      margin: 0 auto 24px;
    }
    .cta-label { color: rgba(255,255,255,.75); font-size: 14px; margin-bottom: 6px; }
    .cta-sitio { color: #fff; font-size: 22px; font-weight: 800; }
    .cta-btn {
      display: block;
      background: #fff;
      color: #0000A2;
      padding: 14px 32px;
      border-radius: 30px;
      font-weight: 800;
      font-size: 15px;
      text-decoration: none;
      text-align: center;
    }
  </style>
  <script type="application/ld+json">${schema}</script>
</head>
<body>
  <amp-story standalone
    title="${esc(titulo)}"
    publisher="Acontecer.co.cr"
    publisher-logo-src="${LOGO}"
    poster-portrait-src="${imagenUrl}"
    poster-square-src="${imagenUrl}"
    poster-landscape-src="${imagenUrl}">

    <!-- ── 1. PORTADA ───────────────────────────────────────────────────── -->
    <amp-story-page id="portada" auto-advance-after="5s">
      <amp-story-grid-layer template="fill">
        <amp-img src="${imagenUrl}"
          width="720" height="1280" layout="fill"
          object-fit="cover" alt="${esc(tituloCorto)}">
        </amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="l-portada-overlay">
        <div class="portada-bottom">
          <p class="badge">${esc(catName)}</p>
          <h1 class="story-title">${esc(tituloCorto)}</h1>
          <p class="story-meta">Acontecer.co.cr · ${esc(fecha)}</p>
        </div>
      </amp-story-grid-layer>
    </amp-story-page>

    <!-- ── 2. DATO CLAVE ────────────────────────────────────────────────── -->
    <amp-story-page id="dato" auto-advance-after="6s">
      <amp-story-grid-layer template="fill" class="l-dato-bg">
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="l-dato-content">
        <p class="dato-label">🔍 Dato clave</p>
        <p class="dato-quote">« ${esc(datoTexto)} »</p>
      </amp-story-grid-layer>
    </amp-story-page>

    <!-- ── 3. CONTEXTO ──────────────────────────────────────────────────── -->
    <amp-story-page id="contexto" auto-advance-after="7s">
      <amp-story-grid-layer template="fill">
        <amp-img src="${imagenUrl}"
          width="720" height="1280" layout="fill"
          object-fit="cover" alt="${esc(tituloCorto)}">
        </amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="fill" class="l-ctx-overlay">
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="l-ctx-content">
        <p class="ctx-label">📰 Contexto</p>
        <p class="ctx-text">${esc(extracto)}</p>
        <p class="ctx-autor">Por ${esc(autorNombre)}</p>
      </amp-story-grid-layer>
    </amp-story-page>

    <!-- ── 4. LEER MÁS ──────────────────────────────────────────────────── -->
    <amp-story-page id="leer-mas">
      <amp-story-grid-layer template="fill" class="l-cta-bg">
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="l-cta-content">
        <div class="logo-wrap">
          <amp-img src="${LOGO}"
            width="80" height="80" layout="responsive"
            alt="Acontecer.co.cr">
          </amp-img>
        </div>
        <p class="cta-label">Lee la nota completa en</p>
        <p class="cta-sitio">Acontecer.co.cr</p>
      </amp-story-grid-layer>
      <amp-story-cta-layer>
        <a href="${articuloUrl}" target="_top" class="cta-btn">
          Leer nota completa →
        </a>
      </amp-story-cta-layer>
    </amp-story-page>

  </amp-story>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
