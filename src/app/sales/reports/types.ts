export interface TrendItem {
  month: string;
  volume: number;
  revenue: number;
}

export interface SalesReportFilters {
  period: string;
  product: string;
  region: string;
  customer: string;
  stage: string;
}

export interface SalesMetrics {
  totalSales: number;
  totalQty: number;
  avgSales: number;
  avgQty: number;
  salesInc: number;
  qtyInc: number;
}

export interface PurchasingCustomerMonth {
  month: string;
  total: number;
  purchasing: number;
}

export interface CountryStat {
  flag: string;
  name: string;
  pct: number;
  color: string;
}

export interface ChannelPercentages {
  retail: number;
  online: number;
}

export interface CustomerAnalysisStats {
  totalCust: number;
  retentionStr: string;
  acquisition: string;
  onlinePct: number;
  repeatPct: number;
  oneTimePct: number;
  nonPurchasingPct: number;
}

export interface ProductPreference {
  rank: string;
  name: string;
  qty: number;
}
