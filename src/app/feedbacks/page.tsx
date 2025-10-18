'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { Feedback, ApiError } from '@/types';

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const data = await apiFetch<Feedback[]>('/feedback');
      setFeedbacks(data ?? []);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao buscar feedbacks:', apiError);
      setError(apiError.message || 'Erro desconhecido ao carregar feedbacks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return (
    <>
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando feedbacks..." />
      {!loading && !error && (
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Feedbacks Recebidos</h1>
          {feedbacks?.length === 0 ? (
            <p className="text-gray-600">Você ainda não recebeu feedbacks.</p>
          ) : (
            <ul className="space-y-4" role="list">
              {feedbacks?.map((fb) => (
                <li
                  key={fb.id}
                  className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-800">{fb.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(fb.createdAt).toLocaleString('pt-BR')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}