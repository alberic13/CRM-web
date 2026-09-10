'use client';

import { useState } from 'react';
import { CustomerFormData, CustomerStatus } from '../customers.types';
import styles from '../customers.module.css';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
}

export default function AddCustomerModal({ isOpen, onClose, onSubmit }: AddCustomerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('North America');
  const [source, setSource] = useState('Online');
  const [status, setStatus] = useState<CustomerStatus>('New');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ name, email, region, source, status });
      setName('');
      setEmail('');
      onClose();
    } catch {
      alert('An error occurred while adding customer');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Add New Customer</h2>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.field}>
            <label className={styles.label}>Company / Customer Name</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contact Email</label>
            <input
              type="email"
              required
              className={styles.input}
              placeholder="info@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Region</label>
            <select
              className={styles.input}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Source</label>
            <select
              className={styles.input}
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value as CustomerStatus)}
            >
              <option value="New">New</option>
              <option value="Loyal">Loyal</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryBtn}>
              {isSubmitting ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
