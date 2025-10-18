/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

type LinkType = {
  id: number;
  title: string;
  url: string;
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await apiFetch('/users/links');
        setLinks(data);
      } catch (err: any) {
        console.error('Erro ao buscar links:', err);
        setError(err?.message || 'Erro desconhecido ao carregar os links.');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este link?')) return;

    try {
      await apiFetch(`/users/links/${id}`, { method: 'DELETE' });
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir link:', err);
      alert(err?.message || 'Erro desconhecido ao excluir o link.');
    }
  };

  if (loading) return <p className="p-4 text-gray-600">Carregando links...</p>;
  if (error) return <p className="p-4 text-red-600">⚠️ {error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Meus Links</h1>
        <Link
          href="/profile/links/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          + Novo Link
        </Link>
      </div>

      {links.length === 0 ? (
        <p className="text-gray-600 mt-6">
          Você ainda não adicionou nenhum link.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {links.map((link) => (
            <li
              key={link.id}
              className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-medium text-gray-900">{link.title}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm break-all hover:underline"
                >
                  {link.url}
                </a>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/profile/links/${link.id}/edit`}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
