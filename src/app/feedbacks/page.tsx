'use client';

import { useEffect, useState } from 'react';

type Feedback = {
  id: number;
  message: string;
  createdAt: string;
};

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/feedback', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Erro ao buscar feedbacks');
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <p className="p-4">Carregando feedbacks...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Feedbacks Recebidos</h1>

      {feedbacks.length === 0 ? (
        <p className="text-gray-600">Você ainda não recebeu feedbacks.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li key={fb.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <p className="text-gray-800">{fb.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(fb.createdAt).toLocaleString('pt-BR')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
