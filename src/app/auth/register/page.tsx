'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { SignupForm, SignupFormData, signupSchema } from '@/components/SignupForm';

type FormErrors = Partial<Record<keyof SignupFormData | 'form', string>>;

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setLoading(true);

      const result = signupSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors({
          name: fieldErrors.name?.[0],
          username: fieldErrors.username?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch<{
          accessToken: string;
          user: { id: number; email: string; username: string };
        }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(formData),
        });

        saveToken(response!.accessToken);
        router.push('/profile');
      } catch (err: unknown) {
        const apiError = err as ApiError;
        setErrors({ form: apiError.message || 'Erro ao cadastrar' });
      } finally {
        setLoading(false);
      }
    },
    [formData, router],
  );

  return (
    <main className="max-w-md mx-auto p-6">
      <SignupForm
        formData={formData}
        errors={errors}
        loading={loading}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
    </main>
  );
}