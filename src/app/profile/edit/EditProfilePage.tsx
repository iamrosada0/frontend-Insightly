'use client';

import { EditProfileForm } from '@/components/EditProfileForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEditProfile } from '@/hooks/useEditProfile';

export default function EditProfilePage() {
  const {
    formData,
    setFormData,
    errors,
    loading,
    saving,
    submit: handleSubmit,
    cancel: handleCancel,
  } = useEditProfile();

  if (loading) return <LoadingSpinner />;

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
