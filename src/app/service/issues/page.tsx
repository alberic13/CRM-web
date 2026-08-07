'use client';

import { useEffect, useState } from 'react';
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
}

export default function IssueTrackingPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const issuesList: IssueItem[] = [
    { id: '1', issueKey: 'ISS-401', title: 'Payment Gateway Webhook Secret Disconnect', affectedCustomer: 'Tau Corporation', status: 'Escalated', assignedAgent: 'Chris Evans', avatar: '/avatars/user1.jpg', slaRemaining: '0h 42m', severity: 'Critical' },
    { id: '2', issueKey: 'ISS-402', title: 'OAuth Token Renewal Failure in Mobile SDK', affectedCustomer: 'GlobalMart Inc.', status: 'In Progress', assignedAgent: 'Shirley.H', avatar: '/avatars/user2.jpg', slaRemaining: '3h 15m', severity: 'Major' },
    { id: '3', issueKey: 'ISS-403', title: 'Database Index Latency on Order History API', affectedCustomer: 'Pi Enterprises', status: 'In Progress', assignedAgent: 'Andy Chen', avatar: '/avatars/user3.jpg', slaRemaining: '5h 50m', severity: 'Major' },
    { id: '4', issueKey: 'ISS-404', title: 'CSV Export Line-break Encoding Glitch', affectedCustomer: 'BestBuyer', status: 'Open', assignedAgent: 'Unassigned', avatar: '/avatars/user4.jpg', slaRemaining: '11h 05m', severity: 'Minor' },
    { id: '5', issueKey: 'ISS-405', title: 'Custom Domain SSL Certificate Renewal Stall', affectedCustomer: 'Visionary Tech', status: 'Resolved', assignedAgent: 'Lucy Tan', avatar: '/avatars/user5.jpg', slaRemaining: 'Completed', severity: 'Major' },
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
              <h1 className={styles.pageTitle}>Issue Tracking & SLA Center</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>Issue Tracking</strong>
              </div>
            </div>
          </div>

          {/* Metric Bar */}
          <div className={styles.metricsBar}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Open Issues</span>
              <span className={styles.metricVal}>8</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>In Progress</span>
              <span className={styles.metricVal} style={{ color: '#06b6d4' }}>5</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Escalated to Engineering</span>
              <span className={styles.metricVal} style={{ color: '#ef4444' }}>2</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>SLA Compliance Rate</span>
              <span className={styles.metricVal} style={{ color: '#22c55e' }}>98.2%</span>
            </div>
          </div>

          {/* Issues Table */}
          <div className={styles.cardBox}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Live Issue Tracking List</h2>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Issue Key</th>
                  <th>Title & Description</th>
                  <th>Affected Customer</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Assigned Agent</th>
                  <th>SLA Remaining</th>
                </tr>
              </thead>
              <tbody>
                {issuesList.map((issue) => (
                  <tr key={issue.id}>
                    <td className={styles.issueKey}>{issue.issueKey}</td>
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
                        <img src={issue.avatar} alt={issue.assignedAgent} className={styles.avatarImg} />
                        <span>{issue.assignedAgent}</span>
                      </div>
                    </td>
                    <td className={styles.slaCell}>{issue.slaRemaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
