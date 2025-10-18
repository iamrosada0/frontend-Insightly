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
import { StatusHandler } from '@/components/StatusHandler';
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  username: z
    .string()
    .min(3, 'O usuário deve ter pelo menos 3 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'O usuário deve conter apenas letras, números ou _'),
  email: z.email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

type FormErrors = Partial<Record<keyof SignupFormData | 'form', string>>;

interface SignupFormProps {
  formData: SignupFormData;
  errors: FormErrors;
  loading: boolean;
  onChange: (data: SignupFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignupForm({
  formData,
  errors,
  loading,
  onChange,
  onSubmit,
}: SignupFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crie sua conta Insightly</CardTitle>
        <CardDescription>
          Insira seus dados abaixo para se registrar como criador
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <StatusHandler
              loading={loading}
              error={errors.form ?? null} 
              loadingMessage="Cadastrando..."
            />
            <Field>
              <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) => onChange({ ...formData, name: e.target.value })}
                required
              />
              {errors.name && (
                <FieldDescription className="text-red-600">
                  {errors.name}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Usuário</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="joao_silva"
                value={formData.username}
                onChange={(e) => onChange({ ...formData, username: e.target.value })}
                required
              />
              <FieldDescription>
                Será usado na URL do seu perfil público.
                {errors.username && (
                  <span className="text-red-600"> {errors.username}</span>
                )}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => onChange({ ...formData, email: e.target.value })}
                required
              />
              <FieldDescription>
                Não compartilharemos seu email com ninguém.
                {errors.email && (
                  <span className="text-red-600"> {errors.email}</span>
                )}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(e) => onChange({ ...formData, password: e.target.value })}
                required
              />
              <FieldDescription>
                Deve ter pelo menos 8 caracteres.
                {errors.password && (
                  <span className="text-red-600"> {errors.password}</span>
                )}
              </FieldDescription>
            </Field>
            <Field className="mt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
              <FieldDescription className="text-center mt-2">
                Já tem uma conta?{' '}
                <a href="/auth/login" className="text-blue-600 hover:underline">
                  Entrar
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}