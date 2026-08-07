import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createOpportunitySchema = z.object({
  name: z.string().min(1, 'Opportunity name is required'),
  status: z.enum(['Pending', 'Won', 'InProgress', 'Lost']),
  revenue: z.number().min(0),
  expCloseDate: z.string(),
  customerName: z.string().min(1, 'Customer name is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { customerName: { contains: search } },
        { opportunityNo: { contains: search } },
        { ownerName: { contains: search } },
      ];
    }
    if (status && status !== 'All') {
      where.status = status;
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      orderBy: { creationDate: 'desc' },
    });

    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error('Opportunities GET error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createOpportunitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, status, revenue, expCloseDate, customerName, ownerName, notes } = validation.data;
    const opportunityNo = Math.floor(100 + Math.random() * 900).toString();

    const opportunity = await prisma.opportunity.create({
      data: {
        opportunityNo,
        name,
        status,
        revenue,
        expCloseDate: new Date(expCloseDate),
        customerName,
        ownerName,
        notes,
      },
    });

    return NextResponse.json(
      { message: 'Opportunity created successfully', opportunity },
      { status: 201 }
    );
  } catch (error) {
    console.error('Opportunity POST error:', error);
    return NextResponse.json(
      { message: 'Failed to add opportunity' },
      { status: 500 }
    );
  }
}
