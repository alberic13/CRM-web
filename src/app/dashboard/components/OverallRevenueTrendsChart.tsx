'use client';

import { TrendPoint } from '../types';
import styles from '../dashboard.module.css';

interface OverallRevenueTrendsChartProps {
  points: TrendPoint[];
}

export function OverallRevenueTrendsChart({ points }: OverallRevenueTrendsChartProps) {
  return (
    <div className={styles.cardBox} style={{ position: 'relative' }}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Overall Revenue Trends</h2>
        <div className={styles.legendGroup}>
          <div className={styles.legendItem}>
            <span className={styles.legendLineBlue} />
            <span>Total Revenue</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendLineGreen} />
            <span>Online Channel</span>
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          <span className={styles.yAxisTitle}>Revenue</span>
          <span>10,000</span>
          <span>0</span>
        </div>

        <div className={styles.chartBody}>
          <svg className={styles.svgChart} viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5d5fef" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#5d5fef" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d="M 0 190 Q 40 185, 80 180 T 160 160 T 240 140 T 320 120 T 400 110 T 500 60 L 500 200 L 0 200 Z"
              fill="url(#gradGreen)"
            />
            <path
              d="M 0 190 Q 40 185, 80 180 T 160 160 T 240 140 T 320 120 T 400 110 T 500 60"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
            />

            <path
              d="M 0 190 Q 40 170, 80 160 T 160 130 T 240 90 T 320 70 T 400 60 T 500 20 L 500 200 L 0 200 Z"
              fill="url(#gradBlue)"
            />
            <path
              d="M 0 190 Q 40 170, 80 160 T 160 130 T 240 90 T 320 70 T 400 60 T 500 20"
              fill="none"
              stroke="#5d5fef"
              strokeWidth="3"
            />

            {points.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="#5d5fef"
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </svg>

          <div className={styles.xAxis}>
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
            <span className={styles.xAxisTitle}>month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
