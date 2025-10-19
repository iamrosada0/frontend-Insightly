import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';
import { Link as LinkType } from '@/types';

export function useLinks() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const redirectToLogin = useCallback(() => {
    clearToken();
    router.push('/auth/login');
  }, [router]);

  const fetchLinks = useCallback(async () => {
    const token = getToken();
    if (!token) return router.push('/auth/login');

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<LinkType[]>('/users/links', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(data ?? []);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao buscar links:', apiError);
      setError(apiError.message || 'Erro desconhecido ao carregar os links.');
      if (apiError.status === 401) redirectToLogin();
    } finally {
      setLoading(false);
    }
  }, [router, redirectToLogin]);

  const deleteLink = useCallback(
    async (id: number) => {
      const token = getToken();
      if (!token) return router.push('/auth/login');
      if (!confirm('Tem certeza que deseja excluir este link?')) return;

      try {
        await apiFetch<void>(`/users/links/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setLinks((prev) => prev.filter((link) => link.id !== id));
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao excluir link:', apiError);
        setError(apiError.message || 'Erro desconhecido ao excluir o link.');
        if (apiError.status === 401) redirectToLogin();
      }
    },
    [router, redirectToLogin],
  );

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return { links, loading, error, fetchLinks, deleteLink };
}
