import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const issueKey = searchParams.get('issueKey') || '';

    const where: Prisma.IssueWhereInput = {};
    if (issueKey) {
      where.issueKey = issueKey;
    } else if (search) {
      where.OR = [
        { issueKey: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { affectedCustomer: { contains: search, mode: 'insensitive' } },
      ];
    }

    const issues = await prisma.issue.findMany({
      where,
      include: { ticket: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ issues });
  } catch (error) {
    console.error('Issues GET error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: 'Failed to fetch issues from database', error: errorMessage },
      { status: 500 }
    );
  }
}
