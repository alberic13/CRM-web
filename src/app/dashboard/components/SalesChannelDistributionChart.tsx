'use client';

import styles from '../dashboard.module.css';

interface SalesChannelDistributionChartProps {
  donutPaths: {
    retailD: string;
    onlineD: string;
    onlinePct: number;
    retailPct: number;
  };
}

export function SalesChannelDistributionChart({ donutPaths }: SalesChannelDistributionChartProps) {
  return (
    <div className={styles.cardBox}>
      <h2 className={styles.cardTitle}>Sales Channel Distribution</h2>
      <div className={styles.donutWrapper}>
        <svg className={styles.donutSvg} viewBox="0 0 200 200">
          <path d={donutPaths.retailD} fill="#c7d2fe" />
          <path d={donutPaths.onlineD} fill="#5b5cf0" />

          <text x="65" y="118" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
            Online ({donutPaths.onlinePct}%)
          </text>

          <text x="138" y="62" textAnchor="middle" fill="#4338ca" fontSize="11" fontWeight="700">
            Retail ({donutPaths.retailPct}%)
          </text>
        </svg>
      </div>
    </div>
  );
}
