'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CustomerRow, SegmentationFilters, NewCustomerFormData } from './types';
import {
  DEFAULT_CUSTOMERS_DATA,
  calculateSegmentationMetrics,
  calculateSourceStats,
  calculateAgeStats,
  generateBehaviorLineRows,
  exportCustomersToCsv,
} from './segmentationData';

interface RawCustomerApi {
  id: string;
  customerNo?: string;
  name: string;
  age?: number;
  region?: string;
  purchaseNum?: number;
  source?: string;
  status?: string;
  lastPurchase?: string;
  createdAt?: string;
}

export function useSegmentation() {
  const [dbCustomers, setDbCustomers] = useState<CustomerRow[]>([]);
  const [filters, setFilters] = useState<SegmentationFilters>({
    customerType: 'All', region: 'All', state: 'All', age: 'All',
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCustomers = useCallback(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.customers && Array.isArray(data.customers)) {
          const mapped: CustomerRow[] = data.customers.map((c: RawCustomerApi) => ({
            id: c.id,
            customerNo: c.customerNo || Math.floor(10000 + Math.random() * 90000).toString(),
            name: c.name,
            age: c.age || 32,
            region: c.region || 'North America',
            purchaseNum: c.purchaseNum || 1,
            source: (c.source === 'Retail' ? 'Retail' : 'Online') as 'Online' | 'Retail',
            state: (c.status || 'New') as 'Loyal' | 'New' | 'Lost',
            lastPurchase: c.lastPurchase ? new Date(c.lastPurchase).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
            firstPurchase: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
          }));
          setDbCustomers(mapped);
        }
      })
      .catch((err) => console.error('Fetch customers error:', err));
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const customersData = useMemo(() => {
    const combined = [...dbCustomers, ...DEFAULT_CUSTOMERS_DATA];
    const uniqueMap = new Map<string, CustomerRow>();
    combined.forEach((item) => {
      if (!uniqueMap.has(item.customerNo)) uniqueMap.set(item.customerNo, item);
    });
    return Array.from(uniqueMap.values());
  }, [dbCustomers]);

  const filteredCustomers = useMemo(() => {
    return customersData.filter((c) => {
      if (filters.customerType !== 'All' && c.state !== filters.customerType) return false;
      if (filters.region !== 'All' && c.region !== filters.region) return false;
      if (filters.state !== 'All' && c.source !== filters.state) return false;
      if (filters.age !== 'All') {
        if (filters.age === '0-20' && c.age > 20) return false;
        if (filters.age === '21-30' && (c.age < 21 || c.age > 30)) return false;
        if (filters.age === '31-40' && (c.age < 31 || c.age > 40)) return false;
        if (filters.age === '41-50' && (c.age < 41 || c.age > 50)) return false;
        if (filters.age === '>50' && c.age <= 50) return false;
      }
      return true;
    });
  }, [customersData, filters]);

  const metrics = useMemo(() => calculateSegmentationMetrics(filteredCustomers.length, customersData.length), [filteredCustomers.length, customersData.length]);
  const sourceStats = useMemo(() => calculateSourceStats(filteredCustomers), [filteredCustomers]);
  const ageStats = useMemo(() => calculateAgeStats(filteredCustomers, customersData.length), [filteredCustomers, customersData.length]);
  const behaviorLineRows = useMemo(() => generateBehaviorLineRows(filters.age), [filters.age]);

  const toggleSelect = (id: string) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === filteredCustomers.length ? [] : filteredCustomers.map((c) => c.id));
  const resetFilters = () => { setFilters({ customerType: 'All', region: 'All', state: 'All', age: 'All' }); setSelectedIds([]); };

  const handleBulkExport = () => {
    const list = selectedIds.length > 0 ? customersData.filter((c) => selectedIds.includes(c.id)) : filteredCustomers;
    exportCustomersToCsv(list);
  };

  const handleAddCustomer = async (data: NewCustomerFormData) => {
    const email = data.email.trim() || `${data.name.toLowerCase().replace(/\s+/g, '')}@example.com`;
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, email, region: data.region, source: data.source, status: data.state }),
    });
    if (res.ok) { setIsAddModalOpen(false); fetchCustomers(); return true; }
    alert('Failed to add customer');
    return false;
  };

  return {
    customersData, filteredCustomers, filters, setFilters, selectedIds, metrics, sourceStats, ageStats, behaviorLineRows,
    isAddModalOpen, setIsAddModalOpen, toggleSelect, toggleSelectAll, resetFilters, handleBulkExport, handleAddCustomer,
  };
}
