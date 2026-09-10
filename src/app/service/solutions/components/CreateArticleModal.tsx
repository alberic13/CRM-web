'use client';

import { useState } from 'react';
import { ArticleCategory, CATEGORIES } from '../solutions.types';
import styles from '../solutions.module.css';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    category: ArticleCategory;
    summary: string;
    content: string;
  }) => Promise<void>;
}

export default function CreateArticleModal({ isOpen, onClose, onSubmit }: CreateArticleModalProps) {
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ArticleCategory>('Technical Integration');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handlePublish() {
    if (!formTitle.trim()) { setFormError('Title is required.'); return; }
    if (!formSummary.trim()) { setFormError('Summary is required.'); return; }
    if (!formContent.trim()) { setFormError('Content is required.'); return; }

    setIsSubmitting(true);
    setFormError('');
    try {
      await onSubmit({
        title: formTitle.trim(),
        category: formCategory,
        summary: formSummary.trim(),
        content: formContent.trim(),
      });
      setFormTitle('');
      setFormSummary('');
      setFormContent('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Create New Article</h2>
            <p className={styles.modalSubtitle}>Add a new article to the Knowledge Base</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Article Title *</label>
            <input
              id="articleTitle"
              type="text"
              className={styles.formInput}
              placeholder="Enter a clear, descriptive title..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category *</label>
            <select
              id="articleCategory"
              className={styles.formInput}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as ArticleCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Summary *</label>
            <textarea
              id="articleSummary"
              className={styles.formTextarea}
              rows={2}
              placeholder="Brief description shown on the article card..."
              value={formSummary}
              onChange={(e) => setFormSummary(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Content *
              <span className={styles.formHint}> — supports Markdown (## Heading, **bold**, - list, ``` code)</span>
            </label>
            <textarea
              id="articleContent"
              className={styles.formTextarea}
              rows={8}
              placeholder="## Overview&#10;Write your article content here...&#10;&#10;## Steps&#10;1. First step&#10;2. Second step"
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
            />
          </div>

          {formError && <p className={styles.formError}>{formError}</p>}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            id="publishArticleBtn"
            disabled={isSubmitting}
            className={styles.primaryBtn}
            onClick={handlePublish}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </div>
    </div>
  );
}
