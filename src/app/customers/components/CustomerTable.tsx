'use client';

import { Customer } from '../customers.types';
import styles from '../customers.module.css';

interface CustomerTableProps {
  customers: Customer[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  regionFilter: string;
  setRegionFilter: (region: string) => void;
  search: string;
  setSearch: (query: string) => void;
}

export default function CustomerTable({
  customers,
  statusFilter,
  setStatusFilter,
  regionFilter,
  setRegionFilter,
  search,
  setSearch,
}: CustomerTableProps) {
  return (
    <div className={styles.cardBox}>
      {/* Filter & Search Bar */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Customer Status: All</option>
            <option value="Loyal">Loyal</option>
            <option value="New">New</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            className={styles.selectInput}
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="All">Region: All</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
          </select>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search name, email, No..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Customer Name</th>
            <th>Contact Email</th>
            <th>Region</th>
            <th>Last Purchase</th>
            <th>Source</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className={styles.customerNo}>{c.customerNo}</td>
              <td className={styles.customerName}>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.region}</td>
              <td>{new Date(c.lastPurchase).toLocaleDateString()}</td>
              <td>{c.source}</td>
              <td>
                <span
                  className={
                    c.status === 'Loyal'
                      ? styles.badgeLoyal
                      : c.status === 'New'
                      ? styles.badgeNew
                      : styles.badgeLost
                  }
                >
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.tableFooter}>
        <div>Total Items: {customers.length}</div>
        <div>Showing Page 1 of 1</div>
      </div>
    </div>
  );
}
