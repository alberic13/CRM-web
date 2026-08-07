'use client';

import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './reports.module.css';

interface TrendItem {
  month: string;
  volume: number;
  revenue: number;
}

export default function SalesReportsPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter States
  const [periodFilter, setPeriodFilter] = useState('Last 1 Year');
  const [productFilter, setProductFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');

  // Country Selection State
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.user) setUser(resData.user);
      });
  }, []);

  // Filter Scale Factor Calculation
  const scaleFactor = useMemo(() => {
    let factor = 1.0;
    if (periodFilter === 'Last 6 Months') factor *= 0.55;
    else if (periodFilter === 'Last 3 Months') factor *= 0.28;
    else if (periodFilter === 'Last 1 Month') factor *= 0.1;

    if (productFilter === 'Software SaaS') factor *= 0.45;
    else if (productFilter === 'Hardware Equipment') factor *= 0.35;
    else if (productFilter === 'Consulting Services') factor *= 0.2;

    if (regionFilter === 'North America') factor *= 0.5;
    else if (regionFilter === 'Europe') factor *= 0.3;
    else if (regionFilter === 'Asia Pacific') factor *= 0.2;

    if (customerFilter === 'Enterprise') factor *= 0.6;
    else if (customerFilter === 'Mid-Market') factor *= 0.3;

    if (stageFilter === 'Won') factor *= 0.7;
    else if (stageFilter === 'In Progress') factor *= 0.25;

    if (selectedCountry === 'US') factor *= 0.6;
    else if (selectedCountry === 'Canada') factor *= 0.4;
    else if (selectedCountry === 'China') factor *= 0.3;
    else if (selectedCountry === 'UK') factor *= 0.2;
    else if (selectedCountry === 'France') factor *= 0.15;

    return Math.max(0.05, factor);
  }, [periodFilter, productFilter, regionFilter, customerFilter, stageFilter, selectedCountry]);

  // Dynamic KPI Metrics
  const metrics = useMemo(() => {
    const totalSales = Math.round(1800000 * scaleFactor);
    const totalQty = Math.round(4920 * scaleFactor);
    const avgSales = Math.round(totalSales / 12);
    const avgQty = Math.round(totalQty / 12);

    return {
      totalSales,
      totalQty,
      avgSales,
      avgQty,
      salesInc: scaleFactor > 0.4 ? 1.93 : 3.12,
      qtyInc: scaleFactor > 0.4 ? -0.62 : 1.45,
    };
  }, [scaleFactor]);

  // Dynamic Trend Data
  const months = ['4/23', '5/23', '6/23', '7/23', '8/23', '9/23', '10/23', '11/23', '12/23', '1/24', '2/24', '3/24'];

  const baseTrendData = [
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

  const trendData: TrendItem[] = useMemo(() => {
    return baseTrendData.map((d) => ({
      month: d.month,
      volume: Math.max(10, Math.round(d.volume * Math.min(1.5, scaleFactor * 1.2))),
      revenue: Math.max(20, Math.round(d.revenue * Math.min(1.5, scaleFactor * 1.1))),
    }));
  }, [scaleFactor]);

  // Dynamic Purchasing Customers Monthly Stacked Bar Data
  const purchasingCustData = useMemo(() => {
    const baseCust = [
      { month: '4/23', total: 800, purchasing: 370 },
      { month: '5/23', total: 890, purchasing: 480 },
      { month: '6/23', total: 890, purchasing: 410 },
      { month: '7/23', total: 960, purchasing: 360 },
      { month: '8/23', total: 960, purchasing: 540 },
      { month: '9/23', total: 960, purchasing: 500 },
      { month: '10/23', total: 920, purchasing: 570 },
      { month: '11/23', total: 920, purchasing: 470 },
      { month: '12/23', total: 1000, purchasing: 410 },
      { month: '1/24', total: 1000, purchasing: 530 },
      { month: '2/24', total: 1000, purchasing: 370 },
      { month: '3/24', total: 1000, purchasing: 290 },
    ];

    return baseCust.map((d) => ({
      month: d.month,
      total: Math.max(100, Math.round(d.total * Math.min(1.5, scaleFactor * 1.05))),
      purchasing: Math.max(50, Math.round(d.purchasing * Math.min(1.5, scaleFactor * 1.05))),
    }));
  }, [scaleFactor]);

  // Dynamic Country Regional Distribution
  const countryStats = useMemo(() => {
    if (regionFilter === 'North America') {
      return [
        { flag: '/images/flagUS.png', name: 'US', pct: 75, color: '#046a38' },
        { flag: '/images/flagCanada.png', name: 'Canada', pct: 25, color: '#059669' },
      ];
    } else if (regionFilter === 'Europe') {
      return [
        { flag: '/images/flagUK.png', name: 'UK', pct: 55, color: '#34d399' },
        { flag: '/images/flagFrance.png', name: 'France', pct: 45, color: '#6ee7b7' },
      ];
    } else if (regionFilter === 'Asia Pacific') {
      return [
        { flag: '/images/flagChina.png', name: 'China', pct: 80, color: '#10b981' },
      ];
    }

    return [
      { flag: '/images/flagUS.png', name: 'US', pct: 60, color: '#046a38' },
      { flag: '/images/flagCanada.png', name: 'Canada', pct: 40, color: '#059669' },
      { flag: '/images/flagChina.png', name: 'China', pct: 30, color: '#10b981' },
      { flag: '/images/flagUK.png', name: 'UK', pct: 20, color: '#34d399' },
      { flag: '/images/flagFrance.png', name: 'France', pct: 10, color: '#6ee7b7' },
    ];
  }, [regionFilter]);

  // Dynamic Donut Channel Percentages
  const channelPct = useMemo(() => {
    if (selectedCountry === 'US') return { retail: 64.0, online: 36.0 };
    if (selectedCountry === 'Canada') return { retail: 58.0, online: 42.0 };
    if (selectedCountry === 'China') return { retail: 72.0, online: 28.0 };
    if (selectedCountry === 'UK') return { retail: 55.0, online: 45.0 };
    if (selectedCountry === 'France') return { retail: 48.0, online: 52.0 };

    if (regionFilter === 'Europe') return { retail: 55.0, online: 45.0 };
    if (regionFilter === 'North America') return { retail: 68.0, online: 32.0 };
    if (regionFilter === 'Asia Pacific') return { retail: 72.0, online: 28.0 };
    if (productFilter === 'Software SaaS') return { retail: 72.5, online: 27.5 };
    if (productFilter === 'Hardware Equipment') return { retail: 55.0, online: 45.0 };

    return { retail: 61.8, online: 38.2 };
  }, [selectedCountry, regionFilter, productFilter]);

  // Donut StrokeDasharray calculation
  const donutDash = useMemo(() => {
    const circum = 2 * Math.PI * 34; // ~213.6
    const retailLength = (channelPct.retail / 100) * circum;
    return `${retailLength.toFixed(1)} ${circum.toFixed(1)}`;
  }, [channelPct]);

  // Dynamic Customer Analysis Stats
  const custAnalysisStats = useMemo(() => {
    const totalCust = Math.round(1200 * scaleFactor);

    let retention = 76.15;
    if (customerFilter === 'Enterprise') retention = 84.50;
    else if (customerFilter === 'Mid-Market') retention = 72.80;
    else if (customerFilter === 'Small Business (SMB)') retention = 65.20;

    if (selectedCountry === 'US') retention = 78.20;
    else if (selectedCountry === 'China') retention = 81.10;

    const acquisition = (100 - retention).toFixed(2);
    const retentionStr = retention.toFixed(2);

    let onlinePct = 95.0;
    if (productFilter === 'Hardware Equipment') onlinePct = 82.0;
    else if (productFilter === 'Software SaaS') onlinePct = 98.5;

    let repeatPct = 42.1;
    let oneTimePct = 34.3;
    let nonPurchasingPct = 23.6;

    if (customerFilter === 'Enterprise') {
      repeatPct = 58.2;
      oneTimePct = 28.5;
      nonPurchasingPct = 13.3;
    } else if (customerFilter === 'Small Business (SMB)') {
      repeatPct = 31.0;
      oneTimePct = 41.5;
      nonPurchasingPct = 27.5;
    }

    return {
      totalCust,
      retentionStr,
      acquisition,
      onlinePct,
      repeatPct,
      oneTimePct,
      nonPurchasingPct,
    };
  }, [scaleFactor, customerFilter, selectedCountry, productFilter]);

  // Dynamic Product Preferences (10 Products)
  const productsCol2 = useMemo(() => [
    { rank: 'TOP.1', name: 'Product name 1', qty: Math.round(2647 * scaleFactor) },
    { rank: 'TOP.2', name: 'Product 2', qty: Math.round(2280 * scaleFactor) },
    { rank: 'TOP.3', name: 'Product 3', qty: Math.round(1849 * scaleFactor) },
    { rank: 'TOP.4', name: 'Product 4', qty: Math.round(1352 * scaleFactor) },
    { rank: 'TOP.5', name: 'Product 5', qty: Math.round(835 * scaleFactor) },
    { rank: 'TOP.6', name: 'Product 6', qty: Math.round(647 * scaleFactor) },
    { rank: 'TOP.7', name: 'Product 7', qty: Math.round(635 * scaleFactor) },
    { rank: 'TOP.8', name: 'Product 8', qty: Math.round(578 * scaleFactor) },
    { rank: 'TOP.9', name: 'Product 9', qty: Math.round(509 * scaleFactor) },
    { rank: 'TOP.10', name: 'Product 10', qty: Math.round(356 * scaleFactor) },
  ], [scaleFactor]);

  // Reset Filters & Country Selection
  const handleResetFilters = () => {
    setPeriodFilter('Last 1 Year');
    setProductFilter('ALL');
    setRegionFilter('ALL');
    setCustomerFilter('ALL');
    setStageFilter('ALL');
    setSelectedCountry(null);
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Metric', 'Value', 'Growth %'];
    const rows = [
      ['Total Sales', `$${metrics.totalSales.toLocaleString()}`, `${metrics.salesInc}%`],
      ['Total Sales Quantity', `${metrics.totalQty.toLocaleString()} units`, `${metrics.qtyInc}%`],
      ['Average Sales', `$${metrics.avgSales.toLocaleString()}`, `${metrics.salesInc}%`],
      ['Average Sales Quantity', `${metrics.avgQty.toLocaleString()} units`, `${metrics.qtyInc}%`],
      ['Total Customers', `${custAnalysisStats.totalCust.toLocaleString()}`, '-'],
      ['Customer Retention', `${custAnalysisStats.retentionStr}%`, '+1.2%'],
      ['New Acquisition', `${custAnalysisStats.acquisition}%`, '+2.4%'],
      ['Filter Region', regionFilter, '-'],
      ['Selected Country', selectedCountry || 'All', '-'],
    ];

    const csvString = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Sales" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className={styles.contentBody}>
          {/* Top Title & Header Buttons */}
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Sales</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Sales</span> &gt; <strong>Reports & Analysis</strong>
              </div>
            </div>

            <button className={styles.exportBtn} onClick={handleExportCsv}>
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
            <select
              className={styles.selectInput}
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value="Last 1 Year">📅 Last 1 Year</option>
              <option value="Last 6 Months">📅 Last 6 Months</option>
              <option value="Last 3 Months">📅 Last 3 Months</option>
              <option value="Last 1 Month">📅 Last 1 Month</option>
            </select>

            <select
              className={styles.selectInput}
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            >
              <option value="ALL">㗊 ALL (Product Type)</option>
              <option value="Software SaaS">Software SaaS</option>
              <option value="Hardware Equipment">Hardware Equipment</option>
              <option value="Consulting Services">Consulting Services</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <select
              className={styles.selectInput}
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setSelectedCountry(null);
              }}
            >
              <option value="ALL">🌐 Region: ALL</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
              <option value="Latin America">Latin America</option>
            </select>

            <select
              className={styles.selectInput}
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            >
              <option value="ALL">👥 ALL (Customer Type)</option>
              <option value="Enterprise">Enterprise Tier 1</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="Small Business (SMB)">Small Business (SMB)</option>
            </select>

            <select
              className={styles.selectInput}
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="ALL">☑ ALL (Sales Stage)</option>
              <option value="Won">Won</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Lost">Lost</option>
            </select>

            <button
              className={styles.filterIconBtn}
              title="Reset All Filters"
              onClick={handleResetFilters}
            >
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
                <span className={styles.miniCardValue}>${metrics.totalSales.toLocaleString()}</span>
                <span className={styles.badgePositive}>{metrics.salesInc}%</span>
              </div>

              <div className={styles.miniCard}>
                <span className={styles.miniCardTopLine} />
                <span className={styles.miniCardLabel}>Total Sales Quantity</span>
                <span className={styles.miniCardValue}>{metrics.totalQty.toLocaleString()}(units)</span>
                <span className={metrics.qtyInc >= 0 ? styles.badgePositive : styles.badgeNegative}>
                  {metrics.qtyInc}%
                </span>
              </div>

              <div className={styles.miniCard}>
                <span className={styles.miniCardTopLine} />
                <span className={styles.miniCardLabel}>Average Sales</span>
                <span className={styles.miniCardValue}>${metrics.avgSales.toLocaleString()}</span>
                <span className={styles.badgePositive}>{metrics.salesInc}%</span>
              </div>

              <div className={styles.miniCard}>
                <span className={styles.miniCardTopLine} />
                <span className={styles.miniCardLabel}>Average Sales Quantity</span>
                <span className={styles.miniCardValue}>{metrics.avgQty.toLocaleString()}(units)</span>
                <span className={metrics.qtyInc >= 0 ? styles.badgePositive : styles.badgeNegative}>
                  {metrics.qtyInc}%
                </span>
              </div>
            </div>

            {/* Sales Trend Combo Chart */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  Sales Trend {selectedCountry ? `(${selectedCountry})` : ''}
                </h2>
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
                Sales channel distribution <span className={styles.cardSubtitle}>(Sales proportion {selectedCountry ? `- ${selectedCountry}` : ''})</span>
              </h2>
            </div>

            <div className={styles.channelMapGrid}>
              {/* Interactive Donut Chart */}
              <div className={styles.channelContent}>
                <svg width="220" height="200" viewBox="0 0 150 130">
                  {/* Background Periwinkle Ring (Online %) */}
                  <circle cx="65" cy="60" r="34" fill="none" stroke="#c7d2fe" strokeWidth="18" />

                  {/* Primary Indigo Ring (Retail %) */}
                  <circle
                    cx="65"
                    cy="60"
                    r="34"
                    fill="none"
                    stroke="#5d5fef"
                    strokeWidth="18"
                    strokeDasharray={donutDash}
                    transform="rotate(-90 65 60)"
                  />

                  {/* Callout Pointer Line & Label for Online */}
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
                    {channelPct.online}%
                  </text>

                  {/* Callout Pointer Line & Label for Retail */}
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
                    {channelPct.retail}%
                  </text>
                </svg>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '3px', background: '#5d5fef' }} />
                    <span>Retail ({channelPct.retail}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '3px', background: '#c7d2fe' }} />
                    <span>Online ({channelPct.online}%)</span>
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
                  {countryStats.map((c) => {
                    const isSelected = selectedCountry === c.name;

                    return (
                      <div
                        key={c.name}
                        className={`${styles.countryRow} ${isSelected ? styles.countryRowActive : ''}`}
                        onClick={() => setSelectedCountry(isSelected ? null : c.name)}
                        title={`Click to filter diagrams by ${c.name}`}
                      >
                        <img src={c.flag} alt={c.name} className={styles.flagIconImg} />
                        <span className={styles.countryName}>{c.name}</span>
                        <div className={styles.countryProgress}>
                          <div className={styles.countryFill} style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                        </div>
                        <span className={styles.countryPctText}>{c.pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Customer Analysis */}
          <div className={styles.cardBox}>
            <h2 className={styles.cardTitle}>Customer Analysis</h2>

            <div className={styles.customerAnalysisContent}>
              {/* Dynamic Pie Projection Diagram */}
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

                  {/* Text Labels */}
                  <text x="82" y="82" fill="#ffffff" fontSize="10" fontWeight="bold">
                    {custAnalysisStats.acquisition}%
                  </text>
                  <text x="190" y="78" textAnchor="middle" fill="#5d5fef" fontSize="13" fontWeight="bold">
                    New Customers
                  </text>
                  <text x="310" y="92" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    Online
                  </text>
                  <text x="310" y="104" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    ({custAnalysisStats.onlinePct}%)
                  </text>
                </svg>
              </div>

              {/* Right Side Column with Dynamic Stat Cards & Interactive Stacked Bar */}
              <div className={styles.rightAnalysisCol}>
                {/* Dynamic Stat Cards */}
                <div className={styles.custMetricsGroup}>
                  {/* Total Customers Card */}
                  <div className={styles.custStatCard}>
                    <span className={styles.custLabel}>Total Customers</span>
                    <div className={styles.custValRow}>
                      <span className={styles.custVal}>{custAnalysisStats.totalCust.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className={styles.custStatCard}>
                    <span className={styles.custLabel}>Customer Retention</span>
                    <div className={styles.custValRow}>
                      <span className={styles.custVal}>{custAnalysisStats.retentionStr}%</span>
                      <div className={styles.dividerLine} />
                      <span className={styles.badgeTrendPositive}>▲ +1.2%</span>
                    </div>
                  </div>

                  <div className={styles.custStatCard}>
                    <span className={styles.custLabel}>New Acquisition</span>
                    <div className={styles.custValRow}>
                      <span className={styles.custVal}>{custAnalysisStats.acquisition}%</span>
                      <div className={styles.dividerLine} />
                      <span className={styles.badgeTrendPositive}>▲ +2.4%</span>
                    </div>
                  </div>
                </div>

                {/* Stacked Progress Bar (Dynamic Widths) */}
                <div style={{ width: '100%' }}>
                  <div className={styles.barLegendRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className={styles.legendSquareMint} />
                      <span>Repeat Purchasing ({custAnalysisStats.repeatPct}%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className={styles.legendSquareEmerald} />
                      <span>One-time Purchasing ({custAnalysisStats.oneTimePct}%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className={styles.legendSquareDarkGreen} />
                      <span>Non-purchasing ({custAnalysisStats.nonPurchasingPct}%)</span>
                    </div>
                  </div>

                  <div className={styles.stackedProgressBar}>
                    <div className={styles.segRepeat} style={{ width: `${custAnalysisStats.repeatPct}%` }}>
                      {custAnalysisStats.repeatPct}%
                    </div>
                    <div className={styles.segOneTime} style={{ width: `${custAnalysisStats.oneTimePct}%` }}>
                      {custAnalysisStats.oneTimePct}%
                    </div>
                    <div className={styles.segNonPurchasing} style={{ width: `${custAnalysisStats.nonPurchasingPct}%` }}>
                      {custAnalysisStats.nonPurchasingPct}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Purchasing Customers Stacked Bar Chart & Product Preferences Top Ranking */}
          <div className={styles.row4Grid}>
            {/* Purchasing Customers Stacked Bar Chart */}
            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Purchasing customers</h2>
                <div className={styles.legendGroup} style={{ gap: '14px' }}>
                  <div className={styles.legendItem}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#a7f3d0', borderRadius: '2px', display: 'inline-block' }} />
                    <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Total number of customers</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '2px', display: 'inline-block' }} />
                    <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Monthly number of purchasing customers</span>
                  </div>
                </div>
              </div>

              <div className={styles.comboChartContainer} style={{ marginTop: '12px' }}>
                <div className={styles.yAxis} style={{ gap: '22px', fontSize: '11px', color: '#94a3b8' }}>
                  <span>1100</span>
                  <span>800</span>
                  <span>500</span>
                  <span>200</span>
                </div>

                <div className={styles.chartBody}>
                  <svg className={styles.svgCombo} viewBox="0 0 500 160" preserveAspectRatio="none">
                    {/* Horizontal Baseline Lines */}
                    <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="43" x2="500" y2="43" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="86" x2="500" y2="86" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="129" x2="500" y2="129" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Stacked Bars per Month */}
                    {purchasingCustData.map((d, i) => {
                      const barWidth = 18;
                      const xPos = 12 + i * 41;
                      const totalHeight = (d.total / 1100) * 160;
                      const purchasingHeight = (d.purchasing / 1100) * 160;
                      const yTotal = 160 - totalHeight;
                      const yPurchasing = 160 - purchasingHeight;

                      return (
                        <g key={i}>
                          {/* Total Customers Bar (Light Mint) */}
                          <rect
                            x={xPos}
                            y={yTotal}
                            width={barWidth}
                            height={totalHeight}
                            fill="#a7f3d0"
                            rx="4"
                            ry="4"
                          />
                          {/* Monthly Purchasing Customers Bar (Dark Emerald) */}
                          <rect
                            x={xPos}
                            y={yPurchasing}
                            width={barWidth}
                            height={purchasingHeight}
                            fill="#10b981"
                            rx="4"
                            ry="4"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  <div className={styles.xAxis} style={{ fontSize: '11px', color: '#64748b' }}>
                    {months.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Preferences Top Ranking */}
            <div className={styles.cardBox}>
              <h2 className={styles.cardTitle}>Product Preferences Top Ranking</h2>
              <div className={styles.productPrefGrid}>
                {productsCol2.slice(0, 5).map((p) => (
                  <div key={p.rank} className={styles.prefItem}>
                    <div className={styles.prefLeft}>
                      <span className={styles.prefRank}>{p.rank}</span>
                      <span className={styles.prefAvatar}>📦</span>
                      <span>{p.name}</span>
                    </div>
                    <span className={styles.prefQty}>{p.qty.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
