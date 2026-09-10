'use client';

import { PurchasingCustomerMonth } from '../types';
import styles from '../reports.module.css';

interface PurchasingCustomersChartProps {
  purchasingCustData: PurchasingCustomerMonth[];
  months: string[];
}

export default function PurchasingCustomersChart({
  purchasingCustData,
  months,
}: PurchasingCustomersChartProps) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Purchasing customers</h2>
        <div className={styles.legendGroup} style={{ gap: '14px' }}>
          <div className={styles.legendItem}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#a7f3d0', borderRadius: '2px', display: 'inline-block' }} />
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Total number of customers</span>
          </div>
          <div className={styles.legendItem}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '2px', display: 'inline-block' }} />
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Monthly number of purchasing customers</span>
          </div>
        </div>
      </div>

      <div className={styles.comboChartContainer} style={{ marginTop: '12px' }}>
        <div className={styles.yAxis} style={{ gap: '22px', fontSize: '11px', color: '#94a3b8' }}>
          <span>1100</span>
          <span>800</span>
          <span>500</span>
          <span>200</span>
        </div>

        <div className={styles.chartBody}>
          <svg className={styles.svgCombo} viewBox="0 0 500 160" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="43" x2="500" y2="43" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="86" x2="500" y2="86" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="129" x2="500" y2="129" stroke="#e2e8f0" strokeWidth="1" />

            {purchasingCustData.map((d, i) => {
              const barWidth = 18;
              const xPos = 12 + i * 41;
              const totalHeight = (d.total / 1100) * 160;
              const purchasingHeight = (d.purchasing / 1100) * 160;
              const yTotal = 160 - totalHeight;
              const yPurchasing = 160 - purchasingHeight;

              return (
                <g key={i}>
                  <rect
                    x={xPos}
                    y={yTotal}
                    width={barWidth}
                    height={totalHeight}
                    fill="#a7f3d0"
                    rx="4"
                    ry="4"
                  />
                  <rect
                    x={xPos}
                    y={yPurchasing}
                    width={barWidth}
                    height={purchasingHeight}
                    fill="#10b981"
                    rx="4"
                    ry="4"
                  />
                </g>
              );
            })}
          </svg>

          <div className={styles.xAxis} style={{ fontSize: '11px', color: '#64748b' }}>
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
