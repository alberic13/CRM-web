'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './activity.module.css';

export default function SalesActivityPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const activities = [
    { id: '1', time: '10:30 AM', agent: 'Shirley.H', action: 'Calls with Tau Corporation', type: 'Call', status: 'Completed' },
    { id: '2', time: '11:15 AM', agent: 'Andy Chen', action: 'Sent Proposal to Pi Enterprises', type: 'Email', status: 'Completed' },
    { id: '3', time: '01:45 PM', agent: 'Lucy Tan', action: 'Meeting with GlobalMart Reps', type: 'Meeting', status: 'Completed' },
    { id: '4', time: '03:20 PM', agent: 'Peter Wu', action: 'Follow up call with Big Company Ltd', type: 'Call', status: 'In Progress' },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Sales" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />
        
        <main className={styles.contentBody}>
          <div className={styles.topRow}>
            <div>
              <h1 className={styles.pageTitle}>Sales Activity Log</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Sales</span> &gt; <strong>Sales Activity</strong>
              </div>
            </div>
          </div>

          <div className={styles.cardBox}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Sales Agent</th>
                  <th>Aktivitas</th>
                  <th>Tipe</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.time}</td>
                    <td style={{ fontWeight: 700 }}>{a.agent}</td>
                    <td>{a.action}</td>
                    <td>
                      <span className={styles.typeBadge}>
                        {a.type}
                      </span>
                    </td>
                    <td className={a.status === 'Completed' ? styles.statusCompleted : styles.statusProgress}>
                      {a.status}
                    </td>
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
