'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { ApiError } from '@/types';

export default function NewLinkPage() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        await apiFetch<void>('/users/links', {
          method: 'POST',
          body: JSON.stringify({ title, url }),
        });
        router.push('/profile/links');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao criar link:', apiError);
        setError(apiError.message || 'Erro desconhecido ao criar link.');
      } finally {
        setLoading(false);
      }
    },
    [router, title, url],
  );

  return (
    <>
      <StatusHandler loading={loading} error={error} loadingMessage="Salvando..." />
      {!loading && !error && (
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-xl font-semibold mb-4">Adicionar Novo Link</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-1 font-semibold">
                Título
              </label>
              <input
                id="title"
                type="text"
                placeholder="Título"
                className="w-full border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-required="true"
                aria-label="Título do link"
              />
            </div>
            <div>
              <label htmlFor="url" className="block mb-1 font-semibold">
                URL
              </label>
              <input
                id="url"
                type="url"
                placeholder="https://..."
                className="w-full border p-2 rounded"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                aria-required="true"
                aria-label="URL do link"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded transition bg-green-600 text-white ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
              aria-label={loading ? 'Salvando link' : 'Salvar link'}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}