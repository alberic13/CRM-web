import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'Year-to-date';

    const [dbMetrics, dbSalesTeam, dbTasks] = await Promise.all([
      prisma.metricSummary.findFirst().catch(() => null),
      prisma.salesTeamMember.findMany({ orderBy: { revenue: 'desc' } }).catch(() => []),
      prisma.taskCompletion.findMany({ orderBy: { completed: 'desc' } }).catch(() => []),
    ]);

    // Period multiplier scale
    let mult = 1.0;
    if (period === 'Month-to-date') mult = 0.12;
    else if (period === 'Quarter-to-date') mult = 0.32;
    else if (period === 'Last 30 Days') mult = 0.15;
    else if (period === 'Last 7 Days') mult = 0.04;

    const baseRevenue = dbMetrics?.totalRevenue || 82340;
    const baseQuantity = dbMetrics?.totalQuantity || 3734;
    const baseOrders = dbMetrics?.numberOrders || 5532;
    const baseCustomers = dbMetrics?.customerCount || 4982;

    const metrics = {
      totalRevenue: Math.round(baseRevenue * mult),
      totalRevenueInc: period === 'Month-to-date' ? 3.4 : period === 'Quarter-to-date' ? 2.1 : period === 'Last 7 Days' ? 4.8 : 1.24,
      totalQuantity: Math.round(baseQuantity * mult),
      totalQuantityInc: period === 'Month-to-date' ? 1.5 : -0.24,
      numberOrders: Math.round(baseOrders * mult),
      numberOrdersInc: period === 'Month-to-date' ? 2.8 : 0.91,
      averageOrderValue: Number((14.88 * (period === 'Last 7 Days' ? 1.15 : 1.0)).toFixed(2)),
      averageOrderValueInc: 1.02,
      customerCount: Math.round(baseCustomers * mult),
      customerCountInc: period === 'Month-to-date' ? 2.4 : -0.92,
    };

    return NextResponse.json({
      period,
      metrics,
      salesTeam: dbSalesTeam,
      tasks: dbTasks,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
