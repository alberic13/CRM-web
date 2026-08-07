'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './csat.module.css';

interface ReviewFeedback {
  id: string;
  customerName: string;
  company: string;
  avatar: string;
  rating: number; // out of 5
  agentName: string;
  date: string;
  comment: string;
  tag: 'Technical' | 'Billing' | 'Onboarding';
}

export default function CustomerSatisfactionPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const reviews: ReviewFeedback[] = [
    {
      id: '1',
      customerName: 'Marcus Vance',
      company: 'Bright Solutions',
      avatar: '/avatars/user1.jpg',
      rating: 5,
      agentName: 'Chris Evans',
      date: '2026-08-06',
      comment: 'Chris resolved our API rate limit configuration in under 10 minutes. Stellar customer support!',
      tag: 'Technical',
    },
    {
      id: '2',
      customerName: 'Sarah Jenkins',
      company: 'GlobalMart Inc.',
      avatar: '/avatars/user2.jpg',
      rating: 5,
      agentName: 'Shirley.H',
      date: '2026-08-05',
      comment: 'Very clear explanation of our enterprise invoice details and tier discounts. Thank you Shirley!',
      tag: 'Billing',
    },
    {
      id: '3',
      customerName: 'David K.',
      company: 'Pi Enterprises',
      avatar: '/avatars/user3.jpg',
      rating: 4,
      agentName: 'Andy Chen',
      date: '2026-08-04',
      comment: 'Great guidance on setting up custom domain SSL certificates. Highly responsive support team.',
      tag: 'Onboarding',
    },
    {
      id: '4',
      customerName: 'Elena Rostova',
      company: 'Visionary Tech',
      avatar: '/avatars/user4.jpg',
      rating: 5,
      agentName: 'Lucy Tan',
      date: '2026-08-03',
      comment: 'Smooth resolution to our webhook payload retry delay. The agent followed up proactive twice!',
      tag: 'Technical',
    },
  ];

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Customer Service" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className={styles.contentBody}>
          {/* Header */}
          <div className={styles.topRow}>
            <div>
              <h1 className={styles.pageTitle}>Customer Satisfaction (CSAT) & Feedback</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>CSAT & Feedback</strong>
              </div>
            </div>
          </div>

          {/* Metric Bar */}
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Overall CSAT Score</span>
              <div className={styles.valRow}>
                <span className={styles.metricVal}>94.8%</span>
                <span className={styles.incBadge}>+2.1% vs last month</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Average Star Rating</span>
              <div className={styles.valRow}>
                <span className={styles.metricVal} style={{ color: '#eab308' }}>4.8 / 5.0</span>
                <span className={styles.starsSpan}>★★★★★</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Feedback Reviews</span>
              <div className={styles.valRow}>
                <span className={styles.metricVal} style={{ color: '#06b6d4' }}>324</span>
                <span className={styles.incBadge}>98.5% Positive</span>
              </div>
            </div>
          </div>

          {/* Feedback Reviews Grid */}
          <div className={styles.cardBox}>
            <h2 className={styles.cardTitle}>Recent Customer Feedback & Reviews</h2>

            <div className={styles.reviewsList}>
              {reviews.map((rev) => (
                <div key={rev.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.userInfo}>
                      <img src={rev.avatar} alt={rev.customerName} className={styles.avatarImg} />
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

                  <p className={styles.commentText}>"{rev.comment}"</p>

                  <div className={styles.reviewFooter}>
                    <span className={styles.agentTag}>Handled by: <strong>{rev.agentName}</strong></span>
                    <span className={styles.categoryBadge}>{rev.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
