'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ClientItem, SalesCustomer, ClientFilters, NewClientFormData } from './types';
import { DEFAULT_SALES_CUSTOMERS, exportClientsToCsv } from './clientData';

export function useClients() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [salesCustomers, setSalesCustomers] = useState<SalesCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ClientFilters>({ search: '', tier: 'All', region: 'All' });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (data.clients) setClients(data.clients);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.clients) setClients(data.clients);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load clients:', err);
        if (!ignore) setIsLoading(false);
      });

    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setSalesCustomers(data.customers?.length ? data.customers : DEFAULT_SALES_CUSTOMERS);
        }
      })
      .catch(() => {
        if (!ignore) setSalesCustomers(DEFAULT_SALES_CUSTOMERS);
      });

    return () => { ignore = true; };
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (filters.tier !== 'All' && c.tier !== filters.tier) return false;
      if (filters.region !== 'All' && c.region !== filters.region) return false;
      if (filters.search.trim() !== '') {
        const q = filters.search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.industry.toLowerCase().includes(q) && !c.region.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [clients, filters]);

  const setFilter = (key: keyof ClientFilters, val: string) => setFilters((prev) => ({ ...prev, [key]: val }));

  const handleAddClient = async (data: NewClientFormData) => {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.message || 'Failed to save client.');
      return false;
    }
    await fetchClients();
    setIsAddModalOpen(false);
    return true;
  };

  const handleEditClient = async (updated: ClientItem) => {
    const res = await fetch(`/api/clients/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: updated.name, industry: updated.industry, region: updated.region, tier: updated.tier }),
    });
    if (!res.ok) { alert('Failed to update client.'); return false; }
    await fetchClients();
    setIsEditModalOpen(false);
    setEditingClient(null);
    return true;
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete client "${name}"?`)) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) { alert('Failed to delete client.'); return; }
      await fetchClients();
    } catch {
      alert('An error occurred while deleting the client.');
    }
  };

  const handleExport = () => {
    if (filteredClients.length === 0) { alert('No client data available to export.'); return; }
    exportClientsToCsv(filteredClients);
  };

  return {
    clients, salesCustomers, isLoading, filters, setFilter, filteredClients,
    isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen,
    editingClient, setEditingClient, handleAddClient, handleEditClient, handleDeleteClient, handleExport,
  };
}
