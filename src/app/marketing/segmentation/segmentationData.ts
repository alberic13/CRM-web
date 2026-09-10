import { CustomerRow, SegmentationMetrics, SourceStats, AgeStats, BehaviorLineRow } from './types';

export const DEFAULT_CUSTOMERS_DATA: CustomerRow[] = [
  { id: '13846', customerNo: '13846', name: 'Bright Solutions', age: 34, region: 'North America', purchaseNum: 5, source: 'Online', state: 'Loyal', lastPurchase: '4/14/2024', firstPurchase: '3/21/2024' },
  { id: '98745', customerNo: '98745', name: 'GlobalMart', age: 23, region: 'Europe', purchaseNum: 4, source: 'Retail', state: 'Loyal', lastPurchase: '5/1/2024', firstPurchase: '3/21/2024' },
  { id: '34972', customerNo: '34972', name: 'Tech Innovations', age: 38, region: 'Asia Pacific', purchaseNum: 8, source: 'Online', state: 'Loyal', lastPurchase: '4/17/2024', firstPurchase: '3/17/2024' },
  { id: '29373', customerNo: '29373', name: 'Blue Horizon', age: 25, region: 'Europe', purchaseNum: 2, source: 'Online', state: 'New', lastPurchase: '3/29/2024', firstPurchase: '3/16/2024' },
  { id: '48759', customerNo: '48759', name: 'BestBuyer', age: 41, region: 'North America', purchaseNum: 1, source: 'Online', state: 'New', lastPurchase: '6/11/2024', firstPurchase: '3/7/2024' },
  { id: '18673', customerNo: '18673', name: 'Alpha Solutions', age: 42, region: 'Asia Pacific', purchaseNum: 1, source: 'Retail', state: 'New', lastPurchase: '4/14/2024', firstPurchase: '3/1/2024' },
  { id: '13978', customerNo: '13978', name: 'Prime Goods', age: 29, region: 'North America', purchaseNum: 4, source: 'Online', state: 'Loyal', lastPurchase: '5/4/2024', firstPurchase: '2/27/2024' },
  { id: '16483', customerNo: '16483', name: 'Wise Shoppers', age: 35, region: 'Europe', purchaseNum: 1, source: 'Online', state: 'New', lastPurchase: '7/10/2024', firstPurchase: '2/21/2024' },
  { id: '24567', customerNo: '24567', name: 'Quick Solutions', age: 38, region: 'Asia Pacific', purchaseNum: 5, source: 'Online', state: 'Loyal', lastPurchase: '4/14/2024', firstPurchase: '2/19/2024' },
  { id: '23565', customerNo: '23565', name: 'Visionary Tech', age: 53, region: 'Europe', purchaseNum: 2, source: 'Retail', state: 'Lost', lastPurchase: '6/14/2022', firstPurchase: '2/19/2024' },
];

export function calculateSegmentationMetrics(filteredCount: number, totalCount: number): SegmentationMetrics {
  const scaleFactor = Math.max(0.1, filteredCount / (totalCount || 1));
  return {
    totalCust: Math.round(1090 * scaleFactor),
    newCust: Math.round(26 * scaleFactor),
    loyalCust: Math.round(158 * scaleFactor),
    lostCust: Math.max(1, Math.round(11 * scaleFactor)),
  };
}

export function calculateSourceStats(filteredCustomers: CustomerRow[]): SourceStats {
  const onlineCount = filteredCustomers.filter((c) => c.source === 'Online').length;
  const total = filteredCustomers.length || 1;
  const onlinePct = ((onlineCount / total) * 100).toFixed(1);
  const retailPct = (100 - parseFloat(onlinePct)).toFixed(1);
  const circum = 238.7;
  const onlineDash = ((parseFloat(onlinePct) / 100) * circum).toFixed(1);
  return { onlinePct, retailPct, onlineDash, circum };
}

export function calculateAgeStats(filteredCustomers: CustomerRow[], totalOriginalCount: number): AgeStats {
  if (filteredCustomers.length === totalOriginalCount) {
    return { p0_20: '13.4', p21_30: '19.8', p31_40: '35.4', p41_50: '22.2', pOver50: '9.2' };
  }
  let c0 = 0, c21 = 0, c31 = 0, c41 = 0, cOver = 0;
  filteredCustomers.forEach((c) => {
    if (c.age <= 20) c0++;
    else if (c.age <= 30) c21++;
    else if (c.age <= 40) c31++;
    else if (c.age <= 50) c41++;
    else cOver++;
  });
  const total = filteredCustomers.length || 1;
  return {
    p0_20: ((c0 / total) * 100).toFixed(1),
    p21_30: ((c21 / total) * 100).toFixed(1),
    p31_40: ((c31 / total) * 100).toFixed(1),
    p41_50: ((c41 / total) * 100).toFixed(1),
    pOver50: ((cOver / total) * 100).toFixed(1),
  };
}

export function generateBehaviorLineRows(ageFilter: string): BehaviorLineRow[] {
  const ageOffset = ageFilter === '21-30' ? -4 : ageFilter === '41-50' ? 4 : 0;
  const ageToX = (age: number) => 45 + (age / 60) * 240;
  return Array.from({ length: 14 }).map((_, i) => ({
    y: 138 - i * 8.3,
    fullRange: { x1: ageToX(18 + i * 1.1 + ageOffset), x2: ageToX(56 - i * 1.0 + ageOffset) },
    midRange: { x1: ageToX(24 + i * 0.7 + ageOffset), x2: ageToX(48 - i * 0.6 + ageOffset) },
    coreRange: { x1: ageToX(29 + i * 0.4 + ageOffset), x2: ageToX(41 - i * 0.2 + ageOffset) },
  }));
}

export function exportCustomersToCsv(list: CustomerRow[]): void {
  const headers = ['Customer No', 'Name', 'Age', 'Region', 'Purchase Num', 'Source', 'State', 'Last Purchase', 'First Purchase'];
  const rows = list.map((c) => [
    c.customerNo, c.name, c.age, c.region, c.purchaseNum, c.source, c.state, c.lastPurchase, c.firstPurchase,
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `customer_segmentation_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
