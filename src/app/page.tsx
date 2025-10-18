// src/app/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation
import { apiFetch } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { User, ApiError } from '@/types';

export default function UserSelectionPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiFetch<User[]>('/users');
      setUsers(data ?? []);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao carregar usuários:', apiError);
      setError(apiError.message || 'Erro desconhecido ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserSelect = useCallback(
    (username: string) => {
      router.push(`/${encodeURIComponent(username)}`);
    },
    [router],
  );

  return (
    <>
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando usuários..." />
      {!loading && !error && (
        <section className="max-w-xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Escolha um usuário para enviar feedback</h1>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline"
              aria-label="Fazer login para acessar seu perfil"
            >
              Fazer Login
            </Link>
          </div>
          <ul className="space-y-2" role="list">
            {users?.map((user) => (
              <li
                key={user.id}
                className="border p-3 rounded hover:bg-gray-100 cursor-pointer focus:bg-gray-100 transition-colors"
                onClick={() => handleUserSelect(user.username)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleUserSelect(user.username);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Enviar feedback para ${user.name ?? user.username}`}
              >
                {user.name ?? user.username} ({user.username})
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}