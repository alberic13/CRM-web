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

const defaultArticles: SolutionArticle[] = [
  {
    id: '1',
    title: 'How to Resolve OAuth2 Bearer Token Renewal Delays',
    category: 'Technical Integration',
    views: 1420,
    helpfulCount: 388,
    lastUpdated: 'Aug 4, 2026',
    summary: 'Step-by-step troubleshooting guide for configuring refresh token rotation policies in mobile and web SDKs.',
    content:
      '## Overview\nOAuth2 Bearer Token Renewal Delays can disrupt your application. This guide walks you through identifying and resolving common causes.\n\n## Steps\n1. Check your token expiry time in the authorization server settings.\n2. Implement refresh token rotation to keep sessions alive.\n3. Add retry logic with exponential backoff when the server returns 401.\n4. Log token refresh events to monitor renewal patterns.\n\n## Common Causes\n- Misconfigured token TTL\n- Missing refresh token scope\n- Clock skew between client and server\n\n## Additional Resources\nSee our [API Reference](#) for full token configuration options.',
  },
  {
    id: '2',
    title: 'Updating Billing Payment Methods & Tax Invoices',
    category: 'Billing & Subscription',
    views: 2190,
    helpfulCount: 612,
    lastUpdated: 'Jul 28, 2026',
    summary: 'Instructions on adding international credit cards, updating company VAT numbers, and downloading automated monthly PDFs.',
    content:
      '## Overview\nManaging billing payment methods and tax invoices is straightforward in the admin portal.\n\n## Adding a Payment Method\n1. Navigate to **Settings > Billing**.\n2. Click **Add Payment Method**.\n3. Enter your card details and save.\n\n## Updating VAT Number\n1. Go to **Settings > Company Info**.\n2. Enter your VAT/Tax ID in the designated field.\n3. Your next invoice will reflect this change.\n\n## Downloading Invoices\nAll invoices are available under **Billing > Invoice History** in PDF format.',
  },
  {
    id: '3',
    title: 'Setting Up Multi-Factor Authentication (MFA) & IP Whitelisting',
    category: 'Account Security',
    views: 980,
    helpfulCount: 245,
    lastUpdated: 'Aug 1, 2026',
    summary: 'Enforce TOTP authenticator apps for team workspace members and configure CIDR IP range boundaries.',
    content:
      '## Overview\nStrengthening account security with MFA and IP whitelisting protects your workspace from unauthorized access.\n\n## Enabling MFA\n1. Go to **Settings > Security**.\n2. Enable MFA and choose **Authenticator App (TOTP)**.\n3. Scan the QR code with your authenticator app.\n4. Enter the 6-digit code to confirm.\n\n## IP Whitelisting\n1. Under **Settings > Security > IP Allowlist**, click **Add Range**.\n2. Enter your CIDR range (e.g. 192.168.1.0/24).\n3. Save — all other IPs will be blocked from login.',
  },
  {
    id: '4',
    title: 'Webhooks Rate Limits & Retry Backoff Exponential Standards',
    category: 'API Reference',
    views: 1750,
    helpfulCount: 490,
    lastUpdated: 'Jul 15, 2026',
    summary: 'Complete technical reference detailing HTTP 429 response headers and recommended exponential backoff retry algorithms.',
    content:
      '## Overview\nOur webhook system enforces rate limits to ensure platform stability.\n\n## Rate Limit Headers\n- `X-RateLimit-Limit`: Max requests per window\n- `X-RateLimit-Remaining`: Requests left in current window\n- `Retry-After`: Seconds until limit resets\n\n## Exponential Backoff Formula\n```\ndelay = min(cap, base * 2^attempt) + jitter\n```\n\n## Best Practices\n- Always inspect `Retry-After` before retrying.\n- Add random jitter to prevent thundering herd.\n- Log all 429 responses for monitoring.',
  },
  {
    id: '5',
    title: 'Customizing Role Permissions for Manager & Agent Tiers',
    category: 'Account Security',
    views: 870,
    helpfulCount: 210,
    lastUpdated: 'Jun 30, 2026',
    summary: 'How workspace Admins can assign fine-grained read/write privileges to sales representatives and marketing operators.',
    content:
      '## Overview\nRole-based access control (RBAC) gives you fine-grained control over what each team member can do.\n\n## Default Roles\n- **Admin**: Full access\n- **Manager**: Read + write for their team\n- **Agent**: Read-only for most resources\n\n## Customizing Permissions\n1. Go to **Settings > Roles & Permissions**.\n2. Select a role or create a new one.\n3. Toggle individual permissions on or off.\n4. Click **Save Changes**.\n\n## Tips\n- Use custom roles to match your org structure.\n- Audit permissions quarterly.',
  },
];

export default function SolutionsLibraryPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Articles state (starts with defaults, new ones get appended)
  const [articles, setArticles] = useState<SolutionArticle[]>(defaultArticles);

  // Create Article modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ArticleCategory>('Technical Integration');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formError, setFormError] = useState('');

  // Preview modal state
  const [previewArticle, setPreviewArticle] = useState<SolutionArticle | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
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

  function handleCreateArticle() {
    if (!formTitle.trim()) { setFormError('Title is required.'); return; }
    if (!formSummary.trim()) { setFormError('Summary is required.'); return; }
    if (!formContent.trim()) { setFormError('Content is required.'); return; }

    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    const newArticle: SolutionArticle = {
      id: `custom-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      views: 0,
      helpfulCount: 0,
      lastUpdated: dateStr,
      summary: formSummary.trim(),
      content: formContent.trim(),
    };

    setArticles((prev) => [newArticle, ...prev]);
    setShowCreateModal(false);
  }

  function openPreview(art: SolutionArticle) {
    setArticles((prev) =>
      prev.map((a) => (a.id === art.id ? { ...a, views: a.views + 1 } : a))
    );
    setPreviewArticle({ ...art, views: art.views + 1 });
  }

  // Render markdown-lite: convert ## headings, ``` code blocks, ** bold
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
                onClick={() => {
                  setArticles((prev) =>
                    prev.map((a) =>
                      a.id === previewArticle.id ? { ...a, helpfulCount: a.helpfulCount + 1 } : a
                    )
                  );
                  setPreviewArticle((prev) =>
                    prev ? { ...prev, helpfulCount: prev.helpfulCount + 1 } : prev
                  );
                }}
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
