'use client';

import { CustomerAnalysisStats } from '../types';
import styles from '../reports.module.css';

interface CustomerAnalysisCardProps {
  stats: CustomerAnalysisStats;
}

export default function CustomerAnalysisCard({ stats }: CustomerAnalysisCardProps) {
  return (
    <div className={styles.cardBox}>
      <h2 className={styles.cardTitle}>Customer Analysis</h2>

      <div className={styles.customerAnalysisContent}>
        <div className={styles.pieDiagramArea}>
          <svg width="380" height="180" viewBox="0 0 380 180">
            <circle cx="80" cy="95" r="60" fill="#e0e7ff" />
            <path d="M 80 95 L 80 35 A 60 60 0 0 1 135 120 Z" fill="#5d5fef" />
            <line x1="80" y1="35" x2="298" y2="70" stroke="#a5b4fc" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="135" y1="120" x2="295" y2="122" stroke="#a5b4fc" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="310" cy="95" r="30" fill="#5d5fef" />
            <path d="M 310 95 L 280 100 A 30 30 0 0 1 298 68 Z" fill="#818cf8" />
            <text x="82" y="82" fill="#ffffff" fontSize="10" fontWeight="bold">
              {stats.acquisition}%
            </text>
            <text x="190" y="78" textAnchor="middle" fill="#5d5fef" fontSize="13" fontWeight="bold">
              New Customers
            </text>
            <text x="310" y="92" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              Online
            </text>
            <text x="310" y="104" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              ({stats.onlinePct}%)
            </text>
          </svg>
        </div>

        <div className={styles.rightAnalysisCol}>
          <div className={styles.custMetricsGroup}>
            <div className={styles.custStatCard}>
              <span className={styles.custLabel}>Total Customers</span>
              <div className={styles.custValRow}>
                <span className={styles.custVal}>{stats.totalCust.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.custStatCard}>
              <span className={styles.custLabel}>Customer Retention</span>
              <div className={styles.custValRow}>
                <span className={styles.custVal}>{stats.retentionStr}%</span>
                <div className={styles.dividerLine} />
                <span className={styles.badgeTrendPositive}>▲ +1.2%</span>
              </div>
            </div>

            <div className={styles.custStatCard}>
              <span className={styles.custLabel}>New Acquisition</span>
              <div className={styles.custValRow}>
                <span className={styles.custVal}>{stats.acquisition}%</span>
                <div className={styles.dividerLine} />
                <span className={styles.badgeTrendPositive}>▲ +2.4%</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div className={styles.barLegendRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className={styles.legendSquareMint} />
                <span>Repeat Purchasing ({stats.repeatPct}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className={styles.legendSquareEmerald} />
                <span>One-time Purchasing ({stats.oneTimePct}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className={styles.legendSquareDarkGreen} />
                <span>Non-purchasing ({stats.nonPurchasingPct}%)</span>
              </div>
            </div>

            <div className={styles.stackedProgressBar}>
              <div className={styles.segRepeat} style={{ width: `${stats.repeatPct}%` }}>
                {stats.repeatPct}%
              </div>
              <div className={styles.segOneTime} style={{ width: `${stats.oneTimePct}%` }}>
                {stats.oneTimePct}%
              </div>
              <div className={styles.segNonPurchasing} style={{ width: `${stats.nonPurchasingPct}%` }}>
                {stats.nonPurchasingPct}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
