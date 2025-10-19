'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { CreateLinkForm, CreateLinkFormData, createLinkSchema } from '@/components/CreateLinkForm';
import { useAuth } from '@/lib/auth-context';

type FormErrors = Partial<Record<keyof CreateLinkFormData | 'form', string>>;

export default function CreateLinkPage({ ...props }: React.ComponentProps<'div'>) {
  const { token } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<CreateLinkFormData>({ title: '', url: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
        return;
      }

      try {
        if (!token) return; 
        await apiFetch<void>('/users/links', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        router.push('/profile/links');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Erro ao criar link:', apiError);
        setErrors({ form: apiError.message || 'Erro ao salvar link' });
        if (apiError.status === 401) {
          router.push('/auth/login');
        }
      } finally {
        setSaving(false);
      }
    },
    [formData, router, token],
  );

  const handleCancel = useCallback(() => {
    router.push('/profile/links');
  }, [router]);

  return (
    <main className="max-w-md mx-auto p-6" {...props}>
      <CreateLinkForm
        formData={formData}
        errors={errors}
        saving={saving}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel} 
        loading={false}      
        />
    </main>
  );
}
