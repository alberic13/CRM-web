'use client';

import { SalesMetrics } from '../types';
import styles from '../reports.module.css';

interface SalesKpiCardsProps {
  metrics: SalesMetrics;
}

export default function SalesKpiCards({ metrics }: SalesKpiCardsProps) {
  return (
    <div className={styles.metricCards4Grid}>
      <div className={styles.miniCard}>
        <span className={styles.miniCardTopLine} />
        <span className={styles.miniCardLabel}>Total Sales</span>
        <span className={styles.miniCardValue}>${metrics.totalSales.toLocaleString()}</span>
        <span className={styles.badgePositive}>{metrics.salesInc}%</span>
      </div>

      <div className={styles.miniCard}>
        <span className={styles.miniCardTopLine} />
        <span className={styles.miniCardLabel}>Total Sales Quantity</span>
        <span className={styles.miniCardValue}>{metrics.totalQty.toLocaleString()}(units)</span>
        <span className={metrics.qtyInc >= 0 ? styles.badgePositive : styles.badgeNegative}>
          {metrics.qtyInc}%
        </span>
      </div>

      <div className={styles.miniCard}>
        <span className={styles.miniCardTopLine} />
        <span className={styles.miniCardLabel}>Average Sales</span>
        <span className={styles.miniCardValue}>${metrics.avgSales.toLocaleString()}</span>
        <span className={styles.badgePositive}>{metrics.salesInc}%</span>
      </div>

      <div className={styles.miniCard}>
        <span className={styles.miniCardTopLine} />
        <span className={styles.miniCardLabel}>Average Sales Quantity</span>
        <span className={styles.miniCardValue}>{metrics.avgQty.toLocaleString()}(units)</span>
        <span className={metrics.qtyInc >= 0 ? styles.badgePositive : styles.badgeNegative}>
          {metrics.qtyInc}%
        </span>
      </div>
    </div>
  );
}
