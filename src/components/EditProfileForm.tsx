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
import { Textarea } from '@/components/ui/textarea';
import { StatusHandler } from '@/components/StatusHandler';
import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(50, 'O nome não pode exceder 50 caracteres'),
  bio: z.string().max(500, 'A bio não pode exceder 500 caracteres').optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

type FormErrors = Partial<Record<keyof EditProfileFormData | 'form', string>>;

interface EditProfileFormProps {
  formData: EditProfileFormData;
  errors: FormErrors;
  loading: boolean;
  saving: boolean;
  onChange: (data: EditProfileFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function EditProfileForm({
  formData,
  errors,
  loading,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: EditProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
        <CardDescription>Atualize seu nome e bio para personalizar seu perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <StatusHandler
          loading={loading}
          error={errors.form ?? null}
          loadingMessage="Carregando informações do perfil..."
        />
        {!loading && !errors.form && (
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => onChange({ ...formData, name: e.target.value })}
                  required
                  aria-required="true"
                  aria-label="Nome do perfil"
                />
                {errors.name && (
                  <FieldDescription className="text-red-600">
                    {errors.name}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => onChange({ ...formData, bio: e.target.value })}
                  placeholder="Conte um pouco sobre você"
                  rows={4}
                  aria-label="Bio do perfil"
                />
                <FieldDescription>
                  Máximo de 500 caracteres.
                  {errors.bio && <span className="text-red-600"> {errors.bio}</span>}
                </FieldDescription>
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
                  aria-label="Salvar alterações do perfil"
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