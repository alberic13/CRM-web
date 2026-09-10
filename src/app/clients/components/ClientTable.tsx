'use client';

import { ClientItem } from '../types';
import styles from '../clients.module.css';

interface ClientTableProps {
  clients: ClientItem[];
  isLoading: boolean;
  onEdit: (client: ClientItem) => void;
  onDelete: (id: string, name: string) => void;
  onOpenAdd: () => void;
}

export default function ClientTable({
  clients,
  isLoading,
  onEdit,
  onDelete,
  onOpenAdd,
}: ClientTableProps) {
  const getTierClass = (tier: string) => {
    if (tier.includes('Enterprise') || tier.includes('VIP')) return styles.tierEnterprise;
    if (tier.includes('Mid-Market')) return styles.tierMidMarket;
    return styles.tierSmb;
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Client</th>
            <th>Industry</th>
            <th>Region</th>
            <th>Tier Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                Loading clients...
              </td>
            </tr>
          ) : clients.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                No clients found. Click <strong style={{ cursor: 'pointer', color: '#5d5fef' }} onClick={onOpenAdd}>+ ADD CLIENT</strong> to add one.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id}>
                <td className={styles.clientName}>{client.name}</td>
                <td>{client.industry}</td>
                <td>{client.region}</td>
                <td>
                  <span className={getTierClass(client.tier)}>
                    {client.tier}
                  </span>
                </td>
                <td>
                  <div className={styles.actionGroup}>
                    <button className={styles.editBtn} title="Edit Client" onClick={() => onEdit(client)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className={styles.deleteBtn} title="Delete Client" onClick={() => onDelete(client.id, client.name)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.tableFooter}>
        <div>Total Clients: {clients.length}</div>
        <div>Showing Page 1 of 1</div>
      </div>
    </>
  );
}
