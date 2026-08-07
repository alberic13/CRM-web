'use client';

import { useEffect, useState, useMemo } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter States
  const [customerTypeFilter, setCustomerTypeFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All');

  // Selected Row Checkbox IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Add Customer Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAge, setNewCustAge] = useState<number>(30);
  const [newCustRegion, setNewCustRegion] = useState('North America');
  const [newCustSource, setNewCustSource] = useState<'Online' | 'Retail'>('Online');
  const [newCustState, setNewCustState] = useState<'Loyal' | 'New' | 'Lost'>('New');

  // Custom name mode flag
  const [isCustomNameInput, setIsCustomNameInput] = useState(false);

  // Dynamic Customers State from Database API + Sample Items
  const [dbCustomers, setDbCustomers] = useState<CustomerRow[]>([]);

  const defaultCustomersData: CustomerRow[] = [
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

  // Fetch Customers from Database API
  const fetchCustomers = () => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.customers && Array.isArray(data.customers)) {
          const mapped: CustomerRow[] = data.customers.map((c: any) => ({
            id: c.id,
            customerNo: c.customerNo || Math.floor(10000 + Math.random() * 90000).toString(),
            name: c.name,
            age: c.age || 32,
            region: c.region || 'North America',
            purchaseNum: c.purchaseNum || 1,
            source: (c.source === 'Retail' ? 'Retail' : 'Online') as 'Online' | 'Retail',
            state: (c.status || 'New') as 'Loyal' | 'New' | 'Lost',
            lastPurchase: c.lastPurchase ? new Date(c.lastPurchase).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
            firstPurchase: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
          }));
          setDbCustomers(mapped);
        }
      })
      .catch((err) => console.error('Fetch customers error:', err));
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.user) setUser(resData.user);
      });

    fetchCustomers();
  }, []);

  // Combined Customers Data
  const customersData = useMemo(() => {
    const combined = [...dbCustomers, ...defaultCustomersData];
    const uniqueMap = new Map();
    combined.forEach((item) => {
      if (!uniqueMap.has(item.customerNo)) {
        uniqueMap.set(item.customerNo, item);
      }
    });
    return Array.from(uniqueMap.values());
  }, [dbCustomers]);

  // List of Sales Customers for Dropdown Selection
  const salesCustomerOptions = useMemo(() => {
    const names = customersData.map((c) => c.name);
    return Array.from(new Set(names));
  }, [customersData]);

  // Handle Customer Name Select from Sales Customers
  const handleSelectCustomerFromSales = (selectedName: string) => {
    if (selectedName === 'CUSTOM_NEW') {
      setIsCustomNameInput(true);
      setNewCustName('');
    } else {
      setIsCustomNameInput(false);
      setNewCustName(selectedName);

      // Auto populate attributes if customer exists
      const match = customersData.find((c) => c.name === selectedName);
      if (match) {
        setNewCustAge(match.age);
        setNewCustRegion(match.region);
        setNewCustSource(match.source);
        setNewCustState(match.state);
      }
    }
  };

  // Filter Table Customers
  const filteredCustomers = useMemo(() => {
    return customersData.filter((c) => {
      if (customerTypeFilter !== 'All' && c.state !== customerTypeFilter) return false;
      if (regionFilter !== 'All' && c.region !== regionFilter) return false;
      if (stateFilter !== 'All' && c.source !== stateFilter) return false;
      if (ageFilter !== 'All') {
        if (ageFilter === '0-20' && c.age > 20) return false;
        if (ageFilter === '21-30' && (c.age < 21 || c.age > 30)) return false;
        if (ageFilter === '31-40' && (c.age < 31 || c.age > 40)) return false;
        if (ageFilter === '41-50' && (c.age < 41 || c.age > 50)) return false;
        if (ageFilter === '>50' && c.age <= 50) return false;
      }
      return true;
    });
  }, [customersData, customerTypeFilter, regionFilter, stateFilter, ageFilter]);

  // Checkbox toggle logic
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setCustomerTypeFilter('All');
    setRegionFilter('All');
    setStateFilter('All');
    setAgeFilter('All');
    setSelectedIds([]);
  };

  // Submit Add Customer Form
  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    try {
      const email = newCustEmail.trim() || `${newCustName.toLowerCase().replace(/\s+/g, '')}@example.com`;
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustName,
          email,
          region: newCustRegion,
          source: newCustSource,
          status: newCustState,
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewCustName('');
        setNewCustEmail('');
        setIsCustomNameInput(false);
        fetchCustomers();
      } else {
        alert('Failed to add customer');
      }
    } catch (err) {
      console.error('Error adding customer:', err);
    }
  };

  // Bulk CSV Export
  const handleBulkExport = () => {
    const listToExport = selectedIds.length > 0
      ? customersData.filter((c) => selectedIds.includes(c.id))
      : filteredCustomers;

    const headers = ['Customer No', 'Name', 'Age', 'Region', 'Purchase Num', 'Source', 'State', 'Last Purchase', 'First Purchase'];
    const rows = listToExport.map((c) => [
      c.customerNo,
      c.name,
      c.age,
      c.region,
      c.purchaseNum,
      c.source,
      c.state,
      c.lastPurchase,
      c.firstPurchase,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer_segmentation_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter Scale Factor Calculation
  const scaleFactor = useMemo(() => {
    let factor = filteredCustomers.length / (customersData.length || 1);
    return Math.max(0.1, factor);
  }, [filteredCustomers, customersData]);

  // Dynamic Horizontal Metrics
  const metrics = useMemo(() => {
    const totalCust = Math.round(1090 * scaleFactor);
    const newCust = Math.round(26 * scaleFactor);
    const loyalCust = Math.round(158 * scaleFactor);
    const lostCust = Math.max(1, Math.round(11 * scaleFactor));

    return { totalCust, newCust, loyalCust, lostCust };
  }, [scaleFactor]);

  // Dynamic Customer Source (Donut Chart)
  const sourceStats = useMemo(() => {
    const onlineCount = filteredCustomers.filter((c) => c.source === 'Online').length;
    const total = filteredCustomers.length || 1;
    const onlinePct = ((onlineCount / total) * 100).toFixed(1);
    const retailPct = (100 - parseFloat(onlinePct)).toFixed(1);

    const circum = 238.7;
    const onlineDash = ((parseFloat(onlinePct) / 100) * circum).toFixed(1);

    return { onlinePct, retailPct, onlineDash, circum };
  }, [filteredCustomers]);

  // Dynamic Age Distribution
  const ageStats = useMemo(() => {
    let count0_20 = 0, count21_30 = 0, count31_40 = 0, count41_50 = 0, countOver50 = 0;
    filteredCustomers.forEach((c) => {
      if (c.age <= 20) count0_20++;
      else if (c.age <= 30) count21_30++;
      else if (c.age <= 40) count31_40++;
      else if (c.age <= 50) count41_50++;
      else countOver50++;
    });

    const total = filteredCustomers.length || 1;
    if (filteredCustomers.length === customersData.length) {
      return {
        p0_20: '13.4',
        p21_30: '19.8',
        p31_40: '35.4',
        p41_50: '22.2',
        pOver50: '9.2',
      };
    }

    return {
      p0_20: ((count0_20 / total) * 100).toFixed(1),
      p21_30: ((count21_30 / total) * 100).toFixed(1),
      p31_40: ((count31_40 / total) * 100).toFixed(1),
      p41_50: ((count41_50 / total) * 100).toFixed(1),
      pOver50: ((countOver50 / total) * 100).toFixed(1),
    };
  }, [filteredCustomers, customersData]);

  // Dynamic Behavior LINE graph rows
  const behaviorLineRows = useMemo(() => {
    const ageOffset = ageFilter === '21-30' ? -4 : ageFilter === '41-50' ? 4 : 0;

    return Array.from({ length: 14 }).map((_, i) => {
      const y = 138 - i * 8.3;
      const ageToX = (age: number) => 45 + (age / 60) * 240;

      const fullRange = { x1: ageToX(18 + i * 1.1 + ageOffset), x2: ageToX(56 - i * 1.0 + ageOffset) };
      const midRange = { x1: ageToX(24 + i * 0.7 + ageOffset), x2: ageToX(48 - i * 0.6 + ageOffset) };
      const coreRange = { x1: ageToX(29 + i * 0.4 + ageOffset), x2: ageToX(41 - i * 0.2 + ageOffset) };

      return { y, fullRange, midRange, coreRange };
    });
  }, [ageFilter]);

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Marketing" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />

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
              <select
                className={styles.selectInput}
                value={customerTypeFilter}
                onChange={(e) => setCustomerTypeFilter(e.target.value)}
              >
                <option value="All">㗊 Customer type: All</option>
                <option value="Loyal">Loyal</option>
                <option value="New">New</option>
                <option value="Lost">Lost</option>
              </select>

              <select
                className={styles.selectInput}
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="All">Region: All</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
              </select>

              <select
                className={styles.selectInput}
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <option value="All">Source: All</option>
                <option value="Online">Online</option>
                <option value="Retail">Retail</option>
              </select>

              <select
                className={styles.selectInput}
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
              >
                <option value="All">Age: All</option>
                <option value="0-20">0-20</option>
                <option value="21-30">21-30</option>
                <option value="31-40">31-40</option>
                <option value="41-50">41-50</option>
                <option value=">50">&gt;50</option>
              </select>

              <button
                className={styles.filterIconBtn}
                title="Reset Filters"
                onClick={handleResetFilters}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className={styles.bulkActionGroup}>
              <span className={styles.selectedCountText}>{selectedIds.length} Item selected</span>
              <button className={styles.bulkExportBtn} onClick={handleBulkExport}>
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
              <span className={styles.metricVal}>{metrics.totalCust}</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>New Customers</span>
              <span className={styles.metricVal}>{metrics.newCust}</span>
              <span className={styles.metricInc}>2.38%</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Loyal Customers</span>
              <span className={styles.metricVal}>{metrics.loyalCust}</span>
              <span className={styles.metricInc}>14.5%</span>
            </div>
            <div className={styles.metricDivider} />

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Lost Customers</span>
              <span className={styles.metricVal}>{metrics.lostCust}</span>
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
                    strokeDasharray={`${sourceStats.onlineDash} ${sourceStats.circum}`}
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="48" textAnchor="middle" fill="#5d5fef" fontSize="7" fontWeight="bold">
                    Online
                  </text>
                  <text x="50" y="56" textAnchor="middle" fill="#5d5fef" fontSize="7" fontWeight="bold">
                    {sourceStats.onlinePct}%
                  </text>
                </svg>
              </div>
            </div>

            {/* Card 2: Age Distribution */}
            <div className={styles.cardBox}>
              <h2 className={styles.cardTitle}>Age Distribution</h2>
              <div className={styles.ageDistributionWrapper}>
                <svg width="100%" height="200" viewBox="0 0 350 200" style={{ overflow: 'visible' }}>
                  <defs>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#5d5fef" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* Multi-segment Donut Ring */}
                  <g filter="url(#shadow)">
                    <circle cx="175" cy="100" r="52" fill="none" stroke="#f1f5f9" strokeWidth="15" />

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

                  {/* Dynamic Pointer Lines & Text Labels */}
                  <circle cx="196" cy="53" r="3" fill="#c7d2fe" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="196,53 218,32 245,32" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="250" y="36" fill="#1e293b" fontSize="11" fontWeight="700">0-20 <tspan fill="#5d5fef" fontWeight="800">({ageStats.p0_20}%)</tspan></text>

                  <circle cx="222" cy="78" r="3" fill="#4338ca" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="222,78 245,82 270,82" fill="none" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="275" y="86" fill="#1e293b" fontSize="11" fontWeight="700">&gt;50 <tspan fill="#4338ca" fontWeight="800">({ageStats.pOver50}%)</tspan></text>

                  <circle cx="219" cy="127" r="3" fill="#818cf8" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="219,127 240,150 265,150" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="270" y="154" fill="#1e293b" fontSize="11" fontWeight="700">41-50 <tspan fill="#818cf8" fontWeight="800">({ageStats.p41_50}%)</tspan></text>

                  <circle cx="138" cy="137" r="3" fill="#5d5fef" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="138,137 110,160 80,160" fill="none" stroke="#5d5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="75" y="164" textAnchor="end" fill="#1e293b" fontSize="11" fontWeight="700">31-40 <tspan fill="#5d5fef" fontWeight="800">({ageStats.p31_40}%)</tspan></text>

                  <circle cx="145" cy="58" r="3" fill="#a5b4fc" stroke="#ffffff" strokeWidth="1" />
                  <polyline points="145,58 120,35 90,35" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="85" y="39" textAnchor="end" fill="#1e293b" fontSize="11" fontWeight="700">21-30 <tspan fill="#6366f1" fontWeight="800">({ageStats.p21_30}%)</tspan></text>
                </svg>
              </div>
            </div>

            {/* Card 3: Purchase Behavior Analysis */}
            <div className={styles.cardBox}>
              <h2 className={styles.cardTitle}>Purchase Behavior Analysis</h2>
              <div className={styles.behaviorChartWrapper}>
                <svg width="100%" height="210" viewBox="0 0 340 190" style={{ overflow: 'visible' }}>
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

                  <line x1="45" y1="20" x2="45" y2="150" stroke="#e0e7ff" strokeWidth="1.5" />
                  <line x1="45" y1="150" x2="295" y2="150" stroke="#e0e7ff" strokeWidth="1.5" />

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

                  <text x="295" y="168" textAnchor="start" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                    (Age)
                  </text>

                  {behaviorLineRows.map((row, rIdx) => (
                    <g key={rIdx}>
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
                      checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
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
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No customers match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((item) => {
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
                  })
                )}
              </tbody>
            </table>

            {/* Footer Pagination */}
            <div className={styles.tableFooter}>
              <div>Total items: {filteredCustomers.length}</div>
              <div className={styles.paginationControls}>
                <span>Items per page: 10</span>
                <span>Total pages: 1</span>
                <div className={styles.pageNumbers}>
                  <button className={styles.arrowBtn}>&lt;</button>
                  <button className={`${styles.pageBtn} ${styles.activePageBtn}`}>1</button>
                  <button className={styles.arrowBtn}>&gt;</button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Customer Modal */}
          {isAddModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}>Add New Customer</h3>
                  <button className={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}>×</button>
                </div>

                <form onSubmit={handleAddCustomerSubmit} className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Customer Name * (Select from Sales Customers)</label>

                    {!isCustomNameInput ? (
                      <select
                        className={styles.formSelect}
                        value={newCustName}
                        onChange={(e) => handleSelectCustomerFromSales(e.target.value)}
                        required
                      >
                        <option value="">-- Select Customer from Sales --</option>
                        {salesCustomerOptions.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                        <option value="CUSTOM_NEW">✏️ + Enter New Custom Customer Name</option>
                      </select>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="e.g. Acme Corp"
                          value={newCustName}
                          onChange={(e) => setNewCustName(e.target.value)}
                          required
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className={styles.cancelBtn}
                          style={{ fontSize: '11px', padding: '6px 10px' }}
                          onClick={() => setIsCustomNameInput(false)}
                        >
                          List
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      placeholder="acme@example.com"
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Age</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={newCustAge}
                      onChange={(e) => setNewCustAge(parseInt(e.target.value) || 30)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Region</label>
                    <select
                      className={styles.formSelect}
                      value={newCustRegion}
                      onChange={(e) => setNewCustRegion(e.target.value)}
                    >
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia Pacific">Asia Pacific</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Source</label>
                    <select
                      className={styles.formSelect}
                      value={newCustSource}
                      onChange={(e) => setNewCustSource(e.target.value as 'Online' | 'Retail')}
                    >
                      <option value="Online">Online</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>State / Status</label>
                    <select
                      className={styles.formSelect}
                      value={newCustState}
                      onChange={(e) => setNewCustState(e.target.value as 'Loyal' | 'New' | 'Lost')}
                    >
                      <option value="New">New</option>
                      <option value="Loyal">Loyal</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className={styles.submitBtn}>
                      Save Customer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
