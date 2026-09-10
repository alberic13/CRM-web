'use client';

import AppShell from '@/components/AppShell';
import { useSegmentation } from './useSegmentation';
import SegmentationFilterBar from './components/SegmentationFilterBar';
import SegmentationMetricsBar from './components/SegmentationMetricsBar';
import CustomerSourceChart from './components/CustomerSourceChart';
import AgeDistributionChart from './components/AgeDistributionChart';
import PurchaseBehaviorChart from './components/PurchaseBehaviorChart';
import SegmentationTable from './components/SegmentationTable';
import AddCustomerModal from './components/AddCustomerModal';
import styles from './segmentation.module.css';

export default function SegmentationPage() {
  const {
    customersData,
    filteredCustomers,
    filters,
    setFilters,
    selectedIds,
    metrics,
    sourceStats,
    ageStats,
    behaviorLineRows,
    isAddModalOpen,
    setIsAddModalOpen,
    toggleSelect,
    toggleSelectAll,
    resetFilters,
    handleBulkExport,
    handleAddCustomer,
  } = useSegmentation();

  const handleFilterChange = (key: keyof typeof filters, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <AppShell activeMenu="Marketing">
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Marketing</h1>
          <div className={styles.breadcrumbs}>
            <span>Home</span> &gt; <span>Marketing</span> &gt; <strong>Segmentation</strong>
          </div>
        </div>
      </div>

      <SegmentationFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        selectedCount={selectedIds.length}
        onBulkExport={handleBulkExport}
        onOpenAddCustomer={() => setIsAddModalOpen(true)}
      />

      <SegmentationMetricsBar metrics={metrics} />

      <div className={styles.chartsGrid}>
        <CustomerSourceChart sourceStats={sourceStats} />
        <AgeDistributionChart ageStats={ageStats} />
        <PurchaseBehaviorChart behaviorLineRows={behaviorLineRows} />
      </div>

      <SegmentationTable
        customers={filteredCustomers}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCustomer}
        customersData={customersData}
      />
    </AppShell>
  );
}
