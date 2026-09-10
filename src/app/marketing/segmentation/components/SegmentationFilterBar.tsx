'use client';

import { SegmentationFilters } from '../types';
import styles from '../segmentation.module.css';

interface SegmentationFilterBarProps {
  filters: SegmentationFilters;
  onFilterChange: (key: keyof SegmentationFilters, val: string) => void;
  onReset: () => void;
  selectedCount: number;
  onBulkExport: () => void;
  onOpenAddCustomer: () => void;
}

export default function SegmentationFilterBar({
  filters,
  onFilterChange,
  onReset,
  selectedCount,
  onBulkExport,
  onOpenAddCustomer,
}: SegmentationFilterBarProps) {
  return (
    <div className={styles.filterRow}>
      <div className={styles.filterGroup}>
        <select
          className={styles.selectInput}
          value={filters.customerType}
          onChange={(e) => onFilterChange('customerType', e.target.value)}
        >
          <option value="All">㗊 Customer type: All</option>
          <option value="Loyal">Loyal</option>
          <option value="New">New</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          className={styles.selectInput}
          value={filters.region}
          onChange={(e) => onFilterChange('region', e.target.value)}
        >
          <option value="All">Region: All</option>
          <option value="North America">North America</option>
          <option value="Europe">Europe</option>
          <option value="Asia Pacific">Asia Pacific</option>
        </select>

        <select
          className={styles.selectInput}
          value={filters.state}
          onChange={(e) => onFilterChange('state', e.target.value)}
        >
          <option value="All">Source: All</option>
          <option value="Online">Online</option>
          <option value="Retail">Retail</option>
        </select>

        <select
          className={styles.selectInput}
          value={filters.age}
          onChange={(e) => onFilterChange('age', e.target.value)}
        >
          <option value="All">Age: All</option>
          <option value="0-20">0-20</option>
          <option value="21-30">21-30</option>
          <option value="31-40">31-40</option>
          <option value="41-50">41-50</option>
          <option value=">50">&gt;50</option>
        </select>

        <button className={styles.filterIconBtn} title="Reset Filters" onClick={onReset}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </button>
      </div>

      <div className={styles.bulkActionGroup}>
        <span className={styles.selectedCountText}>{selectedCount} Item selected</span>
        <button className={styles.bulkExportBtn} onClick={onBulkExport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>BULK EXPORT</span>
        </button>
        <button className={styles.addBtn} onClick={onOpenAddCustomer}>
          + Add Customer
        </button>
      </div>
    </div>
  );
}
