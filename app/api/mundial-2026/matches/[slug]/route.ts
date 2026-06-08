import { NextResponse } from 'next/server';
import { getMundialMatch } from '@/lib/mundial-2026';

export const revalidate = 30;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const match = getMundialMatch(slug);
  if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  return NextResponse.json({ match });
}
