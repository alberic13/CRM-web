export type IssueStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
export type IssueSeverity = 'Critical' | 'Major' | 'Minor';

export interface Issue {
  id?: string;
  issueKey: string;
  title?: string;
  affectedCustomer?: string;
  status: IssueStatus;
  assignedAgent?: string;
  slaRemaining: string;
  severity: IssueSeverity;
}

export type TicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Open' | 'Pending' | 'Resolved';

export interface Ticket {
  id: string;
  ticketNo: string;
  customerName: string;
  avatar: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  agentName: string;
  createdDate: string;
  issue?: Issue | null;
}

export interface TicketFormData {
  customerName: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  autoEscalate: boolean;
}

export interface EditTicketFormData {
  customerName: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  agentName: string;
}
