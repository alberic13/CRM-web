'use client';

import AppShell from '@/components/AppShell';
import { useSalesReports } from './useSalesReports';
import { MONTHS } from './salesReportsData';
import ReportsFilterBar from './components/ReportsFilterBar';
import SalesKpiCards from './components/SalesKpiCards';
import SalesTrendChart from './components/SalesTrendChart';
import ChannelDistributionCard from './components/ChannelDistributionCard';
import CustomerAnalysisCard from './components/CustomerAnalysisCard';
import PurchasingCustomersChart from './components/PurchasingCustomersChart';
import ProductPreferencesCard from './components/ProductPreferencesCard';
import styles from './reports.module.css';

export default function SalesReportsPage() {
  const {
    filters,
    setFilter,
    resetFilters,
    selectedCountry,
    toggleCountry,
    metrics,
    trendData,
    purchasingCustData,
    countryStats,
    channelPct,
    donutDash,
    custAnalysisStats,
    products,
    handleExport,
  } = useSalesReports();

  return (
    <AppShell activeMenu="Sales">
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Sales</h1>
          <div className={styles.breadcrumbs}>
            <span>Home</span> &gt; <span>Sales</span> &gt; <strong>Reports & Analysis</strong>
          </div>
        </div>

        <button className={styles.exportBtn} onClick={handleExport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>EXPORT</span>
        </button>
      </div>

      <ReportsFilterBar
        filters={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />

      <div className={styles.row1Grid}>
        <SalesKpiCards metrics={metrics} />
        <SalesTrendChart
          trendData={trendData}
          selectedCountry={selectedCountry}
          months={MONTHS}
        />
      </div>

      <ChannelDistributionCard
        selectedCountry={selectedCountry}
        channelPct={channelPct}
        donutDash={donutDash}
        countryStats={countryStats}
        onCountrySelect={toggleCountry}
      />

      <CustomerAnalysisCard stats={custAnalysisStats} />

      <div className={styles.row4Grid}>
        <PurchasingCustomersChart
          purchasingCustData={purchasingCustData}
          months={MONTHS}
        />
        <ProductPreferencesCard products={products} />
      </div>
    </AppShell>
  );
}
