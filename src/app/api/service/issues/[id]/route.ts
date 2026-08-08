import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: issueId } = await params;

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { ticket: true },
    });

    if (!issue) {
      return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
    }

    const ticketId = issue.ticket?.id;

    await prisma.issue.delete({
      where: { id: issueId },
    });

    if (ticketId) {
      await prisma.ticket.delete({
        where: { id: ticketId },
      }).catch((err) => console.log('Ticket cleanup error:', err));
    }

    return NextResponse.json({
      message: 'Issue deleted successfully from database',
      id: issueId,
      ticketId,
    });
  } catch (error: any) {
    console.error('Issue DELETE error:', error);
    return NextResponse.json(
      { message: 'Failed to delete issue from database', error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
