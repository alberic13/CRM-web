import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const demographics = await prisma.marketingDemographic.findMany();
    const customerCount = await prisma.customer.count();

    return NextResponse.json({
      demographics,
      totalCustomers: customerCount || 1090,
      newCustomers: 26,
      loyalCustomers: 158,
      lostCustomers: 11,
    });
  } catch (error) {
    console.error('Segmentation GET error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch segmentation data' },
      { status: 500 }
    );
  }
}
