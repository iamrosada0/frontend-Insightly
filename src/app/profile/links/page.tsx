'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type LinkType = {
  id: number;
  title: string;
  url: string;
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/users/links', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLinks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  if (loading) return <p className="p-4">Carregando...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Meus Links</h1>
      <Link
        href="/profile/links/new"
        className="bg-blue-500 text-white px-3 py-2 rounded"
      >
        + Novo Link
      </Link>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{link.title}</p>
              <a href={link.url} target="_blank" className="text-blue-600">
                {link.url}
              </a>
            </div>
            <Link
              href={`/profile/links/${link.id}/edit`}
              className="text-sm text-blue-500 hover:underline"
            >
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
