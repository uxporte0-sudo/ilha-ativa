import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Plus } from 'lucide-react';
import { db } from '@/api/Client';
import { ativosTipos } from '@/constants/ativosTipos';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const atividadeInicial = {
  nome: '',
  tipo: '',
  data: '',
  minParticipantes: '2',
};

export default function NewBooking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(atividadeInicial);
  const [success, setSuccess] = useState(false);

  const createMutation = useMutation({
    mutationFn: (atividade) =>
      db.entities.Atividade.create({
        ...atividade,
        minParticipantes: Number(atividade.minParticipantes),
        confirmados: 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atividades'] });
      setForm(atividadeInicial);
      setSuccess(true);
    },
  });

  function updateField(field, value) {
    setForm((atividade) => ({
      ...atividade,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    createMutation.mutate(form);
  }

  const formInvalid =
    !form.nome ||
    !form.tipo ||
    !form.data ||
    Number(form.minParticipantes) < 1;

  if (success) {
    return (
      <div className="mx-auto mt-12 max-w-lg text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
          <Check className="h-8 w-8 text-accent" />
        </div>
        <h1 className="mb-2 text-2xl font-display font-bold">Ativo criado!</h1>
        <p className="mb-6 text-muted-foreground">
          A atividade foi salva no pseudo banco e ja aparece no painel.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate('/')}>
            Ver painel
          </Button>
          <Button onClick={() => setSuccess(false)}>
            Criar outro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold md:text-3xl">Criar Ativo</h1>
        <p className="mt-1 text-muted-foreground">
          Cadastre uma atividade usando as categorias configuradas no sistema.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="atividade-nome">Nome do ativo *</Label>
            <Input
              id="atividade-nome"
              value={form.nome}
              onChange={(event) => updateField('nome', event.target.value)}
              placeholder="Ex: Volei na praia"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={form.tipo} onValueChange={(value) => updateField('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {ativosTipos.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.ico} {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="atividade-data">Data *</Label>
              <Input
                id="atividade-data"
                type="date"
                value={form.data}
                onChange={(event) => updateField('data', event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="atividade-minimo">Participantes mínimos *</Label>
            <Input
              id="atividade-minimo"
              type="number"
              min="1"
              value={form.minParticipantes}
              onChange={(event) => updateField('minParticipantes', event.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={formInvalid || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Criar ativo
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
