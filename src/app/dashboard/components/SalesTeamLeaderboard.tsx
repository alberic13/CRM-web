'use client';

import { SalesViewMode, SalesMember, SortField, SortOrder } from '../types';
import styles from '../dashboard.module.css';

interface SalesTeamLeaderboardProps {
  viewMode: SalesViewMode;
  onModeChange: (mode: SalesViewMode) => void;
  members: SalesMember[];
  sortField: SortField;
  sortOrder: SortOrder;
  onToggleSort: (field: SortField) => void;
}

export function SalesTeamLeaderboard({
  viewMode,
  onModeChange,
  members,
  sortField,
  sortOrder,
  onToggleSort,
}: SalesTeamLeaderboardProps) {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return '⇕';
    return sortOrder === 'asc' ? '▲' : '▼';
  };

  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Sales Team</h2>
        <div className={styles.segmentedToggle}>
          <button
            className={`${styles.segBtn} ${viewMode === 'Team' ? styles.segBtnActive : ''}`}
            onClick={() => onModeChange('Team')}
          >
            Team
          </button>
          <button
            className={`${styles.segBtn} ${viewMode === 'Member' ? styles.segBtnActive : ''}`}
            onClick={() => onModeChange('Member')}
          >
            Member
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '30px' }}>#</th>
              <th>{viewMode === 'Member' ? 'Member Name' : 'Team Name'}</th>
              <th>
                <span className={styles.sortableHeader} onClick={() => onToggleSort('revenue')}>
                  Revenue <span className={styles.sortIcon}>{renderSortIcon('revenue')}</span>
                </span>
              </th>
              <th>
                <span className={styles.sortableHeader} onClick={() => onToggleSort('orders')}>
                  Orders Number <span className={styles.sortIcon}>{renderSortIcon('orders')}</span>
                </span>
              </th>
              <th>
                <span className={styles.sortableHeader} onClick={() => onToggleSort('conversionRate')}>
                  Conversion Rate <span className={styles.sortIcon}>{renderSortIcon('conversionRate')}</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((st, idx: number) => (
              <tr key={st.id || idx}>
                <td className={styles.rankNum}>{idx + 1}</td>
                <td>
                  <div className={styles.userCell}>
                    <img
                      src={st.avatar || `/avatars/user${(idx % 10) + 1}.jpg`}
                      alt={st.name}
                      className={styles.avatarImgPhoto}
                    />
                    <span>{st.name}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: '#0f172a' }}>${st.revenue.toLocaleString()}</td>
                <td>{st.orders}</td>
                <td>
                  <span style={{ fontWeight: 700, color: '#22c55e' }}>{st.conversionRate}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
