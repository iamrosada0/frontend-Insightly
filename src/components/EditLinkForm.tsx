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

export const editLinkSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(100, 'O título não pode exceder 100 caracteres'),
  url: z.url('A URL deve ser válida'),
});

export type EditLinkFormData = z.infer<typeof editLinkSchema>;

type FormErrors = Partial<Record<keyof EditLinkFormData | 'form', string>>;

interface EditLinkFormProps {
  formData: EditLinkFormData;
  errors: FormErrors;
  loading: boolean;
  saving: boolean;
  onChange: (data: EditLinkFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function EditLinkForm({
  formData,
  errors,
  loading,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: EditLinkFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Link</CardTitle>
        <CardDescription>Atualize o título e a URL do seu link.</CardDescription>
      </CardHeader>
      <CardContent>
        <StatusHandler
          loading={loading}
          error={errors.form ?? null}
          loadingMessage="Carregando informações do link..."
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
                  aria-label="Cancelar edição"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  aria-label="Salvar alterações do link"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}