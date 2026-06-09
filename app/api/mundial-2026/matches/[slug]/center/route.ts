import { NextResponse } from 'next/server';
import { getMundialMatchCenterData } from '@/lib/mundial-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const data = await getMundialMatchCenterData(slug);

  if (!data.match || !data.center) {
    return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });
  }

  return NextResponse.json(
    data,
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  );
}
