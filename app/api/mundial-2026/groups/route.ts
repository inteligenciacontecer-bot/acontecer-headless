import { NextResponse } from 'next/server';
import { getMundialGroupsData } from '@/lib/mundial-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(
    await getMundialGroupsData(),
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  );
}
