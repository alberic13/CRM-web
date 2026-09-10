'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { IssueItem } from './issues.types';
import IssueMetricsBar from './components/IssueMetricsBar';
import IssueTable from './components/IssueTable';
import styles from './issues.module.css';

function IssueTrackingContent() {
  const searchParams = useSearchParams();
  const highlightKey = searchParams.get('issueKey') || '';
  const [issuesList, setIssuesList] = useState<IssueItem[]>([]);

  useEffect(() => {
    let ignore = false;
    fetch('/api/service/issues')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.issues) {
          setIssuesList(data.issues);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AppShell activeMenu="Customer Service">
      {/* Header */}
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.pageTitle}>Issue Tracking &amp; SLA Center</h1>
          <div className={styles.breadcrumbs}>
            <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>Issue Tracking</strong>
          </div>
        </div>

        <Link href="/service/queries" className={styles.backBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Customer Queries</span>
        </Link>
      </div>

      {/* Metrics Bar */}
      <IssueMetricsBar issuesList={issuesList} />

      {/* Issues Table */}
      <IssueTable issuesList={issuesList} highlightKey={highlightKey} />
    </AppShell>
  );
}

export default function IssueTrackingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading Issue Tracking...</div>}>
      <IssueTrackingContent />
    </Suspense>
  );
}
