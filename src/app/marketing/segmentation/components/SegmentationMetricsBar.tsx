'use client';

import { SegmentationMetrics } from '../types';
import styles from '../segmentation.module.css';

interface SegmentationMetricsBarProps {
  metrics: SegmentationMetrics;
}

export default function SegmentationMetricsBar({ metrics }: SegmentationMetricsBarProps) {
  return (
    <div className={styles.metricsBar}>
      <div className={styles.metricItem}>
        <span className={styles.metricLabel}>Total Customers</span>
        <span className={styles.metricVal}>{metrics.totalCust}</span>
      </div>
      <div className={styles.metricDivider} />

      <div className={styles.metricItem}>
        <span className={styles.metricLabel}>New Customers</span>
        <span className={styles.metricVal}>{metrics.newCust}</span>
        <span className={styles.metricInc}>2.38%</span>
      </div>
      <div className={styles.metricDivider} />

      <div className={styles.metricItem}>
        <span className={styles.metricLabel}>Loyal Customers</span>
        <span className={styles.metricVal}>{metrics.loyalCust}</span>
        <span className={styles.metricInc}>14.5%</span>
      </div>
      <div className={styles.metricDivider} />

      <div className={styles.metricItem}>
        <span className={styles.metricLabel}>Lost Customers</span>
        <span className={styles.metricVal}>{metrics.lostCust}</span>
        <span className={styles.metricInc}>1.0%</span>
      </div>
    </div>
  );
}
