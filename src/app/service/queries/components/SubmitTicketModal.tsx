'use client';

import { useState } from 'react';
import { TicketFormData, TicketPriority } from '../types';
import styles from '../queries.module.css';

interface SubmitTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => void;
}

export function SubmitTicketModal({ isOpen, onClose, onSubmit }: SubmitTicketModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [priority, setPriority] = useState<TicketPriority>('High');
  const [autoEscalate, setAutoEscalate] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ customerName, subject, category, priority, autoEscalate });
    setCustomerName('');
    setSubject('');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Submit New Support Ticket</h2>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.field}>
            <label className={styles.label}>Customer / Company Name</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. Acme Corporation"
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
              placeholder="e.g. Unable to access billing dashboard"
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

          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={autoEscalate}
              onChange={(e) => setAutoEscalate(e.target.checked)}
            />
            <span className={styles.checkboxLabel}>
              Auto-link &amp; escalate to Issue Tracking (SLA Center)
            </span>
          </label>

          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn}>
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
