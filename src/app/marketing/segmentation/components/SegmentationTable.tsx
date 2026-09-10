'use client';

import { CustomerRow } from '../types';
import styles from '../segmentation.module.css';

interface SegmentationTableProps {
  customers: CustomerRow[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export default function SegmentationTable({
  customers,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: SegmentationTableProps) {
  const isAllSelected = customers.length > 0 && selectedIds.length === customers.length;

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: '40px' }}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={isAllSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            <th>No.</th>
            <th>Customer name</th>
            <th>Age</th>
            <th>Region</th>
            <th>Purchase Num.</th>
            <th>Source</th>
            <th>State</th>
            <th>
              <span className={styles.sortHeader}>
                Last purchase <span className={styles.sortIcon}>⇕</span>
              </span>
            </th>
            <th>
              <span className={styles.sortHeader}>
                First Purchase <span className={styles.sortIcon}>⇕</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                No customers match the selected filter criteria.
              </td>
            </tr>
          ) : (
            customers.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <tr key={item.id} className={isSelected ? styles.selectedRow : ''}>
                  <td>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={isSelected}
                      onChange={() => onToggleSelect(item.id)}
                    />
                  </td>
                  <td className={styles.customerNo}>{item.customerNo}</td>
                  <td className={styles.customerName}>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.region}</td>
                  <td>
                    <span className={styles.purchaseNumLink}>{item.purchaseNum}</span>
                  </td>
                  <td>{item.source}</td>
                  <td>{item.state}</td>
                  <td>{item.lastPurchase}</td>
                  <td>{item.firstPurchase}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className={styles.tableFooter}>
        <div>Total items: {customers.length}</div>
        <div className={styles.paginationControls}>
          <span>Items per page: 10</span>
          <span>Total pages: 1</span>
          <div className={styles.pageNumbers}>
            <button className={styles.arrowBtn}>&lt;</button>
            <button className={`${styles.pageBtn} ${styles.activePageBtn}`}>1</button>
            <button className={styles.arrowBtn}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
