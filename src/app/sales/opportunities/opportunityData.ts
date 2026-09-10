import { OpportunityItem } from './types';

export const formatDateForDisplay = (dateInput: string | number | Date | null | undefined): string => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

export const formatDateForExcelCsv = (dateInput: string | number | Date | null | undefined): string => {
  if (!dateInput) return '"-"';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return `=" ${String(dateInput)} "`;
  const formatted = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  return `=" ${formatted} "`;
};

export const DEFAULT_OPPORTUNITIES: OpportunityItem[] = [
  { id: '110', opportunityNo: '110', name: 'Project Theta', status: 'Pending', revenue: 23000, expCloseDate: '4/14/2024', customerName: 'Tau Corporation', ownerName: 'Lucy Tan', creationDate: '3/21/2024', notes: 'Proposal submitted' },
  { id: '111', opportunityNo: '111', name: 'Deal Beta', status: 'Won', revenue: 25000, expCloseDate: '5/1/2024', customerName: 'Tau Corporation', ownerName: 'Lucy Tan', creationDate: '3/21/2024', notes: 'Deal finalized' },
  { id: '112', opportunityNo: '112', name: 'Project Omega', status: 'InProgress', revenue: 14000, expCloseDate: '4/17/2024', customerName: 'Pi Enterprises', ownerName: 'Andy Chen', creationDate: '3/17/2024', notes: 'Discussing terms' },
  { id: '113', opportunityNo: '113', name: 'Deal Gamma', status: 'Lost', revenue: 0, expCloseDate: '3/29/2024', customerName: 'Xi Group', ownerName: 'Mary Foo', creationDate: '3/16/2024', notes: 'Decision postponed' },
  { id: '114', opportunityNo: '114', name: 'Deal Alpha', status: 'Pending', revenue: 22000, expCloseDate: '6/11/2024', customerName: 'Lambda Ltd', ownerName: 'Andy Chen', creationDate: '3/7/2024', notes: 'Sending proposal' },
  { id: '115', opportunityNo: '115', name: 'Project Theta', status: 'Pending', revenue: 23000, expCloseDate: '4/14/2024', customerName: 'Tau Corporation', ownerName: 'Lucy Tan', creationDate: '3/1/2024', notes: 'Proposal submitted' },
  { id: '116', opportunityNo: '116', name: 'Deal XYZ', status: 'Pending', revenue: 23000, expCloseDate: '5/4/2024', customerName: 'Delta Industries', ownerName: 'Peter Wu', creationDate: '2/27/2024', notes: 'Budget constraints' },
  { id: '117', opportunityNo: '117', name: 'Project Theta', status: 'InProgress', revenue: 13000, expCloseDate: '7/10/2024', customerName: 'Iota Corporation', ownerName: 'Lucy Tan', creationDate: '2/21/2024', notes: 'Sent follow-up email' },
  { id: '118', opportunityNo: '118', name: 'Deal XYZ', status: 'InProgress', revenue: 16000, expCloseDate: '4/14/2024', customerName: 'Big Company Ltd', ownerName: 'Peter Wu', creationDate: '2/19/2024', notes: 'Proposal submitted' },
  { id: '119', opportunityNo: '119', name: 'Project Theta', status: 'Pending', revenue: 3000, expCloseDate: '6/14/2024', customerName: 'Tau Corporation', ownerName: 'Lucy Tan', creationDate: '2/19/2024', notes: 'Sent follow-up email' },
  { id: '120', opportunityNo: '120', name: 'Enterprise SaaS Renewal', status: 'Won', revenue: 45000, expCloseDate: '8/12/2024', customerName: 'Apex Innovations', ownerName: 'Lucy Tan', creationDate: '1/15/2024', notes: 'Multi-year contract signed' },
  { id: '121', opportunityNo: '121', name: 'Cloud Migration Pilot', status: 'InProgress', revenue: 18500, expCloseDate: '9/1/2024', customerName: 'Nexus Global', ownerName: 'Andy Chen', creationDate: '1/10/2024', notes: 'Proof of concept stage' },
];

export function exportOpportunitiesToCsv(items: OpportunityItem[]): void {
  const headers = ['No.', 'Opportunity Name', 'Status', 'Revenue', 'Exp Close Date', 'Customer', 'Owner', 'Creation Date', 'Notes'];
  const rows = items.map((o) => [
    o.opportunityNo,
    `"${o.name.replace(/"/g, '""')}"`,
    o.status,
    o.revenue,
    formatDateForExcelCsv(o.expCloseDate),
    `"${o.customerName.replace(/"/g, '""')}"`,
    `"${o.ownerName.replace(/"/g, '""')}"`,
    formatDateForExcelCsv(o.creationDate),
    `"${(o.notes || '-').replace(/"/g, '""')}"`,
  ]);

  const csvString = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `opportunities_export_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
