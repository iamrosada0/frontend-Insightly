'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { ApiError } from '@/types';

export default function NewFeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        await apiFetch<void>(`/feedback/${username}`, {
          method: 'POST',
          body: JSON.stringify({ message }),
        });
        router.push('/profile');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao enviar feedback:', apiError);
        setError(apiError.message || 'Erro ao enviar feedback');
      } finally {
        setLoading(false);
      }
    },
    [router, username, message],
  );

  return (
    <>
      <StatusHandler loading={loading} error={error} loadingMessage="Enviando..." />
      {!loading && !error && (
        <div className="max-w-xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Enviar feedback para {username}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full border rounded p-2"
              rows={6}
              placeholder="Escreva seu feedback..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-label="Escrever feedback"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Enviar Feedback
            </button>
          </form>
        </div>
      )}
    </>
  );
}