'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Feedback, UserProfileResponse } from '@/types';
import { clearToken, getToken } from '@/lib/auth';

export default function ProfilePage({ className, searchParams, ...props }: React.ComponentProps<'div'> & { searchParams?: unknown }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchProfileAndFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      console.log('Token de autenticação:', token);
      console.log('Token de autenticação:', localStorage.getItem('insightly_token'));

      if (!token) {
        router.push('/auth/login');
        return;
      }
      const profileData = await apiFetch<UserProfileResponse>('/users/me/profile', {
        headers: { Authorization: `Bearer ${token}` },
        method: 'GET',
      });
      console.log('Dados do perfil:', profileData);
      setProfile(profileData ?? null);

      const feedbackData = await apiFetch<Feedback[]>(`/feedback?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(feedbackData ?? []);
      setHasMore((feedbackData?.length ?? 0) === 10);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError.status === 401) {
        clearToken();
        router.push('/auth/login');
      } else {
        setError(apiError.message || 'Erro ao carregar perfil ou feedbacks');
      }
    } finally {
      setLoading(false);
    }
  }, [page, router]);

  useEffect(() => {
    fetchProfileAndFeedbacks();
  }, [fetchProfileAndFeedbacks]);

  const handleNextPage = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className={cn('flex flex-col gap-6 max-w-3xl mx-auto p-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Seu Perfil</CardTitle>
          <CardDescription>Veja os detalhes do seu perfil e os feedbacks recebidos.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusHandler loading={loading} error={error} loadingMessage="Carregando perfil e feedbacks..." />
          {!loading && !error && profile && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Informações do Perfil</h2>
                <p className="text-gray-800">
                  <span className="font-medium">Usuário:</span> {profile.username}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Nome:</span> {profile.name || 'Não definido'}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Bio:</span> {profile.bio || 'Não definida'}
                </p>
                <div>
                  <span className="font-medium">Links:</span>
                  {profile.links.length === 0 ? (
                    <p className="text-gray-500">Nenhum link adicionado.</p>
                  ) : (
                    <ul className="mt-2 space-y-2" role="list">
                      {profile.links.map((link) => (
                        <li key={link.id}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            aria-label={`Visitar ${link.title}`}
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Meus Feedbacks</h2>
                {feedbacks?.length === 0 ? (
                  <p className="text-gray-500 text-center">Nenhum feedback recebido ainda.</p>
                ) : (
                  <ul className="space-y-4" role="list">
                    {feedbacks?.map((feedback) => (
                      <li
                        key={feedback.id}
                        className="border p-4 rounded bg-gray-50"
                        role="listitem"
                      >
                        <p className="text-gray-800">{feedback.text}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Recebido: {new Date(feedback.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                {feedbacks?.length !== 0 && (
                  <div className="flex justify-between mt-6">
                    <Button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      variant="outline"
                      aria-label="Página anterior"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={handleNextPage}
                      disabled={!hasMore}
                      variant="outline"
                      aria-label="Próxima página"
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}