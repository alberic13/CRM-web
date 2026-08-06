'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './dashboard.module.css';

interface DashboardData {
  metrics: {
    totalRevenue: number;
    totalRevenueInc: number;
    totalQuantity: number;
    totalQuantityInc: number;
    numberOrders: number;
    numberOrdersInc: number;
    averageOrderValue: number;
    averageOrderValueInc: number;
    customerCount: number;
    customerCountInc: number;
  };
  salesTeam: Array<{
    id?: string;
    name: string;
    avatar?: string;
    revenue: number;
    orders: number;
    conversionRate: number;
  }>;
  taskCompletions: Array<{
    id?: string;
    companyName: string;
    avatar?: string;
    completed: number;
    inProgress: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [trendTab, setTrendTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
  const [roleView, setRoleView] = useState<'Overview' | 'Sales (Sam)' | 'Marketing (Mia)' | 'Customer Service (Chris)'>('Overview');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.user) setUser(resData.user);
      });

    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => console.error('Error fetching dashboard data:', err));
  }, []);

  const metrics = data?.metrics || {
    totalRevenue: 82340,
    totalRevenueInc: 1.24,
    totalQuantity: 3734,
    totalQuantityInc: -0.24,
    numberOrders: 5532,
    numberOrdersInc: 0.91,
    averageOrderValue: 14.88,
    averageOrderValueInc: 1.02,
    customerCount: 4982,
    customerCountInc: -0.92,
  };

  const defaultSalesTeam = [
    { id: 's1', name: 'Shirley.H', avatar: '/avatars/user1.jpg', revenue: 719, orders: 39, conversionRate: 86 },
    { id: 's2', name: 'GlobalMart', avatar: '/avatars/user2.jpg', revenue: 684, orders: 35, conversionRate: 75 },
    { id: 's3', name: 'Bright Solutions', avatar: '/avatars/user3.jpg', revenue: 643, orders: 32, conversionRate: 36 },
    { id: 's4', name: 'Tech Innovations', avatar: '/avatars/user4.jpg', revenue: 533, orders: 29, conversionRate: 75 },
    { id: 's5', name: 'Blue Horizon', avatar: '/avatars/user5.jpg', revenue: 521, orders: 34, conversionRate: 86 },
    { id: 's6', name: 'BestBuyer', avatar: '/avatars/user8.jpg', revenue: 478, orders: 64, conversionRate: 45 },
    { id: 's7', name: 'Alpha Solutions', avatar: '/avatars/user6.jpg', revenue: 465, orders: 36, conversionRate: 75 },
    { id: 's8', name: 'Prime Goods', avatar: '/avatars/user7.jpg', revenue: 423, orders: 57, conversionRate: 76 },
    { id: 's9', name: 'Wise Shoppers', avatar: '/avatars/user10.jpg', revenue: 387, orders: 32, conversionRate: 47 },
    { id: 's10', name: 'Quick Solutions', avatar: '/avatars/user9.jpg', revenue: 327, orders: 25, conversionRate: 84 },
  ];

  const defaultTasks = [
    { id: 't1', companyName: 'GlobalMart', avatar: '/avatars/user2.jpg', completed: 34, inProgress: 7 },
    { id: 't2', companyName: 'Tech Innovations', avatar: '/avatars/user4.jpg', completed: 31, inProgress: 5 },
    { id: 't3', companyName: 'Bright Solutions', avatar: '/avatars/user3.jpg', completed: 24, inProgress: 9 },
    { id: 't4', companyName: 'Alpha Solutions', avatar: '/avatars/user6.jpg', completed: 21, inProgress: 3 },
    { id: 't5', companyName: 'Prime Goods', avatar: '/avatars/user7.jpg', completed: 20, inProgress: 6 },
    { id: 't6', companyName: 'BestBuyer', avatar: '/avatars/user8.jpg', completed: 18, inProgress: 10 },
    { id: 't7', companyName: 'Shirley.H', avatar: '/avatars/user1.jpg', completed: 16, inProgress: 2 },
    { id: 't8', companyName: 'Blue Horizon', avatar: '/avatars/user5.jpg', completed: 12, inProgress: 7 },
    { id: 't9', companyName: 'Quick Solutions', avatar: '/avatars/user9.jpg', completed: 9, inProgress: 9 },
    { id: 't10', companyName: 'Wise Shoppers', avatar: '/avatars/user10.jpg', completed: 7, inProgress: 3 },
  ];

  const salesTeam = data?.salesTeam && data.salesTeam.length > 0 ? data.salesTeam : defaultSalesTeam;
  const taskCompletions = data?.taskCompletions && data.taskCompletions.length > 0 ? data.taskCompletions : defaultTasks;

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Dashboard" />

      <div className={styles.mainContent}>
        <Header user={user} />

        <main className={styles.contentBody}>
          {/* Top Title & Filter Bar */}
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Dashboard</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <strong>Dashboard</strong>
              </div>
            </div>

            <div className={styles.filterBar}>
              <div className={styles.dateSelectWrapper}>
                <select className={styles.dateSelect} defaultValue="Year-to-date">
                  <option value="Year-to-date">Year-to-date</option>
                  <option value="Month-to-date">Month-to-date</option>
                  <option value="Quarter-to-date">Quarter-to-date</option>
                </select>
              </div>
              <span className={styles.dateRangeText}>2024/1/1 ~ 2024/12/11</span>
            </div>
          </div>

          {/* Persona / Role View Switcher Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '8px 14px', borderRadius: '12px', border: '1px solid #f1f5f9', width: 'fit-content' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginRight: '6px' }}>View Dashboard Persona:</span>
            {(['Overview', 'Sales (Sam)', 'Marketing (Mia)', 'Customer Service (Chris)'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleView(r)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: roleView === r ? 800 : 600,
                  background: roleView === r ? '#5d5fef' : '#f8fafc',
                  color: roleView === r ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* 5 KPI Cards Row */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Total Revenue</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>${metrics.totalRevenue.toLocaleString()}</span>
                <span className={styles.badgeIncPositive}>{metrics.totalRevenueInc}%</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Total Quantity</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{metrics.totalQuantity.toLocaleString()}</span>
                <span className={styles.badgeIncNegative}>{metrics.totalQuantityInc}%</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Number of Orders</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{metrics.numberOrders.toLocaleString()}</span>
                <span className={styles.badgeIncPositive}>{metrics.numberOrdersInc}%</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Average Order Value</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>${metrics.averageOrderValue.toFixed(2)}</span>
                <span className={styles.badgeIncPositive}>{metrics.averageOrderValueInc}%</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Customer Count</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{metrics.customerCount.toLocaleString()}</span>
                <span className={styles.badgeIncNegative}>{metrics.customerCountInc}%</span>
              </div>
            </div>
          </div>

          {/* Customer Service Overview Card (Visible on Overview & Chris View) */}
          {(roleView === 'Overview' || roleView === 'Customer Service (Chris)') && (
            <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#5d5fef', letterSpacing: '0.5px' }}>CUSTOMER SERVICE OVERVIEW (FOR CHRIS)</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>Support SLAs & Customer Happiness Hub</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Unresolved Queries</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444' }}>14 Tickets</div>
                </div>
                <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>First Response SLA</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#06b6d4' }}>8.5 Mins</div>
                </div>
                <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CSAT Rating</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#22c55e' }}>94.8% ★</div>
                </div>
              </div>
            </div>
          )}

          {/* Middle Row Charts */}
          {(roleView === 'Overview' || roleView === 'Sales (Sam)' || roleView === 'Marketing (Mia)') && (
            <div className={styles.chartsGrid}>
              {/* Card 1: Overall Revenue Trends */}
              <div className={styles.cardBox}>
                <h2 className={styles.cardTitle}>Overall Revenue Trends</h2>
                <div className={styles.chartWrapper}>
                  <svg width="100%" height="160" viewBox="0 0 400 160" style={{ overflow: 'visible' }}>
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="70" x2="400" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#f1f5f9" strokeWidth="1" />

                    <path
                      d="M 10 120 C 50 110, 80 130, 120 90 C 160 50, 200 80, 240 60 C 280 40, 320 70, 360 30 C 380 20, 390 25, 400 22 L 400 150 L 10 150 Z"
                      fill="url(#purpleGradient)"
                      opacity="0.1"
                    />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5d5fef" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 10 120 C 50 110, 80 130, 120 90 C 160 50, 200 80, 240 60 C 280 40, 320 70, 360 30 C 380 20, 390 25, 400 22"
                      fill="none"
                      stroke="#5d5fef"
                      strokeWidth="3"
                    />

                    <path
                      d="M 10 135 C 60 130, 100 140, 140 125 C 180 110, 220 120, 260 115 C 300 110, 340 100, 380 95 C 390 92, 400 90, 400 88"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: '#5d5fef' }} />
                    <span>Total Revenue</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: '#38bdf8' }} />
                    <span>Online Channel</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Sales Channel Distribution */}
              <div className={styles.cardBox}>
                <h2 className={styles.cardTitle}>Sales Channel Distribution</h2>
                <div className={styles.donutContainer}>
                  <svg className={styles.donutSvg} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#5d5fef"
                      strokeWidth="14"
                      strokeDasharray="175.2 238.7"
                      transform="rotate(-90 50 50)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#ff8a75"
                      strokeWidth="14"
                      strokeDasharray="63.5 238.7"
                      transform="rotate(174 50 50)"
                    />
                    <text x="50" y="47" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">
                      73.4%
                    </text>
                    <text x="50" y="58" textAnchor="middle" fill="#64748b" fontSize="6.5" fontWeight="600">
                      Online Share
                    </text>
                  </svg>
                </div>
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: '#5d5fef' }} />
                    <span>Online (73.4%)</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: '#ff8a75' }} />
                    <span>Retail (26.6%)</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Revenue Target */}
              <div className={styles.cardBox}>
                <h2 className={styles.cardTitle}>Revenue Targets</h2>
                <div className={styles.targetProgressContainer}>
                  <div className={styles.targetStatRow}>
                    <span className={styles.targetLabel}>Achieved YTD</span>
                    <span className={styles.targetVal}>$82,340 / $100,000</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: '82.34%' }} />
                  </div>
                  <div className={styles.targetSubText}>82.3% of annual sales target reached</div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Trend Line Chart */}
          {(roleView === 'Overview' || roleView === 'Sales (Sam)') && (
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Revenue Trend</h2>
                <div className={styles.pillTabs}>
                  <button
                    className={`${styles.pillTab} ${trendTab === 'Daily' ? styles.activePillTab : ''}`}
                    onClick={() => setTrendTab('Daily')}
                  >
                    Daily
                  </button>
                  <button
                    className={`${styles.pillTab} ${trendTab === 'Weekly' ? styles.activePillTab : ''}`}
                    onClick={() => setTrendTab('Weekly')}
                  >
                    Weekly
                  </button>
                  <button
                    className={`${styles.pillTab} ${trendTab === 'Monthly' ? styles.activePillTab : ''}`}
                    onClick={() => setTrendTab('Monthly')}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className={styles.trendChartArea}>
                <svg width="100%" height="220" viewBox="0 0 800 220" style={{ overflow: 'visible' }}>
                  <line x1="40" y1="20" x2="800" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="65" x2="800" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="110" x2="800" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="155" x2="800" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="200" x2="800" y2="200" stroke="#e2e8f0" strokeWidth="1" />

                  <text x="30" y="25" textAnchor="end" fill="#94a3b8" fontSize="10">80K</text>
                  <text x="30" y="70" textAnchor="end" fill="#94a3b8" fontSize="10">60K</text>
                  <text x="30" y="115" textAnchor="end" fill="#94a3b8" fontSize="10">40K</text>
                  <text x="30" y="160" textAnchor="end" fill="#94a3b8" fontSize="10">20K</text>
                  <text x="30" y="204" textAnchor="end" fill="#94a3b8" fontSize="10">0</text>

                  <path
                    d="M 50 180 L 110 160 L 170 140 L 230 110 L 290 120 L 350 80 L 410 95 L 470 60 L 530 75 L 590 40 L 650 50 L 710 30 L 770 25 L 770 200 L 50 200 Z"
                    fill="url(#trendFill)"
                    opacity="0.12"
                  />
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5d5fef" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 50 180 L 110 160 L 170 140 L 230 110 L 290 120 L 350 80 L 410 95 L 470 60 L 530 75 L 590 40 L 650 50 L 710 30 L 770 25"
                    fill="none"
                    stroke="#5d5fef"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                    <text key={m} x={50 + idx * 65} y="216" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
                      {m}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          )}

          {/* Tables Row: Sales Team Leaderboard & Task Completion */}
          {(roleView === 'Overview' || roleView === 'Sales (Sam)') && (
            <div className={styles.tablesRow}>
              {/* Sales Team Leaderboard */}
              <div className={styles.cardBox} style={{ flex: 1 }}>
                <h2 className={styles.cardTitle}>Sales Team</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Member Name</th>
                      <th>Revenue</th>
                      <th>Orders Number</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesTeam.map((member, i) => (
                      <tr key={member.id || i}>
                        <td className={styles.userCell}>
                          <img
                            src={member.avatar || `/avatars/user${(i % 10) + 1}.jpg`}
                            alt={member.name}
                            className={styles.avatarImg}
                          />
                          <span>{member.name}</span>
                        </td>
                        <td className={styles.boldText}>${member.revenue}</td>
                        <td>{member.orders}</td>
                        <td className={styles.conversionCell}>{member.conversionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Task Completion Table */}
              <div className={styles.cardBox} style={{ flex: 1 }}>
                <h2 className={styles.cardTitle}>Task Completion</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Completed</th>
                      <th>In progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskCompletions.map((task, i) => (
                      <tr key={task.id || i}>
                        <td className={styles.userCell}>
                          <img
                            src={task.avatar || `/avatars/user${((i + 3) % 10) + 1}.jpg`}
                            alt={task.companyName}
                            className={styles.avatarImg}
                          />
                          <span>{task.companyName}</span>
                        </td>
                        <td className={styles.completedCell}>{task.completed}</td>
                        <td className={styles.inProgressCell}>{task.inProgress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
