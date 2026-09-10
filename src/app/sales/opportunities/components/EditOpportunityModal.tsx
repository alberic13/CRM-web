'use client';

import { useState } from 'react';
import { OpportunityItem } from '../types';
import styles from '../opportunities.module.css';

interface EditOpportunityModalProps {
  isOpen: boolean;
  item: OpportunityItem | null;
  onClose: () => void;
  onSave: (item: OpportunityItem) => void;
}

export default function EditOpportunityModal({
  isOpen,
  item,
  onClose,
  onSave,
}: EditOpportunityModalProps) {
  if (!isOpen || !item) return null;

  return <EditOpportunityForm key={item.id} item={item} onClose={onClose} onSave={onSave} />;
}

function EditOpportunityForm({
  item,
  onClose,
  onSave,
}: {
  item: OpportunityItem;
  onClose: () => void;
  onSave: (item: OpportunityItem) => void;
}) {
  const [formData, setFormData] = useState<OpportunityItem>({ ...item });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Edit Opportunity #{item.opportunityNo}</h2>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.field}>
            <label className={styles.label}>Opportunity Name</label>
            <input
              type="text"
              required
              className={styles.input}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Customer Name</label>
            <input
              type="text"
              required
              className={styles.input}
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Revenue ($)</label>
            <input
              type="number"
              required
              className={styles.input}
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.input}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as OpportunityItem['status'] })}
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
              type="text"
              required
              className={styles.input}
              value={formData.expCloseDate}
              onChange={(e) => setFormData({ ...formData, expCloseDate: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Owner Name</label>
            <input
              type="text"
              required
              className={styles.input}
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notes</label>
            <input
              type="text"
              className={styles.input}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn}>
              Update Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
