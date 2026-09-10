'use client';

import AppShell from '@/components/AppShell';
import { useDashboardData } from './useDashboardData';
import { KpiMetricGrid } from './components/KpiMetricGrid';
import { OverallRevenueTrendsChart } from './components/OverallRevenueTrendsChart';
import { SalesChannelDistributionChart } from './components/SalesChannelDistributionChart';
import { RevenueTargetsCard } from './components/RevenueTargetsCard';
import { RevenueTrendCard } from './components/RevenueTrendCard';
import { SalesTeamLeaderboard } from './components/SalesTeamLeaderboard';
import { TaskCompletionTable } from './components/TaskCompletionTable';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const d = useDashboardData();

  return (
    <AppShell activeMenu="Dashboard">
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <div className={styles.breadcrumbs}>
            <span>Home</span> &gt; <strong>Dashboard</strong>
          </div>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.dateSelectWrapper}>
            <select
              className={styles.dateSelect}
              value={d.periodFilter}
              onChange={(e) => d.setPeriodFilter(e.target.value as typeof d.periodFilter)}
            >
              <option value="Year-to-date">Year-to-date</option>
              <option value="Month-to-date">Month-to-date</option>
              <option value="Quarter-to-date">Quarter-to-date</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
            </select>
          </div>
          <span className={styles.dateRangeText}>{d.dateRangeText}</span>
        </div>
      </div>

      <KpiMetricGrid metrics={d.metrics} />

      <div className={styles.row1Grid}>
        <OverallRevenueTrendsChart points={d.overallTrendPoints} />
        <SalesChannelDistributionChart donutPaths={d.donutPaths} />
      </div>

      <div className={styles.row2Grid}>
        <RevenueTargetsCard targets={d.revenueTargets} />
        <RevenueTrendCard
          trendTab={d.trendTab}
          onTabChange={d.setTrendTab}
          chartData={d.revenueTrendChartData}
        />
      </div>

      <div className={styles.row3Grid}>
        <SalesTeamLeaderboard
          viewMode={d.salesViewMode}
          onModeChange={d.setSalesViewMode}
          members={d.sortedSalesTeam}
          sortField={d.sortField}
          sortOrder={d.sortOrder}
          onToggleSort={d.toggleSort}
        />
        <TaskCompletionTable tasks={d.taskCompletions} />
      </div>
    </AppShell>
  );
}
