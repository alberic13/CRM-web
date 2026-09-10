'use client';

import { AgeStats } from '../types';
import styles from '../segmentation.module.css';

interface AgeDistributionChartProps {
  ageStats: AgeStats;
}

export default function AgeDistributionChart({ ageStats }: AgeDistributionChartProps) {
  return (
    <div className={styles.cardBox}>
      <h2 className={styles.cardTitle}>Age Distribution</h2>
      <div className={styles.ageDistributionWrapper}>
        <svg width="100%" height="200" viewBox="0 0 350 200" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#5d5fef" floodOpacity="0.15" />
            </filter>
          </defs>

          <g filter="url(#shadow)">
            <circle cx="175" cy="100" r="52" fill="none" stroke="#f1f5f9" strokeWidth="15" />
            <circle
              cx="175"
              cy="100"
              r="52"
              fill="none"
              stroke="#c7d2fe"
              strokeWidth="15"
              strokeDasharray="43.8 283"
              transform="rotate(-90 175 100)"
            />
            <circle
              cx="175"
              cy="100"
              r="52"
              fill="none"
              stroke="#4338ca"
              strokeWidth="15"
              strokeDasharray="30.1 296.6"
              transform="rotate(-41.76 175 100)"
            />
            <circle
              cx="175"
              cy="100"
              r="52"
              fill="none"
              stroke="#818cf8"
              strokeWidth="15"
              strokeDasharray="72.5 254.2"
              transform="rotate(-8.64 175 100)"
            />
            <circle
              cx="175"
              cy="100"
              r="52"
              fill="none"
              stroke="#5d5fef"
              strokeWidth="15"
              strokeDasharray="115.7 211"
              transform="rotate(71.28 175 100)"
            />
            <circle
              cx="175"
              cy="100"
              r="52"
              fill="none"
              stroke="#a5b4fc"
              strokeWidth="15"
              strokeDasharray="64.7 262"
              transform="rotate(198.72 175 100)"
            />
          </g>

          <circle cx="196" cy="53" r="3" fill="#c7d2fe" stroke="#ffffff" strokeWidth="1" />
          <polyline points="196,53 218,32 245,32" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="250" y="36" fill="#1e293b" fontSize="11" fontWeight="700">0-20 <tspan fill="#5d5fef" fontWeight="800">({ageStats.p0_20}%)</tspan></text>

          <circle cx="222" cy="78" r="3" fill="#4338ca" stroke="#ffffff" strokeWidth="1" />
          <polyline points="222,78 245,82 270,82" fill="none" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="275" y="86" fill="#1e293b" fontSize="11" fontWeight="700">&gt;50 <tspan fill="#4338ca" fontWeight="800">({ageStats.pOver50}%)</tspan></text>

          <circle cx="219" cy="127" r="3" fill="#818cf8" stroke="#ffffff" strokeWidth="1" />
          <polyline points="219,127 240,150 265,150" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="270" y="154" fill="#1e293b" fontSize="11" fontWeight="700">41-50 <tspan fill="#818cf8" fontWeight="800">({ageStats.p41_50}%)</tspan></text>

          <circle cx="138" cy="137" r="3" fill="#5d5fef" stroke="#ffffff" strokeWidth="1" />
          <polyline points="138,137 110,160 80,160" fill="none" stroke="#5d5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="75" y="164" textAnchor="end" fill="#1e293b" fontSize="11" fontWeight="700">31-40 <tspan fill="#5d5fef" fontWeight="800">({ageStats.p31_40}%)</tspan></text>

          <circle cx="145" cy="58" r="3" fill="#a5b4fc" stroke="#ffffff" strokeWidth="1" />
          <polyline points="145,58 120,35 90,35" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="85" y="39" textAnchor="end" fill="#1e293b" fontSize="11" fontWeight="700">21-30 <tspan fill="#6366f1" fontWeight="800">({ageStats.p21_30}%)</tspan></text>
        </svg>
      </div>
    </div>
  );
}
