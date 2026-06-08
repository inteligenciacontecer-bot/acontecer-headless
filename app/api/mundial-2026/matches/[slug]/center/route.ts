import { NextResponse } from 'next/server';
import { getMundialMatch, getMundialMatchCenter } from '@/lib/mundial-2026';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const match = getMundialMatch(slug);

  if (!match) {
    return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });
  }

  return NextResponse.json(
    {
      match,
      center: getMundialMatchCenter(match),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  );
}
