'use client';

import styles from '../opportunities.module.css';

interface OpportunitiesFilterBarProps {
  timeFilter: 'Last 1 Month' | 'Last 3 Months' | 'Last 6 Months';
  setTimeFilter: (val: 'Last 1 Month' | 'Last 3 Months' | 'Last 6 Months') => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onReset: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkExport: () => void;
}

export default function OpportunitiesFilterBar({
  timeFilter,
  setTimeFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onReset,
  selectedCount,
  onBulkDelete,
  onBulkExport,
}: OpportunitiesFilterBarProps) {
  return (
    <div className={styles.filterRow}>
      <div className={styles.filterGroup}>
        <select
          className={styles.selectInput}
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
        >
          <option value="Last 1 Month">📅 Last 1 Month</option>
          <option value="Last 3 Months">📅 Last 3 Months</option>
          <option value="Last 6 Months">📅 Last 6 Months</option>
        </select>

        <select
          className={styles.selectInput}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">State: All</option>
          <option value="Pending">Pending</option>
          <option value="Won">Won</option>
          <option value="InProgress">In Progress</option>
          <option value="Lost">Lost</option>
        </select>

        <input
          type="text"
          placeholder="Search opportunities..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className={styles.filterIconBtn} title="Reset Filters" onClick={onReset}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </button>
      </div>

      <div className={styles.bulkActionGroup}>
        <span className={styles.selectedCountText}>{selectedCount} Item selected</span>
        <button className={styles.bulkBtn} onClick={onBulkDelete}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>BULK DELETE</span>
        </button>
        <button className={styles.bulkBtn} onClick={onBulkExport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>BULK EXPORT</span>
        </button>
      </div>
    </div>
  );
}
