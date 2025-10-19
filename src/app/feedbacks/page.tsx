'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { Feedback, ApiError } from '@/types';
import { FeedbackList } from '@/components/FeedbackList';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export default function FeedbackListPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeedbacks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<Feedback[]>(`/feedback?page=${page}&limit=10`);
      setFeedbacks(data ?? []);
      setHasMore((data?.length ?? 0) === 10);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError.status === 401) {
        router.push('/auth/login');
      } else {
        setError(apiError.message || 'Erro ao carregar feedbacks');
      }
    } finally {
      setLoading(false);
    }
  }, [page, router, token]);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    } else {
      fetchFeedbacks();
    }
  }, [token, router, fetchFeedbacks]);

  const handleNextPage = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <FeedbackList
      feedbacks={feedbacks}
      loading={loading && page > 1} 
      error={error}
      page={page}
      hasMore={hasMore}
      onNextPage={handleNextPage}
      onPrevPage={handlePrevPage}
    />
  );
}
