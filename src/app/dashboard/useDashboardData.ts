'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthUser } from '@/types/user';
import {
  PeriodFilter,
  TrendTab,
  SalesViewMode,
  SortField,
  SortOrder,
  DashboardData,
  DashboardMetrics,
} from './types';
import * as calc from './dashboardCalculations';

const BASE_METRICS: DashboardMetrics = {
  totalRevenue: 82340,
  totalRevenueInc: 1.24,
  totalQuantity: 3734,
  totalQuantityInc: -0.24,
  numberOrders: 5532,
  numberOrdersInc: 0.91,
  averageOrderValue: 14.88,
  averageOrderValueInc: 1.02,
  customerCount: 4982,
  customerCountInc: -0.92,
};

export function useDashboardData() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('Year-to-date');
  const [trendTab, setTrendTab] = useState<TrendTab>('Monthly');
  const [salesViewMode, setSalesViewMode] = useState<SalesViewMode>('Member');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((d) => d.user && setUser(d.user)).catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/dashboard?period=${encodeURIComponent(periodFilter)}`)
      .then((r) => r.json())
      .then((d) => d?.metrics && setData(d))
      .catch((err) => console.error('Error fetching dashboard data:', err));
  }, [periodFilter]);

  const scaleMult = useMemo(() => calc.getScaleMultiplier(periodFilter), [periodFilter]);
  const dateRangeText = useMemo(() => calc.getDateRangeText(periodFilter), [periodFilter]);
  const metrics = useMemo(() => calc.computeScaledMetrics(data?.metrics || BASE_METRICS, periodFilter, scaleMult), [data, periodFilter, scaleMult]);
  const donutPaths = useMemo(() => calc.calculateDonutPaths(periodFilter), [periodFilter]);

  const revenueTargets = useMemo(() => ({
    target: Math.round(73000 * scaleMult),
    actual: metrics.totalRevenue,
    monthlyTarget: Math.round(6084 * (periodFilter === 'Last 7 Days' ? 0.25 : 1.0)),
    monthlyActual: Math.round(6862 * (periodFilter === 'Last 7 Days' ? 0.25 : 1.0)),
  }), [scaleMult, metrics, periodFilter]);

  const overallTrendPoints = useMemo(() => calc.getOverallTrendPoints(periodFilter), [periodFilter]);
  const revenueTrendChartData = useMemo(() => calc.getRevenueTrendChartData(trendTab), [trendTab]);
  const sortedSalesTeam = useMemo(() => calc.getSortedSalesTeam(salesViewMode, scaleMult, sortField, sortOrder), [salesViewMode, scaleMult, sortField, sortOrder]);

  const toggleSort = useCallback((field: SortField) => {
    setSortOrder((prev) => (sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
    setSortField(field);
  }, [sortField]);

  const taskCompletions = data?.taskCompletions?.length ? data.taskCompletions : calc.DEFAULT_TASKS;

  return {
    user,
    periodFilter,
    setPeriodFilter,
    dateRangeText,
    trendTab,
    setTrendTab,
    salesViewMode,
    setSalesViewMode,
    sortField,
    sortOrder,
    toggleSort,
    metrics,
    donutPaths,
    revenueTargets,
    overallTrendPoints,
    revenueTrendChartData,
    sortedSalesTeam,
    taskCompletions,
  };
}
