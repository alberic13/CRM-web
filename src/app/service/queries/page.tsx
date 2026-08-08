'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './queries.module.css';

interface Issue {
  id?: string;
  issueKey: string;
  title?: string;
  affectedCustomer?: string;
  status: 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
  assignedAgent?: string;
  slaRemaining: string;
  severity: 'Critical' | 'Major' | 'Minor';
}

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
  issue?: Issue | null;
}

export default function CustomerQueriesPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Submit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('High');
  const [autoEscalate, setAutoEscalate] = useState(true);

  // Edit Modal State
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editCategory, setEditCategory] = useState('Technical Issue');
  const [editPriority, setEditPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('High');
  const [editStatus, setEditStatus] = useState<'Open' | 'Pending' | 'Resolved'>('Open');
  const [editAgentName, setEditAgentName] = useState('');

  // Delete Confirmation Modal State
  const [deletingTicket, setDeletingTicket] = useState<Ticket | null>(null);

  // Selected Ticket Drawer State
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.log('Auth check error:', err));

    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/service/tickets');
      if (res.ok) {
        const data = await res.json();
        if (data.tickets) {
          setTickets(data.tickets);
        }
      }
    } catch (err) {
      console.warn('Fetch tickets error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/service/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          subject,
          category,
          priority,
          agentName: user?.name || 'Chris Evans',
          autoEscalate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          setTickets([data.ticket, ...tickets]);
        }
      }
    } catch (error) {
      console.error('Add ticket error:', error);
    } finally {
      setIsModalOpen(false);
      setCustomerName('');
      setSubject('');
    }
  };

  // Open Edit Modal & Populate Form
  const openEditModal = (t: Ticket, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingTicket(t);
    setEditCustomerName(t.customerName);
    setEditSubject(t.subject);
    setEditCategory(t.category);
    setEditPriority(t.priority);
    setEditStatus(t.status);
    setEditAgentName(t.agentName);
  };

  // Submit Edit Ticket
  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    try {
      const res = await fetch(`/api/service/tickets/${editingTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: editCustomerName,
          subject: editSubject,
          category: editCategory,
          priority: editPriority,
          status: editStatus,
          agentName: editAgentName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = data.ticket || {
          ...editingTicket,
          customerName: editCustomerName,
          subject: editSubject,
          category: editCategory,
          priority: editPriority,
          status: editStatus,
          agentName: editAgentName,
        };

        setTickets(tickets.map((t) => (t.id === editingTicket.id ? updated : t)));

        if (selectedTicket && selectedTicket.id === editingTicket.id) {
          setSelectedTicket(updated);
        }
      }
    } catch (err) {
      console.error('Update ticket error:', err);
    } finally {
      setEditingTicket(null);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (t: Ticket, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeletingTicket(t);
  };

  // Confirm Delete Ticket
  const handleDeleteTicket = async () => {
    if (!deletingTicket) return;

    try {
      const res = await fetch(`/api/service/tickets/${deletingTicket.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTickets(tickets.filter((t) => t.id !== deletingTicket.id));

        if (selectedTicket && selectedTicket.id === deletingTicket.id) {
          setSelectedTicket(null);
        }
      }
    } catch (err) {
      console.error('Delete ticket error:', err);
    } finally {
      setDeletingTicket(null);
    }
  };

  const handleEscalateTicket = async (ticket: Ticket, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    try {
      const res = await fetch(`/api/service/tickets/${ticket.id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          severity: ticket.priority === 'Urgent' ? 'Critical' : 'Major',
          assignedAgent: ticket.agentName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedIssue: Issue = data.issue || {
          issueKey: data.issueKey || `ISS-${Math.floor(406 + Math.random() * 100)}`,
          title: `${ticket.category}: ${ticket.subject}`,
          status: 'Escalated',
          slaRemaining: data.slaRemaining || '4h 00m',
          severity: data.severity || (ticket.priority === 'Urgent' ? 'Critical' : 'Major'),
          assignedAgent: ticket.agentName,
        };

        const updatedTicket: Ticket = {
          ...ticket,
          status: 'Pending',
          issue: updatedIssue,
        };

        setTickets(tickets.map((t) => (t.id === ticket.id ? updatedTicket : t)));

        if (selectedTicket && selectedTicket.id === ticket.id) {
          setSelectedTicket(updatedTicket);
        }
      }
    } catch (err) {
      console.error('Escalate error:', err);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.issue?.issueKey && t.issue.issueKey.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchPriority && matchStatus && matchSearch;
  });

  const unresolvedCount = tickets.filter((t) => t.status !== 'Resolved').length;
  const connectedIssuesCount = tickets.filter((t) => t.issue).length;

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Customer Service" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />

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
              <span>SUBMIT NEW TICKET</span>
            </button>
          </div>

          {/* Metric Overview Row */}
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Tickets Received</span>
              <div className={styles.metricValRow}>
                <span className={styles.metricVal}>{tickets.length + 143}</span>
                <span className={styles.badgeInc}>+12.4% vs last week</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Unresolved Queries</span>
              <div className={styles.metricValRow}>
                <span className={styles.metricVal} style={{ color: '#ef4444' }}>
                  {unresolvedCount}
                </span>
                <span className={styles.badgeDec}>Active Support Queue</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Connected Issue Tracking</span>
              <div className={styles.metricValRow}>
                <span className={styles.metricVal} style={{ color: '#0d9488' }}>
                  {connectedIssuesCount} Issues
                </span>
                <span className={styles.badgeInc}>Synced with Engineering</span>
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

            {/* Table Connected to Issue Tracking & Edit/Delete */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticket No.</th>
                  <th>Customer Name</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Connected Issue Tracking</th>
                  <th>Assigned Agent</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id} className={styles.clickableRow} onClick={() => setSelectedTicket(t)}>
                    <td className={styles.ticketNo}>{t.ticketNo}</td>
                    <td>
                      <div className={styles.userCell}>
                        <img src={t.avatar || '/avatars/user1.jpg'} alt={t.customerName} className={styles.avatarImg} />
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
                    {/* Connected Issue Tracking Column */}
                    <td onClick={(e) => e.stopPropagation()}>
                      {t.issue ? (
                        <div className={styles.issuePillCell}>
                          <Link
                            href={`/service/issues?issueKey=${t.issue.issueKey}`}
                            className={styles.issueBadgeLink}
                            title="View in Issue Tracking Center"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            <span className={styles.issueKeyTag}>{t.issue.issueKey}</span>
                            <span
                              className={
                                t.issue.severity === 'Critical'
                                  ? styles.slaTagCritical
                                  : t.issue.severity === 'Major'
                                  ? styles.slaTagMajor
                                  : styles.slaTagNormal
                              }
                            >
                              {t.issue.slaRemaining}
                            </span>
                          </Link>
                        </div>
                      ) : (
                        <button
                          className={styles.escalateBtn}
                          onClick={(e) => handleEscalateTicket(t, e)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span>+ Link Issue</span>
                        </button>
                      )}
                    </td>
                    <td>{t.agentName}</td>
                    <td>{t.createdDate}</td>
                    {/* Edit & Delete Action Buttons */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className={styles.actionCell}>
                        <button
                          className={styles.editIconBtn}
                          title="Edit Ticket"
                          onClick={(e) => openEditModal(t, e)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        <button
                          className={styles.deleteIconBtn}
                          title="Delete Ticket"
                          onClick={(e) => openDeleteModal(t, e)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Ticket & Issue Detail Drawer */}
      {selectedTicket && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedTicket(null)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitleGroup}>
                <span className={styles.ticketNo}>{selectedTicket.ticketNo}</span>
                <h3 className={styles.drawerTitle}>{selectedTicket.subject}</h3>
              </div>
              <button className={styles.closeDrawerBtn} onClick={() => setSelectedTicket(null)}>
                &times;
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Customer Ticket Card */}
              <div className={styles.drawerCard}>
                <div className={styles.drawerCardHeader}>
                  <h4 className={styles.drawerCardTitle}>Customer Ticket Info</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      className={
                        selectedTicket.status === 'Open'
                          ? styles.statusOpen
                          : selectedTicket.status === 'Pending'
                          ? styles.statusPending
                          : styles.statusResolved
                      }
                    >
                      {selectedTicket.status}
                    </span>
                    <button
                      className={styles.editIconBtn}
                      title="Edit Ticket"
                      onClick={() => openEditModal(selectedTicket)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className={styles.deleteIconBtn}
                      title="Delete Ticket"
                      onClick={() => openDeleteModal(selectedTicket)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Customer Name</span>
                    <span className={styles.metaVal}>{selectedTicket.customerName}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Category</span>
                    <span className={styles.metaVal}>{selectedTicket.category}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Priority Level</span>
                    <span className={styles.metaValHighlight}>{selectedTicket.priority}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Assigned Agent</span>
                    <span className={styles.metaVal}>{selectedTicket.agentName}</span>
                  </div>
                </div>
              </div>

              {/* Connected Issue Tracking Card */}
              <div className={styles.drawerCard} style={{ borderColor: '#bbf7d0', background: '#fafdfb' }}>
                <div className={styles.drawerCardHeader}>
                  <h4 className={styles.drawerCardTitle} style={{ color: '#0f766e' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Connected Issue Tracking
                  </h4>
                  {selectedTicket.issue ? (
                    <span className={styles.issueKeyTag}>{selectedTicket.issue.issueKey}</span>
                  ) : (
                    <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>Not Linked</span>
                  )}
                </div>

                {selectedTicket.issue ? (
                  <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Engineering Severity</span>
                      <span
                        className={
                          selectedTicket.issue.severity === 'Critical'
                            ? styles.badgeUrgent
                            : selectedTicket.issue.severity === 'Major'
                            ? styles.badgeHigh
                            : styles.badgeLow
                        }
                      >
                        {selectedTicket.issue.severity}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>SLA Clock Remaining</span>
                      <span
                        className={
                          selectedTicket.issue.severity === 'Critical'
                            ? styles.slaTagCritical
                            : styles.slaTagMajor
                        }
                      >
                        {selectedTicket.issue.slaRemaining}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Issue Status</span>
                      <span className={styles.metaVal}>{selectedTicket.issue.status}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Assigned Engineer</span>
                      <span className={styles.metaVal}>{selectedTicket.issue.assignedAgent || selectedTicket.agentName}</span>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    This customer query has not been linked to an engineering issue tracker item yet. Click below to escalate and assign an SLA countdown.
                  </p>
                )}
              </div>
            </div>

            <div className={styles.drawerActions}>
              {selectedTicket.issue ? (
                <Link
                  href={`/service/issues?issueKey=${selectedTicket.issue.issueKey}`}
                  className={styles.viewIssueCenterBtn}
                >
                  <span>Open in Issue Tracking Center</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ) : (
                <button
                  className={styles.escalateFullBtn}
                  onClick={() => handleEscalateTicket(selectedTicket)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  <span>Escalate to Issue Tracking Center</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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

              <label className={styles.checkboxField}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={autoEscalate}
                  onChange={(e) => setAutoEscalate(e.target.checked)}
                />
                <span className={styles.checkboxLabel}>
                  Auto-link &amp; escalate to Issue Tracking (SLA Center)
                </span>
              </label>

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

      {/* Edit Ticket Modal */}
      {editingTicket && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Edit Ticket {editingTicket.ticketNo}</h2>

            <form onSubmit={handleUpdateTicket} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Customer / Company Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Subject / Summary of Issue</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.input}
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
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
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as any)}
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Ticket Status</label>
                <select
                  className={styles.input}
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                >
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Assigned Agent</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editAgentName}
                  onChange={(e) => setEditAgentName(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setEditingTicket(null)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTicket && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ width: '420px' }}>
            <h2 className={styles.modalTitle} style={{ color: '#dc2626' }}>
              Delete Ticket Confirmation
            </h2>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
              Are you sure you want to delete ticket <strong>{deletingTicket.ticketNo}</strong> ({deletingTicket.subject})?
              This action will permanently delete the ticket from the PostgreSQL database.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setDeletingTicket(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={handleDeleteTicket}
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
