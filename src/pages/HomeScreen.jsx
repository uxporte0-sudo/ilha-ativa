import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import CreateAtivoAction from '@/components/navigation/CreateAtivoAction';
import AtivoHomeCard from '@/components/product/AtivoHomeCard';
import LocalCard from '@/components/product/LocalCard';
import SearchField from '@/components/product/SearchField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AtivoService } from '@/domain/ativo/service';
import { LocalService } from '@/domain/local/service';
import { ParticipacaoService } from '@/domain/participacao/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { SessionService } from '@/domain/user/sessionService';

function byStartDate(left, right) {
  return new Date(left.dataHoraInicio).getTime() - new Date(right.dataHoraInicio).getTime();
}

function isDiscoverableAtivo(ativo) {
  return ['publicado', 'confirmado'].includes(ativo.status);
}

function isUpcomingAtivo(ativo) {
  return isDiscoverableAtivo(ativo) && new Date(ativo.dataHoraInicio).getTime() >= Date.now();
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function matchesTerm(ativo, local, termo) {
  const value = normalize(termo);
  if (!value) return true;

  return [ativo.titulo, ativo.descricao, ativo.modalidade, local?.nome, local?.bairro, local?.categoria]
    .map(normalize)
    .some((field) => field.includes(value));
}

function SectionHeader({ title, actionTo, actionLabel = 'Ver todos' }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-bold leading-6 text-text-primary">{title}</h2>
      {actionTo ? (
        <Button asChild variant="link" className="shrink-0 text-xs font-bold">
          <Link to={actionTo}>
            {actionLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

function HomeLoading() {
  return (
    <AppScreen className="gap-6" variant="warm">
      <div className="space-y-4">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-12 w-full rounded-[var(--radius-control)]" />
      </div>
      {[1, 2, 3].map((item) => (
        <section className="space-y-3" key={item}>
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-3 overflow-hidden">
            <Skeleton className="h-44 w-[310px] shrink-0 rounded-[var(--radius-card)]" />
            <Skeleton className="h-44 w-[220px] shrink-0 rounded-[var(--radius-card)]" />
          </div>
        </section>
      ))}
    </AppScreen>
  );
}

function HomeError({ onRetry }) {
  return (
    <AppScreen variant="warm">
      <div className="rounded-[var(--radius-card)] border border-error/20 bg-container-secondary p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-error">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold text-text-primary">Nao foi possivel carregar a Home</h1>
        </div>
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          Os dados oficiais nao responderam agora. Tente recarregar a descoberta.
        </p>
        <Button onClick={onRetry}>Tentar novamente</Button>
      </div>
    </AppScreen>
  );
}

function EmptyHome() {
  return (
    <AppScreen variant="warm">
      <HomeHeader userName="IlhAtiva" />
      <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-5 text-center shadow-card">
        <h2 className="text-xl font-bold text-text-primary">Ainda nao ha Ativos por aqui</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Crie a primeira oportunidade esportiva e convide a comunidade para participar.
        </p>
      </div>
      <CreateAtivoPanel />
    </AppScreen>
  );
}

function HomeHeader({ userName }) {
  return (
    <header className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-tertiary">IlhAtiva</p>
          <h1 className="mt-1 text-3xl font-bold leading-10 text-text-primary">
            Oi, {userName}
          </h1>
          <p className="mt-1 text-sm leading-5 text-text-secondary">
            Descubra Ativos, encontre Locais e movimente sua ilha.
          </p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-text-primary shadow-sm">
          <Sparkles className="h-6 w-6" />
        </span>
      </div>
    </header>
  );
}

function EmptyAtivosSection() {
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <p className="text-sm font-medium text-text-secondary">
        Nenhum Ativo encontrado
      </p>

      <Button asChild size="sm">
        <Link to="/ativos/novo">
          + Criar Ativo
        </Link>
      </Button>
    </div>
  );
}

function EmptyRecommendedCard() {
  return (
    <Link
      to="/ativos/novo"
      className="block transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-container-secondary-strong px-4 py-4 shadow-card">
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">
            Que tal criar um?
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            Experimente: Futebol, Basquete, Vôlei ou Trilha.
          </p>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
      </div>
    </Link>
  );
}

function AtivosSection({
  title,
  ativos,
  locaisById,
  participacoesByAtivo,
}) {
  return (
    <section className="space-y-3">
      <SectionHeader title={title} actionTo="/mapa" />

      {ativos.length === 0 ? (
        title === 'Baseado nos seus gostos' ? (
          <EmptyRecommendedCard />
        ) : (
          <EmptyAtivosSection />
        )
      ) : (
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
          {ativos.map((ativo) => (
            <AtivoHomeCard
              key={ativo.id}
              ativo={ativo}
              local={locaisById.get(ativo.localId)}
              participacao={participacoesByAtivo.get(ativo.id)}
              participantes={
                participacoesByAtivo.get(ativo.id) ? 1 : 0
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LocaisSection({ locais, ativos }) {
  if (locais.length === 0) return null;

  return (
    <section className="space-y-3">
      <SectionHeader title="Locais em alta" actionTo="/mapa" />
      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
        {locais.map((local) => (
          <LocalCard
            key={local.id}
            local={local}
            ativosCount={ativos.filter((ativo) => ativo.localId === local.id).length}
          />
        ))}
      </div>
    </section>
  );
}

function CreateAtivoPanel() {
  return (
    <section className="rounded-[var(--radius-card)] bg-container-secondary-strong px-5 pb-5 pt-10 text-text-inverse shadow-card">
      <div className="mb-2 flex justify-center">
        <CreateAtivoAction className="relative -mt-16" />
      </div>
      <div className="text-center">
        <h2 className="text-text-primary font-bold">Crie um Ativo agora</h2>
        <p className="mt-1 text-sm leading-5 text-text-secondary">
          Abra um convite, escolha um Local e chame pessoas para praticar com voce.
        </p>
      </div>
    </section>
  );
}

export default function HomeScreen() {
  const [termoBusca, setTermoBusca] = useState('');

  const sessionQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.current()),
    queryFn: () => SessionService.getSession(),
  });
  const ativosQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.ativos.all()),
    queryFn: () => AtivoService.list(),
  });
  const locaisQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.locais.trending()),
    queryFn: () => LocalService.listTrending(6),
  });
  const participacoesQuery = useQuery({
    queryKey: assertOfficialQueryKey(
      queryKeys.participacoes.byUser(sessionQuery.data?.user?.id ?? 'aguardando-user')
    ),
    queryFn: () => ParticipacaoService.listByUser(sessionQuery.data.user.id),
    enabled: Boolean(sessionQuery.data?.user?.id),
  });

  const isLoading =
    sessionQuery.isLoading ||
    ativosQuery.isLoading ||
    locaisQuery.isLoading ||
    participacoesQuery.isLoading;
  const hasError =
    sessionQuery.isError || ativosQuery.isError || locaisQuery.isError || participacoesQuery.isError;

  const user = sessionQuery.data?.user;
  const ativos = ativosQuery.data ?? [];
  const locais = locaisQuery.data ?? [];
  const participacoesUsuario = participacoesQuery.data ?? [];

  const viewModel = useMemo(() => {
    const locaisById = new Map(locais.map((local) => [local.id, local]));
    const participacoesByAtivo = new Map(
      participacoesUsuario.map((participacao) => [participacao.ativoId, participacao])
    );
    const proximosAtivos = ativos
      .filter((ativo) => isUpcomingAtivo(ativo))
      .filter((ativo) => matchesTerm(ativo, locaisById.get(ativo.localId), termoBusca))
      .sort(byStartDate)
      .slice(0, 6);
    const preferencias = new Set(user?.preferenciasEsportivas ?? []);
    const ativosRecomendados = proximosAtivos
      .filter((ativo) => preferencias.has(ativo.modalidade))
      .slice(0, 6);
    const locaisFiltrados = locais.filter((local) => {
      const value = normalize(termoBusca);
      if (!value) return true;
      return [local.nome, local.bairro, local.categoria, local.descricao].map(normalize).some((field) => field.includes(value));
    });

    return {
      locaisById,
      participacoesByAtivo,
      proximosAtivos,
      ativosRecomendados,
      locaisFiltrados,
    };
  }, [ativos, locais, participacoesUsuario, termoBusca, user?.preferenciasEsportivas]);

  if (isLoading) return <HomeLoading />;

  if (hasError) {
    return (
      <HomeError
        onRetry={() => {
          sessionQuery.refetch();
          ativosQuery.refetch();
          locaisQuery.refetch();
          participacoesQuery.refetch();
        }}
      />
    );
  }

  const hasContent =
    viewModel.proximosAtivos.length > 0 ||
    viewModel.ativosRecomendados.length > 0 ||
    viewModel.locaisFiltrados.length > 0;

  if (!hasContent && !termoBusca) return <EmptyHome />;

  return (
    <AppScreen variant="warm">
      <HomeHeader userName={user?.nome?.split(' ')[0] ?? 'Atleta'} />
      <SearchField value={termoBusca} onChange={setTermoBusca} />

      <div className="flex flex-wrap gap-2">
        {(user?.preferenciasEsportivas ?? []).slice(0, 4).map((preferencia) => (
          <Badge key={preferencia} variant="accent">
            {preferencia}
          </Badge>
        ))}
      </div>

      <AtivosSection
        title="Proximos de voce"
        ativos={viewModel.proximosAtivos}
        locaisById={viewModel.locaisById}
        participacoesByAtivo={viewModel.participacoesByAtivo}
      />

      <AtivosSection
        title="Baseado nos seus gostos"
        ativos={viewModel.ativosRecomendados}
        locaisById={viewModel.locaisById}
        participacoesByAtivo={viewModel.participacoesByAtivo}
      />

      <LocaisSection locais={viewModel.locaisFiltrados} ativos={ativos} />

      {hasContent ? null : (
        <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 text-sm leading-6 text-text-secondary shadow-card">
          Nenhum resultado encontrado para sua busca.
        </div>
      )}

      <CreateAtivoPanel />
    </AppScreen>
  );
}
