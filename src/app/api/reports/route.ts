import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [products, metrics] = await Promise.all([
      prisma.productPreference.findMany({ orderBy: { rank: 'asc' } }),
      prisma.metricSummary.findFirst(),
    ]);

    return NextResponse.json({
      products,
      metrics,
    });
  } catch (error) {
    console.error('Reports GET error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reports data' },
      { status: 500 }
    );
  }
}
