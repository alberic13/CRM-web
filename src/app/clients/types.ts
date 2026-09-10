export interface ClientItem {
  id: string;
  name: string;
  industry: string;
  region: string;
  tier: string;
}

export interface SalesCustomer {
  id: string;
  name: string;
  email?: string;
  region?: string;
}

export interface ClientFilters {
  search: string;
  tier: string;
  region: string;
}

export interface NewClientFormData {
  name: string;
  industry: string;
  region: string;
  tier: string;
}
