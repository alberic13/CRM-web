'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const roles = [
    { role: 'ADMIN', desc: 'Full access to the system, user management, permissions, and database configuration', count: 1 },
    { role: 'MANAGER', desc: 'Access to sales reports, deal approvals, sales & marketing team monitoring', count: 3 },
    { role: 'AGENT', desc: 'Access to customer management, deal status updates, and sales activity logs', count: 12 },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar activeMenu="Setting" />
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>System Settings & Role Management</h1>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Home &gt; <strong>Setting</strong>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>User Role Permissions</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {roles.map((r) => (
                <div
                  key={r.role}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <span
                      style={{
                        background: '#5d5fef',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {r.role}
                    </span>
                    <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#475569' }}>{r.desc}</p>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
                    {r.count} {r.count === 1 ? 'User' : 'Users'}
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
