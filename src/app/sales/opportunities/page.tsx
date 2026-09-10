'use client';

import AppShell from '@/components/AppShell';
import { useOpportunities } from './useOpportunities';
import OpportunitiesFilterBar from './components/OpportunitiesFilterBar';
import OpportunitiesTable from './components/OpportunitiesTable';
import AddOpportunityModal from './components/AddOpportunityModal';
import EditOpportunityModal from './components/EditOpportunityModal';
import styles from './opportunities.module.css';

export default function OpportunitiesPage() {
  const {
    filteredOpportunities,
    currentItems,
    totalPages,
    currentPage,
    setCurrentPage,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    timeFilter,
    setTimeFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editingItem,
    setEditingItem,
    handleDeleteItem,
    handleBulkDelete,
    handleBulkExport,
    handleAddOpportunity,
    handleSaveEdit,
  } = useOpportunities();

  const handleResetFilters = () => {
    setStatusFilter('All');
    setTimeFilter('Last 1 Month');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <AppShell activeMenu="Sales">
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Sales</h1>
          <div className={styles.breadcrumbs}>
            <span>Home</span> &gt; <span>Sales</span> &gt; <strong>Opportunities</strong>
          </div>
        </div>

        <button className={styles.primaryBtn} onClick={() => setIsAddModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>ADD OPPORTUNITY</span>
        </button>
      </div>

      <div className={styles.cardBox}>
        <OpportunitiesFilterBar
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onReset={handleResetFilters}
          selectedCount={selectedIds.length}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
        />

        <OpportunitiesTable
          items={currentItems}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEdit={(item) => {
            setEditingItem(item);
            setIsEditModalOpen(true);
          }}
          onDelete={handleDeleteItem}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOpportunities.length}
          pageSize={10}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddOpportunityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddOpportunity}
      />

      <EditOpportunityModal
        isOpen={isEditModalOpen}
        item={editingItem}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </AppShell>
  );
}
