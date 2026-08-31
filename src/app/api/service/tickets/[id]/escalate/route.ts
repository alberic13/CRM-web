import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const escalateSchema = z.object({
  severity: z.enum(['Critical', 'Major', 'Minor']).default('Major'),
  assignedAgent: z.string().optional(),
  slaRemaining: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const body = await request.json().catch(() => ({}));
    const validation = escalateSchema.safeParse(body);

    const severity = validation.success ? validation.data.severity : 'Major';
    const slaRemaining = validation.success && validation.data.slaRemaining ? validation.data.slaRemaining : '4h 00m';

    const issueKey = `ISS-${Math.floor(406 + Math.random() * 100)}`;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { issue: true },
    });

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    let issue = ticket.issue;
    if (!issue) {
      const issueData = {
        issueKey,
        title: `${ticket.category}: ${ticket.subject}`,
        affectedCustomer: ticket.customerName,
        status: 'Escalated',
        assignedAgent: ticket.agentName || 'Chris Evans',
        avatar: ticket.avatar || '/avatars/user1.jpg',
        slaRemaining,
        severity,
      };

      const result = await prisma.$transaction(async (tx) => {
        const newIssue = await tx.issue.create({ data: issueData });
        await tx.ticket.update({
          where: { id: ticketId },
          data: {
            issueId: newIssue.id,
            status: 'Pending',
          },
        });
        return newIssue;
      });

      issue = result;
    }

    return NextResponse.json({
      message: 'Ticket escalated and saved in database',
      issue,
      issueKey: issue.issueKey,
      slaRemaining: issue.slaRemaining,
      severity: issue.severity,
    });
  } catch (error) {
    console.error('Escalate POST error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: 'Failed to escalate ticket in database', error: errorMessage },
      { status: 500 }
    );
  }
}
