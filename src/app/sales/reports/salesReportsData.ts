import {
  TrendItem, SalesReportFilters, SalesMetrics, PurchasingCustomerMonth,
  CountryStat, ChannelPercentages, CustomerAnalysisStats, ProductPreference,
} from './types';

export const BASE_TREND_DATA: TrendItem[] = [
  { month: '4/23', volume: 290, revenue: 390 },
  { month: '5/23', volume: 210, revenue: 300 },
  { month: '6/23', volume: 160, revenue: 380 },
  { month: '7/23', volume: 190, revenue: 360 },
  { month: '8/23', volume: 265, revenue: 470 },
  { month: '9/23', volume: 240, revenue: 330 },
  { month: '10/23', volume: 80, revenue: 540 },
  { month: '11/23', volume: 170, revenue: 560 },
  { month: '12/23', volume: 295, revenue: 330 },
  { month: '1/24', volume: 120, revenue: 320 },
  { month: '2/24', volume: 225, revenue: 410 },
  { month: '3/24', volume: 200, revenue: 480 },
];

export const MONTHS = ['4/23', '5/23', '6/23', '7/23', '8/23', '9/23', '10/23', '11/23', '12/23', '1/24', '2/24', '3/24'];

export function calculateScaleFactor(filters: SalesReportFilters, selectedCountry: string | null): number {
  let factor = 1.0;
  if (filters.period === 'Last 6 Months') factor *= 0.55;
  else if (filters.period === 'Last 3 Months') factor *= 0.28;
  else if (filters.period === 'Last 1 Month') factor *= 0.1;

  if (filters.product === 'Software SaaS') factor *= 0.45;
  else if (filters.product === 'Hardware Equipment') factor *= 0.35;
  else if (filters.product === 'Consulting Services') factor *= 0.2;

  if (filters.region === 'North America') factor *= 0.5;
  else if (filters.region === 'Europe') factor *= 0.3;
  else if (filters.region === 'Asia Pacific') factor *= 0.2;

  if (filters.customer === 'Enterprise') factor *= 0.6;
  else if (filters.customer === 'Mid-Market') factor *= 0.3;

  if (filters.stage === 'Won') factor *= 0.7;
  else if (filters.stage === 'In Progress') factor *= 0.25;

  if (selectedCountry === 'US') factor *= 0.6;
  else if (selectedCountry === 'Canada') factor *= 0.4;
  else if (selectedCountry === 'China') factor *= 0.3;
  else if (selectedCountry === 'UK') factor *= 0.2;
  else if (selectedCountry === 'France') factor *= 0.15;

  return Math.max(0.05, factor);
}

export function calculateSalesMetrics(scaleFactor: number): SalesMetrics {
  const totalSales = Math.round(1800000 * scaleFactor);
  const totalQty = Math.round(4920 * scaleFactor);
  return {
    totalSales,
    totalQty,
    avgSales: Math.round(totalSales / 12),
    avgQty: Math.round(totalQty / 12),
    salesInc: scaleFactor > 0.4 ? 1.93 : 3.12,
    qtyInc: scaleFactor > 0.4 ? -0.62 : 1.45,
  };
}

export function calculateTrendData(scaleFactor: number): TrendItem[] {
  return BASE_TREND_DATA.map((d) => ({
    month: d.month,
    volume: Math.max(10, Math.round(d.volume * Math.min(1.5, scaleFactor * 1.2))),
    revenue: Math.max(20, Math.round(d.revenue * Math.min(1.5, scaleFactor * 1.1))),
  }));
}

export function calculatePurchasingCustData(scaleFactor: number): PurchasingCustomerMonth[] {
  const baseCust = [
    { month: '4/23', total: 800, purchasing: 370 }, { month: '5/23', total: 890, purchasing: 480 },
    { month: '6/23', total: 890, purchasing: 410 }, { month: '7/23', total: 960, purchasing: 360 },
    { month: '8/23', total: 960, purchasing: 540 }, { month: '9/23', total: 960, purchasing: 500 },
    { month: '10/23', total: 920, purchasing: 570 }, { month: '11/23', total: 920, purchasing: 470 },
    { month: '12/23', total: 1000, purchasing: 410 }, { month: '1/24', total: 1000, purchasing: 530 },
    { month: '2/24', total: 1000, purchasing: 370 }, { month: '3/24', total: 1000, purchasing: 290 },
  ];
  return baseCust.map((d) => ({
    month: d.month,
    total: Math.max(100, Math.round(d.total * Math.min(1.5, scaleFactor * 1.05))),
    purchasing: Math.max(50, Math.round(d.purchasing * Math.min(1.5, scaleFactor * 1.05))),
  }));
}

export function calculateCountryStats(regionFilter: string): CountryStat[] {
  if (regionFilter === 'North America') {
    return [
      { flag: '/images/flagUS.png', name: 'US', pct: 75, color: '#046a38' },
      { flag: '/images/flagCanada.png', name: 'Canada', pct: 25, color: '#059669' },
    ];
  }
  if (regionFilter === 'Europe') {
    return [
      { flag: '/images/flagUK.png', name: 'UK', pct: 55, color: '#34d399' },
      { flag: '/images/flagFrance.png', name: 'France', pct: 45, color: '#6ee7b7' },
    ];
  }
  if (regionFilter === 'Asia Pacific') {
    return [{ flag: '/images/flagChina.png', name: 'China', pct: 80, color: '#10b981' }];
  }
  return [
    { flag: '/images/flagUS.png', name: 'US', pct: 60, color: '#046a38' },
    { flag: '/images/flagCanada.png', name: 'Canada', pct: 40, color: '#059669' },
    { flag: '/images/flagChina.png', name: 'China', pct: 30, color: '#10b981' },
    { flag: '/images/flagUK.png', name: 'UK', pct: 20, color: '#34d399' },
    { flag: '/images/flagFrance.png', name: 'France', pct: 10, color: '#6ee7b7' },
  ];
}

export function calculateChannelPercentages(selectedCountry: string | null, region: string, product: string): ChannelPercentages {
  if (selectedCountry === 'US') return { retail: 64.0, online: 36.0 };
  if (selectedCountry === 'Canada') return { retail: 58.0, online: 42.0 };
  if (selectedCountry === 'China') return { retail: 72.0, online: 28.0 };
  if (selectedCountry === 'UK') return { retail: 55.0, online: 45.0 };
  if (selectedCountry === 'France') return { retail: 48.0, online: 52.0 };
  if (region === 'Europe') return { retail: 55.0, online: 45.0 };
  if (region === 'North America') return { retail: 68.0, online: 32.0 };
  if (region === 'Asia Pacific') return { retail: 72.0, online: 28.0 };
  if (product === 'Software SaaS') return { retail: 72.5, online: 27.5 };
  if (product === 'Hardware Equipment') return { retail: 55.0, online: 45.0 };
  return { retail: 61.8, online: 38.2 };
}

export function calculateCustomerAnalysisStats(scaleFactor: number, customer: string, country: string | null, product: string): CustomerAnalysisStats {
  const totalCust = Math.round(1200 * scaleFactor);
  let retention = 76.15;
  if (customer === 'Enterprise') retention = 84.50;
  else if (customer === 'Mid-Market') retention = 72.80;
  else if (customer === 'Small Business (SMB)') retention = 65.20;
  if (country === 'US') retention = 78.20;
  else if (country === 'China') retention = 81.10;

  let onlinePct = 95.0;
  if (product === 'Hardware Equipment') onlinePct = 82.0;
  else if (product === 'Software SaaS') onlinePct = 98.5;

  let repeatPct = 42.1, oneTimePct = 34.3, nonPurchasingPct = 23.6;
  if (customer === 'Enterprise') { repeatPct = 58.2; oneTimePct = 28.5; nonPurchasingPct = 13.3; }
  else if (customer === 'Small Business (SMB)') { repeatPct = 31.0; oneTimePct = 41.5; nonPurchasingPct = 27.5; }

  return {
    totalCust, retentionStr: retention.toFixed(2), acquisition: (100 - retention).toFixed(2),
    onlinePct, repeatPct, oneTimePct, nonPurchasingPct,
  };
}

export function calculateProductPreferences(scaleFactor: number): ProductPreference[] {
  return [
    { rank: 'TOP.1', name: 'Product name 1', qty: Math.round(2647 * scaleFactor) },
    { rank: 'TOP.2', name: 'Product 2', qty: Math.round(2280 * scaleFactor) },
    { rank: 'TOP.3', name: 'Product 3', qty: Math.round(1849 * scaleFactor) },
    { rank: 'TOP.4', name: 'Product 4', qty: Math.round(1352 * scaleFactor) },
    { rank: 'TOP.5', name: 'Product 5', qty: Math.round(835 * scaleFactor) },
    { rank: 'TOP.6', name: 'Product 6', qty: Math.round(647 * scaleFactor) },
    { rank: 'TOP.7', name: 'Product 7', qty: Math.round(635 * scaleFactor) },
    { rank: 'TOP.8', name: 'Product 8', qty: Math.round(578 * scaleFactor) },
    { rank: 'TOP.9', name: 'Product 9', qty: Math.round(509 * scaleFactor) },
    { rank: 'TOP.10', name: 'Product 10', qty: Math.round(356 * scaleFactor) },
  ];
}

export function exportSalesReportCsv(metrics: SalesMetrics, custAnalysis: CustomerAnalysisStats, region: string, country: string | null) {
  const headers = ['Metric', 'Value', 'Growth %'];
  const rows = [
    ['Total Sales', `$${metrics.totalSales.toLocaleString()}`, `${metrics.salesInc}%`],
    ['Total Sales Quantity', `${metrics.totalQty.toLocaleString()} units`, `${metrics.qtyInc}%`],
    ['Average Sales', `$${metrics.avgSales.toLocaleString()}`, `${metrics.salesInc}%`],
    ['Average Sales Quantity', `${metrics.avgQty.toLocaleString()} units`, `${metrics.qtyInc}%`],
    ['Total Customers', `${custAnalysis.totalCust.toLocaleString()}`, '-'],
    ['Customer Retention', `${custAnalysis.retentionStr}%`, '+1.2%'],
    ['New Acquisition', `${custAnalysis.acquisition}%`, '+2.4%'],
    ['Filter Region', region, '-'],
    ['Selected Country', country || 'All', '-'],
  ];
  const csvString = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `sales_report_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
