'use client';

import { useEffect, useState } from 'react';
import { ReviewFeedback, CsatStats, DEFAULT_REVIEWS } from './csatData';

export function useCsat() {
  const [reviews, setReviews] = useState<ReviewFeedback[]>(DEFAULT_REVIEWS);
  const [stats, setStats] = useState<CsatStats>({
    totalReviews: DEFAULT_REVIEWS.length,
    avgRating: '4.9',
    csatScore: '96.5%',
  });

  useEffect(() => {
    let ignore = false;
    fetch('/api/service/csat')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          if (data.reviews?.length > 0) setReviews(data.reviews);
          if (data.stats) setStats(data.stats);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  return { reviews, stats };
}
