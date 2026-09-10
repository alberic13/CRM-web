'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_MENU_ITEMS } from './sidebar/sidebarMenu';
import { SidebarIcon } from './sidebar/SidebarIcon';
import { HelpDeskWidget } from './sidebar/HelpDeskWidget';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeMenu?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeMenu, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    Sales: pathname.startsWith('/sales') || pathname === '/customers',
    Marketing: pathname.startsWith('/marketing'),
    'Customer Service': pathname.startsWith('/service'),
  });

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className={styles.mobileBackdrop} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brandRow}>
          <Link href="/dashboard" className={styles.brand} onClick={handleLinkClick}>
            <span className={styles.brandName}>FlowTech</span>
          </Link>
          <button className={styles.closeMobileBtn} onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>

        <nav className={styles.nav}>
          {SIDEBAR_MENU_ITEMS.map((item) => {
            const isActive = item.activeMatcher(pathname, activeMenu);
            const hasSub = Boolean(item.subItems?.length);
            const isSubOpen = Boolean(openSubMenus[item.title]);

            if (hasSub) {
              return (
                <div key={item.title} className={styles.navGroup}>
                  <button
                    type="button"
                    className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                    onClick={() => toggleSubMenu(item.title)}
                  >
                    <div className={styles.navItemContent}>
                      <span className={styles.navItemIcon}>
                        <SidebarIcon type={item.iconType} />
                      </span>
                      <span>{item.title}</span>
                    </div>
                    <svg
                      className={`${styles.chevron} ${isSubOpen ? styles.chevronOpen : ''}`}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {isActive && !isSubOpen && <div className={styles.activeIndicator} />}
                  </button>

                  {isSubOpen && (
                    <div className={styles.subMenu}>
                      {item.subItems?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`${styles.subNavItem} ${pathname === sub.href ? styles.activeSubNavItem : ''}`}
                          onClick={handleLinkClick}
                        >
                          <span>{sub.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={item.title} className={styles.navGroup}>
                <Link
                  href={item.href || '#'}
                  className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                  onClick={handleLinkClick}
                >
                  <div className={styles.navItemContent}>
                    <span className={styles.navItemIcon}>
                      <SidebarIcon type={item.iconType} />
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {item.title !== 'Dashboard' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.chevron}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                  {isActive && <div className={styles.activeIndicator} />}
                </Link>
              </div>
            );
          })}
        </nav>

        <HelpDeskWidget />
      </aside>
    </>
  );
}
