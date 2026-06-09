import { NextResponse } from 'next/server';
import { getMundialMatchesData } from '@/lib/mundial-data';

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(await getMundialMatchesData());
}
