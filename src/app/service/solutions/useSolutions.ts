'use client';

import { useEffect, useState } from 'react';
import { ArticleCategory, SolutionArticle } from './solutions.types';

export function useSolutions() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<SolutionArticle[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<SolutionArticle | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch('/api/service/solutions', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.articles) setArticles(data.articles);
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  async function handleCreateArticle(payload: {
    title: string;
    category: ArticleCategory;
    summary: string;
    content: string;
  }) {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    let published: SolutionArticle = { id: `art-${Date.now()}`, ...payload, views: 0, helpfulCount: 0, lastUpdated: dateStr };
    try {
      const res = await fetch('/api/service/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (data.article) published = data.article;
    } catch {}

    setSelectedCategory('All');
    setSearchQuery('');
    setArticles((prev) => [published, ...prev.filter((a) => a.id !== published.id)]);
    setShowCreateModal(false);
  }

  function openPreview(art: SolutionArticle) {
    setPreviewArticle(art);
    fetch('/api/service/solutions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: art.id, type: 'view' }),
    }).catch(() => {});
    setArticles((prev) => prev.map((a) => (a.id === art.id ? { ...a, views: a.views + 1 } : a)));
  }

  function handleHelpfulClick(artId: string) {
    fetch('/api/service/solutions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: artId, type: 'helpful' }),
    }).catch(() => {});
    setArticles((prev) => prev.map((a) => (a.id === artId ? { ...a, helpfulCount: a.helpfulCount + 1 } : a)));
    setPreviewArticle((prev) => (prev ? { ...prev, helpfulCount: prev.helpfulCount + 1 } : prev));
  }

  return {
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    filteredArticles,
    showCreateModal, setShowCreateModal,
    previewArticle, setPreviewArticle,
    handleCreateArticle, openPreview, handleHelpfulClick,
  };
}
