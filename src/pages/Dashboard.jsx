import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '@/api/Client';
import obterAtividades from '@/components/ListaAtividades';
import { ativosTipos } from '@/constants/ativosTipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const atividadeInicial = {
  nome: '',
  tipo: '',
  data: '',
  minParticipantes: '2',
};

function AtivoCard({
  icone,
  nome,
  tipoLabel,
  dataFormatada,
  confirmadosTexto,
  acaoLabel,
  onConfirmar,
  confirmando,
  confirmarDesabilitado,
}) {
  return (
    <article className="flex w-full shrink-0 snap-start snap-always flex-col gap-4 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50 md:min-h-24 md:w-auto md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">
          {icone}
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{nome}</h3>
          <p className="text-sm text-muted-foreground">{tipoLabel}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm font-medium">{dataFormatada}</p>
          <p className="text-xs text-muted-foreground">{confirmadosTexto}</p>
        </div>

        <Button size="sm" onClick={onConfirmar} disabled={confirmando || confirmarDesabilitado}>
          {confirmando ? 'Confirmando...' : acaoLabel}
        </Button>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const ativosCarouselRef = useRef(null);
  const [ativoAtual, setAtivoAtual] = useState(0);
  const [novaAtividade, setNovaAtividade] = useState(atividadeInicial);

  const { data: atividadesBase = [] } = useQuery({
    queryKey: ['atividades'],
    queryFn: () => db.entities.Atividade.list('-created_date'),
  });

  const atividades = obterAtividades(atividadesBase);

  const confirmarPresencaMutation = useMutation({
    mutationFn: (atividade) =>
      db.entities.Atividade.update(atividade.id, {
        confirmados: atividade.confirmados + 1,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['atividades'] }),
  });

  const criarAtividadeMutation = useMutation({
    mutationFn: (atividade) =>
      db.entities.Atividade.create({
        ...atividade,
        minParticipantes: Number(atividade.minParticipantes),
        confirmados: 0,
      }),
    onSuccess: () => {
      setNovaAtividade(atividadeInicial);
      setAtivoAtual(0);
      queryClient.invalidateQueries({ queryKey: ['atividades'] });
    },
  });

  function atualizarAtivoAtual() {
    const carousel = ativosCarouselRef.current;

    if (!carousel) return;

    const cards = Array.from(carousel.children);
    const cardMaisProximo = cards.reduce(
      (maisProximo, card, index) => {
        const distancia = Math.abs(card.offsetLeft - carousel.scrollLeft);

        return distancia < maisProximo.distancia
          ? { index, distancia }
          : maisProximo;
      },
      { index: 0, distancia: Infinity }
    );

    setAtivoAtual(cardMaisProximo.index);
  }

  function rolarParaAtivo(index) {
    const carousel = ativosCarouselRef.current;
    const card = carousel?.children[index];

    if (!carousel || !card) return;

    carousel.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth',
    });
    setAtivoAtual(index);
  }

  function atualizarNovaAtividade(campo, valor) {
    setNovaAtividade((atividade) => ({
      ...atividade,
      [campo]: valor,
    }));
  }

  function criarAtividade(event) {
    event.preventDefault();
    criarAtividadeMutation.mutate(novaAtividade);
  }

  const formularioInvalido =
    !novaAtividade.nome ||
    !novaAtividade.tipo ||
    !novaAtividade.data ||
    Number(novaAtividade.minParticipantes) < 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Seu Painel</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe os ATIVOS e informações principais da Ilha Ativa.
        </p>
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>ATIVOS</CardTitle>
            <CardDescription>Ativos próximos de você</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={ativosCarouselRef}
              onScroll={atualizarAtivoAtual}
              className="scrollbar-none-mobile flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 md:block md:max-h-[13.5rem] md:space-y-3 md:overflow-x-visible md:overflow-y-auto md:pr-2"
            >
              {atividades.map((atividade) => (
                <AtivoCard
                  key={atividade.id}
                  {...atividade}
                  onConfirmar={() => confirmarPresencaMutation.mutate(atividade)}
                  confirmando={confirmarPresencaMutation.variables?.id === atividade.id && confirmarPresencaMutation.isPending}
                />
              ))}
            </div>

            <div className="mt-3 flex justify-center gap-2 md:hidden">
              {atividades.map((atividade, index) => (
                <button
                  key={atividade.id}
                  type="button"
                  onClick={() => rolarParaAtivo(index)}
                  className={`h-2 rounded-full transition-all ${
                    ativoAtual === index ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/35'
                  }`}
                  aria-label={`Ir para ${atividade.nome}`}
                  aria-current={ativoAtual === index}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novo Ativo</CardTitle>
            <CardDescription>Crie uma atividade no pseudo banco</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={criarAtividade}>
              <div className="space-y-2">
                <Label htmlFor="atividade-nome">Nome</Label>
                <Input
                  id="atividade-nome"
                  value={novaAtividade.nome}
                  onChange={(event) => atualizarNovaAtividade('nome', event.target.value)}
                  placeholder="Ex: Volei na praia"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={novaAtividade.tipo}
                    onValueChange={(valor) => atualizarNovaAtividade('tipo', valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
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
                  <Label htmlFor="atividade-data">Data</Label>
                  <Input
                    id="atividade-data"
                    type="date"
                    value={novaAtividade.data}
                    onChange={(event) => atualizarNovaAtividade('data', event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="atividade-minimo">Participantes mínimos</Label>
                <Input
                  id="atividade-minimo"
                  type="number"
                  min="1"
                  value={novaAtividade.minParticipantes}
                  onChange={(event) => atualizarNovaAtividade('minParticipantes', event.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={formularioInvalido || criarAtividadeMutation.isPending}
              >
                {criarAtividadeMutation.isPending ? 'Criando...' : 'Criar ativo'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
