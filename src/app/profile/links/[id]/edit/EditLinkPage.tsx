'use client';

import { EditLinkForm } from '@/components/EditLinkForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEditLink } from '@/hooks/useEditLink';

export default function EditLinkPage(props: React.HTMLAttributes<HTMLElement>) {
  const { formData, setFormData, errors, loading, saving, submit, cancel } = useEditLink();


  if (loading) return <LoadingSpinner />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <main className="max-w-md mx-auto p-6" {...props}>
      <EditLinkForm
        formData={formData}
        errors={errors}
        loading={loading}
        saving={saving}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={cancel}
      />
    </main>
  );
}
