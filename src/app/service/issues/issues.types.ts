export interface IssueItem {
  id: string;
  issueKey: string;
  title: string;
  affectedCustomer: string;
  status: 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
  assignedAgent: string;
  avatar: string;
  slaRemaining: string;
  severity: 'Critical' | 'Major' | 'Minor';
  ticket?: {
    ticketNo?: string;
  } | null;
}
