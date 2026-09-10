'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';
import styles from './AppShell.module.css';

interface AppShellProps {
  activeMenu?: string;
  children: React.ReactNode;
}

export default function AppShell({ activeMenu, children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className={styles.layout}>
      <Sidebar
        activeMenu={activeMenu}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className={styles.contentBody}>{children}</main>
      </div>
    </div>
  );
}
