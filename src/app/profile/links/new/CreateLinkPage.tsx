'use client';

import { CreateLinkForm } from '@/components/CreateLinkForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCreateLink } from '@/hooks/useCreateLink';

export default function CreateLinkPage() {
  const { formData, setFormData, errors, loading, saving, submit, cancel } = useCreateLink();

  if (loading) return <LoadingSpinner />;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <CreateLinkForm
        formData={formData}
        errors={errors}
        saving={saving}
        loading={false} 
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={cancel}
      />
    </main>
  );
}
