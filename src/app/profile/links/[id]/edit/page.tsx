'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { Link, ApiError } from '@/types';

export default function EditLinkPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLink = useCallback(async () => {
    if (!id) {
      setError('ID do link inválido');
      setLoading(false);
      return;
    }

    try {
      const links = await apiFetch<Link[]>('/users/links');
      const link = links?.find((l) => l.id === Number(id));

      if (link) {
        setTitle(link.title);
        setUrl(link.url);
      } else {
        setError('Link não encontrado.');
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao carregar link:', apiError);
      setError(apiError.message || 'Erro desconhecido ao carregar link.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLink();
  }, [fetchLink]);

  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);

      try {
        await apiFetch<void>(`/users/links/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, url }),
        });
        router.push('/profile/links');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao atualizar link:', apiError);
        setError(apiError.message || 'Erro desconhecido ao atualizar link.');
      } finally {
        setSaving(false);
      }
    },
    [id, router, title, url],
  );

  return (
    <>
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando link..." />
      {!loading && !error && (
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-xl font-semibold mb-4">Editar Link</h1>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-1 font-semibold">
                Título
              </label>
              <input
                id="title"
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Título do link"
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
                className="w-full border p-2 rounded"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                aria-required="true"
                aria-label="URL do link"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={`w-full px-4 py-2 rounded transition bg-blue-600 text-white ${
                saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              aria-label={saving ? 'Salvando link' : 'Atualizar link'}
            >
              {saving ? 'Salvando...' : 'Atualizar'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}