import { NextRequest, NextResponse } from 'next/server';

const WP  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const TTS = 'https://cms.acontecer.co.cr/tts/';

function prepararTextoLector(html: string): string {
  return html
    // Citas y blockquotes → anunciadas como tales
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) => {
      const txt = c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return ` Cita textual: ${txt}. `;
    })
    // Headings → pausa larga antes + después
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, c) => {
      const txt = c.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      return `... ${txt}... `;
    })
    // Párrafos y secciones → punto al cerrar si no lo tienen
    .replace(/<\/(p|div|section|article|figure|figcaption)>/gi, '. ')
    // Listas → pausa entre ítems
    .replace(/<li[^>]*>/gi, '... ')
    .replace(/<\/(li|ul|ol)>/gi, '. ')
    // Saltos de línea → pausa corta
    .replace(/<br\s*\/?>/gi, ', ')
    // Quitar etiquetas restantes
    .replace(/<[^>]+>/g, '')
    // Entidades HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#8211;/g, ', ')
    .replace(/&#8212;/g, ', ')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8230;/g, '... ')
    .replace(/&#?\w+;/g, '')
    // Símbolos markdown que edge-tts lee literalmente
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*{1,3}/g, '')
    .replace(/_{1,2}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links [texto](url) → texto
    // Limpiar puntuación redundante
    .replace(/([.!?])\s*[.,]/g, '$1 ')
    .replace(/,\s*,+/g, ',')
    .replace(/\.{3,}/g, '... ')
    .replace(/\.\s*\./g, '. ')
    // Espacios múltiples
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  try {
    // Obtener contenido del artículo desde WP
    const res = await fetch(`${WP}/posts?slug=${slug}&_fields=title,content`, { next: { revalidate: 3600 } });
    const posts = await res.json();
    const post = posts[0];
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const titulo = prepararTextoLector(post.title?.rendered || '');
    const cuerpo = prepararTextoLector(post.content?.rendered || '');
    const texto  = `${titulo}. ${cuerpo}`.slice(0, 5000);

    // Llamar al servidor edge-tts en el VPS
    const ttsRes = await fetch(`${TTS}?text=${encodeURIComponent(texto)}`, {
      next: { revalidate: 604800 }, // cache 7 días
    });

    if (!ttsRes.ok) {
      throw new Error(`TTS server error: ${ttsRes.status}`);
    }

    const buffer = Buffer.from(await ttsRes.arrayBuffer());
    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error('[TTS]', err?.message);
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 });
  }
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
