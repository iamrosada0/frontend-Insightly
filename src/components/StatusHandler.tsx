'use client';

interface StatusHandlerProps {
  loading: boolean;
  error: string | null;
  loadingMessage?: string;
}

export function StatusHandler({
  loading,
  error,
  loadingMessage = 'Carregando...',
}: StatusHandlerProps) {
  if (loading) {
    return (
      <p className="p-4 text-gray-700" aria-live="polite">
        {loadingMessage}
      </p>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600" role="alert">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return null;
}