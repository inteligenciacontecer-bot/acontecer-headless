import { NextResponse } from 'next/server';
import { getMundialTeamsData } from '@/lib/mundial-data';

export const revalidate = 60;

export async function GET() {
  const data = await getMundialTeamsData();

  return NextResponse.json({
    ...data,
    count: data.teams.length,
  });
}
