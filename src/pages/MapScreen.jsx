import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Layers3, List, LocateFixed, Map as MapIcon, MapPin, Plus, SlidersHorizontal } from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import AtivoHomeCard from '@/components/product/AtivoHomeCard';
import LocalCard from '@/components/product/LocalCard';
import SearchField from '@/components/product/SearchField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AtivoService } from '@/domain/ativo/service';
import { LocalService } from '@/domain/local/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { cn } from '@/lib/utils';

console.log("MapScreen renderizado");

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function formatLabel(value, fallback = 'Todos') {
  if (!value) return fallback;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isDiscoverableAtivo(ativo) {
  return ['publicado', 'confirmado'].includes(ativo.status);
}

function matchesAtivoTerm(ativo, local, termoBusca) {
  const term = normalize(termoBusca);
  if (!term) return true;

  return [ativo.titulo, ativo.descricao, ativo.modalidade, local?.nome, local?.bairro]
    .map(normalize)
    .some((field) => field.includes(term));
}

function buildLocalBounds(locais) {
  const latitudes = locais.map((local) => local.latitude);
  const longitudes = locais.map((local) => local.longitude);

  return {
    minLat: Math.min(...latitudes),
    maxLat: Math.max(...latitudes),
    minLng: Math.min(...longitudes),
    maxLng: Math.max(...longitudes),
  };
}

function getMarkerPosition(local, bounds) {
  const latRange = bounds.maxLat - bounds.minLat || 1;
  const lngRange = bounds.maxLng - bounds.minLng || 1;
  const top = 12 + ((bounds.maxLat - local.latitude) / latRange) * 72;
  const left = 12 + ((local.longitude - bounds.minLng) / lngRange) * 72;

  return { top: `${top}%`, left: `${left}%` };
}

function MapLoading() {
  return (
    <AppScreen className="gap-5" variant="warm">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-12 w-full rounded-[var(--radius-control)]" />
      <Skeleton className="h-[360px] w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-28 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

function MapError({ onRetry }) {
  return (
    <AppScreen variant="warm">
      <div className="rounded-[var(--radius-card)] border border-error/20 bg-container-secondary p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-error">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold text-text-primary">Nao foi possivel carregar o mapa</h1>
        </div>
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          Os dados oficiais de Locais e Ativos nao responderam agora.
        </p>
        <Button onClick={onRetry}>Tentar novamente</Button>
      </div>
    </AppScreen>
  );
}

function FilterRail({ categorias, categoriaSelecionada, onChange }) {
  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
      {['', ...categorias].map((categoria) => {
        const active = categoria === categoriaSelecionada;

        return (
          <Button
            key={categoria || 'todos'}
            type="button"
            size="sm"
            variant={active ? 'default' : 'outline'}
            onClick={() => onChange(categoria)}
            className="shrink-0"
          >
            {categoria ? null : <SlidersHorizontal className="h-4 w-4" />}
            {formatLabel(categoria)}
          </Button>
        );
      })}
    </div>
  );
}

function MapSurface({ locais, ativos, locaisById }) {
  const bounds = useMemo(() => buildLocalBounds(locais), [locais]);

  return (
    <section className="relative min-h-[360px] overflow-hidden rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-accent shadow-card">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.38)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.38)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(30,136,229,.20),transparent_24%),radial-gradient(circle_at_78%_70%,rgba(0,150,136,.24),transparent_26%)]" />
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-[var(--radius-control)] bg-container-primary/95 px-3 py-2 text-xs font-bold text-text-secondary shadow-sm">
        <LocateFixed className="h-4 w-4 text-brand-primary" />
        Ilhabela
      </div>

      {locais.map((local) => {
        const ativosCount = ativos.filter((ativo) => ativo.localId === local.id).length;

        return (
          <Link
            key={local.id}
            to={`/locais/${local.id}`}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus"
            style={getMarkerPosition(local, bounds)}
            aria-label={`Abrir ${local.nome}`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-container-primary bg-brand-primary text-text-inverse shadow-card">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="max-w-[112px] rounded-full bg-container-primary/95 px-2 py-1 text-center text-[11px] font-bold leading-3 text-text-primary shadow-sm">
              {local.nome}
            </span>
            {ativosCount > 0 ? (
              <span className="rounded-full bg-surface-inverse px-2 py-0.5 text-[10px] font-bold text-text-inverse">
                {ativosCount}
              </span>
            ) : null}
          </Link>
        );
      })}

      {ativos.slice(0, 6).map((ativo, index) => {
        const local = locaisById.get(ativo.localId);
        if (!local) return null;
        const basePosition = getMarkerPosition(local, bounds);

        return (
          <Link
            key={ativo.id}
            to={`/ativos/${ativo.id}`}
            className="absolute flex h-7 w-7 items-center justify-center rounded-full border-2 border-container-primary bg-brand-secondary text-[10px] font-black text-text-primary shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus"
            style={{
              top: `calc(${basePosition.top} + ${10 + (index % 3) * 8}px)`,
              left: `calc(${basePosition.left} + ${14 + (index % 2) * 10}px)`,
            }}
            aria-label={`Abrir ${ativo.titulo}`}
          >
            {index + 1}
          </Link>
        );
      })}
    </section>
  );
}

function EmptyMap({ onClear, hasFilters, selectedLocalId }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-5 text-center shadow-card">
      <h2 className="text-xl font-bold text-text-primary">Nada encontrado no mapa</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Limpe a busca ou crie um Ativo para movimentar este Local.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {hasFilters ? (
          <Button type="button" variant="outline" onClick={onClear}>
            Limpar filtros
          </Button>
        ) : null}
        <Button asChild>
          <Link to={selectedLocalId ? `/ativos/novo?localId=${selectedLocalId}` : '/ativos/novo'}>
            <Plus className="h-4 w-4" />
            Criar Ativo
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function MapScreen() {
  const [termoBusca, setTermoBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modoLista, setModoLista] = useState(false);

  const filtrosMapa = useMemo(() => ({ termo: termoBusca, categoria: categoria || undefined }), [categoria, termoBusca]);

  const locaisQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.locais.search(filtrosMapa)),
    queryFn: () => LocalService.search(filtrosMapa),
  });
  const ativosQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.ativos.all()),
    queryFn: () => AtivoService.list(),
  });

  const locais = locaisQuery.data ?? [];
  const ativos = ativosQuery.data ?? [];

  const viewModel = useMemo(() => {
    const locaisById = new Map(locais.map((local) => [local.id, local]));
    const localIds = new Set(locais.map((local) => local.id));
    const ativosProximos = ativos
      .filter(isDiscoverableAtivo)
      .filter((ativo) => localIds.has(ativo.localId))
      .filter((ativo) => matchesAtivoTerm(ativo, locaisById.get(ativo.localId), termoBusca));
    const categorias = Array.from(new Set(locais.map((local) => local.categoria).filter(Boolean))).sort();

    return { locaisById, ativosProximos, categorias };
  }, [ativos, locais, termoBusca]);

  if (locaisQuery.isLoading || ativosQuery.isLoading) return <MapLoading />;

  if (locaisQuery.isError || ativosQuery.isError) {
    return <MapError onRetry={() => { locaisQuery.refetch(); ativosQuery.refetch(); }} />;
  }

  const hasContent = locais.length > 0 || viewModel.ativosProximos.length > 0;
  const hasFilters = Boolean(termoBusca || categoria);
  const selectedLocalId = locais[0]?.id;

  return (
    <AppScreen className="gap-5" variant="warm">
      <header className="space-y-2">
        <Badge variant="accent">Mapa</Badge>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold leading-10 text-text-primary">Explore a ilha</h1>
            <p className="text-sm leading-5 text-text-secondary">
              Encontre Locais e Ativos oficiais perto de voce.
            </p>
          </div>
          <Button type="button" size="icon" variant="outline" onClick={() => setModoLista((value) => !value)} aria-label="Alternar mapa e lista">
            {modoLista ? <MapIcon className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <SearchField value={termoBusca} onChange={setTermoBusca} placeholder="Buscar Local, bairro ou Ativo" />
      <FilterRail categorias={viewModel.categorias} categoriaSelecionada={categoria} onChange={setCategoria} />

      {hasContent ? (
        modoLista ? (
          <section className="space-y-3">
            {locais.map((local) => (
              <LocalCard
                key={local.id}
                local={local}
                ativosCount={viewModel.ativosProximos.filter((ativo) => ativo.localId === local.id).length}
                className="w-full"
              />
            ))}
          </section>
        ) : (
          <MapSurface locais={locais} ativos={viewModel.ativosProximos} locaisById={viewModel.locaisById} />
        )
      ) : (
        <EmptyMap
          hasFilters={hasFilters}
          selectedLocalId={selectedLocalId}
          onClear={() => {
            setTermoBusca('');
            setCategoria('');
          }}
        />
      )}

      {hasContent ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold leading-6 text-text-primary">Ativos no mapa</h2>
            <Badge variant="outline" className={cn(viewModel.ativosProximos.length === 0 && 'text-text-disabled')}>
              <Layers3 className="mr-1 h-3.5 w-3.5" />
              {viewModel.ativosProximos.length}
            </Badge>
          </div>
          {viewModel.ativosProximos.length > 0 ? (
            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
              {viewModel.ativosProximos.map((ativo) => (
                <AtivoHomeCard key={ativo.id} ativo={ativo} local={viewModel.locaisById.get(ativo.localId)} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 text-sm leading-6 text-text-secondary shadow-card">
              Os Locais encontrados ainda nao possuem Ativos publicados.
            </div>
          )}
        </section>
      ) : null}
    </AppScreen>
  );
}
