import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  industry: z.string().min(1, 'Industry is required'),
  region: z.string().min(1, 'Region is required'),
  tier: z.string().min(1, 'Tier is required'),
});

// GET — fetch all clients (with optional search/filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tier = searchParams.get('tier') || '';
    const region = searchParams.get('region') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (tier && tier !== 'All') {
      where.tier = tier;
    }
    if (region && region !== 'All') {
      where.region = region;
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Clients GET error:', error);
    return NextResponse.json({ message: 'Failed to fetch clients' }, { status: 500 });
  }
}

// POST — create new client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = clientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, industry, region, tier } = validation.data;

    const client = await prisma.client.create({
      data: { name, industry, region, tier },
    });

    return NextResponse.json({ message: 'Client created', client }, { status: 201 });
  } catch (error) {
    console.error('Clients POST error:', error);
    return NextResponse.json({ message: 'Failed to create client' }, { status: 500 });
  }
}
