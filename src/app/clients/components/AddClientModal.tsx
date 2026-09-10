'use client';

import { useState } from 'react';
import { SalesCustomer, NewClientFormData } from '../types';
import styles from '../clients.module.css';

interface AddClientModalProps {
  isOpen: boolean;
  salesCustomers: SalesCustomer[];
  onClose: () => void;
  onSubmit: (data: NewClientFormData) => Promise<boolean>;
}

export default function AddClientModal({
  isOpen,
  salesCustomers,
  onClose,
  onSubmit,
}: AddClientModalProps) {
  const [selectedSalesCustomerId, setSelectedSalesCustomerId] = useState('');
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [region, setRegion] = useState('North America');
  const [tier, setTier] = useState('Enterprise Tier 1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectSalesCustomer = (customerId: string) => {
    setSelectedSalesCustomerId(customerId);
    if (customerId === 'CUSTOM') { setClientName(''); return; }
    const found = salesCustomers.find((c) => c.id === customerId);
    if (found) {
      setClientName(found.name);
      if (found.region) setRegion(found.region);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) { alert('Please enter or select a client name.'); return; }

    setIsSubmitting(true);
    try {
      const success = await onSubmit({ name: clientName.trim(), industry, region, tier });
      if (success) {
        setSelectedSalesCustomerId('');
        setClientName('');
        setIndustry('Technology');
        setRegion('North America');
        setTier('Enterprise Tier 1');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add New Client</h2>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.field}>
            <label className={styles.label}>Select From Sales &gt; Customers</label>
            <select
              className={styles.input}
              value={selectedSalesCustomerId}
              onChange={(e) => handleSelectSalesCustomer(e.target.value)}
            >
              <option value="">-- Choose Existing Sales Customer --</option>
              {salesCustomers.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name} {sc.region ? `(${sc.region})` : ''}
                </option>
              ))}
              <option value="CUSTOM">+ Type Custom Client Name</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Client / Company Name</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. Tau Corporation"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Industry</label>
            <select className={styles.input} value={industry} onChange={(e) => setIndustry(e.target.value)}>
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
            <select className={styles.input} value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
              <option value="Latin America">Latin America</option>
              <option value="Middle East">Middle East</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tier Category</label>
            <select className={styles.input} value={tier} onChange={(e) => setTier(e.target.value)}>
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
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
