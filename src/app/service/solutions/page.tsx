'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './solutions.module.css';

type ArticleCategory = 'Technical Integration' | 'Billing & Subscription' | 'Account Security' | 'API Reference';

interface SolutionArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  views: number;
  helpfulCount: number;
  lastUpdated: string;
  summary: string;
  content: string;
}

const CATEGORIES: ArticleCategory[] = [
  'Technical Integration',
  'Billing & Subscription',
  'Account Security',
  'API Reference',
];

export default function SolutionsLibraryPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [articles, setArticles] = useState<SolutionArticle[]>([]);

  // Create Article modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ArticleCategory>('Technical Integration');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formError, setFormError] = useState('');

  // Preview modal state
  const [previewArticle, setPreviewArticle] = useState<SolutionArticle | null>(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/service/solutions', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.articles) {
          setArticles(data.articles);
        }
      }
    } catch (err) {
      console.warn('Fetch articles error:', err);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.log('Auth check error:', err));

    fetchArticles();
  }, []);


  const filteredArticles = articles.filter((art) => {
    const matchCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  function openCreateModal() {
    setFormTitle('');
    setFormCategory('Technical Integration');
    setFormSummary('');
    setFormContent('');
    setFormError('');
    setShowCreateModal(true);
  }

  async function handleCreateArticle() {
    if (!formTitle.trim()) { setFormError('Title is required.'); return; }
    if (!formSummary.trim()) { setFormError('Summary is required.'); return; }
    if (!formContent.trim()) { setFormError('Content is required.'); return; }

    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    try {
      const res = await fetch('/api/service/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          summary: formSummary.trim(),
          content: formContent.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      const publishedArticle: SolutionArticle = data.article || {
        id: `art-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        views: 0,
        helpfulCount: 0,
        lastUpdated: dateStr,
        summary: formSummary.trim(),
        content: formContent.trim(),
      };

      // Set category filter to 'All' and reset search query so new article is always visible
      setSelectedCategory('All');
      setSearchQuery('');
      setArticles((prev) => [publishedArticle, ...prev.filter((a) => a.id !== publishedArticle.id)]);
      setFormTitle('');
      setFormSummary('');
      setFormContent('');
      setFormError('');
      setShowCreateModal(false);
    } catch (err: any) {
      console.error('Create article error:', err);
      const fallbackArticle: SolutionArticle = {
        id: `art-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        views: 0,
        helpfulCount: 0,
        lastUpdated: dateStr,
        summary: formSummary.trim(),
        content: formContent.trim(),
      };
      setSelectedCategory('All');
      setSearchQuery('');
      setArticles((prev) => [fallbackArticle, ...prev.filter((a) => a.id !== fallbackArticle.id)]);
      setShowCreateModal(false);
    }
  }

  async function openPreview(art: SolutionArticle) {
    setPreviewArticle(art);

    try {
      fetch('/api/service/solutions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: art.id, type: 'view' }),
      });
      setArticles((prev) =>
        prev.map((a) => (a.id === art.id ? { ...a, views: a.views + 1 } : a))
      );
    } catch (err) {
      console.error('Track view error:', err);
    }
  }

  async function handleHelpfulClick(artId: string) {
    try {
      fetch('/api/service/solutions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: artId, type: 'helpful' }),
      });
      setArticles((prev) =>
        prev.map((a) => (a.id === artId ? { ...a, helpfulCount: a.helpfulCount + 1 } : a))
      );
      setPreviewArticle((prev) =>
        prev ? { ...prev, helpfulCount: prev.helpfulCount + 1 } : prev
      );
    } catch (err) {
      console.error('Track helpful error:', err);
    }
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

  function parseBold(text: string): React.ReactNode {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar activeMenu="Customer Service" isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className={styles.mainContent}>
        <Header user={user} onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className={styles.contentBody}>
          {/* Page Header */}
          <div className={styles.topRow}>
            <div>
              <h1 className={styles.pageTitle}>Solutions Library &amp; Knowledge Base</h1>
              <div className={styles.breadcrumbs}>
                <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>Solutions Library</strong>
              </div>
            </div>

            <button id="createArticleBtn" className={styles.primaryBtn} onClick={openCreateModal}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>CREATE ARTICLE</span>
            </button>
          </div>

          {/* Search Hero */}
          <div className={styles.searchHero}>
            <h2 className={styles.heroTitle}>Search Customer Support Knowledge Base</h2>
            <div className={styles.heroSearchRow}>
              <input
                id="knowledgeSearch"
                type="text"
                className={styles.heroSearchInput}
                placeholder="Search troubleshooting guides, API documentation, billing solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.heroSearchBtn}>Search</button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className={styles.tabsRow}>
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                className={`${styles.tabBtn} ${selectedCategory === cat ? styles.activeTabBtn : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className={styles.articlesGrid}>
            {filteredArticles.length === 0 && (
              <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No articles found. Try a different search or category.</p>
              </div>
            )}
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                className={styles.articleCard}
                onClick={() => openPreview(art)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openPreview(art)}
              >
                <span className={styles.categoryBadge}>{art.category}</span>
                <h3 className={styles.articleTitle}>{art.title}</h3>
                <p className={styles.articleSummary}>{art.summary}</p>

                <div className={styles.articleFooter}>
                  <div className={styles.metaGroup}>
                    <span>👁 {art.views.toLocaleString()} views</span>
                    <span>👍 {art.helpfulCount.toLocaleString()} helpful</span>
                  </div>
                  <span className={styles.dateText}>Updated {art.lastUpdated}</span>
                </div>

                <div className={styles.readMoreRow}>
                  <span className={styles.readMoreLink}>Read article →</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ===== CREATE ARTICLE MODAL ===== */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Create New Article</h2>
                <p className={styles.modalSubtitle}>Add a new article to the Knowledge Base</p>
              </div>
              <button className={styles.modalClose} onClick={() => setShowCreateModal(false)}>✕</button>
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
                  rows={10}
                  placeholder="## Overview&#10;Write your article content here...&#10;&#10;## Steps&#10;1. First step&#10;2. Second step"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                />
              </div>

              {formError && <p className={styles.formError}>{formError}</p>}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button id="publishArticleBtn" className={styles.primaryBtn} onClick={handleCreateArticle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Publish Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ARTICLE PREVIEW MODAL ===== */}
      {previewArticle && (
        <div className={styles.modalOverlay} onClick={() => setPreviewArticle(null)}>
          <div className={`${styles.modal} ${styles.previewModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.previewCategoryBadge}>{previewArticle.category}</span>
                <h2 className={styles.previewTitle}>{previewArticle.title}</h2>
                <div className={styles.previewMeta}>
                  <span>👁 {previewArticle.views.toLocaleString()} views</span>
                  <span>👍 {previewArticle.helpfulCount.toLocaleString()} helpful</span>
                  <span>Updated {previewArticle.lastUpdated}</span>
                </div>
              </div>
              <button className={styles.modalClose} onClick={() => setPreviewArticle(null)}>✕</button>
            </div>

            <div className={`${styles.modalBody} ${styles.previewBody}`}>
              <div className={styles.articleContent}>
                {renderContent(previewArticle.content)}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.helpfulBtn}
                onClick={() => handleHelpfulClick(previewArticle.id)}
              >
                👍 This was helpful
              </button>
              <button className={styles.cancelBtn} onClick={() => setPreviewArticle(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
