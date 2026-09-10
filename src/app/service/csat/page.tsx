'use client';

import AppShell from '@/components/AppShell';
import { useCsat } from './useCsat';
import styles from './csat.module.css';

export default function CustomerSatisfactionPage() {
  const { reviews, stats } = useCsat();

  return (
    <AppShell activeMenu="Customer Service">
      {/* Header */}
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.pageTitle}>Customer Satisfaction (CSAT) &amp; Feedback</h1>
          <div className={styles.breadcrumbs}>
            <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>CSAT &amp; Feedback</strong>
          </div>
        </div>
      </div>

      {/* Metric Bar */}
      <div className={styles.metricGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Overall CSAT Score</span>
          <div className={styles.valRow}>
            <span className={styles.metricVal}>{stats.csatScore}</span>
            <span className={styles.incBadge}>Synced from DB</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Average Star Rating</span>
          <div className={styles.valRow}>
            <span className={styles.metricVal} style={{ color: '#eab308' }}>
              {stats.avgRating} / 5.0
            </span>
            <span className={styles.starsSpan}>★★★★★</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Feedback Reviews</span>
          <div className={styles.valRow}>
            <span className={styles.metricVal} style={{ color: '#06b6d4' }}>
              {stats.totalReviews || reviews.length}
            </span>
            <span className={styles.incBadge}>Live Customer Ratings</span>
          </div>
        </div>
      </div>

      {/* Feedback Reviews Grid */}
      <div className={styles.cardBox}>
        <h2 className={styles.cardTitle}>Recent Customer Feedback &amp; Reviews</h2>

        <div className={styles.reviewsList}>
          {reviews.map((rev) => (
            <div key={rev.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  <img src={rev.avatar || '/avatars/user1.jpg'} alt={rev.customerName} className={styles.avatarImg} />
                  <div>
                    <div className={styles.userName}>{rev.customerName}</div>
                    <div className={styles.userCompany}>{rev.company}</div>
                  </div>
                </div>

                <div className={styles.ratingGroup}>
                  <div className={styles.starsText}>{'★'.repeat(rev.rating)}</div>
                  <span className={styles.dateText}>{rev.date}</span>
                </div>
              </div>

              <p className={styles.commentText}>&quot;{rev.comment}&quot;</p>

              <div className={styles.reviewFooter}>
                <span className={styles.agentTag}>
                  Handled by: <strong>{rev.agentName}</strong>
                </span>
                <span className={styles.categoryBadge}>{rev.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
