'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useTicketQueries } from './useTicketQueries';
import { TicketMetrics } from './components/TicketMetrics';
import { TicketTable } from './components/TicketTable';
import { SubmitTicketModal } from './components/SubmitTicketModal';
import { EditTicketModal } from './components/EditTicketModal';
import { DeleteTicketModal } from './components/DeleteTicketModal';
import { TicketDetailDrawer } from './components/TicketDetailDrawer';
import styles from './queries.module.css';

export default function CustomerQueriesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const q = useTicketQueries();

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Customer Service" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={q.user} onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className={styles.contentBody}>
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Customer Queries</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>Customer Queries</strong>
              </div>
            </div>

            <button className={styles.primaryBtn} onClick={() => q.setIsSubmitModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>SUBMIT NEW TICKET</span>
            </button>
          </div>

          <TicketMetrics
            totalTickets={q.tickets.length}
            unresolvedCount={q.unresolvedCount}
            connectedIssuesCount={q.connectedIssuesCount}
          />

          <TicketTable
            tickets={q.filteredTickets}
            filters={{
              priority: q.priorityFilter,
              setPriority: q.setPriorityFilter,
              status: q.statusFilter,
              setStatus: q.setStatusFilter,
              search: q.searchQuery,
              setSearch: q.setSearchQuery,
            }}
            actions={{
              onSelect: q.setSelectedTicket,
              onEdit: (t, e) => {
                e?.stopPropagation();
                q.setEditingTicket(t);
              },
              onDelete: (t, e) => {
                e?.stopPropagation();
                q.setDeletingTicket(t);
              },
              onEscalate: q.handleEscalateTicket,
            }}
          />
        </main>
      </div>

      <TicketDetailDrawer
        ticket={q.selectedTicket}
        onClose={() => q.setSelectedTicket(null)}
        onEdit={(t) => q.setEditingTicket(t)}
        onDelete={(t) => q.setDeletingTicket(t)}
        onEscalate={q.handleEscalateTicket}
      />

      <SubmitTicketModal
        isOpen={q.isSubmitModalOpen}
        onClose={() => q.setIsSubmitModalOpen(false)}
        onSubmit={q.handleAddTicket}
      />

      {q.editingTicket && (
        <EditTicketModal
          key={q.editingTicket.id}
          ticket={q.editingTicket}
          onClose={() => q.setEditingTicket(null)}
          onSubmit={q.handleUpdateTicket}
        />
      )}

      <DeleteTicketModal
        ticket={q.deletingTicket}
        onClose={() => q.setDeletingTicket(null)}
        onConfirm={q.handleDeleteTicket}
      />
    </div>
  );
}
