export interface OpportunityItem {
  id: string;
  opportunityNo: string;
  name: string;
  status: 'Pending' | 'Won' | 'InProgress' | 'Lost';
  revenue: number;
  expCloseDate: string;
  customerName: string;
  ownerName: string;
  creationDate: string;
  notes: string;
}

export interface OpportunityFilters {
  time: 'Last 1 Month' | 'Last 3 Months' | 'Last 6 Months';
  status: string;
  search: string;
}

export interface NewOpportunityFormData {
  name: string;
  customerName: string;
  revenue: number;
  status: OpportunityItem['status'];
  expCloseDate: string;
  ownerName: string;
  notes: string;
}
