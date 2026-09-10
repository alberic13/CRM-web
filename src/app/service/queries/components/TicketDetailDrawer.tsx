'use client';

import Link from 'next/link';
import { Ticket } from '../types';
import styles from '../queries.module.css';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  onClose: () => void;
  onEdit: (t: Ticket) => void;
  onDelete: (t: Ticket) => void;
  onEscalate: (t: Ticket) => void;
}

export function TicketDetailDrawer({ ticket, onClose, onEdit, onDelete, onEscalate }: TicketDetailDrawerProps) {
  if (!ticket) return null;

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitleGroup}>
            <span className={styles.ticketNo}>{ticket.ticketNo}</span>
            <h3 className={styles.drawerTitle}>{ticket.subject}</h3>
          </div>
          <button className={styles.closeDrawerBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.drawerBody}>
          <div className={styles.drawerCard}>
            <div className={styles.drawerCardHeader}>
              <h4 className={styles.drawerCardTitle}>Customer Ticket Info</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={styles[`status${ticket.status}`] || styles.statusOpen}>
                  {ticket.status}
                </span>
                <button className={styles.editIconBtn} title="Edit Ticket" onClick={() => onEdit(ticket)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className={styles.deleteIconBtn} title="Delete Ticket" onClick={() => onDelete(ticket)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Customer Name</span>
                <span className={styles.metaVal}>{ticket.customerName}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Category</span>
                <span className={styles.metaVal}>{ticket.category}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Priority Level</span>
                <span className={styles.metaValHighlight}>{ticket.priority}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Assigned Agent</span>
                <span className={styles.metaVal}>{ticket.agentName}</span>
              </div>
            </div>
          </div>

          <div className={styles.drawerCard} style={{ borderColor: '#bbf7d0', background: '#fafdfb' }}>
            <div className={styles.drawerCardHeader}>
              <h4 className={styles.drawerCardTitle} style={{ color: '#0f766e' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Connected Issue Tracking
              </h4>
              {ticket.issue ? (
                <span className={styles.issueKeyTag}>{ticket.issue.issueKey}</span>
              ) : (
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>Not Linked</span>
              )}
            </div>

            {ticket.issue ? (
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Engineering Severity</span>
                  <span className={styles[`badge${ticket.issue.severity === 'Critical' ? 'Urgent' : ticket.issue.severity === 'Major' ? 'High' : 'Low'}`]}>
                    {ticket.issue.severity}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>SLA Clock Remaining</span>
                  <span className={ticket.issue.severity === 'Critical' ? styles.slaTagCritical : styles.slaTagMajor}>
                    {ticket.issue.slaRemaining}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Issue Status</span>
                  <span className={styles.metaVal}>{ticket.issue.status}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Assigned Engineer</span>
                  <span className={styles.metaVal}>{ticket.issue.assignedAgent || ticket.agentName}</span>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                This customer query has not been linked to an engineering issue tracker item yet. Click below to escalate and assign an SLA countdown.
              </p>
            )}
          </div>
        </div>

        <div className={styles.drawerActions}>
          {ticket.issue ? (
            <Link href={`/service/issues?issueKey=${ticket.issue.issueKey}`} className={styles.viewIssueCenterBtn}>
              <span>Open in Issue Tracking Center</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ) : (
            <button className={styles.escalateFullBtn} onClick={() => onEscalate(ticket)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <span>Escalate to Issue Tracking Center</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
