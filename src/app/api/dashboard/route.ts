import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [metrics, salesTeam, tasks] = await Promise.all([
      prisma.metricSummary.findFirst(),
      prisma.salesTeamMember.findMany({ orderBy: { revenue: 'desc' } }),
      prisma.taskCompletion.findMany({ orderBy: { completed: 'desc' } }),
    ]);

    return NextResponse.json({
      metrics,
      salesTeam,
      tasks,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
