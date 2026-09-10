export interface SubMenuItem {
  title: string;
  href: string;
}

export interface MenuItem {
  title: string;
  href?: string;
  iconType: 'dashboard' | 'sales' | 'marketing' | 'service' | 'clients' | 'analytics' | 'settings';
  activeMatcher: (pathname: string, activeMenu?: string) => boolean;
  subItems?: SubMenuItem[];
}

export const SIDEBAR_MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    iconType: 'dashboard',
    activeMatcher: (p, a) => p === '/dashboard' || a === 'Dashboard',
  },
  {
    title: 'Sales',
    iconType: 'sales',
    activeMatcher: (p, a) => p.startsWith('/sales') || p === '/customers' || a === 'Sales' || a === 'Customers',
    subItems: [
      { title: 'Opportunities', href: '/sales/opportunities' },
      { title: 'Sales Activity', href: '/sales/activity' },
      { title: 'Customers', href: '/customers' },
      { title: 'Reports & Analysis', href: '/sales/reports' },
    ],
  },
  {
    title: 'Marketing',
    iconType: 'marketing',
    activeMatcher: (p, a) => p.startsWith('/marketing') || a === 'Marketing',
    subItems: [
      { title: 'Segmentation', href: '/marketing/segmentation' },
      { title: 'Campaigns', href: '/marketing/campaigns' },
    ],
  },
  {
    title: 'Customer Service',
    iconType: 'service',
    activeMatcher: (p, a) => p.startsWith('/service') || a === 'Service' || a === 'Customer Service',
    subItems: [
      { title: 'Customer Queries', href: '/service/queries' },
      { title: 'Issue Tracking', href: '/service/issues' },
      { title: 'Solutions Library', href: '/service/solutions' },
      { title: 'CSAT & Feedback', href: '/service/csat' },
    ],
  },
  {
    title: 'Clients',
    href: '/clients',
    iconType: 'clients',
    activeMatcher: (p, a) => p === '/clients' || a === 'Clients',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    iconType: 'analytics',
    activeMatcher: (p, a) => p === '/analytics' || a === 'Analytics',
  },
  {
    title: 'Setting',
    href: '/settings',
    iconType: 'settings',
    activeMatcher: (p, a) => p === '/settings' || a === 'Setting',
  },
];
