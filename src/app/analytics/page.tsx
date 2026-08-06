'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar activeMenu="Analytics" />
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Advanced System Analytics</h1>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Home &gt; <strong>Analytics</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Sales Conversion Rate</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#5d5fef', marginTop: '8px' }}>68.4%</div>
              <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', fontWeight: 700 }}>+4.2% dibanding bulan lalu</div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Customer Retention Index</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e', marginTop: '8px' }}>92.1%</div>
              <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', fontWeight: 700 }}>+1.8% dibanding bulan lalu</div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Average Lead Response Time</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#06b6d4', marginTop: '8px' }}>14 Menit</div>
              <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', fontWeight: 700 }}>3x Lebih cepat</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
