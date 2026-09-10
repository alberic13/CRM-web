'use client';

import { ProductPreference } from '../types';
import styles from '../reports.module.css';

interface ProductPreferencesCardProps {
  products: ProductPreference[];
}

export default function ProductPreferencesCard({ products }: ProductPreferencesCardProps) {
  return (
    <div className={styles.cardBox}>
      <h2 className={styles.cardTitle}>Product Preferences Top Ranking</h2>
      <div className={styles.productPrefGrid}>
        {products.slice(0, 5).map((p) => (
          <div key={p.rank} className={styles.prefItem}>
            <div className={styles.prefLeft}>
              <span className={styles.prefRank}>{p.rank}</span>
              <span className={styles.prefAvatar}>📦</span>
              <span>{p.name}</span>
            </div>
            <span className={styles.prefQty}>{p.qty.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
