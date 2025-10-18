import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">Insightly</h1>
      <p className="text-lg text-center max-w-md mb-8">
        Crie sua página pública, compartilhe seus links e receba feedbacks
        anônimos dos seus seguidores.
      </p>

      <div className="flex gap-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Criar conta
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
