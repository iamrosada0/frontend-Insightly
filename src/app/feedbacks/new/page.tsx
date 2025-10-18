/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api'; 

export default function NewFeedbackPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiFetch('/feedback', {
        method: 'POST',
        body: JSON.stringify({ username, message }),
      });

      setSuccess('✅ Feedback enviado com sucesso!');
      setUsername('');
      setMessage('');
    } catch (err: any) {
      console.error('Erro ao enviar feedback:', err);
      setError(err?.message || 'Erro desconhecido ao enviar feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Enviar Feedback Anônimo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Usuário (ex: luisrosada)"
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <textarea
          placeholder="Escreva sua mensagem..."
          className="w-full border p-2 rounded min-h-[120px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white px-4 py-2 rounded transition ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
          }`}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
