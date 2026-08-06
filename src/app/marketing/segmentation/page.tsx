'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './segmentation.module.css';

interface CustomerRow {
  id: string;
  customerNo: string;
  name: string;
  age: number;
  region: string;
  purchaseNum: number;
  source: 'Online' | 'Retail';
  state: 'Loyal' | 'New' | 'Lost';
  lastPurchase: string;
  firstPurchase: string;
}

export default function SegmentationPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(['29373', '18673']);

  const customersData: CustomerRow[] = [
    { id: '13846', customerNo: '13846', name: 'Bright Solutions', age: 34, region: 'North America', purchaseNum: 5, source: 'Online', state: 'Loyal', lastPurchase: '4/14/2024', firstPurchase: '3/21/2024' },
    { id: '98745', customerNo: '98745', name: 'GlobalMart', age: 23, region: 'Europe', purchaseNum: 4, source: 'Retail', state: 'Loyal', lastPurchase: '5/1/2024', firstPurchase: '3/21/2024' },
    { id: '34972', customerNo: '34972', name: 'Tech Innovations', age: 38, region: 'Asia Pacific', purchaseNum: 8, source: 'Online', state: 'Loyal', lastPurchase: '4/17/2024', firstPurchase: '3/17/2024' },
    { id: '29373', customerNo: '29373', name: 'Blue Horizon', age: 25, region: 'Europe', purchaseNum: 2, source: 'Online', state: 'New', lastPurchase: '3/29/2024', firstPurchase: '3/16/2024' },
    { id: '48759', customerNo: '48759', name: 'BestBuyer', age: 41, region: 'North America', purchaseNum: 1, source: 'Online', state: 'New', lastPurchase: '6/11/2024', firstPurchase: '3/7/2024' },
    { id: '18673', customerNo: '18673', name: 'Alpha Solutions', age: 42, region: 'Asia Pacific', purchaseNum: 1, source: 'Retail', state: 'New', lastPurchase: '4/14/2024', firstPurchase: '3/1/2024' },
    { id: '13978', customerNo: '13978', name: 'Prime Goods', age: 29, region: 'North America', purchaseNum: 4, source: 'Online', state: 'Loyal', lastPurchase: '5/4/2024', firstPurchase: '2/27/2024' },
    { id: '16483', customerNo: '16483', name: 'Wise Shoppers', age: 35, region: 'Europe', purchaseNum: 1, source: 'Online', state: 'New', lastPurchase: '7/10/2024', firstPurchase: '2/21/2024' },
    { id: '24567', customerNo: '24567', name: 'Quick Solutions', age: 38, region: 'Asia Pacific', purchaseNum: 5, source: 'Online', state: 'Loyal', lastPurchase: '4/14/2024', firstPurchase: '2/19/2024' },
    { id: '23565', customerNo: '23565', name: 'Visionary Tech', age: 53, region: 'Europe', purchaseNum: 2, source: 'Retail', state: 'Lost', lastPurchase: '6/14/2022', firstPurchase: '2/19/2024' },
  ];

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.user) setUser(resData.user);
      });
  }, []);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === customersData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customersData.map((c) => c.id));
    }
  };

  // Generate 14 horizontal LINE graph segments for Purchase Behavior Analysis
  const behaviorLineRows = Array.from({ length: 14 }).map((_, i) => {
    const y = 138 - i * 8.3;
    // Map age 0-60 to SVG X coords [45..285]
    const ageToX = (age: number) => 45 + (age / 60) * 240;

    const fullRange = { x1: ageToX(18 + i * 1.1), x2: ageToX(56 - i * 1.0) };
    const midRange = { x1: ageToX(24 + i * 0.7), x2: ageToX(48 - i * 0.6) };
    const coreRange = { x1: ageToX(29 + i * 0.4), x2: ageToX(41 - i * 0.2) };

    return { y, fullRange, midRange, coreRange };
  });

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Marketing" />

      <div className={styles.mainContent}>
        <Header user={user} />

        <main className={styles.contentBody}>
          {/* Top Title & Header */}
          <div className={styles.topRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Marketing</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Marketing</span> &gt; <strong>Segmentation</strong>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <select className={styles.selectInput} defaultValue="All">
                <option value="All">㗊 Customer type: All</option>
                <option value="Loyal">Loyal</option>
                <option value="New">New</option>
                <option value="Lost">Lost</option>
              </select>

              <select className={styles.selectInput} defaultValue="All">
                <option value="All">Region: All</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
              </select>

              <select className={styles.selectInput} defaultValue="All">
                <option value="All">State: All</option>
              </select>

              <select className={styles.selectInput} defaultValue="All">
                <option value="All">Age: All</option>
              </select>

              <button className={styles.filterIconBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className={styles.bulkActionGroup}>
              <span className={styles.selectedCountText}>{selectedIds.length} Item selected</span>
              <button className={styles.bulkExportBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>BULK EXPORT</span>
              </button>
            </div>
          </div>

          {/* Horizontal Metrics Bar */}
          <div className={styles.metricsBar}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Total Customers</span>
              <span className={styles.metricVal}>1090</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>New Customers</span>
              <span className={styles.metricVal}>26</span>
              <span className={styles.metricInc}>2.38%</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Loyal Customers</span>
              <span className={styles.metricVal}>158</span>
              <span className={styles.metricInc}>14.5%</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Lost Customers</span>
              <span className={styles.metricVal}>11</span>
              <span className={styles.metricInc}>1.0%</span>
            </div>
          </div>

          {/* Middle 3 Charts Row */}
          <div className={styles.chartsGrid}>
            {/* Card 1: Customer Source */}
            <div className={styles.cardBox}>
              <h2 className={styles.cardTitle}>Customer source</h2>
              <div className={styles.donutContainer}>
                <svg className={styles.sourceSvg} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#5d5fef"
                    strokeWidth="16"
                    strokeDasharray="172.8 238.7"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="48" textAnchor="middle" fill="#5d5fef" fontSize="7" fontWeight="bold">
                    Online
                  </text>
                  <text x="50" y="56" textAnchor="middle" fill="#5d5fef" fontSize="7" fontWeight="bold">
                    72.4%
                  </text>
                </svg>
              </div>
            </div>

            {/* Card 2: Age Distribution (Enlarged with Accurate Pointer Lines) */}
            <div className={styles.cardBox}>
              <h2 className={styles.cardTitle}>Age Distribution</h2>
              <div className={styles.ageDistributionWrapper}>
                <svg width="100%" height="200" viewBox="0 0 350 200" style={{ overflow: 'visible' }}>
                  <defs>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#5d5fef" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* Multi-segment Donut Ring (Center: 175, 100 | R: 52 | Stroke: 15) */}
                  <g filter="url(#shadow)">
                    {/* Background Ring */}
                    <circle cx="175" cy="100" r="52" fill="none" stroke="#f1f5f9" strokeWidth="15" />

                    {/* Segment 1: 0-20 (13.4%) - Light Ice Blue */}
                    <circle
                      cx="175"
                      cy="100"
                      r="52"
                      fill="none"
                      stroke="#c7d2fe"
                      strokeWidth="15"
                      strokeDasharray="43.8 283"
                      transform="rotate(-90 175 100)"
                    />

                    {/* Segment 2: >50 (9.2%) - Deep Royal Indigo */}
                    <circle
                      cx="175"
                      cy="100"
                      r="52"
                      fill="none"
                      stroke="#4338ca"
                      strokeWidth="15"
                      strokeDasharray="30.1 296.6"
                      transform="rotate(-41.76 175 100)"
                    />

                    {/* Segment 3: 41-50 (22.2%) - Soft Blue */}
                    <circle
                      cx="175"
                      cy="100"
                      r="52"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="15"
                      strokeDasharray="72.5 254.2"
                      transform="rotate(-8.64 175 100)"
                    />

                    {/* Segment 4: 31-40 (35.4%) - Primary Indigo (Largest) */}
                    <circle
                      cx="175"
                      cy="100"
                      r="52"
                      fill="none"
                      stroke="#5d5fef"
                      strokeWidth="15"
                      strokeDasharray="115.7 211"
                      transform="rotate(71.28 175 100)"
                    />

                    {/* Segment 5: 21-30 (19.8%) - Periwinkle */}
                    <circle
                      cx="175"
                      cy="100"
                      r="52"
                      fill="none"
                      stroke="#a5b4fc"
                      strokeWidth="15"
                      strokeDasharray="64.7 262"
                      transform="rotate(198.72 175 100)"
                    />
                  </g>

                  {/* Clear Pointer Lines & Text Labels */}

                  {/* 1. Segment 0-20 (13.4%) - Top Right */}
                  <circle cx="196" cy="53" r="3" fill="#c7d2fe" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="196,53 218,32 245,32" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="250" y="36" fill="#1e293b" fontSize="11" fontWeight="700">0-20 <tspan fill="#5d5fef" fontWeight="800">(13.4%)</tspan></text>

                  {/* 2. Segment >50 (9.2%) - Right Upper */}
                  <circle cx="222" cy="78" r="3" fill="#4338ca" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="222,78 245,82 270,82" fill="none" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="275" y="86" fill="#1e293b" fontSize="11" fontWeight="700">&gt;50 <tspan fill="#4338ca" fontWeight="800">(9.2%)</tspan></text>

                  {/* 3. Segment 41-50 (22.2%) - Bottom Right */}
                  <circle cx="219" cy="127" r="3" fill="#818cf8" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="219,127 240,150 265,150" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="270" y="154" fill="#1e293b" fontSize="11" fontWeight="700">41-50 <tspan fill="#818cf8" fontWeight="800">(22.2%)</tspan></text>

                  {/* 4. Segment 31-40 (35.4%) - Bottom Left */}
                  <circle cx="138" cy="137" r="3" fill="#5d5fef" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="138,137 110,160 80,160" fill="none" stroke="#5d5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="75" y="164" textAnchor="end" fill="#1e293b" fontSize="11" fontWeight="700">31-40 <tspan fill="#5d5fef" fontWeight="800">(35.4%)</tspan></text>

                  {/* 5. Segment 21-30 (19.8%) - Top Left */}
                  <circle cx="145" cy="58" r="3" fill="#a5b4fc" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="145,58 120,35 90,35" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="85" y="39" textAnchor="end" fill="#1e293b" fontSize="11" fontWeight="700">21-30 <tspan fill="#6366f1" fontWeight="800">(19.8%)</tspan></text>
                </svg>
              </div>
            </div>

            {/* Card 3: Purchase Behavior Analysis (Larger Horizontal LINE Graph) */}
            <div className={styles.cardBox}>
              <h2 className={styles.cardTitle}>Purchase Behavior Analysis</h2>
              <div className={styles.behaviorChartWrapper}>
                <svg width="100%" height="210" viewBox="0 0 340 190" style={{ overflow: 'visible' }}>
                  {/* Y-Axis Title (Rotated Vertically on Far Left) */}
                  <text
                    x="-90"
                    y="15"
                    transform="rotate(-90)"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9.5"
                    fontWeight="600"
                  >
                    (Purchase Frequency)
                  </text>

                  {/* Axis Lines (Soft Lavender #e0e7ff) */}
                  <line x1="45" y1="20" x2="45" y2="150" stroke="#e0e7ff" strokeWidth="1.5" />
                  <line x1="45" y1="150" x2="295" y2="150" stroke="#e0e7ff" strokeWidth="1.5" />

                  {/* Y-Axis Ticks & Labels */}
                  {[
                    { y: 30, label: '>14' },
                    { y: 65, label: '10' },
                    { y: 100, label: '6' },
                    { y: 135, label: '2' },
                    { y: 150, label: '0' },
                  ].map((tick) => (
                    <g key={tick.label}>
                      <line x1="40" y1={tick.y} x2="45" y2={tick.y} stroke="#c7d2fe" strokeWidth="1.2" />
                      <text x="36" y={tick.y + 3} textAnchor="end" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                        {tick.label}
                      </text>
                    </g>
                  ))}

                  {/* X-Axis Ticks & Labels */}
                  {[
                    { x: 45, label: '0' },
                    { x: 85, label: '10' },
                    { x: 125, label: '20' },
                    { x: 165, label: '30' },
                    { x: 205, label: '40' },
                    { x: 245, label: '50' },
                    { x: 285, label: '60' },
                  ].map((tick) => (
                    <g key={tick.label}>
                      <line x1={tick.x} y1="150" x2={tick.x} y2="155" stroke="#c7d2fe" strokeWidth="1.2" />
                      <text x={tick.x} y="168" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                        {tick.label}
                      </text>
                    </g>
                  ))}

                  {/* X-Axis Unit Label */}
                  <text x="295" y="168" textAnchor="start" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                    (Age)
                  </text>

                  {/* Horizontal LINE Graph Rows (Clean Solid & Gradient Lines instead of dots) */}
                  {behaviorLineRows.map((row, rIdx) => (
                    <g key={rIdx}>
                      {/* Outer Soft Light Lavender Line Segment */}
                      <line
                        x1={row.fullRange.x1}
                        y1={row.y}
                        x2={row.fullRange.x2}
                        y2={row.y}
                        stroke="#c7d2fe"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      {/* Mid Indigo Line Segment */}
                      <line
                        x1={row.midRange.x1}
                        y1={row.y}
                        x2={row.midRange.x2}
                        y2={row.y}
                        stroke="#818cf8"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                      {/* Core Peak Vibrant Indigo Line Segment */}
                      <line
                        x1={row.coreRange.x1}
                        y1={row.y}
                        x2={row.coreRange.x2}
                        y2={row.y}
                        stroke="#5d5fef"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Table Card */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={selectedIds.length === customersData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>No.</th>
                  <th>Customer name</th>
                  <th>Age</th>
                  <th>Region</th>
                  <th>Purchase Num.</th>
                  <th>Source</th>
                  <th>State</th>
                  <th>
                    <span className={styles.sortHeader}>
                      Last purchase <span className={styles.sortIcon}>⇕</span>
                    </span>
                  </th>
                  <th>
                    <span className={styles.sortHeader}>
                      First Purchase <span className={styles.sortIcon}>⇕</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customersData.map((item) => {
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr key={item.id} className={isSelected ? styles.selectedRow : ''}>
                      <td>
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>
                      <td className={styles.customerNo}>{item.customerNo}</td>
                      <td className={styles.customerName}>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.region}</td>
                      <td>
                        <span className={styles.purchaseNumLink}>{item.purchaseNum}</span>
                      </td>
                      <td>{item.source}</td>
                      <td>{item.state}</td>
                      <td>{item.lastPurchase}</td>
                      <td>{item.firstPurchase}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer Pagination */}
            <div className={styles.tableFooter}>
              <div>Total items: 356</div>
              <div className={styles.paginationControls}>
                <span>Items per page: 10</span>
                <span>Total pages: 40</span>
                <div className={styles.pageNumbers}>
                  <button className={styles.arrowBtn}>&lt;</button>
                  <button className={`${styles.pageBtn} ${styles.activePageBtn}`}>1</button>
                  <button className={styles.pageBtn}>2</button>
                  <button className={styles.pageBtn}>3</button>
                  <button className={styles.pageBtn}>4</button>
                  <button className={styles.pageBtn}>5</button>
                  <button className={styles.arrowBtn}>&gt;</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
