import { PeriodFilter, TrendTab, TrendPoint, SalesMember, TaskCompletionItem, SortField, SortOrder, DashboardMetrics, SalesViewMode } from './types';

export const DEFAULT_SALES_MEMBERS: SalesMember[] = [
  { id: 's1', name: 'Shirley.H', avatar: '/avatars/user1.jpg', revenue: 71900, orders: 390, conversionRate: 86 },
  { id: 's2', name: 'GlobalMart', avatar: '/avatars/user2.jpg', revenue: 68400, orders: 350, conversionRate: 75 },
  { id: 's3', name: 'Bright Solutions', avatar: '/avatars/user3.jpg', revenue: 64300, orders: 320, conversionRate: 36 },
  { id: 's4', name: 'Tech Innovations', avatar: '/avatars/user4.jpg', revenue: 53300, orders: 290, conversionRate: 75 },
  { id: 's5', name: 'Blue Horizon', avatar: '/avatars/user5.jpg', revenue: 52100, orders: 340, conversionRate: 86 },
  { id: 's6', name: 'BestBuyer', avatar: '/avatars/user8.jpg', revenue: 47800, orders: 640, conversionRate: 45 },
  { id: 's7', name: 'Alpha Solutions', avatar: '/avatars/user6.jpg', revenue: 46500, orders: 360, conversionRate: 75 },
  { id: 's8', name: 'Prime Goods', avatar: '/avatars/user7.jpg', revenue: 42300, orders: 570, conversionRate: 76 },
  { id: 's9', name: 'Wise Shoppers', avatar: '/avatars/user10.jpg', revenue: 38700, orders: 320, conversionRate: 47 },
  { id: 's10', name: 'Quick Solutions', avatar: '/avatars/user9.jpg', revenue: 32700, orders: 250, conversionRate: 84 },
];

export const SALES_TEAMS_LIST: SalesMember[] = [
  { id: 'tm1', name: 'Enterprise Sales Team', avatar: '/avatars/user1.jpg', revenue: 32450, orders: 1420, conversionRate: 82 },
  { id: 'tm2', name: 'Mid-Market Team', avatar: '/avatars/user4.jpg', revenue: 24180, orders: 1850, conversionRate: 74 },
  { id: 'tm3', name: 'Online Direct Team', avatar: '/avatars/user3.jpg', revenue: 16890, orders: 1240, conversionRate: 68 },
  { id: 'tm4', name: 'Retail Partner Team', avatar: '/avatars/user7.jpg', revenue: 8820, orders: 1022, conversionRate: 61 },
];

export const DEFAULT_TASKS: TaskCompletionItem[] = [
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

export function getScaleMultiplier(period: PeriodFilter): number {
  switch (period) {
    case 'Month-to-date': return 0.12;
    case 'Quarter-to-date': return 0.32;
    case 'Last 30 Days': return 0.15;
    case 'Last 7 Days': return 0.04;
    default: return 1.0;
  }
}

export function getDateRangeText(period: PeriodFilter): string {
  switch (period) {
    case 'Month-to-date': return '2024/12/1 ~ 2024/12/11';
    case 'Quarter-to-date': return '2024/10/1 ~ 2024/12/11';
    case 'Last 30 Days': return '2024/11/11 ~ 2024/12/11';
    case 'Last 7 Days': return '2024/12/4 ~ 2024/12/11';
    default: return '2024/1/1 ~ 2024/12/11';
  }
}

export function computeScaledMetrics(base: DashboardMetrics, period: PeriodFilter, scale: number): DashboardMetrics {
  if (period === 'Year-to-date') return base;
  return {
    totalRevenue: Math.round(82340 * scale),
    totalRevenueInc: period === 'Month-to-date' ? 3.4 : period === 'Last 7 Days' ? 4.8 : 2.1,
    totalQuantity: Math.round(3734 * scale),
    totalQuantityInc: period === 'Month-to-date' ? 1.5 : -0.24,
    numberOrders: Math.round(5532 * scale),
    numberOrdersInc: period === 'Month-to-date' ? 2.8 : 0.91,
    averageOrderValue: Number((14.88 * (period === 'Last 7 Days' ? 1.15 : 1.0)).toFixed(2)),
    averageOrderValueInc: 1.02,
    customerCount: Math.round(4982 * scale),
    customerCountInc: period === 'Month-to-date' ? 2.4 : -0.92,
  };
}

export function calculateDonutPaths(period: PeriodFilter) {
  const channelData =
    period === 'Month-to-date' ? { onlinePct: 68.2, retailPct: 31.8 } :
    period === 'Quarter-to-date' ? { onlinePct: 75.1, retailPct: 24.9 } :
    period === 'Last 7 Days' ? { onlinePct: 80.0, retailPct: 20.0 } :
    period === 'Last 30 Days' ? { onlinePct: 71.5, retailPct: 28.5 } :
    { onlinePct: 73.4, retailPct: 26.6 };

  const { onlinePct, retailPct } = channelData;
  const rad = ((90 - (retailPct / 100) * 360) * Math.PI) / 180;
  const x = 100 + 80 * Math.cos(rad);
  const y = 100 - 80 * Math.sin(rad);

  return {
    retailD: `M 100 100 L 100 20 A 80 80 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Z`,
    onlineD: `M 100 100 L ${x.toFixed(1)} ${y.toFixed(1)} A 80 80 0 1 1 100 20 Z`,
    onlinePct,
    retailPct,
  };
}

export function getRevenueTrendChartData(tab: TrendTab) {
  if (tab === 'Daily') {
    return {
      points: Array.from({ length: 12 }, (_, i) => ({
        x: (500 / 11) * i,
        y: 170 - Math.sin((i / 11) * Math.PI) * 120 - (i % 2 === 0 ? 10 : -10),
        label: `Day ${(i + 1) * 2.5}`,
        rev: `$${(200 + i * 45).toLocaleString()}`,
      })),
      pathD: 'M 0 160 Q 40 120, 80 130 T 160 90 T 240 70 T 320 80 T 400 50 T 500 35 L 500 200 L 0 200 Z',
      strokeD: 'M 0 160 Q 40 120, 80 130 T 160 90 T 240 70 T 320 80 T 400 50 T 500 35',
      labels: ['D1', 'D3', 'D6', 'D9', 'D12', 'D15', 'D18', 'D21', 'D24', 'D27', 'D30'],
    };
  }
  if (tab === 'Weekly') {
    return {
      points: Array.from({ length: 7 }, (_, i) => ({
        x: (500 / 6) * i,
        y: 150 - i * 18 - (i % 2 === 0 ? 8 : -8),
        label: `Week ${i + 1}`,
        rev: `$${(1200 + i * 650).toLocaleString()}`,
      })),
      pathD: 'M 0 150 Q 80 130, 160 110 T 320 70 T 500 40 L 500 200 L 0 200 Z',
      strokeD: 'M 0 150 Q 80 130, 160 110 T 320 70 T 500 40',
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    };
  }
  return {
    points: Array.from({ length: 12 }, (_, i) => ({
      x: (500 / 11) * i,
      y: 160 - i * 11 - (i % 2 === 0 ? 5 : -5),
      label: `Month ${i + 1}`,
      rev: `$${(500 + i * 550).toLocaleString()}`,
    })),
    pathD: 'M 0 160 Q 40 110, 80 120 T 160 80 T 240 60 T 320 70 T 400 40 T 500 30 L 500 200 L 0 200 Z',
    strokeD: 'M 0 160 Q 40 110, 80 120 T 160 80 T 240 60 T 320 70 T 400 40 T 500 30',
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  };
}

export function getOverallTrendPoints(period: PeriodFilter): TrendPoint[] {
  const basePoints: TrendPoint[] = [
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
  if (period === 'Last 7 Days') {
    return basePoints.map((p, idx) => ({
      ...p,
      y: 190 - idx * 12,
      label: `Day ${idx + 1}`,
      rev: `$${(150 + idx * 80).toLocaleString()}`,
      online: `$${(110 + idx * 60).toLocaleString()}`,
    }));
  }
  return basePoints;
}

export function getSortedSalesTeam(mode: SalesViewMode, scale: number, field: SortField, order: SortOrder): SalesMember[] {
  const source = mode === 'Member' ? DEFAULT_SALES_MEMBERS : SALES_TEAMS_LIST;
  const scaled = source.map((m) => ({
    ...m,
    revenue: Math.round(m.revenue * scale),
    orders: Math.round(m.orders * scale),
  }));
  return [...scaled].sort((a, b) => {
    const vA = a[field];
    const vB = b[field];
    return order === 'asc' ? (vA > vB ? 1 : -1) : (vA < vB ? 1 : -1);
  });
}
