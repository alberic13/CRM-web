'use client';

import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './clients.module.css';

interface ClientItem {
  id: string;
  name: string;
  industry: string;
  region: string;
  tier: string;
}

interface SalesCustomer {
  id: string;
  name: string;
  email?: string;
  region?: string;
}

export default function ClientsPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [salesCustomers, setSalesCustomers] = useState<SalesCustomer[]>([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');

  // Client List State
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Client Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSalesCustomerId, setSelectedSalesCustomerId] = useState('');
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [region, setRegion] = useState('North America');
  const [tier, setTier] = useState('Enterprise Tier 1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // ── Fetch clients from DB ──────────────────────────────────
  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (data.clients) setClients(data.clients);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => { if (data.user) setUser(data.user); });

    fetchClients();

    // Fetch Sales Customers for the dropdown
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.customers && data.customers.length > 0) {
          setSalesCustomers(data.customers);
        } else {
          setSalesCustomers([
            { id: 'c1', name: 'Tau Corporation', region: 'North America' },
            { id: 'c2', name: 'Pi Enterprises', region: 'Europe' },
            { id: 'c3', name: 'GlobalMart Inc.', region: 'Europe' },
            { id: 'c4', name: 'Delta Industries', region: 'Asia Pacific' },
            { id: 'c5', name: 'Xi Group', region: 'Asia Pacific' },
            { id: 'c6', name: 'Lambda Ltd', region: 'North America' },
          ]);
        }
      })
      .catch(() => {
        setSalesCustomers([
          { id: 'c1', name: 'Tau Corporation', region: 'North America' },
          { id: 'c2', name: 'Pi Enterprises', region: 'Europe' },
          { id: 'c3', name: 'GlobalMart Inc.', region: 'Europe' },
          { id: 'c4', name: 'Delta Industries', region: 'Asia Pacific' },
        ]);
      });
  }, []);

  // ── Sales Customer Selection ──────────────────────────────
  const handleSelectSalesCustomer = (customerId: string) => {
    setSelectedSalesCustomerId(customerId);
    if (customerId === 'CUSTOM') { setClientName(''); return; }
    const found = salesCustomers.find((c) => c.id === customerId);
    if (found) {
      setClientName(found.name);
      if (found.region) setRegion(found.region);
    }
  };

  // ── Add Client → POST to API ──────────────────────────────
  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) { alert('Please enter or select a client name.'); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clientName.trim(), industry, region, tier }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Failed to save client.');
        return;
      }

      // Refresh list from DB
      await fetchClients();
      setIsAddModalOpen(false);
      setSelectedSalesCustomerId('');
      setClientName('');
      setIndustry('Technology');
      setRegion('North America');
      setTier('Enterprise Tier 1');
    } catch (err) {
      alert('An error occurred while saving the client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit Client → PUT to API ──────────────────────────────
  const handleEditClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    setIsEditSubmitting(true);
    try {
      const res = await fetch(`/api/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingClient.name,
          industry: editingClient.industry,
          region: editingClient.region,
          tier: editingClient.tier,
        }),
      });

      if (!res.ok) {
        alert('Failed to update client.');
        return;
      }

      await fetchClients();
      setIsEditModalOpen(false);
      setEditingClient(null);
    } catch (err) {
      alert('An error occurred while updating the client.');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // ── Delete Client → DELETE to API ────────────────────────
  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete client "${name}"?`)) return;

    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) { alert('Failed to delete client.'); return; }
      await fetchClients();
    } catch (err) {
      alert('An error occurred while deleting the client.');
    }
  };

  // ── Export to CSV ─────────────────────────────────────────
  const handleExportCsv = () => {
    if (filteredClients.length === 0) { alert('No client data available to export.'); return; }

    const headers = ['Client Name', 'Industry', 'Region', 'Tier Category'];
    const rows = filteredClients.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.industry.replace(/"/g, '""')}"`,
      `"${c.region.replace(/"/g, '""')}"`,
      `"${c.tier.replace(/"/g, '""')}"`,
    ]);

    const csvString = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Filtered Clients ──────────────────────────────────────
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (tierFilter !== 'All' && c.tier !== tierFilter) return false;
      if (regionFilter !== 'All' && c.region !== regionFilter) return false;
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.industry.toLowerCase().includes(q) &&
          !c.region.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [clients, tierFilter, regionFilter, search]);

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Clients" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className={styles.contentBody}>
          {/* Top Title & Header Buttons */}
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Clients Management</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <strong>Clients</strong>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.primaryBtn} onClick={() => setIsAddModalOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>ADD CLIENT</span>
              </button>

              <button className={styles.secondaryBtn} onClick={handleExportCsv}>
                EXPORT
              </button>
            </div>
          </div>

          {/* Main Card Box */}
          <div className={styles.cardBox}>
            {/* Filter Controls */}
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <select
                  className={styles.selectInput}
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                >
                  <option value="All">Tier Category: All</option>
                  <option value="Enterprise Tier 1">Enterprise Tier 1</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="Small Business (SMB)">Small Business (SMB)</option>
                  <option value="VIP Partner">VIP Partner</option>
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
                  <option value="Latin America">Latin America</option>
                  <option value="Middle East">Middle East</option>
                </select>
              </div>

              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Clients Table */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Industry</th>
                  <th>Region</th>
                  <th>Tier Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                      Loading clients...
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                      No clients found. Click <strong>+ ADD CLIENT</strong> to add one.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td className={styles.clientName}>{client.name}</td>
                      <td>{client.industry}</td>
                      <td>{client.region}</td>
                      <td>
                        <span
                          className={
                            client.tier.includes('Enterprise')
                              ? styles.tierEnterprise
                              : client.tier.includes('Mid-Market')
                              ? styles.tierMidMarket
                              : client.tier.includes('VIP')
                              ? styles.tierEnterprise
                              : styles.tierSmb
                          }
                        >
                          {client.tier}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button
                            className={styles.editBtn}
                            title="Edit Client"
                            onClick={() => { setEditingClient({ ...client }); setIsEditModalOpen(true); }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>

                          <button
                            className={styles.deleteBtn}
                            title="Delete Client"
                            onClick={() => handleDeleteClient(client.id, client.name)}
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
                  ))
                )}
              </tbody>
            </table>

            <div className={styles.tableFooter}>
              <div>Total Clients: {filteredClients.length}</div>
              <div>Showing Page 1 of 1</div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Add Client Modal ── */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Add New Client</h2>

            <form onSubmit={handleAddClientSubmit} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Select From Sales &gt; Customers</label>
                <select
                  className={styles.input}
                  value={selectedSalesCustomerId}
                  onChange={(e) => handleSelectSalesCustomer(e.target.value)}
                >
                  <option value="">-- Choose Existing Sales Customer --</option>
                  {salesCustomers.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name} {sc.region ? `(${sc.region})` : ''}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Type Custom Client Name</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Client / Company Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Tau Corporation"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Industry</label>
                <select className={styles.input} value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="Technology">Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail & E-commerce">Retail &amp; E-commerce</option>
                  <option value="Logistics & Supply">Logistics &amp; Supply</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Healthcare & Pharma">Healthcare &amp; Pharma</option>
                  <option value="Telecommunications">Telecommunications</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Region</label>
                <select className={styles.input} value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Latin America">Latin America</option>
                  <option value="Middle East">Middle East</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Tier Category</label>
                <select className={styles.input} value={tier} onChange={(e) => setTier(e.target.value)}>
                  <option value="Enterprise Tier 1">Enterprise Tier 1</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="Small Business (SMB)">Small Business (SMB)</option>
                  <option value="VIP Partner">VIP Partner</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Client Modal ── */}
      {isEditModalOpen && editingClient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Edit Client</h2>

            <form onSubmit={handleEditClientSubmit} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Client Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Industry</label>
                <select
                  className={styles.input}
                  value={editingClient.industry}
                  onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                >
                  <option value="Technology">Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail & E-commerce">Retail &amp; E-commerce</option>
                  <option value="Logistics & Supply">Logistics &amp; Supply</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Healthcare & Pharma">Healthcare &amp; Pharma</option>
                  <option value="Telecommunications">Telecommunications</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Region</label>
                <select
                  className={styles.input}
                  value={editingClient.region}
                  onChange={(e) => setEditingClient({ ...editingClient, region: e.target.value })}
                >
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Latin America">Latin America</option>
                  <option value="Middle East">Middle East</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Tier Category</label>
                <select
                  className={styles.input}
                  value={editingClient.tier}
                  onChange={(e) => setEditingClient({ ...editingClient, tier: e.target.value })}
                >
                  <option value="Enterprise Tier 1">Enterprise Tier 1</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="Small Business (SMB)">Small Business (SMB)</option>
                  <option value="VIP Partner">VIP Partner</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => { setIsEditModalOpen(false); setEditingClient(null); }}
                  disabled={isEditSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={isEditSubmitting}>
                  {isEditSubmitting ? 'Updating...' : 'Update Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
