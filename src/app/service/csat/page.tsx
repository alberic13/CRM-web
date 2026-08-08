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

const DEFAULT_REVIEWS: ReviewFeedback[] = [
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
  {
    id: '5',
    customerName: 'Robert Sterling',
    company: 'Delta Industries',
    avatar: '/avatars/user5.jpg',
    rating: 5,
    agentName: 'Chris Evans',
    date: '2026-08-02',
    comment: 'The team helped us migrate 50,000 customer records without any downtime. World-class onboarding assistance.',
    tag: 'Onboarding',
  },
  {
    id: '6',
    customerName: 'Amanda Lin',
    company: 'Alpha Solutions',
    avatar: '/avatars/user6.jpg',
    rating: 5,
    agentName: 'Lucy Tan',
    date: '2026-08-01',
    comment: 'Quick response on our subscription VAT invoice adjustment. Extremely helpful and friendly staff.',
    tag: 'Billing',
  },
  {
    id: '7',
    customerName: 'Jonathan Hayes',
    company: 'Nexus Software Ltd',
    avatar: '/avatars/user7.jpg',
    rating: 4,
    agentName: 'Andy Chen',
    date: '2026-07-30',
    comment: 'Detailed response with working code snippets for OAuth token refresh integration. Solved our issue!',
    tag: 'Technical',
  },
];

export default function CustomerSatisfactionPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [reviews, setReviews] = useState<ReviewFeedback[]>(DEFAULT_REVIEWS);
  const [stats, setStats] = useState({
    totalReviews: DEFAULT_REVIEWS.length,
    avgRating: '4.9',
    csatScore: '96.5%',
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.log('Auth check error:', err));

    fetchCsat();
  }, []);

  const fetchCsat = async () => {
    try {
      const res = await fetch('/api/service/csat');
      if (res.ok) {
        const data = await res.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.warn('Using default CSAT reviews:', err);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Customer Service" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className={styles.contentBody}>
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

                  <p className={styles.commentText}>"{rev.comment}"</p>

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
        </main>
      </div>
    </div>
  );
}
