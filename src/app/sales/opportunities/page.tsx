'use client';

import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './opportunities.module.css';

interface OpportunityItem {
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

// Helper to format dates for web table display (M/D/YYYY)
const formatDateForDisplay = (dateInput: any): string => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

// Helper to format dates for Excel Export (forces text formula `=" M/D/YYYY "` so Excel NEVER displays `#####`)
const formatDateForExcelCsv = (dateInput: any): string => {
  if (!dateInput) return '"-"';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return `=" ${String(dateInput)} "`;
  const formatted = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  return `=" ${formatted} "`;
};

export default function OpportunitiesPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);

  // Filter States
  const [timeFilter, setTimeFilter] = useState<'Last 1 Month' | 'Last 3 Months' | 'Last 6 Months'>('Last 1 Month');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [revenue, setRevenue] = useState(15000);
  const [status, setStatus] = useState<'Pending' | 'Won' | 'InProgress' | 'Lost'>('Pending');
  const [expCloseDate, setExpCloseDate] = useState('2024-04-14');
  const [ownerName, setOwnerName] = useState('Lucy Tan');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OpportunityItem | null>(null);

  const defaultOpportunities: OpportunityItem[] = [
    { id: '110', opportunityNo: '110', name: 'Project Theta', status: 'Pending', revenue: 23000, expCloseDate: '4/14/2024', customerName: 'Tau Corporation', ownerName: 'Lucy Tan', creationDate: '3/21/2024', notes: 'Proposal submitted' },
    { id: '111', opportunityNo: '111', name: 'Deal Beta', status: 'Won', revenue: 25000, expCloseDate: '5/1/2024', customerName: 'Tau Corporation', ownerName: 'Lucy Tan', creationDate: '3/21/2024', notes: 'Deal finalized' },
    { id: '112', opportunityNo: '112', name: 'Project Omega', status: 'InProgress', revenue: 14000, expCloseDate: '4/17/2024', customerName: 'Pi Enterprises', ownerName: 'Andy Chen', creationDate: '3/17/2024', notes: 'Discussing terms' },
    { id: '113', opportunityNo: '113', name: 'Deal Gamma', status: 'Lost', revenue: 0, expCloseDate: '3/29/2024', customerName: 'Xi Group', ownerName: 'Mary Foo', creationDate: '3/16/2024', notes: 'Decision postponed' },
    { id: '114', opportunityNo: '114', name: 'Deal Alpha', status: 'Pending', revenue: 22000, expCloseDate: '6/11/2024', customerName: 'Lambda Ltd', ownerName: 'Andy Chen', creationDate: '3/7/2024', notes: 'Sending proposal' },
    { id: '115', opportunityNo: '115', name: 'Project Theta', status: 'Pending', revenue: 23000, expCloseDate: '4/14/2024', customerName: 'Tau Corporation', ownerName: 'Lucy Tan', creationDate: '3/1/2024', notes: 'Proposal submitted' },
    { id: '116', opportunityNo: '116', name: 'Deal XYZ', status: 'Pending', revenue: 23000, expCloseDate: '5/4/2024', customerName: 'Delta Industries', ownerName: 'Peter Wu', creationDate: '2/27/2024', notes: 'Budget constraints' },
    { id: '117', opportunityNo: '117', name: 'Project Theta', status: 'InProgress', revenue: 13000, expCloseDate: '7/10/2024', customerName: 'Iota Corporation', ownerName: 'Lucy Tan', creationDate: '2/21/2024', notes: 'Sent follow-up email' },
    { id: '118', opportunityNo: '118', name: 'Deal XYZ', status: 'InProgress', revenue: 16000, expCloseDate: '4/14/2024', customerName: 'Big Company Ltd', ownerName: 'Peter Wu', creationDate: '2/19/2024', notes: 'Proposal submitted' },
    { id: '119', opportunityNo: '119', name: 'Project Theta', status: 'Pending', revenue: 3000, expCloseDate: '6/14/2024', customerName: 'Tau Corporation', ownerName: 'Lucy Tan', creationDate: '2/19/2024', notes: 'Sent follow-up email' },
    { id: '120', opportunityNo: '120', name: 'Enterprise SaaS Renewal', status: 'Won', revenue: 45000, expCloseDate: '8/12/2024', customerName: 'Apex Innovations', ownerName: 'Lucy Tan', creationDate: '1/15/2024', notes: 'Multi-year contract signed' },
    { id: '121', opportunityNo: '121', name: 'Cloud Migration Pilot', status: 'InProgress', revenue: 18500, expCloseDate: '9/1/2024', customerName: 'Nexus Global', ownerName: 'Andy Chen', creationDate: '1/10/2024', notes: 'Proof of concept stage' },
  ];

  const fetchOpportunities = () => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.opportunities && resData.opportunities.length > 0) {
          const formatted = resData.opportunities.map((o: any) => ({
            id: o.opportunityNo || o.id,
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
          setOpportunities(defaultOpportunities);
        }
      })
      .catch(() => setOpportunities(defaultOpportunities));
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.user) setUser(resData.user);
      });

    fetchOpportunities();
  }, []);

  // Real-time Computed Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== 'All') {
        if (item.status !== statusFilter) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchCustomer = item.customerName.toLowerCase().includes(query);
        const matchOwner = item.ownerName.toLowerCase().includes(query);
        const matchNo = item.opportunityNo.toLowerCase().includes(query);
        if (!matchName && !matchCustomer && !matchOwner && !matchNo) return false;
      }

      return true;
    });
  }, [opportunities, statusFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredOpportunities.length / pageSize));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOpportunities.slice(start, start + pageSize);
  }, [filteredOpportunities, currentPage, pageSize]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map((o) => o.id));
    }
  };

  // Single Item Delete
  const handleDeleteItem = (id: string, oppName: string) => {
    if (confirm(`Are you sure you want to delete opportunity "${oppName}"?`)) {
      setOpportunities(opportunities.filter((o) => o.id !== id));
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  // Single Item Edit Trigger
  const handleEditClick = (item: OpportunityItem) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  // Single Item Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setOpportunities(opportunities.map((o) => (o.id === editingItem.id ? editingItem : o)));
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least 1 item to delete.');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected opportunity items?`)) {
      setOpportunities(opportunities.filter((o) => !selectedIds.includes(o.id)));
      setSelectedIds([]);
    }
  };

  // Excel CSV Bulk Export with Text Formula `=" M/D/YYYY "` so Excel NEVER displays `#####`
  const handleBulkExport = () => {
    const targetItems = selectedIds.length > 0 
      ? opportunities.filter((o) => selectedIds.includes(o.id))
      : filteredOpportunities;

    if (targetItems.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = ['No.', 'Opportunity Name', 'Status', 'Revenue', 'Exp Close Date', 'Customer', 'Owner', 'Creation Date', 'Notes'];
    const rows = targetItems.map((o) => [
      o.opportunityNo,
      `"${o.name.replace(/"/g, '""')}"`,
      o.status,
      o.revenue,
      formatDateForExcelCsv(o.expCloseDate),
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.ownerName.replace(/"/g, '""')}"`,
      formatDateForExcelCsv(o.creationDate),
      `"${(o.notes || '-').replace(/"/g, '""')}"`,
    ]);

    // Include UTF-8 Byte Order Mark (\uFEFF) for Excel Compatibility
    const csvString = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `opportunities_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          status,
          revenue: Number(revenue),
          expCloseDate,
          customerName,
          ownerName,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to add opportunity');

      setIsAddModalOpen(false);
      setName('');
      setCustomerName('');
      setNotes('');
      fetchOpportunities();
    } catch {
      alert('An error occurred while adding opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Sales" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className={styles.contentBody}>
          {/* Top Title & Header */}
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Sales</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Sales</span> &gt; <strong>Opportunities</strong>
              </div>
            </div>

            <button
              className={styles.primaryBtn}
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>ADD OPPORTUNITY</span>
            </button>
          </div>

          {/* Main Card */}
          <div className={styles.cardBox}>
            {/* Filter & Action Controls Bar */}
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                {/* Time Filter Select */}
                <select
                  className={styles.selectInput}
                  value={timeFilter}
                  onChange={(e) => {
                    setTimeFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                >
                  <option value="Last 1 Month">📅 Last 1 Month</option>
                  <option value="Last 3 Months">📅 Last 3 Months</option>
                  <option value="Last 6 Months">📅 Last 6 Months</option>
                </select>

                {/* State Status Select */}
                <select
                  className={styles.selectInput}
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">State: All</option>
                  <option value="Pending">Pending</option>
                  <option value="Won">Won</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Lost">Lost</option>
                </select>

                {/* Search Input Box */}
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />

                {/* Reset Filters Icon Button */}
                <button
                  className={styles.filterIconBtn}
                  title="Reset Filters"
                  onClick={() => {
                    setStatusFilter('All');
                    setTimeFilter('Last 1 Month');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </button>
              </div>

              {/* Bulk Actions */}
              <div className={styles.bulkActionGroup}>
                <span className={styles.selectedCountText}>
                  {selectedIds.length} Item selected
                </span>

                <button className={styles.bulkBtn} onClick={handleBulkDelete}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>BULK DELETE</span>
                </button>

                <button className={styles.bulkBtn} onClick={handleBulkExport}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>BULK EXPORT</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={currentItems.length > 0 && selectedIds.length === currentItems.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>No.</th>
                  <th>Opportunity Name</th>
                  <th>
                    <span className={styles.sortHeader}>
                      Status <span className={styles.sortIcon}>⇕</span>
                    </span>
                  </th>
                  <th>Revenue</th>
                  <th>
                    <span className={styles.sortHeader}>
                      Exp. Close Date <span className={styles.sortIcon}>⇕</span>
                    </span>
                  </th>
                  <th>Customers</th>
                  <th>Owner</th>
                  <th>
                    <span className={styles.sortHeader}>
                      Creation Date <span className={styles.sortIcon}>⇕</span>
                    </span>
                  </th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                      No opportunities found matching your filters.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr key={item.id} className={isSelected ? styles.selectedRow : ''}>
                        <td>
                          <input
                            type="checkbox"
                            className={styles.checkboxInput}
                            checked={isSelected}
                            onChange={() => toggleSelect(item.id)}
                          />
                        </td>
                        <td className={styles.oppNo}>{item.opportunityNo}</td>
                        <td className={styles.oppName}>{item.name}</td>
                        <td>
                          <span
                            className={
                              item.status === 'Pending'
                                ? styles.badgePending
                                : item.status === 'Won'
                                ? styles.badgeWon
                                : item.status === 'InProgress'
                                ? styles.badgeInProgress
                                : styles.badgeLost
                            }
                          >
                            {item.status === 'InProgress' ? 'In Progress' : item.status}
                          </span>
                        </td>
                        <td className={styles.revenueText}>${item.revenue.toLocaleString()}</td>
                        <td>{formatDateForDisplay(item.expCloseDate)}</td>
                        <td>{item.customerName}</td>
                        <td>{item.ownerName}</td>
                        <td>{formatDateForDisplay(item.creationDate)}</td>
                        <td style={{ color: '#64748b', fontSize: '13px' }}>{item.notes}</td>
                        <td>
                          <div className={styles.actionGroup}>
                            {/* Edit Icon Button */}
                            <button
                              className={styles.editBtn}
                              title="Edit Opportunity"
                              onClick={() => handleEditClick(item)}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>

                            {/* Delete Icon Button */}
                            <button
                              className={styles.deleteBtn}
                              title="Delete Opportunity"
                              onClick={() => handleDeleteItem(item.id, item.name)}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Table Footer Pagination */}
            <div className={styles.tableFooter}>
              <div>Total items: {filteredOpportunities.length}</div>
              <div className={styles.paginationControls}>
                <span>Items per page: {pageSize}</span>
                <span>Total pages: {totalPages}</span>
                <div className={styles.pageNumbers}>
                  <button
                    className={styles.arrowBtn}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  >
                    &lt;
                  </button>
                  <button className={`${styles.pageBtn} ${styles.activePageBtn}`}>
                    {currentPage}
                  </button>
                  <button
                    className={styles.arrowBtn}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Opportunity Modal */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Add New Opportunity</h2>

            <form onSubmit={handleAddOpportunity} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Opportunity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project Theta"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tau Corporation"
                  className={styles.input}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Revenue ($)</label>
                <input
                  type="number"
                  required
                  className={styles.input}
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.input}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Won">Won</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Expected Close Date</label>
                <input
                  type="date"
                  required
                  className={styles.input}
                  value={expCloseDate}
                  onChange={(e) => setExpCloseDate(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Owner Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Proposal submitted"
                  className={styles.input}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {isEditModalOpen && editingItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Edit Opportunity #{editingItem.opportunityNo}</h2>

            <form onSubmit={handleSaveEdit} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Opportunity Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Customer Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editingItem.customerName}
                  onChange={(e) => setEditingItem({ ...editingItem, customerName: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Revenue ($)</label>
                <input
                  type="number"
                  required
                  className={styles.input}
                  value={editingItem.revenue}
                  onChange={(e) => setEditingItem({ ...editingItem, revenue: Number(e.target.value) })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.input}
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Won">Won</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Expected Close Date</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editingItem.expCloseDate}
                  onChange={(e) => setEditingItem({ ...editingItem, expCloseDate: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Owner Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editingItem.ownerName}
                  onChange={(e) => setEditingItem({ ...editingItem, ownerName: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Notes</label>
                <input
                  type="text"
                  className={styles.input}
                  value={editingItem.notes}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Update Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
