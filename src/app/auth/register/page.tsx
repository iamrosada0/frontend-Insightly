// src/app/signup/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { saveToken } from '@/lib/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch<{ accessToken: string; user: { id: number; email: string; username: string } }>(
          '/auth/register',
          {
            method: 'POST',
            body: JSON.stringify({ email, username, password }),
          },
        );
           saveToken(response!.accessToken) 

        router.push('/profile'); 
      } catch (err: unknown) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Erro ao cadastrar');
      } finally {
        setLoading(false);
      }
    },
    [email, username, password],
  );

  return (
    <main className="max-w-md mx-auto p-6">
      <StatusHandler loading={loading} error={error} loadingMessage="Cadastrando..." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block mb-1">Usuário</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
    </main>
  );
}
