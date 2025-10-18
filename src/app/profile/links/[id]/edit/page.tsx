'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';
import { EditLinkForm, EditLinkFormData, editLinkSchema } from '@/components/EditLinkForm';
import { Link } from '@/types';

type FormErrors = Partial<Record<keyof EditLinkFormData | 'form', string>>;

export default function EditLinkPage({ searchParams, ...props }: React.ComponentProps<'div'> & { searchParams?: unknown }) {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<EditLinkFormData>({ title: '', url: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchLink = useCallback(
    async (linkId: string) => {
      try {
        const token = getToken();
        if (!token) {
          setErrors({ form: 'Usuário não autenticado' });
          router.push('/auth/login');
          return;
        }

        const links = await apiFetch<Link[]>('/users/links', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const link = links?.find((l) => l.id === Number(linkId));

        if (link) {
          setFormData({ title: link.title, url: link.url });
        } else {
          setErrors({ form: 'Link não encontrado' });
        }
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao carregar link:', apiError);
        setErrors({ form: apiError.message || 'Erro ao carregar link' });
        if (apiError.status === 401) {
          clearToken();
          router.push('/auth/login');
        } else {
          router.push('/profile/links');
        }
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setErrors({ form: 'ID do link inválido' });
      setLoading(false);
      router.push('/profile/links');
      return;
    }

    fetchLink(id);
  }, [id, fetchLink, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
        return;
      }

      try {
        const token = getToken();
        if (!token) {
          setErrors({ form: 'Usuário não autenticado' });
          router.push('/auth/login');
          return;
        }

        await apiFetch<void>(`/users/links/${id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title:formData.title, url:formData.url }),
        });
        router.push('/profile/links');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao atualizar link:', apiError);
        setErrors({ form: apiError.message || 'Erro ao salvar alterações' });
        if (apiError.status === 401) {
          clearToken();
          router.push('/auth/login');
        }
      } finally {
        setSaving(false);
      }
    },
    [formData, id, router],
  );

  const handleCancel = useCallback(() => {
    router.push('/profile/links');
  }, [router]);

  return (
    <main className="max-w-md mx-auto p-6" {...props}>
      <EditLinkForm
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