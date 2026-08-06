'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './customers.module.css';

interface Customer {
  id: string;
  customerNo: string;
  name: string;
  email: string;
  region: string;
  source: string;
  status: 'Loyal' | 'New' | 'Lost';
  lastPurchase: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('North America');
  const [source, setSource] = useState('Online');
  const [status, setStatus] = useState<'Loyal' | 'New' | 'Lost'>('New');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (regionFilter !== 'All') params.append('region', regionFilter);
    if (statusFilter !== 'All') params.append('status', statusFilter);

    fetch(`/api/customers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.customers) setCustomers(data.customers);
      })
      .catch((err) => console.error('Error loading customers:', err));
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [search, regionFilter, statusFilter]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, region, source, status }),
      });

      if (!res.ok) throw new Error('Failed to add customer');

      setIsModalOpen(false);
      setName('');
      setEmail('');
      fetchCustomers();
    } catch (err) {
      alert('An error occurred while adding customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Customers" />

      <div className={styles.mainContent}>
        <Header user={user} />

        <main className={styles.contentBody}>
          {/* Top Title & Actions */}
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Sales Customers</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Sales</span> &gt; <strong>Customers</strong>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.primaryBtn}
                onClick={() => setIsModalOpen(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>ADD CUSTOMER</span>
              </button>

              <button className={styles.secondaryBtn}>EXPORT</button>
            </div>
          </div>

          {/* Customer Table Container */}
          <div className={styles.cardBox}>
            {/* Filter & Search Bar */}
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <select
                  className={styles.selectInput}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">Customer Status: All</option>
                  <option value="Loyal">Loyal</option>
                  <option value="New">New</option>
                  <option value="Lost">Lost</option>
                </select>

                <select
                  className={styles.selectInput}
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="All">Region: All</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                </select>
              </div>

              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search name, email, No..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Customer Name</th>
                  <th>Contact Email</th>
                  <th>Region</th>
                  <th>Last Purchase</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className={styles.customerNo}>{c.customerNo}</td>
                    <td className={styles.customerName}>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.region}</td>
                    <td>{new Date(c.lastPurchase).toLocaleDateString()}</td>
                    <td>{c.source}</td>
                    <td>
                      <span
                        className={
                          c.status === 'Loyal'
                            ? styles.badgeLoyal
                            : c.status === 'New'
                            ? styles.badgeNew
                            : styles.badgeLost
                        }
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.tableFooter}>
              <div>Total Items: {customers.length}</div>
              <div>Showing Page 1 of 1</div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Add New Customer</h2>

            <form onSubmit={handleAddCustomer} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Company / Customer Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Contact Email</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="info@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Region</label>
                <select
                  className={styles.input}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Source</label>
                <select
                  className={styles.input}
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="Online">Online</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.input}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="New">New</option>
                  <option value="Loyal">Loyal</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.primaryBtn}
                >
                  {isSubmitting ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
