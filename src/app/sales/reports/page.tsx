'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './reports.module.css';

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.user) setUser(resData.user);
      });
  }, []);

  const months = ['4/23', '5/23', '6/23', '7/23', '8/23', '9/23', '10/23', '11/23', '12/23', '1/24', '2/24', '3/24'];

  const trendData = [
    { month: '4/23', volume: 290, revenue: 390 },
    { month: '5/23', volume: 210, revenue: 300 },
    { month: '6/23', volume: 160, revenue: 380 },
    { month: '7/23', volume: 190, revenue: 360 },
    { month: '8/23', volume: 265, revenue: 470 },
    { month: '9/23', volume: 240, revenue: 330 },
    { month: '10/23', volume: 80, revenue: 540 },
    { month: '11/23', volume: 170, revenue: 560 },
    { month: '12/23', volume: 295, revenue: 330 },
    { month: '1/24', volume: 120, revenue: 320 },
    { month: '2/24', volume: 225, revenue: 410 },
    { month: '3/24', volume: 200, revenue: 480 },
  ];

  const countryStats = [
    { flag: '/images/flagUS.png', name: 'US', pct: 60, color: '#046a38' },
    { flag: '/images/flagCanada.png', name: 'Canada', pct: 40, color: '#059669' },
    { flag: '/images/flagChina.png', name: 'China', pct: 30, color: '#10b981' },
    { flag: '/images/flagUK.png', name: 'UK', pct: 20, color: '#34d399' },
    { flag: '/images/flagFrance.png', name: 'France', pct: 10, color: '#6ee7b7' },
  ];

  const productsCol1 = [
    { rank: 'TOP.1', name: 'Product name 1', qty: 2647 },
    { rank: 'TOP.2', name: 'Product 2', qty: 2280 },
    { rank: 'TOP.3', name: 'Product 3', qty: 1849 },
    { rank: 'TOP.4', name: 'Product 4', qty: 1352 },
    { rank: 'TOP.5', name: 'Product 5', qty: 835 },
  ];

  const productsCol2 = [
    { rank: 'TOP.6', name: 'Product 6', qty: 647 },
    { rank: 'TOP.7', name: 'Product 7', qty: 635 },
    { rank: 'TOP.8', name: 'Product 8', qty: 578 },
    { rank: 'TOP.9', name: 'Product 9', qty: 509 },
    { rank: 'TOP.10', name: 'Product 10', qty: 356 },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Sales" />

      <div className={styles.mainContent}>
        <Header user={user} />

        <main className={styles.contentBody}>
          {/* Top Title & Header */}
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Sales</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Sales</span> &gt; <strong>Reports & Analysis</strong>
              </div>
            </div>

            <button className={styles.exportBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>EXPORT</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterRow}>
            <select className={styles.selectInput} defaultValue="Last 1 Year">
              <option value="Last 1 Year">📅 Last 1 Year</option>
            </select>

            <select className={styles.selectInput} defaultValue="ALL">
              <option value="ALL">㗊 ALL (Product Type)</option>
            </select>

            <select className={styles.selectInput} defaultValue="ALL">
              <option value="ALL">🌐 Region: ALL</option>
            </select>

            <select className={styles.selectInput} defaultValue="ALL">
              <option value="ALL">👥 ALL (Customer Type)</option>
            </select>

            <select className={styles.selectInput} defaultValue="ALL">
              <option value="ALL">☑ ALL (Sales Stage)</option>
            </select>

            <button className={styles.filterIconBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>

          {/* Row 1 Grid: 4 Cards + Sales Trend */}
          <div className={styles.row1Grid}>
            <div className={styles.metricCards4Grid}>
              <div className={styles.miniCard}>
                <span className={styles.miniCardTopLine} />
                <span className={styles.miniCardLabel}>Total Sales</span>
                <span className={styles.miniCardValue}>$1,800,000</span>
                <span className={styles.badgePositive}>1.93%</span>
              </div>

              <div className={styles.miniCard}>
                <span className={styles.miniCardTopLine} />
                <span className={styles.miniCardLabel}>Total Sales Quantity</span>
                <span className={styles.miniCardValue}>4920(units)</span>
                <span className={styles.badgeNegative}>-0.62%</span>
              </div>

              <div className={styles.miniCard}>
                <span className={styles.miniCardTopLine} />
                <span className={styles.miniCardLabel}>Average Sales</span>
                <span className={styles.miniCardValue}>$150,000</span>
                <span className={styles.badgePositive}>1.93%</span>
              </div>

              <div className={styles.miniCard}>
                <span className={styles.miniCardTopLine} />
                <span className={styles.miniCardLabel}>Average Sales Quantity</span>
                <span className={styles.miniCardValue}>410(units)</span>
                <span className={styles.badgeNegative}>-0.62%</span>
              </div>
            </div>

            {/* Sales Trend Combo Chart */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Sales Trend</h2>
                <div className={styles.legendGroup}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendSquareBlue} />
                    <span>Sales Revenue</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendSquareGreen} />
                    <span>Sales volume</span>
                  </div>
                </div>
              </div>

              <div className={styles.comboChartContainer}>
                <div className={styles.yAxis}>
                  <span>600</span>
                  <span>450</span>
                  <span>300</span>
                  <span>150</span>
                  <span>0</span>
                </div>

                <div className={styles.chartBody}>
                  <svg className={styles.svgCombo} viewBox="0 0 500 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradRevenueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5d5fef" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#5d5fef" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Baseline Lines */}
                    <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="45" x2="500" y2="45" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="135" x2="500" y2="135" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Emerald Green Rounded Volume Bars */}
                    {trendData.map((d, i) => {
                      const barWidth = 16;
                      const xPos = 12 + i * 41;
                      const barHeight = (d.volume / 600) * 180;
                      const yPos = 180 - barHeight;

                      return (
                        <g key={i}>
                          <rect
                            x={xPos}
                            y={yPos}
                            width={barWidth}
                            height={barHeight}
                            fill="#34d399"
                            rx="5"
                            ry="5"
                          />
                          <text
                            x={xPos + barWidth / 2}
                            y={Math.max(10, yPos - 3)}
                            textAnchor="middle"
                            fill="#059669"
                            fontSize="8"
                            fontWeight="bold"
                          >
                            {d.volume}
                          </text>
                        </g>
                      );
                    })}

                    {/* Soft Purple Gradient Filled Area */}
                    <path
                      d="
                        M 20 63
                        C 30 55, 50 100, 61 90
                        C 80 75, 90 70, 102 66
                        C 120 75, 130 78, 143 72
                        C 160 50, 170 40, 184 39
                        C 200 80, 210 90, 225 81
                        C 240 40, 250 20, 266 18
                        C 280 15, 290 20, 307 20
                        C 320 80, 330 85, 348 81
                        C 360 85, 370 85, 389 81
                        C 410 65, 420 50, 430 48
                        C 450 35, 460 30, 471 36
                        L 471 180 L 20 180 Z
                      "
                      fill="url(#gradRevenueArea)"
                    />

                    {/* Blue Smooth Revenue Line Stroke */}
                    <path
                      d="
                        M 20 63
                        C 30 55, 50 100, 61 90
                        C 80 75, 90 70, 102 66
                        C 120 75, 130 78, 143 72
                        C 160 50, 170 40, 184 39
                        C 200 80, 210 90, 225 81
                        C 240 40, 250 20, 266 18
                        C 280 15, 290 20, 307 20
                        C 320 80, 330 85, 348 81
                        C 360 85, 370 85, 389 81
                        C 410 65, 420 50, 430 48
                        C 450 35, 460 30, 471 36
                      "
                      fill="none"
                      stroke="#5d5fef"
                      strokeWidth="2.5"
                    />
                  </svg>

                  <div className={styles.xAxis}>
                    {months.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Sales Channel Distribution & World Regional Map */}
          <div className={styles.cardBox}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                Sales channel distribution <span className={styles.cardSubtitle}>(Sales proportion)</span>
              </h2>
            </div>

            <div className={styles.channelMapGrid}>
              {/* Donut Chart */}
              <div className={styles.channelContent}>
                <svg width="220" height="200" viewBox="0 0 150 130">
                  {/* Background Periwinkle Ring (Online 38.2%) */}
                  <circle cx="65" cy="60" r="34" fill="none" stroke="#c7d2fe" strokeWidth="18" />

                  {/* Primary Indigo Ring (Retail 61.8%) */}
                  <circle
                    cx="65"
                    cy="60"
                    r="34"
                    fill="none"
                    stroke="#5d5fef"
                    strokeWidth="18"
                    strokeDasharray="131.9 213.6"
                    transform="rotate(-90 65 60)"
                  />

                  {/* Callout Pointer Line & Label for Online (38.2%) */}
                  <polyline
                    points="44,39 26,21 8,21"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="44" cy="39" r="2.5" fill="#4338ca" />
                  <text x="8" y="14" textAnchor="start" fill="#4338ca" fontSize="10.5" fontWeight="800">
                    38.2%
                  </text>

                  {/* Callout Pointer Line & Label for Retail (61.8%) - Shifted to Bottom Right */}
                  <polyline
                    points="88,79 108,102 142,102"
                    fill="none"
                    stroke="#5d5fef"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="88" cy="79" r="2.5" fill="#5d5fef" />
                  <text x="142" y="93" textAnchor="end" fill="#5d5fef" fontSize="10.5" fontWeight="800">
                    61.8%
                  </text>
                </svg>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '3px', background: '#5d5fef' }} />
                    <span>Retail</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '3px', background: '#c7d2fe' }} />
                    <span>Online</span>
                  </div>
                </div>
              </div>

              {/* World Regional Map & Country Flags */}
              <div className={styles.mapContent}>
                <img
                  src="/images/worldMap.png"
                  alt="World Regional Map"
                  className={styles.worldMapImage}
                />

                <div className={styles.countryList}>
                  {countryStats.map((c) => (
                    <div key={c.name} className={styles.countryRow}>
                      <img src={c.flag} alt={c.name} className={styles.flagIconImg} />
                      <span className={styles.countryName}>{c.name}</span>
                      <div className={styles.countryProgress}>
                        <div className={styles.countryFill} style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                      </div>
                      <span className={styles.countryPctText}>{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Customer Analysis */}
          <div className={styles.cardBox}>
            <h2 className={styles.cardTitle}>Customer Analysis</h2>

            <div className={styles.customerAnalysisContent}>
              {/* Enlarged Left Pie Projection Diagram (380px x 180px) */}
              <div className={styles.pieDiagramArea}>
                <svg width="380" height="180" viewBox="0 0 380 180">
                  {/* Large Pie Chart (r=60) */}
                  <circle cx="80" cy="95" r="60" fill="#e0e7ff" />
                  <path d="M 80 95 L 80 35 A 60 60 0 0 1 135 120 Z" fill="#5d5fef" />

                  {/* Connecting Projection Lines */}
                  <line x1="80" y1="35" x2="298" y2="70" stroke="#a5b4fc" strokeWidth="1.2" strokeDasharray="3 3" />
                  <line x1="135" y1="120" x2="295" y2="122" stroke="#a5b4fc" strokeWidth="1.2" strokeDasharray="3 3" />

                  {/* Connected Small Circle (cx=310, r=30) */}
                  <circle cx="310" cy="95" r="30" fill="#5d5fef" />
                  <path d="M 310 95 L 280 100 A 30 30 0 0 1 298 68 Z" fill="#818cf8" />

                  {/* Text Labels - Placed with ample spacing */}
                  <text x="82" y="82" fill="#ffffff" fontSize="10" fontWeight="bold">23.85%</text>
                  <text x="190" y="78" textAnchor="middle" fill="#5d5fef" fontSize="13" fontWeight="bold">New Customers</text>
                  <text x="310" y="92" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Online</text>
                  <text x="310" y="104" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">(95%)</text>
                </svg>
              </div>

              {/* Right Side Column */}
              <div className={styles.rightAnalysisCol}>
                {/* Top 3 Stat Cards Aligned Right */}
                <div className={styles.custMetricsGroup}>
                  {/* Total Customers Card */}
                  <div className={styles.custStatCard}>
                    <span className={styles.custLabel}>Total Customers</span>
                    <div className={styles.custValRow}>
                      <span className={styles.custVal}>109</span>
                      <span className={styles.dividerLine} />
                      <div className={styles.badgeTrendPositive}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                        <span>1.2%</span>
                      </div>
                    </div>
                  </div>

                  {/* New Customers Card */}
                  <div className={styles.custStatCard}>
                    <span className={styles.custLabel}>New Customers</span>
                    <div className={styles.custValRow}>
                      <span className={styles.custVal}>26</span>
                      <span className={styles.dividerLine} />
                      <div className={styles.badgeTrendNegative}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                          <polyline points="17 18 23 18 23 12" />
                        </svg>
                        <span>0.4%</span>
                      </div>
                    </div>
                  </div>

                  {/* Lost Customers Card */}
                  <div className={styles.custStatCard}>
                    <span className={styles.custLabel}>Lost Customers</span>
                    <div className={styles.custValRow}>
                      <span className={styles.custVal}>11</span>
                      <span className={styles.dividerLine} />
                      <div className={styles.badgeTrendNegative}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                          <polyline points="17 18 23 18 23 12" />
                        </svg>
                        <span>0.7%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend Row */}
                <div className={styles.barLegendRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={styles.legendSquareMint} />
                    <span>Repeat customers</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={styles.legendSquareEmerald} />
                    <span>One-time customers</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={styles.legendSquareDarkGreen} />
                    <span>Non-purchasing customers</span>
                  </div>
                </div>

                {/* Stacked Progress Bar with Numbers Inside */}
                <div className={styles.stackedProgressBar}>
                  <div className={styles.segRepeat} style={{ width: '18.5%' }}>
                    18.5%
                  </div>
                  <div className={styles.segOneTime} style={{ width: '53.9%' }}>
                    53.9%
                  </div>
                  <div className={styles.segNonPurchasing} style={{ width: '27.6%' }}>
                    27.6%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Purchasing Customers & Product Preferences */}
          <div className={styles.row4Grid}>
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Purchasing customers</h2>
                <div className={styles.legendGroup}>
                  <div className={styles.legendItem}>
                    <span style={{ width: '8px', height: '8px', background: '#a7f3d0' }} />
                    <span>Total number of customers</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span style={{ width: '8px', height: '8px', background: '#059669' }} />
                    <span>Monthly number of purchasing customers</span>
                  </div>
                </div>
              </div>

              <div className={styles.comboChartContainer}>
                <div className={styles.yAxis}>
                  <span>1100</span>
                  <span>800</span>
                  <span>500</span>
                  <span>200</span>
                </div>
                <div className={styles.chartBody}>
                  <svg className={styles.svgCombo} viewBox="0 0 480 140" preserveAspectRatio="none">
                    {[
                      { x: 10, hTotal: 100, hMonthly: 40 },
                      { x: 50, hTotal: 110, hMonthly: 55 },
                      { x: 90, hTotal: 105, hMonthly: 48 },
                      { x: 130, hTotal: 120, hMonthly: 42 },
                      { x: 170, hTotal: 115, hMonthly: 62 },
                      { x: 210, hTotal: 118, hMonthly: 58 },
                      { x: 250, hTotal: 110, hMonthly: 65 },
                      { x: 290, hTotal: 112, hMonthly: 52 },
                      { x: 330, hTotal: 122, hMonthly: 49 },
                      { x: 370, hTotal: 120, hMonthly: 60 },
                      { x: 410, hTotal: 118, hMonthly: 45 },
                      { x: 450, hTotal: 115, hMonthly: 38 },
                    ].map((b, i) => (
                      <g key={i}>
                        <rect x={b.x} y={140 - b.hTotal} width="16" height={b.hTotal} fill="#a7f3d0" rx="2" />
                        <rect x={b.x} y={140 - b.hMonthly} width="16" height={b.hMonthly} fill="#059669" rx="2" />
                      </g>
                    ))}
                  </svg>
                  <div className={styles.xAxis}>
                    {months.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Preferences TOP 10 */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  Product preferences <span className={styles.cardSubtitle}>(Purchase Quantity)</span>
                </h2>
                <span style={{ fontSize: '11px', color: '#94a3b8', cursor: 'pointer' }}>View More &gt;</span>
              </div>

              <div className={styles.productPrefGrid}>
                <div>
                  {productsCol1.map((p) => (
                    <div key={p.rank} className={styles.prefItem}>
                      <div className={styles.prefLeft}>
                        <span className={styles.prefRank}>{p.rank}</span>
                        <div className={styles.prefAvatar}>📦</div>
                        <span>{p.name}</span>
                      </div>
                      <span className={styles.prefQty}>({p.qty})</span>
                    </div>
                  ))}
                </div>

                <div>
                  {productsCol2.map((p) => (
                    <div key={p.rank} className={styles.prefItem}>
                      <div className={styles.prefLeft}>
                        <span className={styles.prefRank}>{p.rank}</span>
                        <div className={styles.prefAvatar}>📦</div>
                        <span>{p.name}</span>
                      </div>
                      <span className={styles.prefQty}>({p.qty})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
