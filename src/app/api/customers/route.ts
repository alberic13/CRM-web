import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  region: z.string().min(1, 'Region is required'),
  source: z.string().min(1, 'Source is required'),
  status: z.enum(['Loyal', 'New', 'Lost']).default('New'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const region = searchParams.get('region') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { customerNo: { contains: search } },
      ];
    }
    if (region && region !== 'All') {
      where.region = region;
    }
    if (status && status !== 'All') {
      where.status = status;
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Customers GET error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customer data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createCustomerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, region, source, status } = validation.data;
    const customerNo = Math.floor(10000 + Math.random() * 90000).toString();

    const newCustomer = await prisma.customer.create({
      data: {
        customerNo,
        name,
        email,
        region,
        source,
        status,
        lastPurchase: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Customer added successfully', customer: newCustomer },
      { status: 201 }
    );
  } catch (error) {
    console.error('Customer POST error:', error);
    return NextResponse.json(
      { message: 'Failed to add customer' },
      { status: 500 }
    );
  }
}
