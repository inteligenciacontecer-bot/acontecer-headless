import { NextRequest, NextResponse } from 'next/server';

const WP  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const TTS = 'https://cms.acontecer.co.cr/tts/';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
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

    const titulo = stripHtml(post.title?.rendered || '');
    const cuerpo = stripHtml(post.content?.rendered || '');
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
