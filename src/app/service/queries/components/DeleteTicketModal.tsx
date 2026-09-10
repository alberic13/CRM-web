'use client';

import { Ticket } from '../types';
import styles from '../queries.module.css';

interface DeleteTicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTicketModal({ ticket, onClose, onConfirm }: DeleteTicketModalProps) {
  if (!ticket) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ width: '420px' }}>
        <h2 className={styles.modalTitle} style={{ color: '#dc2626' }}>
          Delete Ticket Confirmation
        </h2>
        <p style={{ fontSize: '13.5px', color: '#475569', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
          Are you sure you want to delete ticket <strong>{ticket.ticketNo}</strong> ({ticket.subject})?
          This action will permanently delete the ticket from the PostgreSQL database.
        </p>

        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.dangerBtn} onClick={onConfirm}>
            Delete Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
