export type PeriodFilter =
  | 'Year-to-date'
  | 'Month-to-date'
  | 'Quarter-to-date'
  | 'Last 30 Days'
  | 'Last 7 Days';

export type TrendTab = 'Daily' | 'Weekly' | 'Monthly';
export type SalesViewMode = 'Member' | 'Team';
export type SortField = 'revenue' | 'orders' | 'conversionRate';
export type SortOrder = 'asc' | 'desc';

export interface DashboardMetrics {
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
}

export interface SalesMember {
  id?: string;
  name: string;
  avatar?: string;
  revenue: number;
  orders: number;
  conversionRate: number;
}

export interface TaskCompletionItem {
  id?: string;
  companyName: string;
  avatar?: string;
  completed: number;
  inProgress: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  salesTeam: SalesMember[];
  taskCompletions: TaskCompletionItem[];
}

export interface TrendPoint {
  x: number;
  y: number;
  label: string;
  rev: string;
  online?: string;
}
