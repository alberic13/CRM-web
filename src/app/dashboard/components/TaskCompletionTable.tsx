'use client';

import { TaskCompletionItem } from '../types';
import styles from '../dashboard.module.css';

interface TaskCompletionTableProps {
  tasks: TaskCompletionItem[];
}

export function TaskCompletionTable({ tasks }: TaskCompletionTableProps) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Task Completion</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '30px' }}>#</th>
              <th>Company / Account</th>
              <th>Completed</th>
              <th>In Progress</th>
              <th>Progress Bar</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((tc, idx: number) => {
              const total = tc.completed + tc.inProgress;
              const pct = total > 0 ? Math.round((tc.completed / total) * 100) : 0;

              return (
                <tr key={tc.id || idx}>
                  <td className={styles.rankNum}>{idx + 1}</td>
                  <td>
                    <div className={styles.userCell}>
                      <img
                        src={tc.avatar || `/avatars/user${(idx % 10) + 1}.jpg`}
                        alt={tc.companyName}
                        className={styles.avatarImgPhoto}
                      />
                      <span>{tc.companyName}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>{tc.completed}</td>
                  <td style={{ fontWeight: 600, color: '#eab308' }}>{tc.inProgress}</td>
                  <td style={{ width: '120px' }}>
                    <div style={{ background: '#e2e8f0', borderRadius: '10px', height: '8px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${pct}%`, background: '#5d5fef', height: '100%' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{pct}% Done</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
