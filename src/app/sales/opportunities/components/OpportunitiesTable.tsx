'use client';

import { OpportunityItem } from '../types';
import { formatDateForDisplay } from '../opportunityData';
import styles from '../opportunities.module.css';

interface OpportunitiesTableProps {
  items: OpportunityItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (item: OpportunityItem) => void;
  onDelete: (id: string, name: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function OpportunitiesTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: OpportunitiesTableProps) {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const getBadgeClass = (status: OpportunityItem['status']) => {
    switch (status) {
      case 'Pending': return styles.badgePending;
      case 'Won': return styles.badgeWon;
      case 'InProgress': return styles.badgeInProgress;
      case 'Lost': return styles.badgeLost;
    }
  };

  return (
    <>
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
            <th>Opportunity Name</th>
            <th>
              <span className={styles.sortHeader}>
                Status <span className={styles.sortIcon}>⇕</span>
              </span>
            </th>
            <th>Revenue</th>
            <th>
              <span className={styles.sortHeader}>
                Exp. Close Date <span className={styles.sortIcon}>⇕</span>
              </span>
            </th>
            <th>Customers</th>
            <th>Owner</th>
            <th>
              <span className={styles.sortHeader}>
                Creation Date <span className={styles.sortIcon}>⇕</span>
              </span>
            </th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={11} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                No opportunities found matching your filters.
              </td>
            </tr>
          ) : (
            items.map((item) => {
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
                  <td className={styles.oppNo}>{item.opportunityNo}</td>
                  <td className={styles.oppName}>{item.name}</td>
                  <td>
                    <span className={getBadgeClass(item.status)}>
                      {item.status === 'InProgress' ? 'In Progress' : item.status}
                    </span>
                  </td>
                  <td className={styles.revenueText}>${item.revenue.toLocaleString()}</td>
                  <td>{formatDateForDisplay(item.expCloseDate)}</td>
                  <td>{item.customerName}</td>
                  <td>{item.ownerName}</td>
                  <td>{formatDateForDisplay(item.creationDate)}</td>
                  <td style={{ color: '#64748b', fontSize: '13px' }}>{item.notes}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button className={styles.editBtn} title="Edit Opportunity" onClick={() => onEdit(item)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className={styles.deleteBtn} title="Delete Opportunity" onClick={() => onDelete(item.id, item.name)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className={styles.tableFooter}>
        <div>Total items: {totalItems}</div>
        <div className={styles.paginationControls}>
          <span>Items per page: {pageSize}</span>
          <span>Total pages: {totalPages}</span>
          <div className={styles.pageNumbers}>
            <button
              className={styles.arrowBtn}
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            >
              &lt;
            </button>
            <button className={`${styles.pageBtn} ${styles.activePageBtn}`}>
              {currentPage}
            </button>
            <button
              className={styles.arrowBtn}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
