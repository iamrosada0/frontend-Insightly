'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';
import { CreateLinkForm, CreateLinkFormData, createLinkSchema } from '@/components/CreateLinkForm';

type FormErrors = Partial<Record<keyof CreateLinkFormData | 'form', string>>;

export default function CreateLinkPage({ searchParams, ...props }: React.ComponentProps<'div'> & { searchParams?: unknown }) {
  const [formData, setFormData] = useState<CreateLinkFormData>({ title: '', url: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false); 
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setSaving(true);

      // Validate with Zod
      const result = createLinkSchema.safeParse(formData);
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

        await apiFetch<void>('/users/links', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title:formData.title, url:formData.url }),

        });
        router.push('/profile/links');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao criar link:', apiError);
        setErrors({ form: apiError.message || 'Erro ao salvar link' });
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
    router.push('/profile/links');
  }, [router]);

  return (
    <main className="max-w-md mx-auto p-6" {...props}>
      <CreateLinkForm
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