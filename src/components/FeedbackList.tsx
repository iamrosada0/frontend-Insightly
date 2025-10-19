import { Feedback } from '@/types';
import { StatusHandler } from './StatusHandler';

interface FeedbackListProps {
  feedbacks: Feedback[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function FeedbackList({
  feedbacks,
  loading,
  error,
  page,
  hasMore,
  onNextPage,
  onPrevPage,
}: FeedbackListProps) {

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <StatusHandler loading={loading} error={error} loadingMessage="Carregando feedbacks..." />
      {!loading && !error && (
        <section aria-labelledby="feedback-header">
          <h1 id="feedback-header" className="text-2xl font-semibold mb-4">
            Meus Feedbacks
          </h1>
          {feedbacks?.length === 0 ? (
            <p className="text-gray-500">Nenhum feedback recebido.</p>
          ) : (
            <>
              <ul className="space-y-4" role="list">
                {feedbacks?.map((feedback) => (
                  <li
                    key={feedback.id}
                    className="border p-4 rounded bg-gray-50"
                    role="listitem"
                  >
                    <p className="text-gray-800">{feedback.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Recebido em: {new Date(feedback.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-6">
                <button
                  onClick={onPrevPage}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
                >
                  Anterior
                </button>
                <button
                  onClick={onNextPage}
                  disabled={!hasMore}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </main>

  );
}