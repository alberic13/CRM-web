'use client';

import { TrendItem } from '../types';
import styles from '../reports.module.css';

interface SalesTrendChartProps {
  trendData: TrendItem[];
  selectedCountry: string | null;
  months: string[];
}

export default function SalesTrendChart({
  trendData,
  selectedCountry,
  months,
}: SalesTrendChartProps) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          Sales Trend {selectedCountry ? `(${selectedCountry})` : ''}
        </h2>
        <div className={styles.legendGroup}>
          <div className={styles.legendItem}>
            <span className={styles.legendSquareBlue} />
            <span>Sales Revenue</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendSquareGreen} />
            <span>Sales volume</span>
          </div>
        </div>
      </div>

      <div className={styles.comboChartContainer}>
        <div className={styles.yAxis}>
          <span>600</span>
          <span>450</span>
          <span>300</span>
          <span>150</span>
          <span>0</span>
        </div>

        <div className={styles.chartBody}>
          <svg className={styles.svgCombo} viewBox="0 0 500 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradRevenueArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5d5fef" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#5d5fef" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="45" x2="500" y2="45" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="135" x2="500" y2="135" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeWidth="1" />

            {trendData.map((d, i) => {
              const barWidth = 16;
              const xPos = 12 + i * 41;
              const barHeight = (d.volume / 600) * 180;
              const yPos = 180 - barHeight;

              return (
                <g key={i}>
                  <rect
                    x={xPos}
                    y={yPos}
                    width={barWidth}
                    height={barHeight}
                    fill="#34d399"
                    rx="5"
                    ry="5"
                  />
                  <text
                    x={xPos + barWidth / 2}
                    y={Math.max(10, yPos - 3)}
                    textAnchor="middle"
                    fill="#059669"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {d.volume}
                  </text>
                </g>
              );
            })}

            <path
              d="
                M 20 63
                C 30 55, 50 100, 61 90
                C 80 75, 90 70, 102 66
                C 120 75, 130 78, 143 72
                C 160 50, 170 40, 184 39
                C 200 80, 210 90, 225 81
                C 240 40, 250 20, 266 18
                C 280 15, 290 20, 307 20
                C 320 80, 330 85, 348 81
                C 360 85, 370 85, 389 81
                C 410 65, 420 50, 430 48
                C 450 35, 460 30, 471 36
                L 471 180 L 20 180 Z
              "
              fill="url(#gradRevenueArea)"
            />

            <path
              d="
                M 20 63
                C 30 55, 50 100, 61 90
                C 80 75, 90 70, 102 66
                C 120 75, 130 78, 143 72
                C 160 50, 170 40, 184 39
                C 200 80, 210 90, 225 81
                C 240 40, 250 20, 266 18
                C 280 15, 290 20, 307 20
                C 320 80, 330 85, 348 81
                C 360 85, 370 85, 389 81
                C 410 65, 420 50, 430 48
                C 450 35, 460 30, 471 36
              "
              fill="none"
              stroke="#5d5fef"
              strokeWidth="2.5"
            />
          </svg>

          <div className={styles.xAxis}>
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
