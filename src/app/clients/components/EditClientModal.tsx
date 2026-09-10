'use client';

import { useState } from 'react';
import { ClientItem } from '../types';
import styles from '../clients.module.css';

interface EditClientModalProps {
  isOpen: boolean;
  client: ClientItem | null;
  onClose: () => void;
  onSave: (client: ClientItem) => Promise<boolean>;
}

export default function EditClientModal({
  isOpen,
  client,
  onClose,
  onSave,
}: EditClientModalProps) {
  if (!isOpen || !client) return null;

  return <EditClientForm key={client.id} client={client} onClose={onClose} onSave={onSave} />;
}

function EditClientForm({
  client,
  onClose,
  onSave,
}: {
  client: ClientItem;
  onClose: () => void;
  onSave: (client: ClientItem) => Promise<boolean>;
}) {
  const [formData, setFormData] = useState<ClientItem>({ ...client });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Edit Client</h2>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.field}>
            <label className={styles.label}>Client Name</label>
            <input
              type="text"
              required
              className={styles.input}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Industry</label>
            <select
              className={styles.input}
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            >
              <option value="Technology">Technology</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail & E-commerce">Retail &amp; E-commerce</option>
              <option value="Logistics & Supply">Logistics &amp; Supply</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Healthcare & Pharma">Healthcare &amp; Pharma</option>
              <option value="Telecommunications">Telecommunications</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Region</label>
            <select
              className={styles.input}
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            >
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
              <option value="Latin America">Latin America</option>
              <option value="Middle East">Middle East</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tier Category</label>
            <select
              className={styles.input}
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
            >
              <option value="Enterprise Tier 1">Enterprise Tier 1</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="Small Business (SMB)">Small Business (SMB)</option>
              <option value="VIP Partner">VIP Partner</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
