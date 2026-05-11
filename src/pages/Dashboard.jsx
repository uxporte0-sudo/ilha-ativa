import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { db } from '@/api/Client';
import obterAtividades from '@/components/ListaAtividades';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  confirmado,
  tone = 'primary',
}) {
  const iconClassName =
    tone === 'secondary'
      ? 'bg-secondary text-secondary-foreground'
      : 'bg-primary/10';
  const buttonClassName =
    tone === 'secondary'
      ? 'border-transparent bg-gradient-accent text-accent-foreground hover:brightness-110'
      : 'bg-gradient-primary text-primary-foreground hover:brightness-110';

  return (
    <article className="flex w-full shrink-0 snap-start snap-always flex-col gap-4 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50 md:min-h-24 md:w-auto md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl ${iconClassName}`}>
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

        <Button
          size="sm"
          variant={confirmado ? 'outline' : 'default'}
          onClick={onConfirmar}
          disabled={confirmando || confirmarDesabilitado}
          className={buttonClassName}
        >
          {confirmando ? 'Atualizando...' : acaoLabel}
        </Button>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const ativosProximosCarouselRef = useRef(null);
  const seusAtivosCarouselRef = useRef(null);
  const [ativoProximoAtual, setAtivoProximoAtual] = useState(0);
  const [seuAtivoAtual, setSeuAtivoAtual] = useState(0);

  const { data: atividadesBase = [] } = useQuery({
    queryKey: ['atividades'],
    queryFn: () => db.entities.Atividade.list('-created_date'),
  });

  const atividades = obterAtividades(atividadesBase, user?.id);
  const ativosProximos = atividades.filter((atividade) => !atividade.confirmadoPeloUsuario);
  const seusAtivos = atividades.filter((atividade) => atividade.confirmadoPeloUsuario);

  const alternarPresencaMutation = useMutation({
    mutationFn: (atividade) => {
      const confirmadosUsuarios = atividade.confirmadosUsuarios ?? [];
      const confirmado = confirmadosUsuarios.includes(user.id);
      const proximosConfirmadosUsuarios = confirmado
        ? confirmadosUsuarios.filter((usuarioId) => usuarioId !== user.id)
        : [...confirmadosUsuarios, user.id];

      return db.entities.Atividade.update(atividade.id, {
        confirmados: Math.max(0, atividade.confirmados + (confirmado ? -1 : 1)),
        confirmadosUsuarios: proximosConfirmadosUsuarios,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['atividades'] }),
  });

  useEffect(() => {
    setAtivoProximoAtual(0);
  }, [ativosProximos.length]);

  useEffect(() => {
    setSeuAtivoAtual(0);
  }, [seusAtivos.length]);

  function atualizarAtivoAtual(carouselRef, setAtivoAtual) {
    const carousel = carouselRef.current;

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

  function rolarParaAtivo(carouselRef, setAtivoAtual, index) {
    const carousel = carouselRef.current;
    const card = carousel?.children[index];

    if (!carousel || !card) return;

    carousel.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth',
    });
    setAtivoAtual(index);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Seu Painel</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe os ATIVOS e informações principais da Ilha Ativa.
        </p>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>ATIVOS</CardTitle>
            <CardDescription>Ativos próximos de você</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={ativosProximosCarouselRef}
              onScroll={() => atualizarAtivoAtual(ativosProximosCarouselRef, setAtivoProximoAtual)}
              className="scrollbar-none-mobile flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 md:block md:max-h-[13.5rem] md:space-y-3 md:overflow-x-visible md:overflow-y-auto md:pr-2"
            >
              {ativosProximos.map((atividade) => (
                <AtivoCard
                  key={atividade.id}
                  {...atividade}
                  onConfirmar={() => alternarPresencaMutation.mutate(atividade)}
                  confirmando={alternarPresencaMutation.variables?.id === atividade.id && alternarPresencaMutation.isPending}
                  confirmado={atividade.confirmadoPeloUsuario}
                />
              ))}
              {ativosProximos.length === 0 && (
                <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                  Todos os ativos disponíveis já estão confirmados por você.
                </div>
              )}
            </div>

            {ativosProximos.length > 0 && (
              <div className="mt-3 flex justify-center gap-2 md:hidden">
                {ativosProximos.map((atividade, index) => (
                  <button
                    key={atividade.id}
                    type="button"
                    onClick={() => rolarParaAtivo(ativosProximosCarouselRef, setAtivoProximoAtual, index)}
                    className={`h-2 rounded-full transition-all ${
                      ativoProximoAtual === index ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/35'
                    }`}
                    aria-label={`Ir para ${atividade.nome}`}
                    aria-current={ativoProximoAtual === index}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>Seus Ativos</CardTitle>
            <CardDescription>Eventos com presença confirmada</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={seusAtivosCarouselRef}
              onScroll={() => atualizarAtivoAtual(seusAtivosCarouselRef, setSeuAtivoAtual)}
              className="scrollbar-none-mobile flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 md:block md:max-h-[13.5rem] md:space-y-3 md:overflow-x-visible md:overflow-y-auto md:pr-2"
            >
              {seusAtivos.map((atividade) => (
                <AtivoCard
                  key={atividade.id}
                  {...atividade}
                  onConfirmar={() => alternarPresencaMutation.mutate(atividade)}
                  confirmando={alternarPresencaMutation.variables?.id === atividade.id && alternarPresencaMutation.isPending}
                  confirmado={atividade.confirmadoPeloUsuario}
                  tone="secondary"
                />
              ))}
              {seusAtivos.length === 0 && (
                <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                  Confirme presença em um ativo para acompanhar ele por aqui.
                </div>
              )}
            </div>

            {seusAtivos.length > 0 && (
              <div className="mt-3 flex justify-center gap-2 md:hidden">
                {seusAtivos.map((atividade, index) => (
                  <button
                    key={atividade.id}
                    type="button"
                    onClick={() => rolarParaAtivo(seusAtivosCarouselRef, setSeuAtivoAtual, index)}
                    className={`h-2 rounded-full transition-all ${
                      seuAtivoAtual === index ? 'w-6 bg-secondary' : 'w-2 bg-muted-foreground/35'
                    }`}
                    aria-label={`Ir para ${atividade.nome}`}
                    aria-current={seuAtivoAtual === index}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Button
        asChild
        size="icon"
        className="group fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-gradient-primary shadow-xl shadow-primary/25 hover:brightness-110 md:bottom-8 md:right-8"
        aria-label="Criar ativo"
      >
        <Link to="/agendar">
          <Plus className="h-6 w-6" />
          <span className="pointer-events-none absolute bottom-16 right-0 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            criar ativo
          </span>
        </Link>
      </Button>
    </div>
  );
}
