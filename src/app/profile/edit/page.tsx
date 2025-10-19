'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { getToken, getUsernameFromToken, clearToken } from '@/lib/auth';
import { EditProfileForm, EditProfileFormData, editProfileSchema } from '@/components/EditProfileForm';
import { Spinner } from '@/components/ui/spinner';

type FormErrors = Partial<Record<keyof EditProfileFormData | 'form', string>>;

export default function EditProfilePage() {
  const [formData, setFormData] = useState<EditProfileFormData>({ name: '', bio: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const fetchProfile = useCallback(
    async (username: string) => {
      try {
        const token = getToken();
        if (!token) {
          setErrors({ form: 'Usuário não autenticado' });
          router.push('/auth/login');
          return;
        }

        const data = await apiFetch<EditProfileFormData>(`/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(data ?? { name: '', bio: '' });
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao carregar perfil:', apiError);
        setErrors({ form: apiError.message || 'Erro ao carregar perfil' });
        if (apiError.status === 401) {
          clearToken();
          router.push('/auth/login');
        } else {
          router.push('/profile');
        }
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const token = getToken();
    const username = getUsernameFromToken();

    if (!token || !username) {
      setErrors({ form: 'Usuário não autenticado' });
      router.push('/auth/login');
      return;
    }

    fetchProfile(username);
  }, [router, fetchProfile]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setSaving(true);

      const result = editProfileSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors({
          name: fieldErrors.name?.[0],
          bio: fieldErrors.bio?.[0],
        });
        setSaving(false);
        return;
      }

      try {
        const token = getToken();
        if (!token) {
          setErrors({ form: 'Usuário não autenticado' });
          router.push('/auth/login');
          return;
        }

        await apiFetch<void>('/users/profile', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(formData),
        });
        router.push('/profile');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao atualizar perfil:', apiError);
        setErrors({ form: apiError.message || 'Erro ao salvar alterações' });
        if (apiError.status === 401) {
          clearToken();
          router.push('/auth/login');
        }
      } finally {
        setSaving(false);
      }
    },
    [formData, router],
  );

  const handleCancel = useCallback(() => {
    router.push('/profile');
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <main className="max-w-xl mx-auto p-6">
      <EditProfileForm
        formData={formData}
        errors={errors}
        loading={loading}
        saving={saving}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </main>
  );
}