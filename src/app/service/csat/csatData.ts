export interface ReviewFeedback {
  id: string;
  customerName: string;
  company: string;
  avatar: string;
  rating: number;
  agentName: string;
  date: string;
  comment: string;
  tag: 'Technical' | 'Billing' | 'Onboarding';
}

export interface CsatStats {
  totalReviews: number;
  avgRating: string;
  csatScore: string;
}

export const DEFAULT_REVIEWS: ReviewFeedback[] = [
  {
    id: '1',
    customerName: 'Marcus Vance',
    company: 'Bright Solutions',
    avatar: '/avatars/user1.jpg',
    rating: 5,
    agentName: 'Chris Evans',
    date: '2026-08-06',
    comment: 'Chris resolved our API rate limit configuration in under 10 minutes. Stellar customer support!',
    tag: 'Technical',
  },
  {
    id: '2',
    customerName: 'Sarah Jenkins',
    company: 'GlobalMart Inc.',
    avatar: '/avatars/user2.jpg',
    rating: 5,
    agentName: 'Shirley.H',
    date: '2026-08-05',
    comment: 'Very clear explanation of our enterprise invoice details and tier discounts. Thank you Shirley!',
    tag: 'Billing',
  },
  {
    id: '3',
    customerName: 'David K.',
    company: 'Pi Enterprises',
    avatar: '/avatars/user3.jpg',
    rating: 4,
    agentName: 'Andy Chen',
    date: '2026-08-04',
    comment: 'Great guidance on setting up custom domain SSL certificates. Highly responsive support team.',
    tag: 'Onboarding',
  },
  {
    id: '4',
    customerName: 'Elena Rostova',
    company: 'Visionary Tech',
    avatar: '/avatars/user4.jpg',
    rating: 5,
    agentName: 'Lucy Tan',
    date: '2026-08-03',
    comment: 'Smooth resolution to our webhook payload retry delay. The agent followed up proactive twice!',
    tag: 'Technical',
  },
  {
    id: '5',
    customerName: 'Robert Sterling',
    company: 'Delta Industries',
    avatar: '/avatars/user5.jpg',
    rating: 5,
    agentName: 'Chris Evans',
    date: '2026-08-02',
    comment: 'The team helped us migrate 50,000 customer records without any downtime. World-class onboarding assistance.',
    tag: 'Onboarding',
  },
  {
    id: '6',
    customerName: 'Amanda Lin',
    company: 'Alpha Solutions',
    avatar: '/avatars/user6.jpg',
    rating: 5,
    agentName: 'Lucy Tan',
    date: '2026-08-01',
    comment: 'Quick response on our subscription VAT invoice adjustment. Extremely helpful and friendly staff.',
    tag: 'Billing',
  },
  {
    id: '7',
    customerName: 'Jonathan Hayes',
    company: 'Nexus Software Ltd',
    avatar: '/avatars/user7.jpg',
    rating: 4,
    agentName: 'Andy Chen',
    date: '2026-07-30',
    comment: 'Detailed response with working code snippets for OAuth token refresh integration. Solved our issue!',
    tag: 'Technical',
  },
];
