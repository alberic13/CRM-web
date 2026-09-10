'use client';

import AppShell from '@/components/AppShell';
import { CATEGORIES } from './solutions.types';
import { useSolutions } from './useSolutions';
import CreateArticleModal from './components/CreateArticleModal';
import ArticlePreviewModal from './components/ArticlePreviewModal';
import styles from './solutions.module.css';

export default function SolutionsLibraryPage() {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredArticles,
    showCreateModal,
    setShowCreateModal,
    previewArticle,
    setPreviewArticle,
    handleCreateArticle,
    openPreview,
    handleHelpfulClick,
  } = useSolutions();

  return (
    <AppShell activeMenu="Customer Service">
      {/* Page Header */}
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.pageTitle}>Solutions Library &amp; Knowledge Base</h1>
          <div className={styles.breadcrumbs}>
            <span>Home</span> &gt; <span>Customer Service</span> &gt; <strong>Solutions Library</strong>
          </div>
        </div>

        <button id="createArticleBtn" className={styles.primaryBtn} onClick={() => setShowCreateModal(true)}>
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

      {/* Modals */}
      <CreateArticleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateArticle}
      />

      <ArticlePreviewModal
        article={previewArticle}
        onClose={() => setPreviewArticle(null)}
        onHelpful={handleHelpfulClick}
      />
    </AppShell>
  );
}
