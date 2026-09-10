'use client';

import { useState, useEffect, useCallback } from 'react';
import { Customer, CustomerFormData } from './customers.types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (regionFilter !== 'All') params.append('region', regionFilter);
    if (statusFilter !== 'All') params.append('status', statusFilter);

    fetch(`/api/customers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.customers) setCustomers(data.customers);
      })
      .catch(() => {});
  }, [search, regionFilter, statusFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  async function addCustomer(payload: CustomerFormData) {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to add customer');
    setIsModalOpen(false);
    fetchCustomers();
  }

  function exportCsv() {
    if (!customers.length) return;
    const headers = ['Customer No', 'Customer Name', 'Contact Email', 'Region', 'Last Purchase', 'Source', 'Status', 'Created At'];
    const rows = customers.map((c) => [
      `="${c.customerNo}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${c.region || ''}"`,
      `="${new Date(c.lastPurchase).toLocaleDateString()}"`,
      `"${c.source || ''}"`,
      `"${c.status || ''}"`,
      `="${new Date(c.createdAt || c.lastPurchase).toLocaleDateString()}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_customers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    customers,
    search, setSearch,
    regionFilter, setRegionFilter,
    statusFilter, setStatusFilter,
    isModalOpen, setIsModalOpen,
    addCustomer,
    exportCsv,
  };
}
