'use client';

import styles from '../queries.module.css';

interface TicketMetricsProps {
  totalTickets: number;
  unresolvedCount: number;
  connectedIssuesCount: number;
}

export function TicketMetrics({ totalTickets, unresolvedCount, connectedIssuesCount }: TicketMetricsProps) {
  return (
    <div className={styles.metricGrid}>
      <div className={styles.metricCard}>
        <span className={styles.metricLabel}>Total Tickets Received</span>
        <div className={styles.metricValRow}>
          <span className={styles.metricVal}>{totalTickets + 143}</span>
          <span className={styles.badgeInc}>+12.4% vs last week</span>
        </div>
      </div>
      <div className={styles.metricCard}>
        <span className={styles.metricLabel}>Unresolved Queries</span>
        <div className={styles.metricValRow}>
          <span className={styles.metricVal} style={{ color: '#ef4444' }}>
            {unresolvedCount}
          </span>
          <span className={styles.badgeDec}>Active Support Queue</span>
        </div>
      </div>
      <div className={styles.metricCard}>
        <span className={styles.metricLabel}>Connected Issue Tracking</span>
        <div className={styles.metricValRow}>
          <span className={styles.metricVal} style={{ color: '#0d9488' }}>
            {connectedIssuesCount} Issues
          </span>
          <span className={styles.badgeInc}>Synced with Engineering</span>
        </div>
      </div>
    </div>
  );
}
