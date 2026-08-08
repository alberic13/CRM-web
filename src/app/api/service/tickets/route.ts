import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createTicketSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  subject: z.string().min(1, 'Subject is required'),
  category: z.string().default('Technical Issue'),
  priority: z.enum(['Urgent', 'High', 'Medium', 'Low']).default('High'),
  agentName: z.string().optional(),
  autoEscalate: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { ticketNo: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (priority && priority !== 'All') {
      where.priority = priority;
    }
    if (status && status !== 'All') {
      where.status = status;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: { issue: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('Tickets GET error details:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tickets from database', error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createTicketSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { customerName, subject, category, priority, agentName, autoEscalate } = validation.data;
    const ticketNo = `TCK-${Math.floor(8100 + Math.random() * 900)}`;
    const createdDate = new Date().toISOString().split('T')[0];
    const avatar = `/avatars/user${Math.floor(Math.random() * 8) + 1}.jpg`;
    const assignedAgent = agentName || 'Chris Evans';

    const createIssueObj = autoEscalate || priority === 'Urgent' || priority === 'High' ? {
      issueKey: `ISS-${Math.floor(406 + Math.random() * 100)}`,
      title: `${category}: ${subject}`,
      affectedCustomer: customerName,
      status: 'Open',
      assignedAgent: assignedAgent,
      avatar: avatar,
      slaRemaining: priority === 'Urgent' ? '1h 30m' : priority === 'High' ? '4h 00m' : '12h 00m',
      severity: priority === 'Urgent' ? 'Critical' : priority === 'High' ? 'Major' : 'Minor',
    } : null;

    let issueId = null;
    if (createIssueObj) {
      const newIssue = await prisma.issue.create({ data: createIssueObj });
      issueId = newIssue.id;
    }

    const newTicket = await prisma.ticket.create({
      data: {
        ticketNo,
        customerName,
        avatar,
        subject,
        category,
        priority,
        status: 'Open',
        agentName: assignedAgent,
        createdDate,
        issueId,
      },
      include: { issue: true },
    });

    return NextResponse.json({ message: 'Ticket added successfully to database', ticket: newTicket }, { status: 201 });
  } catch (error: any) {
    console.error('Tickets POST error details:', error);
    return NextResponse.json(
      { message: 'Failed to save ticket into database', error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
