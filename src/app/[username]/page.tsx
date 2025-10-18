// src/app/[username]/page.tsx
import { apiFetch, ApiError } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { UserProfileResponse } from '@/types';
import FeedbackForm from '@/components/FeedbackForm';

interface PublicProfilePageProps {
  user: UserProfileResponse | null;
  error?: string;
}

async function fetchUser(username: string): Promise<PublicProfilePageProps> {
  try {
    const user = await apiFetch<UserProfileResponse>(`/users/${username}`);
    return { user };
  } catch (err: unknown) {
    const apiError = err as ApiError;
    return { user: null, error: apiError.message || 'Erro ao carregar perfil público' };
  }
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const { user, error: initialError } = await fetchUser(params.username);

  if (!user) {
    return <StatusHandler loading={false} error={initialError || 'Usuário não encontrado'} />;
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <section aria-labelledby="profile-header">
        <h1 id="profile-header" className="text-3xl font-bold text-center">
          {user.name ?? user.username}
        </h1>
        {user.bio && <p className="text-gray-600 text-center">{user.bio}</p>}
      </section>
      <section aria-labelledby="links-header">
        <h2 id="links-header" className="text-xl font-semibold mb-2">Links</h2>
        {user.links.length === 0 ? (
          <p className="text-gray-500">Nenhum link disponível.</p>
        ) : (
          <ul className="space-y-2" role="list">
            {user.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                  aria-label={`Visitar ${link.title}`}
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
      <FeedbackForm username={user.username} />
    </main>
  );
}