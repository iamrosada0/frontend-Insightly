/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getUsernameFromToken, getToken } from "@/lib/auth";

type LinkType = {
  id: number;
  title: string;
  url: string;
};

type FeedbackType = {
  id: number;
  text: string;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
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
    try {
      const res = await apiFetch(`/users/${username}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUser(res);
      setLinks(res.links || []);
      setFeedbacks(
        (res.feedbacks || []).map((f: any) => ({
          id: f.id,
          text: f.text,
          createdAt: f.createdAt,
        }))
      );
    } catch (err) {
      console.error(err);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteLink = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este link?")) return;

    try {
      await apiFetch(`/users/links/${id}`, { method: "DELETE" });
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      console.error("Erro ao excluir link:", err);
      alert(err?.message || "Erro desconhecido ao excluir o link.");
    }
  };

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
        {links.length === 0 ? (
          <p className="text-gray-500">Nenhum link ainda.</p>
        ) : (
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.id} className="border p-3 rounded-md flex justify-between items-center">
                <div>
                  <strong>{l.title}</strong> –{" "}
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    {l.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteLink(l.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Feedbacks Recebidos</h2>
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">Nenhum feedback ainda.</p>
        ) : (
          <ul className="space-y-2">
            {feedbacks.map((f) => (
              <li key={f.id} className="border p-3 rounded-md">
                {f.text}
                <div className="text-xs text-gray-400">
                  {new Date(f.createdAt).toLocaleString("pt-BR")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
