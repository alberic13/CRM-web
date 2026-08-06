'use client';

import { useEffect, useState } from 'react';
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

export default function OpportunitiesPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(['113', '114']);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [revenue, setRevenue] = useState(15000);
  const [status, setStatus] = useState<'Pending' | 'Won' | 'InProgress' | 'Lost'>('Pending');
  const [expCloseDate, setExpCloseDate] = useState('2024-04-14');
  const [ownerName, setOwnerName] = useState('Lucy Tan');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            expCloseDate: new Date(o.expCloseDate).toLocaleDateString(),
            customerName: o.customerName,
            ownerName: o.ownerName,
            creationDate: new Date(o.creationDate).toLocaleDateString(),
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

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === opportunities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(opportunities.map((o) => o.id));
    }
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

      setIsModalOpen(false);
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
      <Sidebar activeMenu="Sales" />

      <div className={styles.mainContent}>
        <Header user={user} />

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
              onClick={() => setIsModalOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>+ ADD OPPORTUNITY</span>
            </button>
          </div>

          {/* Main Card */}
          <div className={styles.cardBox}>
            {/* Filter & Action Controls Bar */}
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <select className={styles.selectInput} defaultValue="Last 1 Month">
                  <option value="Last 1 Month">📅 Last 1 Month</option>
                  <option value="Last 3 Months">📅 Last 3 Months</option>
                  <option value="Last 6 Months">📅 Last 6 Months</option>
                </select>

                <select className={styles.selectInput} defaultValue="All">
                  <option value="All">State: All</option>
                  <option value="Pending">Pending</option>
                  <option value="Won">Won</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Lost">Lost</option>
                </select>

                <button className={styles.filterIconBtn}>
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

                <button className={styles.bulkBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>BULK DELETE</span>
                </button>

                <button className={styles.bulkBtn}>
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
                      checked={selectedIds.length === opportunities.length}
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
                </tr>
              </thead>
              <tbody>
                {opportunities.map((item) => {
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
                      <td>{item.expCloseDate}</td>
                      <td>{item.customerName}</td>
                      <td>{item.ownerName}</td>
                      <td>{item.creationDate}</td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>{item.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table Footer Pagination */}
            <div className={styles.tableFooter}>
              <div>Total items: 356</div>
              <div className={styles.paginationControls}>
                <span>Items per page: 10</span>
                <span>Total pages: 40</span>
                <div className={styles.pageNumbers}>
                  <button className={styles.arrowBtn}>&lt;</button>
                  <button className={`${styles.pageBtn} ${styles.activePageBtn}`}>1</button>
                  <button className={styles.pageBtn}>2</button>
                  <button className={styles.pageBtn}>3</button>
                  <button className={styles.pageBtn}>4</button>
                  <button className={styles.pageBtn}>5</button>
                  <button className={styles.arrowBtn}>&gt;</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Opportunity Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Add New Opportunity</h2>

            <form onSubmit={handleAddOpportunity} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Opportunity / Deal Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Project Alpha Suite"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Customer / Company Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Tau Corporation"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Estimated Revenue ($)</label>
                <input
                  type="number"
                  required
                  className={styles.input}
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Deal Status</label>
                <select
                  className={styles.input}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="Pending">Pending</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Won">Won</option>
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
                <label className={styles.label}>Owner / Sales Agent</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Additional Notes</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Proposal submitted"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.primaryBtn}
                >
                  {isSubmitting ? 'Saving...' : 'Save Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
