/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditLinkPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:4000/users/links`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((links) => {
        const link = links.find((l: any) => l.id === Number(id));
        if (link) {
          setTitle(link.title);
          setUrl(link.url);
        }
      });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    await fetch(`http://localhost:3000/users/links/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, url }),
    });

    router.push('/profile/links');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Editar Link</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="url"
          className="w-full border p-2 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
}
