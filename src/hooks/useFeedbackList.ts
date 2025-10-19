'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';
import { Feedback } from '@/types';

interface UseFeedbackListResult {
  feedbacks: Feedback[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  nextPage: () => void;
  prevPage: () => void;
}

export function useFeedbackList(): UseFeedbackListResult {
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const redirectToLogin = useCallback(() => {
    clearToken();
    router.push('/auth/login');
  }, [router]);

  const fetchFeedbacks = useCallback(async () => {
    const token = getToken();
    if (!token) return redirectToLogin();

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<Feedback[]>(`/feedback?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedbacks(data ?? []);
      setHasMore((data?.length ?? 0) === 10);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao carregar feedbacks:', apiError);

      if (apiError.status === 401) {
        redirectToLogin();
      } else {
        setError(apiError.message || 'Erro ao carregar feedbacks');
      }
    } finally {
      setLoading(false);
    }
  }, [page, redirectToLogin]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      redirectToLogin();
      return;
    }
    fetchFeedbacks();
  }, [fetchFeedbacks, redirectToLogin]);

  const nextPage = useCallback(() => {
    if (hasMore) setPage((prev) => prev + 1);
  }, [hasMore]);

  const prevPage = useCallback(() => {
    if (page > 1) setPage((prev) => prev - 1);
  }, [page]);

  return {
    feedbacks,
    loading,
    error,
    page,
    hasMore,
    nextPage,
    prevPage,
  };
}
