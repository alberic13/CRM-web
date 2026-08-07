'use client';

import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './dashboard.module.css';

interface DashboardData {
  metrics: {
    totalRevenue: number;
    totalRevenueInc: number;
    totalQuantity: number;
    totalQuantityInc: number;
    numberOrders: number;
    numberOrdersInc: number;
    averageOrderValue: number;
    averageOrderValueInc: number;
    customerCount: number;
    customerCountInc: number;
  };
  salesTeam: Array<{
    id?: string;
    name: string;
    avatar?: string;
    revenue: number;
    orders: number;
    conversionRate: number;
  }>;
  taskCompletions: Array<{
    id?: string;
    companyName: string;
    avatar?: string;
    completed: number;
    inProgress: number;
  }>;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  
  // Interactive Filters State
  const [periodFilter, setPeriodFilter] = useState<'Year-to-date' | 'Month-to-date' | 'Quarter-to-date' | 'Last 30 Days' | 'Last 7 Days'>('Year-to-date');
  const [trendTab, setTrendTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
  const [salesViewMode, setSalesViewMode] = useState<'Member' | 'Team'>('Member');
  const [sortField, setSortField] = useState<'revenue' | 'orders' | 'conversionRate'>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Chart Tooltip State
  const [chartHover, setChartHover] = useState<{ x: number; y: number; label: string; val: string } | null>(null);

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.user) setUser(resData.user);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/dashboard?period=${encodeURIComponent(periodFilter)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.metrics) {
          setData(resData);
        }
      })
      .catch((err) => console.error('Error fetching dashboard data:', err));
  }, [periodFilter]);

  // Dynamic Date Range Text based on periodFilter
  const dateRangeText = useMemo(() => {
    switch (periodFilter) {
      case 'Month-to-date':
        return '2024/12/1 ~ 2024/12/11';
      case 'Quarter-to-date':
        return '2024/10/1 ~ 2024/12/11';
      case 'Last 30 Days':
        return '2024/11/11 ~ 2024/12/11';
      case 'Last 7 Days':
        return '2024/12/4 ~ 2024/12/11';
      case 'Year-to-date':
      default:
        return '2024/1/1 ~ 2024/12/11';
    }
  }, [periodFilter]);

  // Dynamic Scale Multiplier for KPI metrics
  const scaleMult = useMemo(() => {
    switch (periodFilter) {
      case 'Month-to-date':
        return 0.12;
      case 'Quarter-to-date':
        return 0.32;
      case 'Last 30 Days':
        return 0.15;
      case 'Last 7 Days':
        return 0.04;
      case 'Year-to-date':
      default:
        return 1.0;
    }
  }, [periodFilter]);

  const metrics = useMemo(() => {
    const base = data?.metrics || {
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

    if (periodFilter === 'Year-to-date') return base;

    return {
      totalRevenue: Math.round(82340 * scaleMult),
      totalRevenueInc: periodFilter === 'Month-to-date' ? 3.4 : periodFilter === 'Last 7 Days' ? 4.8 : 2.1,
      totalQuantity: Math.round(3734 * scaleMult),
      totalQuantityInc: periodFilter === 'Month-to-date' ? 1.5 : -0.24,
      numberOrders: Math.round(5532 * scaleMult),
      numberOrdersInc: periodFilter === 'Month-to-date' ? 2.8 : 0.91,
      averageOrderValue: Number((14.88 * (periodFilter === 'Last 7 Days' ? 1.15 : 1.0)).toFixed(2)),
      averageOrderValueInc: 1.02,
      customerCount: Math.round(4982 * scaleMult),
      customerCountInc: periodFilter === 'Month-to-date' ? 2.4 : -0.92,
    };
  }, [data, scaleMult, periodFilter]);

  // Dynamic Channel Distribution percentages (Online vs Retail)
  const channelData = useMemo(() => {
    switch (periodFilter) {
      case 'Month-to-date':
        return { onlinePct: 68.2, retailPct: 31.8 };
      case 'Quarter-to-date':
        return { onlinePct: 75.1, retailPct: 24.9 };
      case 'Last 7 Days':
        return { onlinePct: 80.0, retailPct: 20.0 };
      case 'Last 30 Days':
        return { onlinePct: 71.5, retailPct: 28.5 };
      case 'Year-to-date':
      default:
        return { onlinePct: 73.4, retailPct: 26.6 };
    }
  }, [periodFilter]);

  // SVG Donut Path Calculation for Sales Channel Distribution
  const donutPaths = useMemo(() => {
    const { onlinePct, retailPct } = channelData;
    const retailAngle = (retailPct / 100) * 360;
    const rad = ((90 - retailAngle) * Math.PI) / 180;
    const x = 100 + 80 * Math.cos(rad);
    const y = 100 - 80 * Math.sin(rad);

    const retailD = `M 100 100 L 100 20 A 80 80 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Z`;
    const onlineD = `M 100 100 L ${x.toFixed(1)} ${y.toFixed(1)} A 80 80 0 1 1 100 20 Z`;

    return { retailD, onlineD, onlinePct, retailPct };
  }, [channelData]);

  // Dynamic Revenue Targets based on Period
  const revenueTargets = useMemo(() => {
    const baseTarget = Math.round(73000 * scaleMult);
    const baseActual = metrics.totalRevenue;
    const monthlyTarget = Math.round(6084 * (periodFilter === 'Last 7 Days' ? 0.25 : 1.0));
    const monthlyActual = Math.round(6862 * (periodFilter === 'Last 7 Days' ? 0.25 : 1.0));

    return {
      target: baseTarget,
      actual: baseActual,
      monthlyTarget,
      monthlyActual,
    };
  }, [scaleMult, metrics, periodFilter]);

  // Dynamic Curve for Overall Revenue Trends Chart
  const overallTrendPoints = useMemo(() => {
    const basePoints = [
      { x: 0, y: 190, label: 'Month 1', rev: '$1,200', online: '$850' },
      { x: 45, y: 175, label: 'Month 2', rev: '$2,400', online: '$1,650' },
      { x: 90, y: 160, label: 'Month 3', rev: '$3,800', online: '$2,700' },
      { x: 135, y: 140, label: 'Month 4', rev: '$4,500', online: '$3,200' },
      { x: 180, y: 110, label: 'Month 5', rev: '$5,900', online: '$4,100' },
      { x: 225, y: 90, label: 'Month 6', rev: '$6,800', online: '$4,900' },
      { x: 270, y: 75, label: 'Month 7', rev: '$7,200', online: '$5,300' },
      { x: 315, y: 65, label: 'Month 8', rev: '$7,800', online: '$5,700' },
      { x: 360, y: 55, label: 'Month 9', rev: '$8,400', online: '$6,150' },
      { x: 405, y: 40, label: 'Month 10', rev: '$8,900', online: '$6,500' },
      { x: 450, y: 30, label: 'Month 11', rev: '$9,400', online: '$6,900' },
      { x: 500, y: 20, label: 'Month 12', rev: '$9,800', online: '$7,200' },
    ];

    if (periodFilter === 'Last 7 Days') {
      return basePoints.map((p, idx) => ({
        ...p,
        y: 190 - idx * 12,
        label: `Day ${idx + 1}`,
        rev: `$${(150 + idx * 80).toLocaleString()}`,
        online: `$${(110 + idx * 60).toLocaleString()}`,
      }));
    }

    return basePoints;
  }, [periodFilter]);

  // Dynamic Curve for Revenue Trend Chart (Daily / Weekly / Monthly)
  const revenueTrendChartData = useMemo(() => {
    if (trendTab === 'Daily') {
      const days = Array.from({ length: 12 }, (_, i) => ({
        x: (500 / 11) * i,
        y: 170 - Math.sin((i / 11) * Math.PI) * 120 - (i % 2 === 0 ? 10 : -10),
        label: `Day ${(i + 1) * 2.5}`,
        rev: `$${(200 + i * 45).toLocaleString()}`,
      }));
      return {
        points: days,
        pathD: `M 0 160 Q 40 120, 80 130 T 160 90 T 240 70 T 320 80 T 400 50 T 500 35 L 500 200 L 0 200 Z`,
        strokeD: `M 0 160 Q 40 120, 80 130 T 160 90 T 240 70 T 320 80 T 400 50 T 500 35`,
        labels: ['D1', 'D3', 'D6', 'D9', 'D12', 'D15', 'D18', 'D21', 'D24', 'D27', 'D30'],
      };
    } else if (trendTab === 'Weekly') {
      const weeks = Array.from({ length: 7 }, (_, i) => ({
        x: (500 / 6) * i,
        y: 150 - i * 18 - (i % 2 === 0 ? 8 : -8),
        label: `Week ${i + 1}`,
        rev: `$${(1200 + i * 650).toLocaleString()}`,
      }));
      return {
        points: weeks,
        pathD: `M 0 150 Q 80 130, 160 110 T 320 70 T 500 40 L 500 200 L 0 200 Z`,
        strokeD: `M 0 150 Q 80 130, 160 110 T 320 70 T 500 40`,
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
      };
    } else {
      // Monthly
      const months = Array.from({ length: 12 }, (_, i) => ({
        x: (500 / 11) * i,
        y: 160 - i * 11 - (i % 2 === 0 ? 5 : -5),
        label: `Month ${i + 1}`,
        rev: `$${(500 + i * 550).toLocaleString()}`,
      }));
      return {
        points: months,
        pathD: `M 0 160 Q 40 110, 80 120 T 160 80 T 240 60 T 320 70 T 400 40 T 500 30 L 500 200 L 0 200 Z`,
        strokeD: `M 0 160 Q 40 110, 80 120 T 160 80 T 240 60 T 320 70 T 400 40 T 500 30`,
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      };
    }
  }, [trendTab]);

  // Default Leaderboard & Teams
  const defaultSalesTeamMembers = [
    { id: 's1', name: 'Shirley.H', avatar: '/avatars/user1.jpg', revenue: Math.round(719 * scaleMult * 100), orders: Math.round(39 * scaleMult * 10), conversionRate: 86 },
    { id: 's2', name: 'GlobalMart', avatar: '/avatars/user2.jpg', revenue: Math.round(684 * scaleMult * 100), orders: Math.round(35 * scaleMult * 10), conversionRate: 75 },
    { id: 's3', name: 'Bright Solutions', avatar: '/avatars/user3.jpg', revenue: Math.round(643 * scaleMult * 100), orders: Math.round(32 * scaleMult * 10), conversionRate: 36 },
    { id: 's4', name: 'Tech Innovations', avatar: '/avatars/user4.jpg', revenue: Math.round(533 * scaleMult * 100), orders: Math.round(29 * scaleMult * 10), conversionRate: 75 },
    { id: 's5', name: 'Blue Horizon', avatar: '/avatars/user5.jpg', revenue: Math.round(521 * scaleMult * 100), orders: Math.round(34 * scaleMult * 10), conversionRate: 86 },
    { id: 's6', name: 'BestBuyer', avatar: '/avatars/user8.jpg', revenue: Math.round(478 * scaleMult * 100), orders: Math.round(64 * scaleMult * 10), conversionRate: 45 },
    { id: 's7', name: 'Alpha Solutions', avatar: '/avatars/user6.jpg', revenue: Math.round(465 * scaleMult * 100), orders: Math.round(36 * scaleMult * 10), conversionRate: 75 },
    { id: 's8', name: 'Prime Goods', avatar: '/avatars/user7.jpg', revenue: Math.round(423 * scaleMult * 100), orders: Math.round(57 * scaleMult * 10), conversionRate: 76 },
    { id: 's9', name: 'Wise Shoppers', avatar: '/avatars/user10.jpg', revenue: Math.round(387 * scaleMult * 100), orders: Math.round(32 * scaleMult * 10), conversionRate: 47 },
    { id: 's10', name: 'Quick Solutions', avatar: '/avatars/user9.jpg', revenue: Math.round(327 * scaleMult * 100), orders: Math.round(25 * scaleMult * 10), conversionRate: 84 },
  ];

  const salesTeamsList = [
    { id: 'tm1', name: 'Enterprise Sales Team', avatar: '/avatars/user1.jpg', revenue: Math.round(32450 * scaleMult), orders: Math.round(1420 * scaleMult), conversionRate: 82 },
    { id: 'tm2', name: 'Mid-Market Team', avatar: '/avatars/user4.jpg', revenue: Math.round(24180 * scaleMult), orders: Math.round(1850 * scaleMult), conversionRate: 74 },
    { id: 'tm3', name: 'Online Direct Team', avatar: '/avatars/user3.jpg', revenue: Math.round(16890 * scaleMult), orders: Math.round(1240 * scaleMult), conversionRate: 68 },
    { id: 'tm4', name: 'Retail Partner Team', avatar: '/avatars/user7.jpg', revenue: Math.round(8820 * scaleMult), orders: Math.round(1022 * scaleMult), conversionRate: 61 },
  ];

  const rawSalesTeam = salesViewMode === 'Member' ? defaultSalesTeamMembers : salesTeamsList;

  // Sorted Sales Team Leaderboard
  const sortedSalesTeam = useMemo(() => {
    return [...rawSalesTeam].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }, [rawSalesTeam, sortField, sortOrder]);

  const toggleSort = (field: 'revenue' | 'orders' | 'conversionRate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const defaultTasks = [
    { id: 't1', companyName: 'GlobalMart', avatar: '/avatars/user2.jpg', completed: 34, inProgress: 7 },
    { id: 't2', companyName: 'Tech Innovations', avatar: '/avatars/user4.jpg', completed: 31, inProgress: 5 },
    { id: 't3', companyName: 'Bright Solutions', avatar: '/avatars/user3.jpg', completed: 24, inProgress: 9 },
    { id: 't4', companyName: 'Alpha Solutions', avatar: '/avatars/user6.jpg', completed: 21, inProgress: 3 },
    { id: 't5', companyName: 'Prime Goods', avatar: '/avatars/user7.jpg', completed: 20, inProgress: 6 },
    { id: 't6', companyName: 'BestBuyer', avatar: '/avatars/user8.jpg', completed: 18, inProgress: 10 },
    { id: 't7', companyName: 'Shirley.H', avatar: '/avatars/user1.jpg', completed: 16, inProgress: 2 },
    { id: 't8', companyName: 'Blue Horizon', avatar: '/avatars/user5.jpg', completed: 12, inProgress: 7 },
    { id: 't9', companyName: 'Quick Solutions', avatar: '/avatars/user9.jpg', completed: 9, inProgress: 9 },
    { id: 't10', companyName: 'Wise Shoppers', avatar: '/avatars/user10.jpg', completed: 7, inProgress: 3 },
  ];

  const taskCompletions = data?.taskCompletions && data.taskCompletions.length > 0 ? data.taskCompletions : defaultTasks;

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Dashboard" />

      <div className={styles.mainContent}>
        <Header user={user} />

        <main className={styles.contentBody}>
          {/* Top Title & Interactive Period Filter Bar */}
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
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value as any)}
                >
                  <option value="Year-to-date">Year-to-date</option>
                  <option value="Month-to-date">Month-to-date</option>
                  <option value="Quarter-to-date">Quarter-to-date</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                </select>
              </div>
              <span className={styles.dateRangeText}>{dateRangeText}</span>
            </div>
          </div>

          {/* 5 KPI Metric Summary Cards (Top Row) */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Total Revenue</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>${metrics.totalRevenue.toLocaleString()}</span>
                <span className={styles.badgeIncPositive}>+{metrics.totalRevenueInc}%</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Total Quantity</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{metrics.totalQuantity.toLocaleString()}</span>
                <span className={metrics.totalQuantityInc >= 0 ? styles.badgeIncPositive : styles.badgeIncNegative}>
                  {metrics.totalQuantityInc >= 0 ? '+' : ''}{metrics.totalQuantityInc}%
                </span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Number of Orders</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{metrics.numberOrders.toLocaleString()}</span>
                <span className={styles.badgeIncPositive}>+{metrics.numberOrdersInc}%</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Average Order Value</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>${metrics.averageOrderValue.toFixed(2)}</span>
                <span className={styles.badgeIncPositive}>+{metrics.averageOrderValueInc}%</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Customer Count</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{metrics.customerCount.toLocaleString()}</span>
                <span className={metrics.customerCountInc >= 0 ? styles.badgeIncPositive : styles.badgeIncNegative}>
                  {metrics.customerCountInc >= 0 ? '+' : ''}{metrics.customerCountInc}%
                </span>
              </div>
            </div>
          </div>

          {/* Row 1: Overall Revenue Trends + Sales Channel Distribution */}
          <div className={styles.row1Grid}>
            {/* Overall Revenue Trends */}
            <div className={styles.cardBox} style={{ position: 'relative' }}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Overall Revenue Trends</h2>
                <div className={styles.legendGroup}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendLineBlue} />
                    <span>Total Revenue</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendLineGreen} />
                    <span>Online Channel</span>
                  </div>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.yAxis}>
                  <span className={styles.yAxisTitle}>Revenue</span>
                  <span>10,000</span>
                  <span>0</span>
                </div>

                <div className={styles.chartBody}>
                  <svg className={styles.svgChart} viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5d5fef" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#5d5fef" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Green Filled Curve (Online Channel) */}
                    <path
                      d="M 0 190 Q 40 185, 80 180 T 160 160 T 240 140 T 320 120 T 400 110 T 500 60 L 500 200 L 0 200 Z"
                      fill="url(#gradGreen)"
                    />
                    <path
                      d="M 0 190 Q 40 185, 80 180 T 160 160 T 240 140 T 320 120 T 400 110 T 500 60"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                    />

                    {/* Blue Filled Curve (Total Revenue) */}
                    <path
                      d="M 0 190 Q 40 170, 80 160 T 160 130 T 240 90 T 320 70 T 400 60 T 500 20 L 500 200 L 0 200 Z"
                      fill="url(#gradBlue)"
                    />
                    <path
                      d="M 0 190 Q 40 170, 80 160 T 160 130 T 240 90 T 320 70 T 400 60 T 500 20"
                      fill="none"
                      stroke="#5d5fef"
                      strokeWidth="3"
                    />

                    {/* Interactive Hover Dots */}
                    {overallTrendPoints.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#5d5fef"
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setChartHover({ x: pt.x, y: pt.y, label: pt.label, val: `Total: ${pt.rev} | Online: ${pt.online}` })}
                        onMouseLeave={() => setChartHover(null)}
                      />
                    ))}
                  </svg>

                  <div className={styles.xAxis}>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                    <span>11</span>
                    <span>12</span>
                    <span className={styles.xAxisTitle}>month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Channel Distribution Pie Chart */}
            <div className={styles.cardBox}>
              <h2 className={styles.cardTitle}>Sales Channel Distribution</h2>
              <div className={styles.donutWrapper}>
                <svg className={styles.donutSvg} viewBox="0 0 200 200">
                  {/* Retail Slice */}
                  <path d={donutPaths.retailD} fill="#c7d2fe" />

                  {/* Online Slice */}
                  <path d={donutPaths.onlineD} fill="#5b5cf0" />

                  {/* Two-Side Embedded Labels */}
                  <text x="65" y="118" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
                    Online ({donutPaths.onlinePct}%)
                  </text>

                  <text x="138" y="62" textAnchor="middle" fill="#4338ca" fontSize="11" fontWeight="700">
                    Retail ({donutPaths.retailPct}%)
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2: Revenue Targets + Revenue Trend Line Chart */}
          <div className={styles.row2Grid}>
            <div className={styles.cardBox}>
              <div className={styles.targetMetricsList}>
                <div className={styles.targetMetricItem}>
                  <span className={styles.targetLabel}>Annual Revenue Target</span>
                  <div className={styles.targetValRow}>
                    <span className={styles.targetVal}>${revenueTargets.target.toLocaleString()}</span>
                    <span className={styles.targetIncBadge}>3.5%</span>
                  </div>
                </div>

                <div className={styles.targetMetricItem}>
                  <span className={styles.targetLabel}>Actual Annual Revenue</span>
                  <div className={styles.targetValRow}>
                    <span className={styles.targetVal}>${revenueTargets.actual.toLocaleString()}</span>
                    <span className={styles.targetIncBadge}>6.2%</span>
                  </div>
                </div>

                <div className={styles.targetMetricItem}>
                  <span className={styles.targetLabel}>Monthly Revenue Target</span>
                  <div className={styles.targetValRow}>
                    <span className={styles.targetVal}>${revenueTargets.monthlyTarget.toLocaleString()}</span>
                    <span className={styles.targetIncBadge}>2.4%</span>
                  </div>
                </div>

                <div className={styles.targetMetricItem}>
                  <span className={styles.targetLabel}>Actual Monthly Revenue</span>
                  <div className={styles.targetValRow}>
                    <span className={styles.targetVal}>${revenueTargets.monthlyActual.toLocaleString()}</span>
                    <span className={styles.targetIncBadge}>2.7%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Revenue Trend</h2>
                <div className={styles.toggleButtonGroup}>
                  <button
                    className={`${styles.toggleBtn} ${trendTab === 'Daily' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setTrendTab('Daily')}
                  >
                    Daily
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${trendTab === 'Weekly' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setTrendTab('Weekly')}
                  >
                    Weekly
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${trendTab === 'Monthly' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setTrendTab('Monthly')}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.yAxis}>
                  <span className={styles.yAxisTitle}>Revenue</span>
                  <span>9,000</span>
                  <span>6,000</span>
                  <span>3,000</span>
                  <span>0</span>
                </div>

                <div className={styles.chartBody}>
                  <svg className={styles.svgChart} viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <path d={revenueTrendChartData.pathD} fill="url(#gradTrend)" />
                    <path d={revenueTrendChartData.strokeD} fill="none" stroke="#6366f1" strokeWidth="3" />

                    {/* Interactive Points */}
                    {revenueTrendChartData.points.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#6366f1"
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setChartHover({ x: pt.x, y: pt.y, label: pt.label, val: pt.rev })}
                        onMouseLeave={() => setChartHover(null)}
                      />
                    ))}
                  </svg>

                  <div className={styles.xAxis}>
                    {revenueTrendChartData.labels.map((lbl, i) => (
                      <span key={i}>{lbl}</span>
                    ))}
                    <span className={styles.xAxisTitle}>Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Sales Team Leaderboard + Task Completion */}
          <div className={styles.row3Grid}>
            {/* Sales Team Leaderboard */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Sales Team</h2>
                <div className={styles.segmentedToggle}>
                  <button
                    className={`${styles.segBtn} ${salesViewMode === 'Team' ? styles.segBtnActive : ''}`}
                    onClick={() => setSalesViewMode('Team')}
                  >
                    Team
                  </button>
                  <button
                    className={`${styles.segBtn} ${salesViewMode === 'Member' ? styles.segBtnActive : ''}`}
                    onClick={() => setSalesViewMode('Member')}
                  >
                    Member
                  </button>
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}>#</th>
                    <th>{salesViewMode === 'Member' ? 'Member Name' : 'Team Name'}</th>
                    <th>
                      <span className={styles.sortableHeader} onClick={() => toggleSort('revenue')}>
                        Revenue <span className={styles.sortIcon}>{sortField === 'revenue' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇕'}</span>
                      </span>
                    </th>
                    <th>
                      <span className={styles.sortableHeader} onClick={() => toggleSort('orders')}>
                        Orders Number <span className={styles.sortIcon}>{sortField === 'orders' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇕'}</span>
                      </span>
                    </th>
                    <th>
                      <span className={styles.sortableHeader} onClick={() => toggleSort('conversionRate')}>
                        Conversion Rate <span className={styles.sortIcon}>{sortField === 'conversionRate' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇕'}</span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSalesTeam.map((st: any, idx: number) => (
                    <tr key={st.id || idx}>
                      <td className={styles.rankNum}>{idx + 1}</td>
                      <td>
                        <div className={styles.userCell}>
                          <img
                            src={st.avatar || `/avatars/user${(idx % 10) + 1}.jpg`}
                            alt={st.name}
                            className={styles.avatarImgPhoto}
                          />
                          <span>{st.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>${st.revenue.toLocaleString()}</td>
                      <td>{st.orders}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#22c55e' }}>{st.conversionRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Task Completion */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Task Completion</h2>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}>#</th>
                    <th>Company / Account</th>
                    <th>Completed</th>
                    <th>In Progress</th>
                    <th>Progress Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {taskCompletions.map((tc: any, idx: number) => {
                    const total = tc.completed + tc.inProgress;
                    const pct = total > 0 ? Math.round((tc.completed / total) * 100) : 0;

                    return (
                      <tr key={tc.id || idx}>
                        <td className={styles.rankNum}>{idx + 1}</td>
                        <td>
                          <div className={styles.userCell}>
                            <img
                              src={tc.avatar || `/avatars/user${(idx % 10) + 1}.jpg`}
                              alt={tc.companyName}
                              className={styles.avatarImgPhoto}
                            />
                            <span>{tc.companyName}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#16a34a' }}>{tc.completed}</td>
                        <td style={{ fontWeight: 600, color: '#eab308' }}>{tc.inProgress}</td>
                        <td style={{ width: '120px' }}>
                          <div style={{ background: '#e2e8f0', borderRadius: '10px', height: '8px', overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: `${pct}%`, background: '#5d5fef', height: '100%' }} />
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{pct}% Done</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
