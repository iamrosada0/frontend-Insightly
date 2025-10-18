/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api'; 

type Feedback = {
  id: number;
  message: string;
  createdAt: string;
};

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await apiFetch('/feedback');
        setFeedbacks(data);
      } catch (err: any) {
        console.error('Erro ao buscar feedbacks:', err);
        setError(err?.message || 'Erro desconhecido ao carregar feedbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading)
    return <p className="p-4 text-gray-700">Carregando feedbacks...</p>;

  if (error)
    return (
      <div className="p-6 text-red-600">
        <p>⚠️ {error}</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Feedbacks Recebidos</h1>

      {feedbacks.length === 0 ? (
        <p className="text-gray-600">Você ainda não recebeu feedbacks.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li
              key={fb.id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <p className="text-gray-800">{fb.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(fb.createdAt).toLocaleString('pt-BR')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
