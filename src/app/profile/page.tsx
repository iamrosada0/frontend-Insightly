/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getUsernameFromToken, getToken } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const token = getToken();
  const username = getUsernameFromToken();

  if (!token || !username) {
    router.replace("/");
    return;
  }

  fetchProfile(username);
}, []);


  async function fetchProfile(username: string) {
    console.log("Fetching profile for", username);
    try {
      const res = await apiFetch(`/users/${username}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log(res);
      setUser(res);
      setLinks(res.links || []);
      setFeedbacks(res.feedbacks || []);
    } catch (err) {
      console.error(err);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!user) return <div className="p-8 text-center">Erro ao carregar perfil.</div>;

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Informações Pessoais</h2>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Bio:</strong> {user.bio}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Meus Links</h2>
        <ul className="space-y-2">
          {links.map((l) => (
            <li key={l.id} className="border p-3 rounded-md">
              <strong>{l.title}</strong> – <a href={l.url} target="_blank" className="text-blue-600">{l.url}</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Feedbacks Recebidos</h2>
        <ul className="space-y-2">
          {feedbacks.length === 0 && <p className="text-gray-500">Nenhum feedback ainda.</p>}
          {feedbacks.map((f) => (
            <li key={f.id} className="border p-3 rounded-md">
              {f.content}
              <div className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
