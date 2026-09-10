import { Ticket, Issue, TicketFormData, EditTicketFormData } from './types';

export async function fetchTicketsApi(): Promise<Ticket[]> {
  const res = await fetch('/api/service/tickets');
  if (!res.ok) return [];
  const data = await res.json();
  return data?.tickets || [];
}

export async function createTicketApi(form: TicketFormData, agentName: string): Promise<Ticket | null> {
  const res = await fetch('/api/service/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, agentName }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.ticket || null;
}

export async function updateTicketApi(id: string, form: EditTicketFormData): Promise<Ticket | null> {
  const res = await fetch(`/api/service/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.ticket || null;
}

export async function deleteTicketApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/service/tickets/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function escalateTicketApi(ticket: Ticket): Promise<Issue | null> {
  const res = await fetch(`/api/service/tickets/${ticket.id}/escalate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      severity: ticket.priority === 'Urgent' ? 'Critical' : 'Major',
      assignedAgent: ticket.agentName,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.issue || {
    issueKey: data.issueKey || `ISS-${ticket.ticketNo.replace('TCK-', '')}`,
    title: `${ticket.category}: ${ticket.subject}`,
    status: 'Escalated',
    slaRemaining: data.slaRemaining || '4h 00m',
    severity: data.severity || (ticket.priority === 'Urgent' ? 'Critical' : 'Major'),
    assignedAgent: ticket.agentName,
  };
}
