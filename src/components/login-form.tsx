// src/app/login/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { StatusHandler } from '@/components/StatusHandler';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { saveToken } from '@/lib/auth';

export default function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setCarregando(true);
      setErro(null);
      try {
        const response = await apiFetch<{ accessToken: string; user: { id: number; email: string; username: string } }>(
          '/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({ email, senha }),
          },
        );
        saveToken(response!.accessToken); 
        router.push('/perfil'); 
      } catch (err: unknown) {
        const apiError = err as ApiError;
        setErro(apiError.message || 'Erro ao fazer login');
      } finally {
        setCarregando(false);
      }
    },
    [email, senha],
  );

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entrar na sua conta Insightly</CardTitle>
          <CardDescription>
            Insira seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <StatusHandler loading={carregando} error={erro} loadingMessage="Fazendo login..." />
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                    aria-label="Esqueceu a senha?"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={carregando}>
                  {carregando ? 'Entrando...' : 'Entrar'}
                </Button>
                <FieldDescription className="text-center mt-2">
                  Não tem uma conta?{' '}
                  <a href="/auth/register" className="text-blue-600 hover:underline">
                    Cadastre-se
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}