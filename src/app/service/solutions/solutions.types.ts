export type ArticleCategory = 'Technical Integration' | 'Billing & Subscription' | 'Account Security' | 'API Reference';

export interface SolutionArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  views: number;
  helpfulCount: number;
  lastUpdated: string;
  summary: string;
  content: string;
}

export const CATEGORIES: ArticleCategory[] = [
  'Technical Integration',
  'Billing & Subscription',
  'Account Security',
  'API Reference',
];
