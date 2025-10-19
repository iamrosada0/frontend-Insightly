'use client';

import { useState, useCallback } from 'react';
import { apiFetch, ApiError } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';

interface FeedbackFormProps {
  username: string;
}

export default function FeedbackForm({ username }: FeedbackFormProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await apiFetch<void>(`/feedback/${username}`, {
          method: 'POST',
          body: JSON.stringify({ message }),
        });
        setMessage('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: unknown) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Erro ao enviar feedback');
      } finally {
        setLoading(false);
      }
    },
    [username, message],
  );

  return (
    <>
      <StatusHandler loading={loading} error={error} loadingMessage="Enviando feedback..." />
      {success && (
        <p className="text-green-600" role="status">
          Feedback enviado com sucesso!
        </p>
      )}
      <section aria-labelledby="feedback-header">
        <h2 id="feedback-header" className="text-xl font-semibold mb-2">
          Feedback Anônimo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block mb-1 font-semibold">
              Deixe seu feedback
            </label>
            <textarea
              id="feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              placeholder="Escreva seu feedback anônimo..."
              required
              aria-required="true"
              aria-label="Feedback anônimo"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded transition bg-blue-600 text-white ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            aria-label="Enviar feedback anônimo"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </section>
    </>
  );
}