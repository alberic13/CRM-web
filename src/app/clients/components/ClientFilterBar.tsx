'use client';

import { ClientFilters } from '../types';
import styles from '../clients.module.css';

interface ClientFilterBarProps {
  filters: ClientFilters;
  onFilterChange: (key: keyof ClientFilters, val: string) => void;
}

export default function ClientFilterBar({ filters, onFilterChange }: ClientFilterBarProps) {
  return (
    <div className={styles.filterRow}>
      <div className={styles.filterGroup}>
        <select
          className={styles.selectInput}
          value={filters.tier}
          onChange={(e) => onFilterChange('tier', e.target.value)}
        >
          <option value="All">Tier Category: All</option>
          <option value="Enterprise Tier 1">Enterprise Tier 1</option>
          <option value="Mid-Market">Mid-Market</option>
          <option value="Small Business (SMB)">Small Business (SMB)</option>
          <option value="VIP Partner">VIP Partner</option>
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
          <option value="Latin America">Latin America</option>
          <option value="Middle East">Middle East</option>
        </select>
      </div>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search clients..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
      />
    </div>
  );
}
