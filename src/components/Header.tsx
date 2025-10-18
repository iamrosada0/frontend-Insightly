"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export default function Header() {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push("/");
  }

  return (
    <header className="w-full bg-gray-900 text-white p-4 flex items-center justify-between shadow-md">
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => router.push("/profile")}
      >
        Insightly
      </h1>

      <nav className="flex items-center gap-4 text-sm">
        <button onClick={() => router.push("/profile/edit")} className="hover:underline">
          Editar Perfil
        </button>
        <button onClick={() => router.push("/profile/links")} className="hover:underline">
          Meus Links
        </button>
        <button onClick={() => router.push("/profile/links/new")} className="hover:underline">
          Criar Link
        </button>
        <button onClick={() => router.push("/feedbacks")} className="hover:underline">
          Feedbacks
        </button>
        <button onClick={() => router.push("/feedbacks/new")} className="hover:underline">
          Criar Feedback
        </button>
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
          Logout
        </button>
      </nav>
    </header>
  );
}
