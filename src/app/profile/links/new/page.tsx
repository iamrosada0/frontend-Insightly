/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api'; 

export default function NewLinkPage() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch('/users/links', {
        method: 'POST',
        body: JSON.stringify({ title, url }),
      });

      router.push('/profile/links');
    } catch (err: any) {
      console.error('Erro ao criar link:', err);
      setError(err?.message || 'Erro desconhecido ao criar link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Adicionar Novo Link</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="URL"
          className="w-full border p-2 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white px-4 py-2 rounded transition ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
          }`}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
