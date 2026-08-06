'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function SalesActivityPage() {
  const [user, setUser] = useState<any>(null);

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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar activeMenu="Sales" />
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Sales Activity Log</h1>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Home &gt; Sales &gt; <strong>Sales Activity</strong>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#94a3b8', fontSize: '12px', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Waktu</th>
                  <th style={{ padding: '12px' }}>Sales Agent</th>
                  <th style={{ padding: '12px' }}>Aktivitas</th>
                  <th style={{ padding: '12px' }}>Tipe</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '14px', color: '#334155' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 600 }}>{a.time}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>{a.agent}</td>
                    <td style={{ padding: '14px 12px' }}>{a.action}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ background: '#f0f1ff', color: '#5d5fef', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                        {a.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#22c55e', fontWeight: 700 }}>{a.status}</td>
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
