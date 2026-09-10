'use client';

import { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus, EditTicketFormData } from '../types';
import styles from '../queries.module.css';

interface EditTicketModalProps {
  ticket: Ticket;
  onClose: () => void;
  onSubmit: (data: EditTicketFormData) => void;
}

export function EditTicketModal({ ticket, onClose, onSubmit }: EditTicketModalProps) {
  const [customerName, setCustomerName] = useState(ticket.customerName);
  const [subject, setSubject] = useState(ticket.subject);
  const [category, setCategory] = useState(ticket.category);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [agentName, setAgentName] = useState(ticket.agentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ customerName, subject, category, priority, status, agentName });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Edit Ticket {ticket.ticketNo}</h2>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.field}>
            <label className={styles.label}>Customer / Company Name</label>
            <input
              type="text"
              required
              className={styles.input}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Subject / Summary of Issue</label>
            <input
              type="text"
              required
              className={styles.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Technical Issue">Technical Issue</option>
              <option value="Billing">Billing</option>
              <option value="Account Mgmt">Account Mgmt</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Priority Level</label>
            <select
              className={styles.input}
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ticket Status</label>
            <select
              className={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value as TicketStatus)}
            >
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Assigned Agent</label>
            <input
              type="text"
              required
              className={styles.input}
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
