'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { Feedback } from '@/types';
import { FeedbackList } from '@/components/FeedbackList';

export default function ProfilePage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const data = await apiFetch<Feedback[]>(`/feedback?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedbacks(data ?? []);
      setHasMore((data?.length ?? 0) === 10);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(apiError.message || 'Erro ao carregar feedbacks');
      }
    } finally {
      setLoading(false);
    }
  }, [page, router]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleNextPage = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (

    <FeedbackList
      feedbacks={feedbacks}
      loading={loading}
      error={error}
      page={page}
      hasMore={hasMore}
      onNextPage={handleNextPage}
      onPrevPage={handlePrevPage}
    />
   
  );
}