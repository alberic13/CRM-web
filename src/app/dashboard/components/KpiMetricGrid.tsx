'use client';

import { DashboardMetrics } from '../types';
import styles from '../dashboard.module.css';

interface KpiMetricGridProps {
  metrics: DashboardMetrics;
}

export function KpiMetricGrid({ metrics }: KpiMetricGridProps) {
  return (
    <div className={styles.kpiGrid}>
      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Total Revenue</span>
        <div className={styles.kpiValueRow}>
          <span className={styles.kpiValue}>${metrics.totalRevenue.toLocaleString()}</span>
          <span className={styles.badgeIncPositive}>+{metrics.totalRevenueInc}%</span>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Total Quantity</span>
        <div className={styles.kpiValueRow}>
          <span className={styles.kpiValue}>{metrics.totalQuantity.toLocaleString()}</span>
          <span className={metrics.totalQuantityInc >= 0 ? styles.badgeIncPositive : styles.badgeIncNegative}>
            {metrics.totalQuantityInc >= 0 ? '+' : ''}{metrics.totalQuantityInc}%
          </span>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Number of Orders</span>
        <div className={styles.kpiValueRow}>
          <span className={styles.kpiValue}>{metrics.numberOrders.toLocaleString()}</span>
          <span className={styles.badgeIncPositive}>+{metrics.numberOrdersInc}%</span>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Average Order Value</span>
        <div className={styles.kpiValueRow}>
          <span className={styles.kpiValue}>${metrics.averageOrderValue.toFixed(2)}</span>
          <span className={styles.badgeIncPositive}>+{metrics.averageOrderValueInc}%</span>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Customer Count</span>
        <div className={styles.kpiValueRow}>
          <span className={styles.kpiValue}>{metrics.customerCount.toLocaleString()}</span>
          <span className={metrics.customerCountInc >= 0 ? styles.badgeIncPositive : styles.badgeIncNegative}>
            {metrics.customerCountInc >= 0 ? '+' : ''}{metrics.customerCountInc}%
          </span>
        </div>
      </div>
    </div>
  );
}
