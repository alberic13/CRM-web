'use client';

import { useState, useMemo } from 'react';
import { CustomerRow, NewCustomerFormData } from '../types';
import styles from '../segmentation.module.css';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewCustomerFormData) => Promise<boolean>;
  customersData: CustomerRow[];
}

export default function AddCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  customersData,
}: AddCustomerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(30);
  const [region, setRegion] = useState('North America');
  const [source, setSource] = useState<'Online' | 'Retail'>('Online');
  const [state, setState] = useState<'Loyal' | 'New' | 'Lost'>('New');
  const [isCustomNameInput, setIsCustomNameInput] = useState(false);

  const salesCustomerOptions = useMemo(() => {
    return Array.from(new Set(customersData.map((c) => c.name)));
  }, [customersData]);

  if (!isOpen) return null;

  const handleSelectCustomer = (selectedName: string) => {
    if (selectedName === 'CUSTOM_NEW') {
      setIsCustomNameInput(true);
      setName('');
    } else {
      setIsCustomNameInput(false);
      setName(selectedName);
      const match = customersData.find((c) => c.name === selectedName);
      if (match) {
        setAge(match.age);
        setRegion(match.region);
        setSource(match.source);
        setState(match.state);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const success = await onSubmit({ name, email, age, region, source, state });
    if (success) {
      setName('');
      setEmail('');
      setIsCustomNameInput(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Add New Customer</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Customer Name * (Select from Sales Customers)</label>
            {!isCustomNameInput ? (
              <select
                className={styles.formSelect}
                value={name}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                required
              >
                <option value="">-- Select Customer from Sales --</option>
                {salesCustomerOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
                <option value="CUSTOM_NEW">✏️ + Enter New Custom Customer Name</option>
              </select>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className={styles.cancelBtn}
                  style={{ fontSize: '11px', padding: '6px 10px' }}
                  onClick={() => setIsCustomNameInput(false)}
                >
                  List
                </button>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              type="email"
              className={styles.formInput}
              placeholder="acme@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Age</label>
            <input
              type="number"
              className={styles.formInput}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10) || 30)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Region</label>
            <select className={styles.formSelect} value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Source</label>
            <select
              className={styles.formSelect}
              value={source}
              onChange={(e) => setSource(e.target.value as 'Online' | 'Retail')}
            >
              <option value="Online">Online</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>State / Status</label>
            <select
              className={styles.formSelect}
              value={state}
              onChange={(e) => setState(e.target.value as 'Loyal' | 'New' | 'Lost')}
            >
              <option value="New">New</option>
              <option value="Loyal">Loyal</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Save Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
