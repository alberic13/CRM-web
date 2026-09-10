'use client';

import AppShell from '@/components/AppShell';
import { useClients } from './useClients';
import ClientFilterBar from './components/ClientFilterBar';
import ClientTable from './components/ClientTable';
import AddClientModal from './components/AddClientModal';
import EditClientModal from './components/EditClientModal';
import styles from './clients.module.css';

export default function ClientsPage() {
  const {
    salesCustomers,
    isLoading,
    filters,
    setFilter,
    filteredClients,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editingClient,
    setEditingClient,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleExport,
  } = useClients();

  return (
    <AppShell activeMenu="Clients">
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

          <button className={styles.secondaryBtn} onClick={handleExport}>
            EXPORT
          </button>
        </div>
      </div>

      <div className={styles.cardBox}>
        <ClientFilterBar
          filters={filters}
          onFilterChange={setFilter}
        />

        <ClientTable
          clients={filteredClients}
          isLoading={isLoading}
          onEdit={(client) => {
            setEditingClient(client);
            setIsEditModalOpen(true);
          }}
          onDelete={handleDeleteClient}
          onOpenAdd={() => setIsAddModalOpen(true)}
        />
      </div>

      <AddClientModal
        isOpen={isAddModalOpen}
        salesCustomers={salesCustomers}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddClient}
      />

      <EditClientModal
        isOpen={isEditModalOpen}
        client={editingClient}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleEditClient}
      />
    </AppShell>
  );
}
