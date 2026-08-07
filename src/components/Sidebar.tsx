'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeMenu?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeMenu, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const [salesOpen, setSalesOpen] = useState(pathname.startsWith('/sales') || pathname === '/customers');
  const [marketingOpen, setMarketingOpen] = useState(pathname.startsWith('/marketing'));
  const [serviceOpen, setServiceOpen] = useState(pathname.startsWith('/service'));

  const isDashboardActive = pathname === '/dashboard' || activeMenu === 'Dashboard';
  const isSalesActive = pathname.startsWith('/sales') || pathname === '/customers' || activeMenu === 'Sales';
  const isMarketingActive = pathname.startsWith('/marketing') || activeMenu === 'Marketing';
  const isServiceActive = pathname.startsWith('/service') || activeMenu === 'Service' || activeMenu === 'Customer Service';
  const isClientsActive = pathname === '/clients' || activeMenu === 'Clients';
  const isAnalyticsActive = pathname === '/analytics' || activeMenu === 'Analytics';
  const isSettingActive = pathname === '/settings' || activeMenu === 'Setting';

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className={styles.mobileBackdrop} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Brand Header */}
        <div className={styles.brandRow}>
          <Link href="/dashboard" className={styles.brand} onClick={handleLinkClick}>
            <span className={styles.brandName}>FlowTech</span>
          </Link>
          <button className={styles.closeMobileBtn} onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>

      {/* Navigation List */}
      <nav className={styles.nav}>
        {/* Dashboard */}
        <div className={styles.navGroup}>
          <Link
            href="/dashboard"
            className={`${styles.navItem} ${isDashboardActive ? styles.activeNavItem : ''}`}
          >
            <div className={styles.navItemContent}>
              <span className={styles.navItemIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="2" />
                  <rect x="13" y="3" width="8" height="8" rx="2" />
                  <rect x="13" y="13" width="8" height="8" rx="2" />
                  <rect x="3" y="13" width="8" height="8" rx="2" />
                </svg>
              </span>
              <span>Dashboard</span>
            </div>
            {isDashboardActive && <div className={styles.activeIndicator} />}
          </Link>
        </div>

        {/* Sales Dropdown */}
        <div className={styles.navGroup}>
          <button
            type="button"
            className={`${styles.navItem} ${isSalesActive ? styles.activeNavItem : ''}`}
            onClick={() => setSalesOpen(!salesOpen)}
          >
            <div className={styles.navItemContent}>
              <span className={styles.navItemIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
                </svg>
              </span>
              <span>Sales</span>
            </div>
            <svg
              className={`${styles.chevron} ${salesOpen ? styles.chevronOpen : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {isSalesActive && !salesOpen && <div className={styles.activeIndicator} />}
          </button>

          {salesOpen && (
            <div className={styles.subMenu}>
              <Link
                href="/sales/opportunities"
                className={`${styles.subNavItem} ${pathname === '/sales/opportunities' ? styles.activeSubNavItem : ''}`}
              >
                <span>Opportunities</span>
              </Link>
              <Link
                href="/sales/activity"
                className={`${styles.subNavItem} ${pathname === '/sales/activity' ? styles.activeSubNavItem : ''}`}
              >
                <span>Sales Activity</span>
              </Link>
              <Link
                href="/customers"
                className={`${styles.subNavItem} ${pathname === '/customers' ? styles.activeSubNavItem : ''}`}
              >
                <span>Customers</span>
              </Link>
              <Link
                href="/sales/reports"
                className={`${styles.subNavItem} ${pathname === '/sales/reports' ? styles.activeSubNavItem : ''}`}
              >
                <span>Reports & Analysis</span>
              </Link>
            </div>
          )}
        </div>

        {/* Marketing Dropdown */}
        <div className={styles.navGroup}>
          <button
            type="button"
            className={`${styles.navItem} ${isMarketingActive ? styles.activeNavItem : ''}`}
            onClick={() => setMarketingOpen(!marketingOpen)}
          >
            <div className={styles.navItemContent}>
              <span className={styles.navItemIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 5.4 5.6.8-4 4.1 1 5.7-5-2.8-5 2.8 1-5.7-4-4.1 5.6-.8z" />
                </svg>
              </span>
              <span>Marketing</span>
            </div>
            <svg
              className={`${styles.chevron} ${marketingOpen ? styles.chevronOpen : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {isMarketingActive && !marketingOpen && <div className={styles.activeIndicator} />}
          </button>

          {marketingOpen && (
            <div className={styles.subMenu}>
              <Link
                href="/marketing/segmentation"
                className={`${styles.subNavItem} ${pathname === '/marketing/segmentation' ? styles.activeSubNavItem : ''}`}
              >
                <span>Segmentation</span>
              </Link>
              <Link
                href="/marketing/campaigns"
                className={`${styles.subNavItem} ${pathname === '/marketing/campaigns' ? styles.activeSubNavItem : ''}`}
              >
                <span>Campaigns</span>
              </Link>
            </div>
          )}
        </div>

        {/* Customer Service Dropdown (for Chris) */}
        <div className={styles.navGroup}>
          <button
            type="button"
            className={`${styles.navItem} ${isServiceActive ? styles.activeNavItem : ''}`}
            onClick={() => setServiceOpen(!serviceOpen)}
          >
            <div className={styles.navItemContent}>
              <span className={styles.navItemIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                </svg>
              </span>
              <span>Customer Service</span>
            </div>
            <svg
              className={`${styles.chevron} ${serviceOpen ? styles.chevronOpen : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {isServiceActive && !serviceOpen && <div className={styles.activeIndicator} />}
          </button>

          {serviceOpen && (
            <div className={styles.subMenu}>
              <Link
                href="/service/queries"
                className={`${styles.subNavItem} ${pathname === '/service/queries' ? styles.activeSubNavItem : ''}`}
              >
                <span>Customer Queries</span>
              </Link>
              <Link
                href="/service/issues"
                className={`${styles.subNavItem} ${pathname === '/service/issues' ? styles.activeSubNavItem : ''}`}
              >
                <span>Issue Tracking</span>
              </Link>
              <Link
                href="/service/solutions"
                className={`${styles.subNavItem} ${pathname === '/service/solutions' ? styles.activeSubNavItem : ''}`}
              >
                <span>Solutions Library</span>
              </Link>
              <Link
                href="/service/csat"
                className={`${styles.subNavItem} ${pathname === '/service/csat' ? styles.activeSubNavItem : ''}`}
              >
                <span>CSAT & Feedback</span>
              </Link>
            </div>
          )}
        </div>

        {/* Clients */}
        <div className={styles.navGroup}>
          <Link
            href="/clients"
            className={`${styles.navItem} ${isClientsActive ? styles.activeNavItem : ''}`}
          >
            <div className={styles.navItemContent}>
              <span className={styles.navItemIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </span>
              <span>Clients</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.chevron}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {isClientsActive && <div className={styles.activeIndicator} />}
          </Link>
        </div>

        {/* Analytics */}
        <div className={styles.navGroup}>
          <Link
            href="/analytics"
            className={`${styles.navItem} ${isAnalyticsActive ? styles.activeNavItem : ''}`}
          >
            <div className={styles.navItemContent}>
              <span className={styles.navItemIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                </svg>
              </span>
              <span>Analytics</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.chevron}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {isAnalyticsActive && <div className={styles.activeIndicator} />}
          </Link>
        </div>

        {/* Setting */}
        <div className={styles.navGroup}>
          <Link
            href="/settings"
            className={`${styles.navItem} ${isSettingActive ? styles.activeNavItem : ''}`}
          >
            <div className={styles.navItemContent}>
              <span className={styles.navItemIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                </svg>
              </span>
              <span>Setting</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.chevron}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {isSettingActive && <div className={styles.activeIndicator} />}
          </Link>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        {/* MORE SERVICE Button with Starburst Badge */}
        <button className={styles.moreServiceBtn}>
          <span>MORE SERVICE</span>
          <span className={styles.starBurstIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <polygon
                points="12 2 14.8 4.6 18.6 3.7 18.9 7.6 22.4 9.2 20.6 12.7 22.4 16.2 18.9 17.8 18.6 21.7 14.8 20.8 12 23.4 9.2 20.8 5.4 21.7 5.1 17.8 1.6 16.2 3.4 12.7 1.6 9.2 5.1 7.6 5.4 3.7 9.2 4.6"
                fill="#ffffff"
              />
              <text x="12" y="14" fill="#6366f1" fontSize="6.5" fontWeight="900" textAnchor="middle">
                NEW
              </text>
            </svg>
          </span>
        </button>

        {/* HELP DESK Card */}
        <div className={styles.helpDeskCard}>
          <div className={styles.illustrationArea}>
            <svg width="160" height="110" viewBox="0 0 160 110">
              {/* Gear and Location Pin Background */}
              <circle cx="65" cy="20" r="4" fill="#e2e8f0" />
              <circle cx="115" cy="25" r="5" fill="#cbd5e1" />
              <path d="M115 20 A 4 4 0 0 1 119 24 L115 28 L111 24 Z" fill="#cbd5e1" />

              {/* 24/7 Clock Widget */}
              <circle cx="48" cy="38" r="16" fill="none" stroke="#ff8a75" strokeWidth="2.5" strokeDasharray="3 2" />
              <polyline points="48 30 48 38 54 38" stroke="#ff8a75" strokeWidth="2" strokeLinecap="round" />
              <text x="40" y="62" fill="#6366f1" fontSize="10" fontWeight="900">24/7</text>
              <text x="36" y="70" fill="#6366f1" fontSize="6" fontWeight="700">SERVICE</text>

              {/* Speech Bubble */}
              <rect x="110" y="32" width="18" height="12" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              <circle cx="115" cy="38" r="1" fill="#94a3b8" />
              <circle cx="119" cy="38" r="1" fill="#94a3b8" />
              <circle cx="123" cy="38" r="1" fill="#94a3b8" />

              {/* Agent Head & Hair */}
              <path d="M 85 45 C 75 45, 75 60, 85 68 C 95 60, 95 45, 85 45 Z" fill="#ffcdb2" />
              <circle cx="92" cy="40" r="10" fill="#334155" />
              <circle cx="85" cy="45" r="9" fill="#475569" />
              {/* Headset */}
              <path d="M 76 46 A 8 8 0 0 1 92 46" fill="none" stroke="#1e293b" strokeWidth="2" />
              <rect x="91" y="44" width="3" height="5" rx="1" fill="#1e293b" />
              <path d="M 92 47 L 88 52" stroke="#1e293b" strokeWidth="1.5" />

              {/* Agent Orange Shirt Body */}
              <path d="M 68 85 C 68 70, 102 70, 102 85 L 110 110 L 60 110 Z" fill="#ff7a65" />
              {/* Open Hand Gesture */}
              <path d="M 50 82 C 60 80, 68 86, 75 88" stroke="#ffcdb2" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <button className={styles.helpDeskBtn}>HELP DESK</button>
        </div>
      </div>
    </aside>
    </>
  );
}
