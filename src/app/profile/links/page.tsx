'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { Link as LinkType, ApiError } from '@/types';

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const data = await apiFetch<LinkType[]>('/users/links');
      setLinks(data ?? []);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao buscar links:', apiError);
      setError(apiError.message || 'Erro desconhecido ao carregar os links.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm('Tem certeza que deseja excluir este link?')) return;

      try {
        await apiFetch<void>(`/users/links/${id}`, { method: 'DELETE' });
        setLinks((prev) => (prev ?? []).filter((link) => link.id !== id));
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao excluir link:', apiError);
        setError(apiError.message || 'Erro desconhecido ao excluir o link.');
      }
    },
    [],
  );

  return (
    <>
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando links..." />
      {!loading && !error && (
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Meus Links</h1>
            <Link
              href="/profile/links/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              aria-label="Adicionar novo link"
            >
              + Novo Link
            </Link>
          </div>
          {links?.length === 0 ? (
            <p className="text-gray-600 mt-6">Você ainda não adicionou nenhum link.</p>
          ) : (
            <ul className="mt-4 space-y-3" role="list">
              {links?.map((link) => (
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
                      aria-label={`Visitar ${link.title}`}
                    >
                      {link.url}
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/profile/links/${link.id}/edit`}
                      className="text-sm text-blue-500 hover:underline"
                      aria-label={`Editar link ${link.title}`}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-sm text-red-500 hover:underline"
                      aria-label={`Excluir link ${link.title}`}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}