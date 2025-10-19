import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';
import { EditLinkFormData, editLinkSchema } from '@/components/EditLinkForm';
import { Link } from '@/types';

export function useEditLink() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<EditLinkFormData>({ title: '', url: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof EditLinkFormData | 'form', string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const redirectToLogin = useCallback(() => {
    clearToken();
    router.push('/auth/login');
  }, [router]);

  const fetchLink = useCallback(async () => {
    if (!id || Array.isArray(id)) {
      setErrors({ form: 'ID do link inválido' });
      setLoading(false);
      router.push('/profile/links');
      return;
    }

    try {
      const token = getToken();
      if (!token) return redirectToLogin();

      const links = await apiFetch<Link[]>('/users/links', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const link = links?.find((l) => l.id === Number(id));
      if (!link) {
        setErrors({ form: 'Link não encontrado' });
        router.push('/profile/links');
        return;
      }

      setFormData({ title: link.title, url: link.url });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao carregar link:', apiError);
      setErrors({ form: apiError.message || 'Erro ao carregar link' });
      if (apiError.status === 401) redirectToLogin();
      else router.push('/profile/links');
    } finally {
      setLoading(false);
    }
  }, [id, router, redirectToLogin]);

  useEffect(() => {
    fetchLink();
  }, [fetchLink]);

  const submit = useCallback(async () => {
    setErrors({});
    setSaving(true);

    const result = editLinkSchema.safeParse(formData);
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
      if (!token) return redirectToLogin();

      await apiFetch<void>(`/users/links/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      router.push('/profile/links');
      return true;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Erro ao atualizar link:', apiError);
      setErrors({ form: apiError.message || 'Erro ao salvar alterações' });
      if (apiError.status === 401) redirectToLogin();
      return false;
    } finally {
      setSaving(false);
    }
  }, [formData, id, router, redirectToLogin]);

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
