'use client';

import { ChannelPercentages, CountryStat } from '../types';
import styles from '../reports.module.css';

interface ChannelDistributionCardProps {
  selectedCountry: string | null;
  channelPct: ChannelPercentages;
  donutDash: string;
  countryStats: CountryStat[];
  onCountrySelect: (name: string) => void;
}

export default function ChannelDistributionCard({
  selectedCountry,
  channelPct,
  donutDash,
  countryStats,
  onCountrySelect,
}: ChannelDistributionCardProps) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          Sales channel distribution <span className={styles.cardSubtitle}>(Sales proportion {selectedCountry ? `- ${selectedCountry}` : ''})</span>
        </h2>
      </div>

      <div className={styles.channelMapGrid}>
        <div className={styles.channelContent}>
          <svg width="220" height="200" viewBox="0 0 150 130">
            <circle cx="65" cy="60" r="34" fill="none" stroke="#c7d2fe" strokeWidth="18" />
            <circle
              cx="65"
              cy="60"
              r="34"
              fill="none"
              stroke="#5d5fef"
              strokeWidth="18"
              strokeDasharray={donutDash}
              transform="rotate(-90 65 60)"
            />
            <polyline
              points="44,39 26,21 8,21"
              fill="none"
              stroke="#818cf8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="44" cy="39" r="2.5" fill="#4338ca" />
            <text x="8" y="14" textAnchor="start" fill="#4338ca" fontSize="10.5" fontWeight="800">
              {channelPct.online}%
            </text>

            <polyline
              points="88,79 108,102 142,102"
              fill="none"
              stroke="#5d5fef"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="88" cy="79" r="2.5" fill="#5d5fef" />
            <text x="142" y="93" textAnchor="end" fill="#5d5fef" fontSize="10.5" fontWeight="800">
              {channelPct.retail}%
            </text>
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '3px', background: '#5d5fef' }} />
              <span>Retail ({channelPct.retail}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '3px', background: '#c7d2fe' }} />
              <span>Online ({channelPct.online}%)</span>
            </div>
          </div>
        </div>

        <div className={styles.mapContent}>
          <img src="/images/worldMap.png" alt="World Regional Map" className={styles.worldMapImage} />
          <div className={styles.countryList}>
            {countryStats.map((c) => {
              const isSelected = selectedCountry === c.name;
              return (
                <div
                  key={c.name}
                  className={`${styles.countryRow} ${isSelected ? styles.countryRowActive : ''}`}
                  onClick={() => onCountrySelect(c.name)}
                  title={`Click to filter diagrams by ${c.name}`}
                >
                  <img src={c.flag} alt={c.name} className={styles.flagIconImg} />
                  <span className={styles.countryName}>{c.name}</span>
                  <div className={styles.countryProgress}>
                    <div className={styles.countryFill} style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                  </div>
                  <span className={styles.countryPctText}>{c.pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
