'use client';

import { StatusHandler } from '@/components/StatusHandler';
import Link from 'next/link';
import { useLinks } from '@/hooks/useLinks';
import { LinksList } from '@/components/LinksList';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LinksPage() {
  const { links, loading, error, deleteLink } = useLinks();

  if (loading) return <LoadingSpinner />;


  return (
    <main className="max-w-2xl mx-auto p-6">
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando links..." />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Meus Links</h1>
        <Link
          href="/profile/links/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          aria-label="Adicionar novo link"
        >
          + Novo Link
        </Link>
      </div>

      <LinksList links={links} onDelete={deleteLink} />
    </main>
  );
}
