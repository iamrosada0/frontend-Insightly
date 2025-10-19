import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';
import { CreateLinkFormData, createLinkSchema } from '@/components/CreateLinkForm';

export function useCreateLink() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateLinkFormData>({ title: '', url: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateLinkFormData | 'form', string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const submit = useCallback(async () => {
    setErrors({});
    setSaving(true);

    const result = createLinkSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        url: fieldErrors.url?.[0],
      });
      setSaving(false);
      return false;
    }

    try {
      const token = getToken();
      if (!token) {
        setErrors({ form: 'Usuário não autenticado' });
        router.push('/auth/login');
        return false;
      }

      await apiFetch<void>('/users/links', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      router.push('/profile/links');
      return true;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao criar link:', apiError);
      setErrors({ form: apiError.message || 'Erro ao salvar link' });
      if (apiError.status === 401) {
        clearToken();
        router.push('/auth/login');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [formData, router]);

  const cancel = useCallback(() => {
    router.push('/profile/links');
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
