import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { getToken, getUsernameFromToken, clearToken } from '@/lib/auth';
import { EditProfileFormData, editProfileSchema } from '@/components/EditProfileForm';

export function useEditProfile() {
  const router = useRouter();

  const [formData, setFormData] = useState<EditProfileFormData>({ name: '', bio: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof EditProfileFormData | 'form', string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const redirectToLogin = useCallback(() => {
    clearToken();
    router.push('/auth/login');
  }, [router]);

  const fetchProfile = useCallback(async (username: string) => {
    try {
      const token = getToken();
      if (!token) return redirectToLogin();

      const data = await apiFetch<EditProfileFormData>(`/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData(data ?? { name: '', bio: '' });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setErrors({ form: apiError.message || 'Erro ao carregar perfil' });
      if (apiError.status === 401) redirectToLogin();
      else router.push('/profile');
    } finally {
      setLoading(false);
    }
  }, [router, redirectToLogin]);

  useEffect(() => {
    const token = getToken();
    const username = getUsernameFromToken();

    if (!token || !username) {
      setErrors({ form: 'Usuário não autenticado' });
      redirectToLogin();
      return;
    }

    fetchProfile(username);
  }, [fetchProfile, redirectToLogin]);

  const submit = useCallback(async () => {
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
      return false;
    }

    try {
      const token = getToken();
      if (!token) return redirectToLogin();

      await apiFetch<void>('/users/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      router.push('/profile');
      return true;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setErrors({ form: apiError.message || 'Erro ao salvar alterações' });
      if (apiError.status === 401) redirectToLogin();
      return false;
    } finally {
      setSaving(false);
    }
  }, [formData, router, redirectToLogin]);

  const cancel = useCallback(() => {
    router.push('/profile');
  }, [router]);

  return {
    formData,
    setFormData,
    errors,
    loading,
    saving,
    submit,
    cancel,
  };
}
