'use client';

import styles from '../Sidebar.module.css';

export function HelpDeskWidget() {
  return (
    <div className={styles.bottomSection}>
      <button className={styles.moreServiceBtn}>
        <span>MORE SERVICE</span>
        <span className={styles.starBurstIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <polygon
              points="12 2 14.8 4.6 18.6 3.7 18.9 7.6 22.4 9.2 20.6 12.7 22.4 16.2 18.9 17.8 18.6 21.7 14.8 20.8 12 23.4 9.2 20.8 5.4 21.7 5.1 17.8 1.6 16.2 3.4 12.7 1.6 9.2 5.1 7.6 5.4 3.7 9.2 4.6"
              fill="#ffffff"
            />
            <text x="12" y="14" fill="#6366f1" fontSize="6.5" fontWeight="900" textAnchor="middle">
              NEW
            </text>
          </svg>
        </span>
      </button>

      <div className={styles.helpDeskCard}>
        <div className={styles.illustrationArea}>
          <svg width="160" height="110" viewBox="0 0 160 110">
            <circle cx="65" cy="20" r="4" fill="#e2e8f0" />
            <circle cx="115" cy="25" r="5" fill="#cbd5e1" />
            <path d="M115 20 A 4 4 0 0 1 119 24 L115 28 L111 24 Z" fill="#cbd5e1" />

            <circle cx="48" cy="38" r="16" fill="none" stroke="#ff8a75" strokeWidth="2.5" strokeDasharray="3 2" />
            <polyline points="48 30 48 38 54 38" stroke="#ff8a75" strokeWidth="2" strokeLinecap="round" />
            <text x="40" y="62" fill="#6366f1" fontSize="10" fontWeight="900">24/7</text>
            <text x="36" y="70" fill="#6366f1" fontSize="6" fontWeight="700">SERVICE</text>

            <rect x="110" y="32" width="18" height="12" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <circle cx="115" cy="38" r="1" fill="#94a3b8" />
            <circle cx="119" cy="38" r="1" fill="#94a3b8" />
            <circle cx="123" cy="38" r="1" fill="#94a3b8" />

            <path d="M 85 45 C 75 45, 75 60, 85 68 C 95 60, 95 45, 85 45 Z" fill="#ffcdb2" />
            <circle cx="92" cy="40" r="10" fill="#334155" />
            <circle cx="85" cy="45" r="9" fill="#475569" />
            <path d="M 76 46 A 8 8 0 0 1 92 46" fill="none" stroke="#1e293b" strokeWidth="2" />
            <rect x="91" y="44" width="3" height="5" rx="1" fill="#1e293b" />
            <path d="M 92 47 L 88 52" stroke="#1e293b" strokeWidth="1.5" />

            <path d="M 68 85 C 68 70, 102 70, 102 85 L 110 110 L 60 110 Z" fill="#ff7a65" />
            <path d="M 50 82 C 60 80, 68 86, 75 88" stroke="#ffcdb2" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        <button className={styles.helpDeskBtn}>HELP DESK</button>
      </div>
    </div>
  );
}
