'use client';

import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

interface HeaderProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  onMenuToggle?: () => void;
}

export default function Header({ user, onMenuToggle }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftHeader}>
        <button
          type="button"
          className={styles.menuToggleBtn}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          title="Open Navigation"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search in CRM..."
          />
        </div>
      </div>

      <div className={styles.rightActions}>
        <button className={styles.iconBtn} title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.notificationDot} />
        </button>

        <button className={styles.iconBtn} title="Language">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </button>

        <button className={styles.iconBtn} onClick={handleLogout} title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>

        <div className={styles.divider} />

        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SH'}
          </div>
          <div>
            <div className={styles.userName}>{user?.name || 'Shirley.H'}</div>
            <div className={styles.userRole}>{user?.role || 'ADMIN'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
