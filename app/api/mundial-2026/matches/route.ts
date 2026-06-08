import { NextResponse } from 'next/server';
import { MUNDIAL_MATCHES, MUNDIAL_SOURCE } from '@/lib/mundial-2026';

export const revalidate = 60;

export function GET() {
  return NextResponse.json({
    source: MUNDIAL_SOURCE,
    count: MUNDIAL_MATCHES.length,
    matches: MUNDIAL_MATCHES,
  });
}
