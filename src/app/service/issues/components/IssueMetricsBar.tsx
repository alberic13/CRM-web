'use client';

import { IssueItem } from '../issues.types';
import styles from '../issues.module.css';

interface IssueMetricsBarProps {
  issuesList: IssueItem[];
}

export default function IssueMetricsBar({ issuesList }: IssueMetricsBarProps) {
  const openCount = issuesList.filter((i) => i.status === 'Open').length;
  const progressCount = issuesList.filter((i) => i.status === 'In Progress').length;
  const escalatedCount = issuesList.filter((i) => i.status === 'Escalated').length;

  return (
    <div className={styles.metricsBar}>
      <div className={styles.metricItem}>
        <span className={styles.metricLabel}>Open Issues</span>
        <span className={styles.metricVal}>{openCount}</span>
      </div>
      <div className={styles.metricDivider} />

      <div className={styles.metricItem}>
        <span className={styles.metricLabel}>In Progress</span>
        <span className={styles.metricVal} style={{ color: '#06b6d4' }}>
          {progressCount}
        </span>
      </div>
      <div className={styles.metricDivider} />

      <div className={styles.metricItem}>
        <span className={styles.metricLabel}>Escalated to Engineering</span>
        <span className={styles.metricVal} style={{ color: '#ef4444' }}>
          {escalatedCount}
        </span>
      </div>
      <div className={styles.metricDivider} />

      <div className={styles.metricItem}>
        <span className={styles.metricLabel}>SLA Compliance Rate</span>
        <span className={styles.metricVal} style={{ color: '#22c55e' }}>
          98.2%
        </span>
      </div>
    </div>
  );
}
