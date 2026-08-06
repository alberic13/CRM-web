'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function ClientsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const clients = [
    { id: '1', name: 'Tau Corporation', industry: 'Technology', region: 'North America', tier: 'Enterprise Tier 1' },
    { id: '2', name: 'Pi Enterprises', industry: 'Manufacturing', region: 'Europe', tier: 'Mid-Market' },
    { id: '3', name: 'GlobalMart Inc.', industry: 'Retail & E-commerce', region: 'Europe', tier: 'Enterprise Tier 1' },
    { id: '4', name: 'Delta Industries', industry: 'Logistics & Supply', region: 'Asia Pacific', tier: 'Mid-Market' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar activeMenu="Clients" />
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Clients Management</h1>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Home &gt; <strong>Clients</strong>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#94a3b8', fontSize: '12px', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Client</th>
                  <th style={{ padding: '12px' }}>Industry</th>
                  <th style={{ padding: '12px' }}>Region</th>
                  <th style={{ padding: '12px' }}>Tier Category</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '14px', color: '#334155' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: '#5d5fef' }}>{client.name}</td>
                    <td style={{ padding: '14px 12px' }}>{client.industry}</td>
                    <td style={{ padding: '14px 12px' }}>{client.region}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                        {client.tier}
                      </span>
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
