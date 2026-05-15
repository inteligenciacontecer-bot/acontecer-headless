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

    // Reemplazar dominio del CMS por el dominio público en todos los URLs
    xml = xml
      .replace(/https:\/\/cms\.acontecer\.co\.cr\/nacionales\//g, 'https://acontecer.co.cr/nacionales/')
      .replace(/https:\/\/cms\.acontecer\.co\.cr\/internacionales\//g, 'https://acontecer.co.cr/internacionales/')
      .replace(/https:\/\/cms\.acontecer\.co\.cr\/deportes\//g, 'https://acontecer.co.cr/deportes/')
      .replace(/https:\/\/cms\.acontecer\.co\.cr\/economia\//g, 'https://acontecer.co.cr/economia/')
      .replace(/https:\/\/cms\.acontecer\.co\.cr\/entretenimiento\//g, 'https://acontecer.co.cr/entretenimiento/')
      .replace(/https:\/\/cms\.acontecer\.co\.cr\/salud\//g, 'https://acontecer.co.cr/salud/')
      .replace(/https:\/\/cms\.acontecer\.co\.cr\/tecnologia\//g, 'https://acontecer.co.cr/tecnologia/')
      .replace(/https:\/\/cms\.acontecer\.co\.cr\/opinion\//g, 'https://acontecer.co.cr/opinion/')
      // Canal principal del feed y self-link
      .replace(/<link>https:\/\/cms\.acontecer\.co\.cr<\/link>/, '<link>https://acontecer.co.cr</link>')
      .replace(/href="https:\/\/cms\.acontecer\.co\.cr\/feed\/"/, 'href="https://acontecer.co.cr/feed"')
      // Comentarios y guids secundarios — mantener CMS para no romper WP internals
      ;

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
