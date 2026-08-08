import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateTicketSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').optional(),
  subject: z.string().min(1, 'Subject is required').optional(),
  category: z.string().optional(),
  priority: z.enum(['Urgent', 'High', 'Medium', 'Low']).optional(),
  status: z.enum(['Open', 'Pending', 'Resolved']).optional(),
  agentName: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const body = await request.json();
    const validation = updateTicketSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid update data', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { issue: true },
    });

    if (!existingTicket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    const dataToUpdate = validation.data;

    await prisma.ticket.update({
      where: { id: ticketId },
      data: dataToUpdate,
      include: { issue: true },
    });

    if (existingTicket.issueId) {
      const newCustomer = dataToUpdate.customerName ?? existingTicket.customerName;
      const newCategory = dataToUpdate.category ?? existingTicket.category;
      const newSubject = dataToUpdate.subject ?? existingTicket.subject;
      const newAgent = dataToUpdate.agentName ?? existingTicket.agentName;
      const newPriority = dataToUpdate.priority ?? existingTicket.priority;
      const newStatus = dataToUpdate.status ?? existingTicket.status;

      const newSeverity = newPriority === 'Urgent' ? 'Critical' : newPriority === 'High' ? 'Major' : 'Minor';
      const newIssueStatus = newStatus === 'Resolved' ? 'Resolved' : newStatus === 'Open' ? 'Open' : 'In Progress';

      await prisma.issue.update({
        where: { id: existingTicket.issueId },
        data: {
          affectedCustomer: newCustomer,
          title: `${newCategory}: ${newSubject}`,
          assignedAgent: newAgent,
          severity: newSeverity,
          status: newIssueStatus,
        },
      });
    }

    const finalTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { issue: true },
    });

    return NextResponse.json({
      message: 'Ticket and connected Issue updated successfully in database',
      ticket: finalTicket,
    });
  } catch (error: any) {
    console.error('Ticket PATCH error:', error);
    return NextResponse.json(
      { message: 'Failed to update ticket in database', error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    const linkedIssueId = ticket.issueId;

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    if (linkedIssueId) {
      await prisma.issue.delete({
        where: { id: linkedIssueId },
      }).catch((err) => console.log('Issue cleanup error:', err));
    }

    return NextResponse.json({
      message: 'Ticket and connected Issue deleted successfully from database',
      id: ticketId,
      issueId: linkedIssueId,
    });
  } catch (error: any) {
    console.error('Ticket DELETE error:', error);
    return NextResponse.json(
      { message: 'Failed to delete ticket from database', error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
