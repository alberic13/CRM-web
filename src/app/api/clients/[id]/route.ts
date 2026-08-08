import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  industry: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  tier: z.string().min(1).optional(),
});

// PUT — update client by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const client = await prisma.client.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({ message: 'Client updated', client });
  } catch (error) {
    console.error('Client PUT error:', error);
    return NextResponse.json({ message: 'Failed to update client' }, { status: 500 });
  }
}

// DELETE — delete client by ID
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ message: 'Client deleted' });
  } catch (error) {
    console.error('Client DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete client' }, { status: 500 });
  }
}
