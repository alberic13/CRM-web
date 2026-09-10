import { SalesCustomer, ClientItem } from './types';

export const DEFAULT_SALES_CUSTOMERS: SalesCustomer[] = [
  { id: 'c1', name: 'Tau Corporation', region: 'North America' },
  { id: 'c2', name: 'Pi Enterprises', region: 'Europe' },
  { id: 'c3', name: 'GlobalMart Inc.', region: 'Europe' },
  { id: 'c4', name: 'Delta Industries', region: 'Asia Pacific' },
  { id: 'c5', name: 'Xi Group', region: 'Asia Pacific' },
  { id: 'c6', name: 'Lambda Ltd', region: 'North America' },
];

export function exportClientsToCsv(clients: ClientItem[]): void {
  const headers = ['Client Name', 'Industry', 'Region', 'Tier Category'];
  const rows = clients.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.industry.replace(/"/g, '""')}"`,
    `"${c.region.replace(/"/g, '""')}"`,
    `"${c.tier.replace(/"/g, '""')}"`,
  ]);

  const csvString = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `clients_export_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
