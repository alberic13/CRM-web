'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './solutions.module.css';

interface SolutionArticle {
  id: string;
  title: string;
  category: 'Technical Integration' | 'Billing & Subscription' | 'Account Security' | 'API Reference';
  views: number;
  helpfulCount: number;
  lastUpdated: string;
  summary: string;
}

export default function SolutionsLibraryPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const articles: SolutionArticle[] = [
    {
      id: '1',
      title: 'How to Resolve OAuth2 Bearer Token Renewal Delays',
      category: 'Technical Integration',
      views: 1420,
      helpfulCount: 388,
      lastUpdated: 'Aug 4, 2026',
      summary: 'Step-by-step troubleshooting guide for configuring refresh token rotation policies in mobile and web SDKs.',
    },
    {
      id: '2',
      title: 'Updating Billing Payment Methods & Tax Invoices',
      category: 'Billing & Subscription',
      views: 2190,
      helpfulCount: 612,
      lastUpdated: 'Jul 28, 2026',
      summary: 'Instructions on adding international credit cards, updating company VAT numbers, and downloading automated monthly PDFs.',
    },
    {
      id: '3',
      title: 'Setting Up Multi-Factor Authentication (MFA) & IP Whitelisting',
      category: 'Account Security',
      views: 980,
      helpfulCount: 245,
      lastUpdated: 'Aug 1, 2026',
      summary: 'Enforce TOTP authenticator apps for team workspace members and configure CIDR IP range boundaries.',
    },
    {
      id: '4',
      title: 'Webhooks Rate Limits & Retry Backoff Exponential Standards',
      category: 'API Reference',
      views: 1750,
      helpfulCount: 490,
      lastUpdated: 'Jul 15, 2026',
      summary: 'Complete technical reference detailing HTTP 429 response headers and recommended exponential backoff retry algorithms.',
    },
    {
      id: '5',
      title: 'Customizing Role Permissions for Manager & Agent Tiers',
      category: 'Account Security',
      views: 870,
      helpfulCount: 210,
      lastUpdated: 'Jun 30, 2026',
      summary: 'How workspace Admins can assign fine-grained read/write privileges to sales representatives and marketing operators.',
    },
  ];

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Customer Service" />

      <div className={styles.mainContent}>
        <Header user={user} />

        <main className={styles.contentBody}>
          {/* Header */}
          <div className={styles.topRow}>
            <div>
              <h1 className={styles.pageTitle}>Solutions Library & Knowledge Base</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>Solutions Library</strong>
              </div>
            </div>

            <button className={styles.primaryBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>+ CREATE ARTICLE</span>
            </button>
          </div>

          {/* Search Hero Box */}
          <div className={styles.searchHero}>
            <h2 className={styles.heroTitle}>Search Customer Support Knowledge Base</h2>
            <div className={styles.heroSearchRow}>
              <input
                type="text"
                className={styles.heroSearchInput}
                placeholder="Search troubleshooting guides, API documentation, billing solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.heroSearchBtn}>Search</button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className={styles.tabsRow}>
            {['All', 'Technical Integration', 'Billing & Subscription', 'Account Security', 'API Reference'].map((cat) => (
              <button
                key={cat}
                className={`${styles.tabBtn} ${selectedCategory === cat ? styles.activeTabBtn : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className={styles.articlesGrid}>
            {filteredArticles.map((art) => (
              <div key={art.id} className={styles.articleCard}>
                <span className={styles.categoryBadge}>{art.category}</span>
                <h3 className={styles.articleTitle}>{art.title}</h3>
                <p className={styles.articleSummary}>{art.summary}</p>

                <div className={styles.articleFooter}>
                  <div className={styles.metaGroup}>
                    <span>👁 {art.views} views</span>
                    <span>👍 {art.helpfulCount} helpful</span>
                  </div>
                  <span className={styles.dateText}>Updated {art.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
