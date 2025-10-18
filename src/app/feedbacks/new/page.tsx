'use client';

import { useState } from 'react';

export default function NewFeedbackPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`http://localhost:4000/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message }),
    });

    alert('Feedback enviado!');
    setUsername('');
    setMessage('');
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
          className="w-full border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Enviar
        </button>
      </form>
    </div>
  );
}
