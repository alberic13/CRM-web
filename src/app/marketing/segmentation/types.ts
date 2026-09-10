export interface CustomerRow {
  id: string;
  customerNo: string;
  name: string;
  age: number;
  region: string;
  purchaseNum: number;
  source: 'Online' | 'Retail';
  state: 'Loyal' | 'New' | 'Lost';
  lastPurchase: string;
  firstPurchase: string;
}

export interface SegmentationFilters {
  customerType: string;
  region: string;
  state: string;
  age: string;
}

export interface SegmentationMetrics {
  totalCust: number;
  newCust: number;
  loyalCust: number;
  lostCust: number;
}

export interface SourceStats {
  onlinePct: string;
  retailPct: string;
  onlineDash: string;
  circum: number;
}

export interface AgeStats {
  p0_20: string;
  p21_30: string;
  p31_40: string;
  p41_50: string;
  pOver50: string;
}

export interface BehaviorLineRow {
  y: number;
  fullRange: { x1: number; x2: number };
  midRange: { x1: number; x2: number };
  coreRange: { x1: number; x2: number };
}

export interface NewCustomerFormData {
  name: string;
  email: string;
  age: number;
  region: string;
  source: 'Online' | 'Retail';
  state: 'Loyal' | 'New' | 'Lost';
}
