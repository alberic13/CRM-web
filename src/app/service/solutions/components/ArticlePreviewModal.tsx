'use client';

import React from 'react';
import { SolutionArticle } from '../solutions.types';
import styles from '../solutions.module.css';

interface ArticlePreviewModalProps {
  article: SolutionArticle | null;
  onClose: () => void;
  onHelpful: (artId: string) => void;
}

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function renderContent(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeBuffer = [];
      } else {
        inCode = false;
        elements.push(
          <pre key={key++} className={styles.codeBlock}><code>{codeBuffer.join('\n')}</code></pre>
        );
      }
      continue;
    }
    if (inCode) { codeBuffer.push(line); continue; }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className={styles.previewH2}>{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className={styles.previewH1}>{line.slice(2)}</h1>);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={key++} className={styles.previewLi}>{parseBold(line.slice(2))}</li>);
    } else if (/^\d+\./.test(line)) {
      elements.push(<li key={key++} className={styles.previewLi}>{parseBold(line.replace(/^\d+\.\s*/, ''))}</li>);
    } else if (line.trim() === '') {
      elements.push(<br key={key++} />);
    } else {
      elements.push(<p key={key++} className={styles.previewParagraph}>{parseBold(line)}</p>);
    }
  }
  return elements;
}

export default function ArticlePreviewModal({ article, onClose, onHelpful }: ArticlePreviewModalProps) {
  if (!article) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.previewModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.previewCategoryBadge}>{article.category}</span>
            <h2 className={styles.previewTitle}>{article.title}</h2>
            <div className={styles.previewMeta}>
              <span>👁 {article.views.toLocaleString()} views</span>
              <span>👍 {article.helpfulCount.toLocaleString()} helpful</span>
              <span>Updated {article.lastUpdated}</span>
            </div>
          </div>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={`${styles.modalBody} ${styles.previewBody}`}>
          <div className={styles.articleContent}>{renderContent(article.content)}</div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.helpfulBtn} onClick={() => onHelpful(article.id)}>
            👍 This was helpful
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
