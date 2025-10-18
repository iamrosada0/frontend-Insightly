'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getToken, getUsernameFromToken } from '@/lib/auth';
import { StatusHandler } from '@/components/StatusHandler';
import { UserProfileResponse, Link as TypeLink, Feedback, ApiError } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [links, setLinks] = useState<TypeLink[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (username: string) => {
    try {
      const data = await apiFetch<UserProfileResponse>(`/users/${username}`);
      if (data) {
        setUser(data);
        setLinks(data.links ?? []);
        // setFeedbacks(data.feedbacks ?? []);
      } else {
        setError('Perfil não encontrado.');
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao carregar perfil:', apiError);
      setError(apiError.message || 'Erro desconhecido ao carregar perfil.');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();
    const username = getUsernameFromToken();

    if (!token || !username) {
      setError('Usuário não autenticado');
      router.push('/');
      return;
    }

    fetchProfile(username);
  }, [router, fetchProfile]);

  const handleDeleteLink = useCallback(
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
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando perfil..." />
      {!loading && !error && user && (
        <main className="p-8 max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <section aria-labelledby="personal-info">
            <h2 id="personal-info" className="text-xl font-semibold mb-2">
              Informações Pessoais
            </h2>
            <p>
              <strong>Nome:</strong> {user.name}
            </p>
            <p>
              <strong>Bio:</strong> {user.bio}
            </p>
            <Link
              href="/profile/edit"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              aria-label="Editar perfil"
            >
              Editar Perfil
            </Link>
          </section>
          <section aria-labelledby="links">
            <h2 id="links" className="text-xl font-semibold mb-2">
              Meus Links
            </h2>
            {links.length === 0 ? (
              <p className="text-gray-500">Nenhum link ainda.</p>
            ) : (
              <ul className="space-y-2" role="list">
                {links.map((link) => (
                  <li
                    key={link.id}
                    className="border p-3 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <strong>{link.title}</strong> –{' '}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                        aria-label={`Visitar ${link.title}`}
                      >
                        {link.url}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-600 text-sm hover:underline"
                      aria-label={`Excluir link ${link.title}`}
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="feedbacks">
            <h2 id="feedbacks" className="text-xl font-semibold mb-2">
              Feedbacks Recebidos
            </h2>
            {feedbacks.length === 0 ? (
              <p className="text-gray-500">Nenhum feedback ainda.</p>
            ) : (
              <ul className="space-y-2" role="list">
                {feedbacks.map((feedback) => (
                  <li key={feedback.id} className="border p-3 rounded-md">
                    <p>{feedback.text}</p>
                    <div className="text-xs text-gray-400">
                      {new Date(feedback.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      )}
    </>
  );
}