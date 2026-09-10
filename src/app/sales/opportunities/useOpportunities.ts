'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { OpportunityItem, NewOpportunityFormData } from './types';
import { DEFAULT_OPPORTUNITIES, formatDateForDisplay, exportOpportunitiesToCsv } from './opportunityData';

interface RawOpportunityApi {
  id?: string;
  opportunityNo: string;
  name: string;
  status: OpportunityItem['status'];
  revenue: number;
  expCloseDate: string;
  customerName: string;
  ownerName: string;
  creationDate: string;
  notes?: string;
}

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<'Last 1 Month' | 'Last 3 Months' | 'Last 6 Months'>('Last 1 Month');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OpportunityItem | null>(null);

  const fetchOpportunities = useCallback(() => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.opportunities && resData.opportunities.length > 0) {
          const formatted = resData.opportunities.map((o: RawOpportunityApi) => ({
            id: o.opportunityNo || o.id || '',
            opportunityNo: o.opportunityNo,
            name: o.name,
            status: o.status,
            revenue: o.revenue,
            expCloseDate: formatDateForDisplay(o.expCloseDate),
            customerName: o.customerName,
            ownerName: o.ownerName,
            creationDate: formatDateForDisplay(o.creationDate),
            notes: o.notes || '-',
          }));
          setOpportunities(formatted);
        } else {
          setOpportunities(DEFAULT_OPPORTUNITIES);
        }
      })
      .catch(() => setOpportunities(DEFAULT_OPPORTUNITIES));
  }, []);

  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const m = item.name.toLowerCase().includes(q) || item.customerName.toLowerCase().includes(q) ||
                  item.ownerName.toLowerCase().includes(q) || item.opportunityNo.toLowerCase().includes(q);
        if (!m) return false;
      }
      return true;
    });
  }, [opportunities, statusFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOpportunities.length / pageSize));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOpportunities.slice(start, start + pageSize);
  }, [filteredOpportunities, currentPage]);

  const toggleSelect = (id: string) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === currentItems.length ? [] : currentItems.map((o) => o.id));

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete opportunity "${name}"?`)) {
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) { alert('Please select at least 1 item to delete.'); return; }
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected opportunity items?`)) {
      setOpportunities((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkExport = () => {
    const targets = selectedIds.length > 0 ? opportunities.filter((o) => selectedIds.includes(o.id)) : filteredOpportunities;
    if (targets.length === 0) { alert('No data available to export.'); return; }
    exportOpportunitiesToCsv(targets);
  };

  const handleAddOpportunity = async (data: NewOpportunityFormData) => {
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add opportunity');
    setIsAddModalOpen(false);
    fetchOpportunities();
  };

  const handleSaveEdit = (updated: OpportunityItem) => {
    setOpportunities((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  return {
    opportunities, filteredOpportunities, currentItems, totalPages, currentPage, setCurrentPage,
    selectedIds, toggleSelect, toggleSelectAll, timeFilter, setTimeFilter, statusFilter, setStatusFilter,
    searchQuery, setSearchQuery, isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen,
    editingItem, setEditingItem, handleDeleteItem, handleBulkDelete, handleBulkExport, handleAddOpportunity, handleSaveEdit,
  };
}
