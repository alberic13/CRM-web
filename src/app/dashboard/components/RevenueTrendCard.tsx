'use client';

import { TrendTab } from '../types';
import styles from '../dashboard.module.css';

interface RevenueTrendCardProps {
  trendTab: TrendTab;
  onTabChange: (tab: TrendTab) => void;
  chartData: {
    points: { x: number; y: number }[];
    pathD: string;
    strokeD: string;
    labels: string[];
  };
}

export function RevenueTrendCard({ trendTab, onTabChange, chartData }: RevenueTrendCardProps) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Revenue Trend</h2>
        <div className={styles.toggleButtonGroup}>
          {(['Daily', 'Weekly', 'Monthly'] as TrendTab[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.toggleBtn} ${trendTab === tab ? styles.toggleBtnActive : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          <span className={styles.yAxisTitle}>Revenue</span>
          <span>9,000</span>
          <span>6,000</span>
          <span>3,000</span>
          <span>0</span>
        </div>

        <div className={styles.chartBody}>
          <svg className={styles.svgChart} viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path d={chartData.pathD} fill="url(#gradTrend)" />
            <path d={chartData.strokeD} fill="none" stroke="#6366f1" strokeWidth="3" />

            {chartData.points.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="#6366f1"
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </svg>

          <div className={styles.xAxis}>
            {chartData.labels.map((lbl, i) => (
              <span key={i}>{lbl}</span>
            ))}
            <span className={styles.xAxisTitle}>Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
