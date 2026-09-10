'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthUser } from '@/types/user';
import { Ticket, TicketFormData, EditTicketFormData } from './types';
import * as api from './ticketApi';

export function useTicketQueries() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicket, setDeletingTicket] = useState<Ticket | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((d) => d?.user && setUser(d.user)).catch(() => {});
    api.fetchTicketsApi().then(setTickets);
  }, []);

  const handleAddTicket = useCallback(async (form: TicketFormData) => {
    const t = await api.createTicketApi(form, user?.name || 'Chris Evans');
    if (t) setTickets((prev) => [t, ...prev]);
    setIsSubmitModalOpen(false);
  }, [user]);

  const handleUpdateTicket = useCallback(async (form: EditTicketFormData) => {
    if (!editingTicket) return;
    const t = await api.updateTicketApi(editingTicket.id, form);
    const updated = t || { ...editingTicket, ...form };
    setTickets((prev) => prev.map((item) => (item.id === editingTicket.id ? updated : item)));
    setSelectedTicket((prev) => (prev?.id === editingTicket.id ? updated : prev));
    setEditingTicket(null);
  }, [editingTicket]);

  const handleDeleteTicket = useCallback(async () => {
    if (!deletingTicket) return;
    const ok = await api.deleteTicketApi(deletingTicket.id);
    if (ok) {
      setTickets((prev) => prev.filter((t) => t.id !== deletingTicket.id));
      setSelectedTicket((prev) => (prev?.id === deletingTicket.id ? null : prev));
    }
    setDeletingTicket(null);
  }, [deletingTicket]);

  const handleEscalateTicket = useCallback(async (ticket: Ticket, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const issue = await api.escalateTicketApi(ticket);
    if (issue) {
      const updated: Ticket = { ...ticket, status: 'Pending', issue };
      setTickets((prev) => prev.map((t) => (t.id === ticket.id ? updated : t)));
      setSelectedTicket((prev) => (prev?.id === ticket.id ? updated : prev));
    }
  }, []);

  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tickets.filter((t) => {
      const mPrio = priorityFilter === 'All' || t.priority === priorityFilter;
      const mStatus = statusFilter === 'All' || t.status === statusFilter;
      const mQuery = !q || t.subject.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.ticketNo.toLowerCase().includes(q) ||
        Boolean(t.issue?.issueKey?.toLowerCase().includes(q));
      return mPrio && mStatus && mQuery;
    });
  }, [tickets, priorityFilter, statusFilter, searchQuery]);

  return {
    user,
    tickets,
    filteredTickets,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    unresolvedCount: tickets.filter((t) => t.status !== 'Resolved').length,
    connectedIssuesCount: tickets.filter((t) => Boolean(t.issue)).length,
    isSubmitModalOpen,
    setIsSubmitModalOpen,
    editingTicket,
    setEditingTicket,
    deletingTicket,
    setDeletingTicket,
    selectedTicket,
    setSelectedTicket,
    handleAddTicket,
    handleUpdateTicket,
    handleDeleteTicket,
    handleEscalateTicket,
  };
}
