'use client';

import { BehaviorLineRow } from '../types';
import styles from '../segmentation.module.css';

interface PurchaseBehaviorChartProps {
  behaviorLineRows: BehaviorLineRow[];
}

export default function PurchaseBehaviorChart({ behaviorLineRows }: PurchaseBehaviorChartProps) {
  const yTicks = [
    { y: 30, label: '>14' },
    { y: 65, label: '10' },
    { y: 100, label: '6' },
    { y: 135, label: '2' },
    { y: 150, label: '0' },
  ];

  const xTicks = [
    { x: 45, label: '0' },
    { x: 85, label: '10' },
    { x: 125, label: '20' },
    { x: 165, label: '30' },
    { x: 205, label: '40' },
    { x: 245, label: '50' },
    { x: 285, label: '60' },
  ];

  return (
    <div className={styles.cardBox}>
      <h2 className={styles.cardTitle}>Purchase Behavior Analysis</h2>
      <div className={styles.behaviorChartWrapper}>
        <svg width="100%" height="210" viewBox="0 0 340 190" style={{ overflow: 'visible' }}>
          <text
            x="-90"
            y="15"
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9.5"
            fontWeight="600"
          >
            (Purchase Frequency)
          </text>

          <line x1="45" y1="20" x2="45" y2="150" stroke="#e0e7ff" strokeWidth="1.5" />
          <line x1="45" y1="150" x2="295" y2="150" stroke="#e0e7ff" strokeWidth="1.5" />

          {yTicks.map((tick) => (
            <g key={tick.label}>
              <line x1="40" y1={tick.y} x2="45" y2={tick.y} stroke="#c7d2fe" strokeWidth="1.2" />
              <text x="36" y={tick.y + 3} textAnchor="end" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                {tick.label}
              </text>
            </g>
          ))}

          {xTicks.map((tick) => (
            <g key={tick.label}>
              <line x1={tick.x} y1="150" x2={tick.x} y2="155" stroke="#c7d2fe" strokeWidth="1.2" />
              <text x={tick.x} y="168" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                {tick.label}
              </text>
            </g>
          ))}

          <text x="295" y="168" textAnchor="start" fill="#94a3b8" fontSize="9.5" fontWeight="600">
            (Age)
          </text>

          {behaviorLineRows.map((row, rIdx) => (
            <g key={rIdx}>
              <line
                x1={row.fullRange.x1}
                y1={row.y}
                x2={row.fullRange.x2}
                y2={row.y}
                stroke="#c7d2fe"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <line
                x1={row.midRange.x1}
                y1={row.y}
                x2={row.midRange.x2}
                y2={row.y}
                stroke="#818cf8"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.85"
              />
              <line
                x1={row.coreRange.x1}
                y1={row.y}
                x2={row.coreRange.x2}
                y2={row.y}
                stroke="#5d5fef"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
