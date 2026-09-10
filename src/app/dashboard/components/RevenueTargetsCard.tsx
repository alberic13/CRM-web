'use client';

import styles from '../dashboard.module.css';

interface RevenueTargetsCardProps {
  targets: {
    target: number;
    actual: number;
    monthlyTarget: number;
    monthlyActual: number;
  };
}

export function RevenueTargetsCard({ targets }: RevenueTargetsCardProps) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.targetMetricsList}>
        <div className={styles.targetMetricItem}>
          <span className={styles.targetLabel}>Annual Revenue Target</span>
          <div className={styles.targetValRow}>
            <span className={styles.targetVal}>${targets.target.toLocaleString()}</span>
            <span className={styles.targetIncBadge}>3.5%</span>
          </div>
        </div>

        <div className={styles.targetMetricItem}>
          <span className={styles.targetLabel}>Actual Annual Revenue</span>
          <div className={styles.targetValRow}>
            <span className={styles.targetVal}>${targets.actual.toLocaleString()}</span>
            <span className={styles.targetIncBadge}>6.2%</span>
          </div>
        </div>

        <div className={styles.targetMetricItem}>
          <span className={styles.targetLabel}>Monthly Revenue Target</span>
          <div className={styles.targetValRow}>
            <span className={styles.targetVal}>${targets.monthlyTarget.toLocaleString()}</span>
            <span className={styles.targetIncBadge}>2.4%</span>
          </div>
        </div>

        <div className={styles.targetMetricItem}>
          <span className={styles.targetLabel}>Actual Monthly Revenue</span>
          <div className={styles.targetValRow}>
            <span className={styles.targetVal}>${targets.monthlyActual.toLocaleString()}</span>
            <span className={styles.targetIncBadge}>2.7%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
