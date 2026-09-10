'use client';

import { SourceStats } from '../types';
import styles from '../segmentation.module.css';

interface CustomerSourceChartProps {
  sourceStats: SourceStats;
}

export default function CustomerSourceChart({ sourceStats }: CustomerSourceChartProps) {
  return (
    <div className={styles.cardBox}>
      <h2 className={styles.cardTitle}>Customer source</h2>
      <div className={styles.donutContainer}>
        <svg className={styles.sourceSvg} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="16" />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#5d5fef"
            strokeWidth="16"
            strokeDasharray={`${sourceStats.onlineDash} ${sourceStats.circum}`}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="48" textAnchor="middle" fill="#5d5fef" fontSize="7" fontWeight="bold">
            Online
          </text>
          <text x="50" y="56" textAnchor="middle" fill="#5d5fef" fontSize="7" fontWeight="bold">
            {sourceStats.onlinePct}%
          </text>
        </svg>
      </div>
    </div>
  );
}
