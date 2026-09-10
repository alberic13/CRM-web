export type CustomerStatus = 'Loyal' | 'New' | 'Lost';

export interface Customer {
  id: string;
  customerNo: string;
  name: string;
  email: string;
  region: string;
  source: string;
  status: CustomerStatus;
  lastPurchase: string;
  createdAt: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  region: string;
  source: string;
  status: CustomerStatus;
}
