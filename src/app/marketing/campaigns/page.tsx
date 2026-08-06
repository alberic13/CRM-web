'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function MarketingCampaignsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const campaigns = [
    { id: '1', name: 'Q3 Enterprise CRM Promo', channel: 'Google Search Ads', budget: '$12,000', leads: 420, status: 'Active' },
    { id: '2', name: 'Sales Automation Webinar', channel: 'LinkedIn Marketing', budget: '$8,500', leads: 280, status: 'Active' },
    { id: '3', name: 'SMB Growth Discount Campaign', channel: 'Email Newsletter', budget: '$3,000', leads: 195, status: 'Completed' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar activeMenu="Marketing" />
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Marketing Campaigns</h1>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Home &gt; Marketing &gt; <strong>Campaigns</strong>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#94a3b8', fontSize: '12px', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Campaign Name</th>
                  <th style={{ padding: '12px' }}>Channel</th>
                  <th style={{ padding: '12px' }}>Budget</th>
                  <th style={{ padding: '12px' }}>Leads Generated</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '14px', color: '#334155' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f172a' }}>{c.name}</td>
                    <td style={{ padding: '14px 12px' }}>{c.channel}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>{c.budget}</td>
                    <td style={{ padding: '14px 12px', color: '#5d5fef', fontWeight: 700 }}>{c.leads} Leads</td>
                    <td style={{ padding: '14px 12px', color: '#22c55e', fontWeight: 700 }}>{c.status}</td>
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
