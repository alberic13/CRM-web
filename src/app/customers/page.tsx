'use client';

import AppShell from '@/components/AppShell';
import { useCustomers } from './useCustomers';
import CustomerTable from './components/CustomerTable';
import AddCustomerModal from './components/AddCustomerModal';
import styles from './customers.module.css';

export default function CustomersPage() {
  const {
    customers,
    search, setSearch,
    regionFilter, setRegionFilter,
    statusFilter, setStatusFilter,
    isModalOpen, setIsModalOpen,
    addCustomer,
    exportCsv,
  } = useCustomers();

  return (
    <AppShell activeMenu="Customers">
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

          <button className={styles.secondaryBtn} onClick={exportCsv}>
            EXPORT
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <CustomerTable
        customers={customers}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        search={search}
        setSearch={setSearch}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addCustomer}
      />
    </AppShell>
  );
}
