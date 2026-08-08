'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './issues.module.css';

interface IssueItem {
  id: string;
  issueKey: string;
  title: string;
  affectedCustomer: string;
  status: 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
  assignedAgent: string;
  avatar: string;
  slaRemaining: string;
  severity: 'Critical' | 'Major' | 'Minor';
  ticket?: {
    ticketNo?: string;
  } | null;
}

function IssueTrackingContent() {
  const searchParams = useSearchParams();
  const highlightKey = searchParams.get('issueKey') || '';

  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [issuesList, setIssuesList] = useState<IssueItem[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });

    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/service/issues');
      if (res.ok) {
        const data = await res.json();
        if (data.issues) {
          setIssuesList(data.issues);
        }
      }
    } catch (err) {
      console.warn('Fetch issues error:', err);
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

          {/* Metric Bar */}
          <div className={styles.metricsBar}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Open Issues</span>
              <span className={styles.metricVal}>{issuesList.filter((i) => i.status === 'Open').length}</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>In Progress</span>
              <span className={styles.metricVal} style={{ color: '#06b6d4' }}>
                {issuesList.filter((i) => i.status === 'In Progress').length}
              </span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Escalated to Engineering</span>
              <span className={styles.metricVal} style={{ color: '#ef4444' }}>
                {issuesList.filter((i) => i.status === 'Escalated').length}
              </span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>SLA Compliance Rate</span>
              <span className={styles.metricVal} style={{ color: '#22c55e' }}>
                98.2%
              </span>
            </div>
          </div>

          {/* Issues Table */}
          <div className={styles.cardBox}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                Live Issue Tracking List {highlightKey && `(Filtered: ${highlightKey})`}
              </h2>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Issue Key</th>
                  <th>Source Ticket</th>
                  <th>Title &amp; Description</th>
                  <th>Affected Customer</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Assigned Agent</th>
                  <th>SLA Remaining</th>
                </tr>
              </thead>
              <tbody>
                {issuesList.map((issue) => {
                  const isHighlighted = highlightKey === issue.issueKey;
                  const ticketNo = issue.ticket?.ticketNo || `TCK-80${issue.issueKey.replace('ISS-', '')}`;

                  return (
                    <tr
                      key={issue.id}
                      className={isHighlighted ? styles.highlightedRow : ''}
                    >
                      <td className={styles.issueKey}>{issue.issueKey}</td>
                      <td>
                        <Link href="/service/queries" className={styles.ticketLinkTag}>
                          <span>{ticketNo}</span>
                        </Link>
                      </td>
                      <td className={styles.issueTitle}>{issue.title}</td>
                      <td>{issue.affectedCustomer}</td>
                      <td>
                        <span
                          className={
                            issue.severity === 'Critical'
                              ? styles.badgeCritical
                              : issue.severity === 'Major'
                              ? styles.badgeMajor
                              : styles.badgeMinor
                          }
                        >
                          {issue.severity}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            issue.status === 'Escalated'
                              ? styles.statusEscalated
                              : issue.status === 'In Progress'
                              ? styles.statusProgress
                              : issue.status === 'Open'
                              ? styles.statusOpen
                              : styles.statusResolved
                          }
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.userCell}>
                          <img src={issue.avatar || '/avatars/user1.jpg'} alt={issue.assignedAgent} className={styles.avatarImg} />
                          <span>{issue.assignedAgent}</span>
                        </div>
                      </td>
                      <td className={styles.slaCell}>{issue.slaRemaining}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function IssueTrackingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading Issue Tracking...</div>}>
      <IssueTrackingContent />
    </Suspense>
  );
}
