'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken, getUsernameFromToken } from '@/lib/auth';
import { StatusHandler } from '@/components/StatusHandler';
import { UserProfile, ApiError } from '@/types';

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<UserProfile>({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (username: string) => {
    try {
      const data = await apiFetch<UserProfile>(`/users/${username}`);
      setForm(data ?? { name: '', bio: '' });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao carregar perfil:', apiError);
      setError(apiError.message || 'Erro ao carregar perfil');
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);

      try {
        await apiFetch<void>('/users/profile', {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        router.push('/profile');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao atualizar perfil:', apiError);
        setError(apiError.message || 'Erro ao salvar alterações');
      } finally {
        setSaving(false);
      }
    },
    [router, form],
  );

  const handleCancel = useCallback(() => {
    router.push('/profile');
  }, [router]);

  return (
    <>
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando informações do perfil..." />
      {!loading && !error && (
        <main className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
                aria-required="true"
                aria-label="Nome do perfil"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block mb-1 font-semibold">
                Bio
              </label>
              <textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                rows={4}
                aria-label="Bio do perfil"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-md border hover:bg-gray-100"
                aria-label="Cancelar edição"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                aria-label="Salvar alterações do perfil"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </main>
      )}
    </>
  );
}