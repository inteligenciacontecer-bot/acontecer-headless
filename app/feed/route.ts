import { NextResponse } from 'next/server';

export const revalidate = 300; // revalidar cada 5 minutos

export async function GET() {
  try {
    const res = await fetch('https://cms.acontecer.co.cr/feed/', {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return new NextResponse('Error fetching feed', { status: 502 });
    }

    let xml = await res.text();

    // ─── Sanitización RSS para Google Publisher Center ──────────────────
    // Reescribir TODAS las URLs del CMS al dominio principal, incluyendo:
    //   • Permalinks de categorías (cualquier slug)
    //   • Imágenes embebidas en content:encoded (/wp-content/uploads/...)
    //   • Channel <link>, <image><url>, <image><link>
    //   • Atom self-link
    // Excepción: <guid isPermaLink="false"> mantiene URL del CMS porque
    // funciona como identificador único, no como URL navegable.

    xml = xml
      // 1. Permalinks de cualquier categoría (regex genérica)
      .replace(/https?:\/\/cms\.acontecer\.co\.cr\/([a-z0-9-]+)\//gi,
               'https://acontecer.co.cr/$1/')
      // 2. Imágenes en wp-content/uploads (rewrite transparente)
      .replace(/https?:\/\/cms\.acontecer\.co\.cr\/wp-content\//gi,
               'https://acontecer.co.cr/wp-content/')
      // 3. Channel root link
      .replace(/<link>https?:\/\/cms\.acontecer\.co\.cr<\/link>/g,
               '<link>https://acontecer.co.cr</link>')
      // 4. Channel <image><link>
      .replace(/<link>https?:\/\/cms\.acontecer\.co\.cr\/?<\/link>/g,
               '<link>https://acontecer.co.cr</link>')
      // 5. Atom self-link del feed
      .replace(/href="https?:\/\/cms\.acontecer\.co\.cr\/feed\/?"/g,
               'href="https://acontecer.co.cr/feed"')
      // 6. Channel image logo (image><url) — apunta al CMS, redirigir al dominio
      .replace(/<url>https?:\/\/cms\.acontecer\.co\.cr\/wp-content\/uploads\/2026\/03\/FAVS\.png<\/url>/g,
               '<url>https://acontecer.co.cr/logo.png</url>');

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('[feed] Error:', err);
    return new NextResponse('Feed unavailable', { status: 503 });
  }
}
