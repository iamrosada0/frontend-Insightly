"use client";

import { useState } from "react";
import { StatusHandler } from "@/components/StatusHandler";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfileData } from "@/hooks/useProfile";
import LoadingSpinner from "@/components/LoadingSpinner";



export default function ProfilePage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [page, setPage] = useState(1);
  const { profile, feedbacks, loading, error, hasMore } = useProfileData(page);

  const handleNextPage = () => hasMore && setPage((prev) => prev + 1);
  const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className={cn("flex flex-col gap-6 max-w-3xl mx-auto p-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Seu Perfil</CardTitle>
          <CardDescription>
            Veja os detalhes do seu perfil e os feedbacks recebidos.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <StatusHandler
            loading={loading}
            error={error}
            loadingMessage="Carregando perfil e feedbacks..."
          />

          {!loading && !error && profile && (
            <div className="space-y-6">
              {/* Perfil */}
              <section>
                <h2 className="text-lg font-semibold">Informações do Perfil</h2>
                <p>
                  <span className="font-medium text-gray-800">Usuário:</span>{" "}
                  {profile.username}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Nome:</span>{" "}
                  {profile.name || "Não definido"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Bio:</span>{" "}
                  {profile.bio || "Não definida"}
                </p>

                <div>
                  <span className="font-medium text-gray-800">Links:</span>
                  {profile.links.length === 0 ? (
                    <p className="text-gray-500">Nenhum link adicionado.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {profile.links.map((link) => (
                        <li key={link.id}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              {/* Feedbacks */}
              <section>
                <h2 className="text-lg font-semibold">Meus Feedbacks</h2>

                {feedbacks.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    Nenhum feedback recebido ainda.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <li
                        key={feedback.id}
                        className="border p-4 rounded bg-gray-50"
                      >
                        <p className="text-gray-800">{feedback.text}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Recebido:{" "}
                          {new Date(feedback.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                {feedbacks.length > 0 && (
                  <div className="flex justify-between mt-6">
                    <Button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      variant="outline"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={handleNextPage}
                      disabled={!hasMore}
                      variant="outline"
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </section>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
