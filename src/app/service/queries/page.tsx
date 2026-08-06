'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './queries.module.css';

interface Ticket {
  id: string;
  ticketNo: string;
  customerName: string;
  avatar: string;
  subject: string;
  category: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Pending' | 'Resolved';
  agentName: string;
  createdDate: string;
}

export default function CustomerQueriesPage() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1', ticketNo: 'TCK-8091', customerName: 'Tau Corporation', avatar: '/avatars/user2.jpg', subject: 'API Integration Timeout on Checkout', category: 'Technical Issue', priority: 'Urgent', status: 'Open', agentName: 'Chris Evans', createdDate: '2026-08-06' },
    { id: '2', ticketNo: 'TCK-8090', customerName: 'GlobalMart Inc.', avatar: '/avatars/user3.jpg', subject: 'Monthly Subscription Billing Clarification', category: 'Billing', priority: 'High', status: 'Pending', agentName: 'Shirley.H', createdDate: '2026-08-06' },
    { id: '3', ticketNo: 'TCK-8089', customerName: 'Pi Enterprises', avatar: '/avatars/user4.jpg', subject: 'User Role Permissions Customization Query', category: 'Account Mgmt', priority: 'Medium', status: 'Resolved', agentName: 'Chris Evans', createdDate: '2026-08-05' },
    { id: '4', ticketNo: 'TCK-8088', customerName: 'Delta Industries', avatar: '/avatars/user5.jpg', subject: 'Bulk Export Data Format Request', category: 'Feature Request', priority: 'Low', status: 'Resolved', agentName: 'Andy Chen', createdDate: '2026-08-05' },
    { id: '5', ticketNo: 'TCK-8087', customerName: 'Alpha Solutions', avatar: '/avatars/user6.jpg', subject: 'Password Reset Notification Email Delayed', category: 'Account Mgmt', priority: 'High', status: 'Open', agentName: 'Lucy Tan', createdDate: '2026-08-04' },
  ]);

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('High');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ticketNo: `TCK-${Math.floor(8100 + Math.random() * 900)}`,
      customerName,
      avatar: `/avatars/user${Math.floor(Math.random() * 10) + 1}.jpg`,
      subject,
      category,
      priority,
      status: 'Open',
      agentName: user?.name || 'Chris Evans',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setCustomerName('');
    setSubject('');
  };

  const filteredTickets = tickets.filter((t) => {
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.ticketNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPriority && matchStatus && matchSearch;
  });

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Customer Service" />

      <div className={styles.mainContent}>
        <Header user={user} />

        <main className={styles.contentBody}>
          {/* Top Title & Header */}
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Customer Queries</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>Customer Queries</strong>
              </div>
            </div>

            <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>+ SUBMIT NEW TICKET</span>
            </button>
          </div>

          {/* Metric Overview Row */}
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Tickets Received</span>
              <div className={styles.metricValRow}>
                <span className={styles.metricVal}>148</span>
                <span className={styles.badgeInc}>+12.4% vs last week</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Unresolved Queries</span>
              <div className={styles.metricValRow}>
                <span className={styles.metricVal} style={{ color: '#ef4444' }}>14</span>
                <span className={styles.badgeDec}>-3 tickets today</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>First Response Time</span>
              <div className={styles.metricValRow}>
                <span className={styles.metricVal} style={{ color: '#06b6d4' }}>8.5 Mins</span>
                <span className={styles.badgeInc}>Top 5% SLAs</span>
              </div>
            </div>
          </div>

          {/* Card Box & Table */}
          <div className={styles.cardBox}>
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <select
                  className={styles.selectInput}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="All">Priority: All</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  className={styles.selectInput}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">Status: All</option>
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search ticket No, customer, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Table */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticket No.</th>
                  <th>Customer Name</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Agent</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td className={styles.ticketNo}>{t.ticketNo}</td>
                    <td>
                      <div className={styles.userCell}>
                        <img src={t.avatar} alt={t.customerName} className={styles.avatarImg} />
                        <span>{t.customerName}</span>
                      </div>
                    </td>
                    <td className={styles.subjectText}>{t.subject}</td>
                    <td>{t.category}</td>
                    <td>
                      <span
                        className={
                          t.priority === 'Urgent'
                            ? styles.badgeUrgent
                            : t.priority === 'High'
                            ? styles.badgeHigh
                            : t.priority === 'Medium'
                            ? styles.badgeMedium
                            : styles.badgeLow
                        }
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          t.status === 'Open'
                            ? styles.statusOpen
                            : t.status === 'Pending'
                            ? styles.statusPending
                            : styles.statusResolved
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>{t.agentName}</td>
                    <td>{t.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Submit Ticket Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Submit New Support Ticket</h2>

            <form onSubmit={handleAddTicket} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Customer / Company Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Acme Corporation"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Subject / Summary of Issue</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Unable to access billing dashboard"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Billing">Billing</option>
                  <option value="Account Mgmt">Account Mgmt</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Priority Level</label>
                <select
                  className={styles.input}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
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
                <button type="submit" className={styles.primaryBtn}>
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
