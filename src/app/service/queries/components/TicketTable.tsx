'use client';

import Link from 'next/link';
import { Ticket } from '../types';
import styles from '../queries.module.css';

interface TicketTableProps {
  tickets: Ticket[];
  filters: {
    priority: string;
    setPriority: (v: string) => void;
    status: string;
    setStatus: (v: string) => void;
    search: string;
    setSearch: (v: string) => void;
  };
  actions: {
    onSelect: (t: Ticket) => void;
    onEdit: (t: Ticket, e?: React.MouseEvent) => void;
    onDelete: (t: Ticket, e?: React.MouseEvent) => void;
    onEscalate: (t: Ticket, e?: React.MouseEvent) => void;
  };
}

export function TicketTable({ tickets, filters, actions }: TicketTableProps) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.priority}
            onChange={(e) => filters.setPriority(e.target.value)}
          >
            <option value="All">Priority: All</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            className={styles.selectInput}
            value={filters.status}
            onChange={(e) => filters.setStatus(e.target.value)}
          >
            <option value="All">Status: All</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search ticket No, customer, subject..."
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ticket No.</th>
            <th>Customer Name</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Connected Issue Tracking</th>
            <th>Assigned Agent</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className={styles.clickableRow} onClick={() => actions.onSelect(t)}>
              <td className={styles.ticketNo}>{t.ticketNo}</td>
              <td>
                <div className={styles.userCell}>
                  <img src={t.avatar || '/avatars/user1.jpg'} alt={t.customerName} className={styles.avatarImg} />
                  <span>{t.customerName}</span>
                </div>
              </td>
              <td className={styles.subjectText}>{t.subject}</td>
              <td>{t.category}</td>
              <td>
                <span className={styles[`badge${t.priority}`] || styles.badgeLow}>
                  {t.priority}
                </span>
              </td>
              <td>
                <span className={styles[`status${t.status}`] || styles.statusOpen}>
                  {t.status}
                </span>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                {t.issue ? (
                  <div className={styles.issuePillCell}>
                    <Link
                      href={`/service/issues?issueKey=${t.issue.issueKey}`}
                      className={styles.issueBadgeLink}
                      title="View in Issue Tracking Center"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span className={styles.issueKeyTag}>{t.issue.issueKey}</span>
                      <span
                        className={
                          t.issue.severity === 'Critical'
                            ? styles.slaTagCritical
                            : t.issue.severity === 'Major'
                            ? styles.slaTagMajor
                            : styles.slaTagNormal
                        }
                      >
                        {t.issue.slaRemaining}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <button className={styles.escalateBtn} onClick={(e) => actions.onEscalate(t, e)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>+ Link Issue</span>
                  </button>
                )}
              </td>
              <td>{t.agentName}</td>
              <td>{t.createdDate}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <div className={styles.actionCell}>
                  <button className={styles.editIconBtn} title="Edit Ticket" onClick={(e) => actions.onEdit(t, e)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className={styles.deleteIconBtn} title="Delete Ticket" onClick={(e) => actions.onDelete(t, e)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
