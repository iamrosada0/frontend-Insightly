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

export const createLinkSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(100, 'O título não pode exceder 100 caracteres'),
  url: z.url('A URL deve ser válida'),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

type FormErrors = Partial<Record<keyof CreateLinkFormData | 'form', string>>;

interface CreateLinkFormProps {
  formData: CreateLinkFormData;
  errors: FormErrors;
  loading: boolean;
  saving: boolean;
  onChange: (data: CreateLinkFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CreateLinkForm({
  formData,
  errors,
  loading,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: CreateLinkFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Link</CardTitle>
        <CardDescription>Adicione um novo link ao seu perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <StatusHandler
          loading={loading}
          error={errors.form ?? null}
          loadingMessage="Carregando formulário..."
        />
        {!loading && !errors.form && (
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Título</FieldLabel>
                <Input
                  id="title"
                  type="text"
                  placeholder="Título do link"
                  value={formData.title}
                  onChange={(e) => onChange({ ...formData, title: e.target.value })}
                  required
                  aria-required="true"
                  aria-label="Título do link"
                />
                {errors.title && (
                  <FieldDescription className="text-red-600">
                    {errors.title}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="url">URL</FieldLabel>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => onChange({ ...formData, url: e.target.value })}
                  required
                  aria-required="true"
                  aria-label="URL do link"
                />
                {errors.url && (
                  <FieldDescription className="text-red-600">{errors.url}</FieldDescription>
                )}
              </Field>
              <Field className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  aria-label="Cancelar criação"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  aria-label="Criar novo link"
                >
                  {saving ? 'Criando...' : 'Criar Link'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}