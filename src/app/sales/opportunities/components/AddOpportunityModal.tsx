'use client';

import { useState } from 'react';
import { NewOpportunityFormData, OpportunityItem } from '../types';
import styles from '../opportunities.module.css';

interface AddOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewOpportunityFormData) => Promise<void>;
}

export default function AddOpportunityModal({
  isOpen,
  onClose,
  onSubmit,
}: AddOpportunityModalProps) {
  const [name, setName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [revenue, setRevenue] = useState(15000);
  const [status, setStatus] = useState<OpportunityItem['status']>('Pending');
  const [expCloseDate, setExpCloseDate] = useState('2024-04-14');
  const [ownerName, setOwnerName] = useState('Lucy Tan');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ name, customerName, revenue: Number(revenue), status, expCloseDate, ownerName, notes });
      setName('');
      setCustomerName('');
      setNotes('');
    } catch {
      alert('An error occurred while adding opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add New Opportunity</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.field}>
            <label className={styles.label}>Opportunity Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Project Theta"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Customer Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Tau Corporation"
              className={styles.input}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Revenue ($)</label>
            <input
              type="number"
              required
              className={styles.input}
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value as OpportunityItem['status'])}
            >
              <option value="Pending">Pending</option>
              <option value="Won">Won</option>
              <option value="InProgress">In Progress</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Expected Close Date</label>
            <input
              type="date"
              required
              className={styles.input}
              value={expCloseDate}
              onChange={(e) => setExpCloseDate(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Owner Name</label>
            <input
              type="text"
              required
              className={styles.input}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notes</label>
            <input
              type="text"
              placeholder="e.g. Proposal submitted"
              className={styles.input}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
