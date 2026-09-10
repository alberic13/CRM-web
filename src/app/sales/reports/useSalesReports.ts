'use client';

import { useState, useMemo } from 'react';
import { SalesReportFilters } from './types';
import {
  calculateScaleFactor,
  calculateSalesMetrics,
  calculateTrendData,
  calculatePurchasingCustData,
  calculateCountryStats,
  calculateChannelPercentages,
  calculateCustomerAnalysisStats,
  calculateProductPreferences,
  exportSalesReportCsv,
} from './salesReportsData';

export function useSalesReports() {
  const [filters, setFilters] = useState<SalesReportFilters>({
    period: 'Last 1 Year',
    product: 'ALL',
    region: 'ALL',
    customer: 'ALL',
    stage: 'ALL',
  });
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const scaleFactor = useMemo(() => calculateScaleFactor(filters, selectedCountry), [filters, selectedCountry]);
  const metrics = useMemo(() => calculateSalesMetrics(scaleFactor), [scaleFactor]);
  const trendData = useMemo(() => calculateTrendData(scaleFactor), [scaleFactor]);
  const purchasingCustData = useMemo(() => calculatePurchasingCustData(scaleFactor), [scaleFactor]);
  const countryStats = useMemo(() => calculateCountryStats(filters.region), [filters.region]);
  const channelPct = useMemo(() => calculateChannelPercentages(selectedCountry, filters.region, filters.product), [selectedCountry, filters.region, filters.product]);

  const donutDash = useMemo(() => {
    const circum = 2 * Math.PI * 34; // ~213.6
    const retailLength = (channelPct.retail / 100) * circum;
    return `${retailLength.toFixed(1)} ${circum.toFixed(1)}`;
  }, [channelPct]);

  const custAnalysisStats = useMemo(() => {
    return calculateCustomerAnalysisStats(scaleFactor, filters.customer, selectedCountry, filters.product);
  }, [scaleFactor, filters.customer, selectedCountry, filters.product]);

  const products = useMemo(() => calculateProductPreferences(scaleFactor), [scaleFactor]);

  const setFilter = (key: keyof SalesReportFilters, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    if (key === 'region') setSelectedCountry(null);
  };

  const resetFilters = () => {
    setFilters({ period: 'Last 1 Year', product: 'ALL', region: 'ALL', customer: 'ALL', stage: 'ALL' });
    setSelectedCountry(null);
  };

  const toggleCountry = (countryName: string) => {
    setSelectedCountry((prev) => (prev === countryName ? null : countryName));
  };

  const handleExport = () => {
    exportSalesReportCsv(metrics, custAnalysisStats, filters.region, selectedCountry);
  };

  return {
    filters, setFilter, resetFilters, selectedCountry, toggleCountry,
    metrics, trendData, purchasingCustData, countryStats, channelPct, donutDash, custAnalysisStats, products,
    handleExport,
  };
}
