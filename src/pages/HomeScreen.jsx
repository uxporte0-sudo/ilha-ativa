import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowRight, MapPin, Sparkles, Plus } from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import AtivoHomeCard from '@/components/product/AtivoHomeCard';
import LocalCard from '@/components/product/LocalCard';
import LocalFloatingWindow from '@/components/local/LocalFloatingWindow';
import AtivoFloatingWindow from '@/components/ativo/AtivoFloatingWindow';
import PromoCarousel from '@/components/product/PromoCarousel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AtivoService } from '@/domain/ativo/service';
import { LocalService } from '@/domain/local/service';
import { ParticipacaoService } from '@/domain/participacao/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { SessionService } from '@/domain/user/sessionService';

function byStartDate(left, right) { return new Date(left.dataHoraInicio).getTime() - new Date(right.dataHoraInicio).getTime(); }
function isDiscoverableAtivo(ativo) { return ['publicado', 'confirmado'].includes(ativo.status); }
function isUpcomingAtivo(ativo) { return isDiscoverableAtivo(ativo) && new Date(ativo.dataHoraInicio).getTime() >= Date.now(); }
function normalize(value) { return String(value || '').trim().toLowerCase(); }
function matchesTerm(ativo, local, termo) {
  const value = normalize(termo);
  if (!value) return true;
  return [ativo.titulo, ativo.descricao, ativo.modalidade, local?.nome, local?.bairro, local?.categoria].map(normalize).some((field) => field.includes(value));
}

function SectionHeader({ title, actionTo, actionLabel = 'Ver todos' }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-bold leading-6 text-text-primary">{title}</h2>
      {actionTo ? (
        <Button asChild variant="link" className="shrink-0 text-xs font-bold">
          <Link to={actionTo}>{actionLabel}<ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      ) : null}
    </div>
  );
}

function EmptySection({ icon: Icon, message, ctaLabel = 'Criar', ctaTo = '/ativos/novo' }) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-card)] bg-container-secondary/50 border border-borderSemantic-subtle px-3 py-3">
      <Icon className="h-5 w-5 shrink-0 text-text-tertiary" />
      <p className="flex-1 text-sm text-text-secondary">{message}</p>
      <Button asChild variant="default" size="sm" className="shrink-0 h-7 px-3 text-xs font-semibold">
        <Link to={ctaTo} className="gap-1">
          {ctaLabel}
          <Plus className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}

function HorizontalList({ children }) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-5 px-5">
      {children}
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
          <div className="flex gap-3">
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
        <p className="mb-4 text-sm leading-6 text-text-secondary">Os dados oficiais nao responderam agora. Tente recarregar a descoberta.</p>
        <div className="flex flex-col gap-2">
          <Button onClick={onRetry}>Tentar novamente</Button>
          <Button asChild variant="outline"><Link to="/">Recarregar</Link></Button>
        </div>
      </div>
    </AppScreen>
  );
}

function AtivosSection({ title, ativos, locaisById, participacoesByAtivo, emptyMessage = 'Nenhum ativo encontrado', ctaLabel = 'Criar', onOpenAtivo }) {
  return (
    <section className="space-y-3">
      <SectionHeader title={title} actionTo="/ativos" />
      {ativos.length > 0 ? (
        <HorizontalList>
          {ativos.map((ativo) => (
            <AtivoHomeCard
              key={ativo.id}
              ativo={ativo}
              local={locaisById.get(ativo.localId)}
              participacao={participacoesByAtivo.get(ativo.id)}
              className="w-[310px] shrink-0"
              onOpen={onOpenAtivo}
            />
          ))}
        </HorizontalList>
      ) : (
        <EmptySection 
          icon={MapPin} 
          message={emptyMessage} 
          ctaLabel={ctaLabel}
        />
      )}
    </section>
  );
}

function LocaisSection({ locais, ativos, onOpenLocal }) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Lugares baseados no seu interesse" actionTo="/mapa" />
      {locais.length > 0 ? (
        <HorizontalList>
          {locais.map((local) => {
            const localAtivos = ativos.filter((a) => a.localId === local.id);
            return (
              <LocalCard
                key={local.id}
                local={local}
                ativos={localAtivos}
                onOpen={onOpenLocal}
                className="w-[220px] shrink-0"
              />
            );
          })}
        </HorizontalList>
      ) : (
        <EmptySection 
          icon={Sparkles} 
          message="Nenhum lugar encontrado no momento"
          ctaLabel="Explorar"
          ctaTo="/mapa"
        />
      )}
    </section>
  );
}

export default function HomeScreen() {
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [selectedAtivoId, setSelectedAtivoId] = useState(null);
  const sessionQuery = useQuery({ queryKey: assertOfficialQueryKey(queryKeys.user.current()), queryFn: () => SessionService.getSession() });
  const ativosQuery = useQuery({ queryKey: assertOfficialQueryKey(queryKeys.ativos.all()), queryFn: () => AtivoService.list() });
  const locaisQuery = useQuery({ queryKey: assertOfficialQueryKey(queryKeys.locais.trending()), queryFn: () => LocalService.listTrending(6) });
  const participacoesQuery = useQuery({ queryKey: assertOfficialQueryKey(queryKeys.participacoes.byUser(sessionQuery.data?.user?.id ?? 'aguardando-user')), queryFn: () => ParticipacaoService.listByUser(sessionQuery.data.user.id), enabled: Boolean(sessionQuery.data?.user?.id) });

  const isLoading = sessionQuery.isLoading || ativosQuery.isLoading || locaisQuery.isLoading || participacoesQuery.isLoading;
  const hasError = sessionQuery.isError || ativosQuery.isError || locaisQuery.isError || participacoesQuery.isError;
  const user = sessionQuery.data?.user;
  const ativos = ativosQuery.data ?? [];
  const locais = locaisQuery.data ?? [];
  const participacoesUsuario = participacoesQuery.data ?? [];

  const viewModel = useMemo(() => {
    const locaisById = new Map(locais.map((local) => [local.id, local]));
    const participacoesByAtivo = new Map(participacoesUsuario.map((p) => [p.ativoId, p]));
    const afterStatus = ativos.filter((a) => isDiscoverableAtivo(a));
    const afterDate = afterStatus.filter((a) => new Date(a.dataHoraInicio).getTime() >= Date.now());
    const proximosAtivos = afterDate.sort(byStartDate).slice(0, 6);
    const preferencias = new Set(user?.preferenciasEsportivas ?? []);
    const ativosRecomendados = proximosAtivos.filter((a) => preferencias.has(a.modalidade)).slice(0, 6);
    return { locaisById, participacoesByAtivo, proximosAtivos, ativosRecomendados, locaisFiltrados: locais };
  }, [ativos, locais, participacoesUsuario, user?.preferenciasEsportivas]);

  const handleOpenLocal = useCallback((local) => { setSelectedLocal(local); }, []);
  const handleCloseLocal = useCallback(() => { setSelectedLocal(null); }, []);
  const handleOpenAtivo = useCallback((ativo) => {
    console.log('[ATIVO_OPEN] handleOpenAtivo', { screen: 'HomeScreen', id: ativo.id, ativo });
    setSelectedAtivoId(ativo.id);
    console.log('[ATIVO_OPEN] selectedAtivoId updated', { value: ativo.id });
  }, []);
  const handleCloseAtivo = useCallback(() => { setSelectedAtivoId(null); }, []);

  if (isLoading) return <HomeLoading />;
  if (hasError) return <HomeError onRetry={() => { sessionQuery.refetch(); ativosQuery.refetch(); locaisQuery.refetch(); participacoesQuery.refetch(); }} />;

  return (
    <AppScreen variant="warm">
      <PromoCarousel />
      <AtivosSection
        title="Ativos perto de voce"
        ativos={viewModel.proximosAtivos}
        locaisById={viewModel.locaisById}
        participacoesByAtivo={viewModel.participacoesByAtivo}
        emptyMessage="Nenhum ativo proximo de voce no momento"
        ctaLabel="Criar"
        onOpenAtivo={handleOpenAtivo}
      />
      <AtivosSection
        title="Ativos da sua comunidade"
        ativos={viewModel.ativosRecomendados}
        locaisById={viewModel.locaisById}
        participacoesByAtivo={viewModel.participacoesByAtivo}
        emptyMessage="Nenhum ativo baseado nos seus interesses"
        ctaLabel="Criar"
        onOpenAtivo={handleOpenAtivo}
      />
      <LocaisSection
        locais={viewModel.locaisFiltrados}
        ativos={ativos}
        onOpenLocal={handleOpenLocal}
      />
      {selectedLocal && (
        <LocalFloatingWindow
          local={selectedLocal}
          onClose={handleCloseLocal}
        />
      )}
      {selectedAtivoId && (
        <AtivoFloatingWindow
          ativoId={selectedAtivoId}
          onClose={handleCloseAtivo}
        />
      )}
    </AppScreen>
  );
}