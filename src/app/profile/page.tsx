// src/app/profile/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { Feedback } from '@/types';



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
      setHasMore((data?.length ?? 0) === 10); // Assume more if 10 items returned
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
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando feedbacks..." />
      {!loading && !error && (
        <section aria-labelledby="feedback-header">
          <h1 id="feedback-header" className="text-2xl font-semibold mb-4">
            Meus Feedbacks
          </h1>
          {feedbacks?.length === 0 ? (
            <p className="text-gray-500">Nenhum feedback recebido.</p>
          ) : (
            <>
              <ul className="space-y-4" role="list">
                {feedbacks?.map((feedback) => (
                  <li
                    key={feedback.id}
                    className="border p-4 rounded bg-gray-50"
                    role="listitem"
                  >
                    <p className="text-gray-800">{feedback.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Recebido em: {new Date(feedback.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
                >
                  Anterior
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}