import { NextResponse } from 'next/server';
import { MUNDIAL_SOURCE, getMundialGroupStandings } from '@/lib/mundial-2026';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(
    {
      source: MUNDIAL_SOURCE,
      updatedAt: new Date().toISOString(),
      groups: getMundialGroupStandings(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  );
}
