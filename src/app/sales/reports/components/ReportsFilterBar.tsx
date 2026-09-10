'use client';

import { SalesReportFilters } from '../types';
import styles from '../reports.module.css';

interface ReportsFilterBarProps {
  filters: SalesReportFilters;
  onFilterChange: (key: keyof SalesReportFilters, val: string) => void;
  onReset: () => void;
}

export default function ReportsFilterBar({
  filters,
  onFilterChange,
  onReset,
}: ReportsFilterBarProps) {
  return (
    <div className={styles.filterRow}>
      <select
        className={styles.selectInput}
        value={filters.period}
        onChange={(e) => onFilterChange('period', e.target.value)}
      >
        <option value="Last 1 Year">📅 Last 1 Year</option>
        <option value="Last 6 Months">📅 Last 6 Months</option>
        <option value="Last 3 Months">📅 Last 3 Months</option>
        <option value="Last 1 Month">📅 Last 1 Month</option>
      </select>

      <select
        className={styles.selectInput}
        value={filters.product}
        onChange={(e) => onFilterChange('product', e.target.value)}
      >
        <option value="ALL">㗊 ALL (Product Type)</option>
        <option value="Software SaaS">Software SaaS</option>
        <option value="Hardware Equipment">Hardware Equipment</option>
        <option value="Consulting Services">Consulting Services</option>
        <option value="Maintenance">Maintenance</option>
      </select>

      <select
        className={styles.selectInput}
        value={filters.region}
        onChange={(e) => onFilterChange('region', e.target.value)}
      >
        <option value="ALL">🌐 Region: ALL</option>
        <option value="North America">North America</option>
        <option value="Europe">Europe</option>
        <option value="Asia Pacific">Asia Pacific</option>
        <option value="Latin America">Latin America</option>
      </select>

      <select
        className={styles.selectInput}
        value={filters.customer}
        onChange={(e) => onFilterChange('customer', e.target.value)}
      >
        <option value="ALL">👥 ALL (Customer Type)</option>
        <option value="Enterprise">Enterprise Tier 1</option>
        <option value="Mid-Market">Mid-Market</option>
        <option value="Small Business (SMB)">Small Business (SMB)</option>
      </select>

      <select
        className={styles.selectInput}
        value={filters.stage}
        onChange={(e) => onFilterChange('stage', e.target.value)}
      >
        <option value="ALL">☑ ALL (Sales Stage)</option>
        <option value="Won">Won</option>
        <option value="In Progress">In Progress</option>
        <option value="Pending">Pending</option>
        <option value="Lost">Lost</option>
      </select>

      <button
        className={styles.filterIconBtn}
        title="Reset All Filters"
        onClick={onReset}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
    </div>
  );
}
