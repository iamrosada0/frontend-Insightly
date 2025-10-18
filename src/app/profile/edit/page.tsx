"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getToken, getUsernameFromToken } from "@/lib/auth";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getToken();
    const username = getUsernameFromToken();

    if (!token || !username) {
      router.push("/");
      return;
    }

    fetchProfile(username);
  }, []);

  async function fetchProfile(username: string) {
    try {
      const res = await apiFetch(`/users/${username}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setForm({ name: res.name || "", bio: res.bio || "" });
    } catch (err) {
      console.error(err);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });
      router.push("/profile");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      alert("Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="p-8 text-center">
        Carregando informações do perfil...
      </div>
    );

  return (
    <>
      <main className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="px-4 py-2 rounded-md border hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
