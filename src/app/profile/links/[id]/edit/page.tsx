/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api'; // ajusta o caminho conforme tua estrutura (ex: "@/utils/api" ou "@/services/api")

export default function EditLinkPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLink = async () => {
      try {
        const links = await apiFetch('/users/links');
        const link = links.find((l: any) => l.id === Number(id));

        if (link) {
          setTitle(link.title);
          setUrl(link.url);
        } else {
          setError('Link não encontrado.');
        }
      } catch (err: any) {
        console.error('Erro ao carregar link:', err);
        setError(err?.message || 'Erro ao carregar link.');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await apiFetch(`/users/links/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, url }),
      });

      router.push('/profile/links');
    } catch (err: any) {
      console.error('Erro ao atualizar link:', err);
      setError(err?.message || 'Erro desconhecido ao atualizar o link.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Carregando link...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Editar Link</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Título do link"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="url"
          className="w-full border p-2 rounded"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={saving}
          className={`bg-blue-600 text-white px-4 py-2 rounded w-full transition ${
            saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {saving ? 'Salvando...' : 'Atualizar'}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}
