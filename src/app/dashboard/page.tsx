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

          {/* Row 1: Overall Revenue Trends + Sales Channel Distribution */}
          <div className={styles.row1Grid}>
            {/* Overall Revenue Trends */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Overall Revenue Trends</h2>
                <div className={styles.legendGroup}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendLineBlue} />
                    <span>Total Revenue</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendLineGreen} />
                    <span>Online Channel</span>
                  </div>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.yAxis}>
                  <span className={styles.yAxisTitle}>Revenue</span>
                  <span>10,000</span>
                  <span>0</span>
                </div>

                <div className={styles.chartBody}>
                  <svg className={styles.svgChart} viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5d5fef" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#5d5fef" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Green Filled Curve (Online) */}
                    <path
                      d="M 0 190 Q 40 185, 80 180 T 160 160 T 240 140 T 320 120 T 400 110 T 500 60 L 500 200 L 0 200 Z"
                      fill="url(#gradGreen)"
                    />
                    <path
                      d="M 0 190 Q 40 185, 80 180 T 160 160 T 240 140 T 320 120 T 400 110 T 500 60"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                    />

                    {/* Blue Filled Curve (Total) */}
                    <path
                      d="M 0 190 Q 40 170, 80 160 T 160 130 T 240 90 T 320 70 T 400 60 T 500 20 L 500 200 L 0 200 Z"
                      fill="url(#gradBlue)"
                    />
                    <path
                      d="M 0 190 Q 40 170, 80 160 T 160 130 T 240 90 T 320 70 T 400 60 T 500 20"
                      fill="none"
                      stroke="#5d5fef"
                      strokeWidth="3"
                    />
                  </svg>

                  <div className={styles.xAxis}>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                    <span>11</span>
                    <span>12</span>
                    <span className={styles.xAxisTitle}>month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Channel Distribution Pie Chart (Two-Side Words Online & Retail) */}
            <div className={styles.cardBox}>
              <h2 className={styles.cardTitle}>Sales Channel Distribution</h2>
              <div className={styles.donutWrapper}>
                <svg className={styles.donutSvg} viewBox="0 0 200 200">
                  {/* Retail Slice (26.6%) - Top Right Quadrant (Light Periwinkle/Lavender) */}
                  <path
                    d="M 100 100 L 100 20 A 80 80 0 0 1 179.6 108 Z"
                    fill="#c7d2fe"
                  />

                  {/* Online Slice (73.4%) - Large Left & Bottom Slice (Primary Solid Purple) */}
                  <path
                    d="M 100 100 L 179.6 108 A 80 80 0 1 1 100 20 Z"
                    fill="#5b5cf0"
                  />

                  {/* Two-Side Embedded Labels */}
                  {/* Left Side: Online (73.4%) inside Purple Slice */}
                  <text x="65" y="118" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
                    Online (73.4%)
                  </text>

                  {/* Right Side: Retail (26.6%) inside Periwinkle Slice */}
                  <text x="138" y="62" textAnchor="middle" fill="#4338ca" fontSize="11" fontWeight="700">
                    Retail (26.6%)
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2: Revenue Targets + Revenue Trend Line Chart */}
          <div className={styles.row2Grid}>
            <div className={styles.cardBox}>
              <div className={styles.targetMetricsList}>
                <div className={styles.targetMetricItem}>
                  <span className={styles.targetLabel}>Annual Revenue Target</span>
                  <div className={styles.targetValRow}>
                    <span className={styles.targetVal}>$73,000</span>
                    <span className={styles.targetIncBadge}>3.5%</span>
                  </div>
                </div>

                <div className={styles.targetMetricItem}>
                  <span className={styles.targetLabel}>Actual Annual Revenue</span>
                  <div className={styles.targetValRow}>
                    <span className={styles.targetVal}>$82,340</span>
                    <span className={styles.targetIncBadge}>6.2%</span>
                  </div>
                </div>

                <div className={styles.targetMetricItem}>
                  <span className={styles.targetLabel}>Monthly Revenue Target</span>
                  <div className={styles.targetValRow}>
                    <span className={styles.targetVal}>$6,084</span>
                    <span className={styles.targetIncBadge}>2.4%</span>
                  </div>
                </div>

                <div className={styles.targetMetricItem}>
                  <span className={styles.targetLabel}>Actual Monthly Revenue</span>
                  <div className={styles.targetValRow}>
                    <span className={styles.targetVal}>$6,862</span>
                    <span className={styles.targetIncBadge}>2.7%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Trend Chart (Clean Curve without Red Circle) */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Revenue Trend</h2>
                <div className={styles.toggleButtonGroup}>
                  <button
                    className={`${styles.toggleBtn} ${trendTab === 'Daily' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setTrendTab('Daily')}
                  >
                    Daily
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${trendTab === 'Weekly' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setTrendTab('Weekly')}
                  >
                    Weekly
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${trendTab === 'Monthly' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setTrendTab('Monthly')}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.yAxis}>
                  <span className={styles.yAxisTitle}>Revenue</span>
                  <span>9,000</span>
                  <span>8,000</span>
                  <span>7,000</span>
                  <span>6,000</span>
                  <span>5,000</span>
                  <span>4,000</span>
                  <span>3,000</span>
                  <span>2,000</span>
                  <span>1,000</span>
                  <span>0</span>
                </div>

                <div className={styles.chartBody}>
                  <svg className={styles.svgChart} viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 0 160 Q 40 110, 80 120 T 160 80 T 240 60 T 320 70 T 400 40 T 500 30 L 500 200 L 0 200 Z"
                      fill="url(#gradTrend)"
                    />
                    <path
                      d="M 0 160 Q 40 110, 80 120 T 160 80 T 240 60 T 320 70 T 400 40 T 500 30"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                    />
                  </svg>

                  <div className={styles.xAxis}>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                    <span>11</span>
                    <span>12</span>
                    <span className={styles.xAxisTitle}>Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Sales Team Leaderboard + Task Completion */}
          <div className={styles.row3Grid}>
            {/* Sales Team */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Sales Team</h2>
                <div className={styles.segmentedToggle}>
                  <button className={styles.segBtn}>Team</button>
                  <button className={`${styles.segBtn} ${styles.segBtnActive}`}>Member</button>
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}>#</th>
                    <th>Member Name</th>
                    <th>
                      <span className={styles.sortableHeader}>
                        Revenue <span className={styles.sortIcon}>⇕</span>
                      </span>
                    </th>
                    <th>
                      <span className={styles.sortableHeader}>
                        Orders Number <span className={styles.sortIcon}>⇕</span>
                      </span>
                    </th>
                    <th>
                      <span className={styles.sortableHeader}>
                        Conversion Rate <span className={styles.sortIcon}>⇕</span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesTeam.map((st: any, idx: number) => (
                    <tr key={idx}>
                      <td className={styles.rankNum}>{idx + 1}</td>
                      <td>
                        <div className={styles.userCell}>
                          <img
                            src={st.avatar || `/avatars/user${(idx % 10) + 1}.jpg`}
                            alt={st.name}
                            className={styles.avatarImgPhoto}
                          />
                          <span>{st.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>${st.revenue}</td>
                      <td>{st.orders}</td>
                      <td>{st.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Task Completion */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Task Completion</h2>
                <div className={styles.segmentedToggle}>
                  <button className={styles.segBtn}>Team</button>
                  <button className={`${styles.segBtn} ${styles.segBtnActive}`}>Member</button>
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}>#</th>
                    <th>Company</th>
                    <th>
                      <span className={styles.sortableHeader}>
                        Completed <span className={styles.sortIcon}>⇕</span>
                      </span>
                    </th>
                    <th>
                      <span className={styles.sortableHeader}>
                        In progress <span className={styles.sortIcon}>⇕</span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {taskCompletions.map((tc: any, idx: number) => (
                    <tr key={idx}>
                      <td className={styles.rankNum}>{idx + 1}</td>
                      <td>
                        <div className={styles.userCell}>
                          <img
                            src={tc.avatar || `/avatars/user${(idx % 10) + 1}.jpg`}
                            alt={tc.companyName}
                            className={styles.avatarImgPhoto}
                          />
                          <span>{tc.companyName}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{tc.completed}</td>
                      <td>{tc.inProgress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
