'use client';

import Link from 'next/link';
import { IssueItem } from '../issues.types';
import styles from '../issues.module.css';

interface IssueTableProps {
  issuesList: IssueItem[];
  highlightKey: string;
}

export default function IssueTable({ issuesList, highlightKey }: IssueTableProps) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          Live Issue Tracking List {highlightKey && `(Filtered: ${highlightKey})`}
        </h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Issue Key</th>
            <th>Source Ticket</th>
            <th>Title &amp; Description</th>
            <th>Affected Customer</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Assigned Agent</th>
            <th>SLA Remaining</th>
          </tr>
        </thead>
        <tbody>
          {issuesList.map((issue) => {
            const isHighlighted = highlightKey === issue.issueKey;
            const ticketNo = issue.ticket?.ticketNo || `TCK-80${issue.issueKey.replace('ISS-', '')}`;

            return (
              <tr
                key={issue.id}
                className={isHighlighted ? styles.highlightedRow : ''}
              >
                <td className={styles.issueKey}>{issue.issueKey}</td>
                <td>
                  <Link href="/service/queries" className={styles.ticketLinkTag}>
                    <span>{ticketNo}</span>
                  </Link>
                </td>
                <td className={styles.issueTitle}>{issue.title}</td>
                <td>{issue.affectedCustomer}</td>
                <td>
                  <span
                    className={
                      issue.severity === 'Critical'
                        ? styles.badgeCritical
                        : issue.severity === 'Major'
                        ? styles.badgeMajor
                        : styles.badgeMinor
                    }
                  >
                    {issue.severity}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      issue.status === 'Escalated'
                        ? styles.statusEscalated
                        : issue.status === 'In Progress'
                        ? styles.statusProgress
                        : issue.status === 'Open'
                        ? styles.statusOpen
                        : styles.statusResolved
                    }
                  >
                    {issue.status}
                  </span>
                </td>
                <td>
                  <div className={styles.userCell}>
                    <img src={issue.avatar || '/avatars/user1.jpg'} alt={issue.assignedAgent} className={styles.avatarImg} />
                    <span>{issue.assignedAgent}</span>
                  </div>
                </td>
                <td className={styles.slaCell}>{issue.slaRemaining}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
