import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, MapPin, Plus, ShieldCheck, Waves } from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import AtivoHomeCard from '@/components/product/AtivoHomeCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AtivoService } from '@/domain/ativo/service';
import { LocalService } from '@/domain/local/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';

function formatLabel(value) {
  if (!value) return 'Nao informado';
  return String(value).replaceAll('_', ' ');
}

function formatCategoria(value) {
  if (!value) return 'Local';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function LocalLoading() {
  return (
    <AppScreen className="gap-5" variant="warm">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-52 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-36 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

function LocalError({ onRetry }) {
  return (
    <AppScreen variant="warm">
      <div className="rounded-[var(--radius-card)] border border-error/20 bg-container-secondary p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-error">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold text-text-primary">Local nao encontrado</h1>
        </div>
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          Nao conseguimos carregar este Local a partir dos dados oficiais.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={onRetry}>Tentar novamente</Button>
          <Button asChild variant="outline">
            <Link to="/mapa">Voltar ao mapa</Link>
          </Button>
        </div>
      </div>
    </AppScreen>
  );
}

function LocalHero({ local }) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-accent shadow-card">
      <div className="relative min-h-[190px] p-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.35)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute right-5 top-5 flex h-16 w-16 items-center justify-center rounded-full bg-container-primary text-brand-primary shadow-sm">
          <Waves className="h-8 w-8" />
        </div>
        <div className="relative max-w-[260px]">
          <Badge variant="secondary">{formatCategoria(local.categoria)}</Badge>
          <h1 className="mt-4 text-3xl font-bold leading-9 text-text-primary">{local.nome}</h1>
          <p className="mt-3 flex items-start gap-2 text-sm font-medium leading-5 text-text-secondary">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" />
            <span>{[local.endereco, local.bairro, local.cidade].filter(Boolean).join(', ')}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function LocalInfoCard({ title, icon: Icon, items, emptyLabel }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-brand-primary" />
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      </div>
      {items?.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge key={item} variant="outline">
              {formatLabel(item)}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-text-secondary">{emptyLabel}</p>
      )}
    </section>
  );
}

function LocalAtivosSection({ local, ativos }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold leading-6 text-text-primary">Ativos neste Local</h2>
        <Badge variant="outline">{ativos.length}</Badge>
      </div>

      {ativos.length > 0 ? (
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
          {ativos.map((ativo) => (
            <AtivoHomeCard key={ativo.id} ativo={ativo} local={local} />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-5 text-center shadow-card">
          <h3 className="text-lg font-bold text-text-primary">Ainda nao ha Ativos futuros aqui</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Crie um Ativo contextualizado para este Local e convide a comunidade.
          </p>
          <Button asChild className="mt-4">
            <Link to={`/ativos/novo?localId=${local.id}`}>
              <Plus className="h-4 w-4" />
              Criar Ativo
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

export default function LocalScreen() {
  const { localId } = useParams();

  const localQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.locais.byId(localId)),
    queryFn: () => LocalService.getById(localId),
    enabled: Boolean(localId),
  });
  const ativosQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.ativos.byLocal(localId)),
    queryFn: () => AtivoService.listByLocal(localId),
    enabled: Boolean(localId),
  });

  if (localQuery.isLoading || ativosQuery.isLoading) return <LocalLoading />;

  if (localQuery.isError || ativosQuery.isError || !localQuery.data) {
    return <LocalError onRetry={() => { localQuery.refetch(); ativosQuery.refetch(); }} />;
  }

  const local = localQuery.data;
  const ativos = ativosQuery.data ?? [];

  return (
    <AppScreen className="gap-5" variant="warm">
      <Button asChild variant="link" className="w-fit text-sm font-bold">
        <Link to="/mapa">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao mapa
        </Link>
      </Button>

      <LocalHero local={local} />

      {local.descricao ? (
        <p className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 text-sm leading-6 text-text-secondary shadow-card">
          {local.descricao}
        </p>
      ) : null}

      <div className="grid gap-3">
        <LocalInfoCard
          title="Estrutura"
          icon={MapPin}
          items={local.estrutura}
          emptyLabel="Estrutura ainda nao informada para este Local."
        />
        <LocalInfoCard
          title="Acessibilidade"
          icon={ShieldCheck}
          items={local.acessibilidade}
          emptyLabel="Acessibilidade ainda nao informada para este Local."
        />
      </div>

      <section className="rounded-[var(--radius-card)] bg-surface-inverse p-5 text-text-inverse shadow-card">
        <h2 className="text-lg font-bold">Criar Ativo neste Local</h2>
        <p className="mt-1 text-sm leading-5 text-text-inverse/80">
          O Local sera enviado como contexto inicial do novo Ativo.
        </p>
        <Button asChild className="mt-4 w-full" variant="secondary">
          <Link to={`/ativos/novo?localId=${local.id}`}>
            <Plus className="h-4 w-4" />
            Criar Ativo
          </Link>
        </Button>
      </section>

      <section className="rounded-[var(--radius-card)] bg-surface-inverse p-5 text-text-inverse shadow-card">
        <h2 className="text-lg font-bold">Abrir Zeladoria</h2>
        <p className="mt-1 text-sm leading-5 text-text-inverse/80">
          Abrir formulário de Zeladoria para este Local.
        </p>
        <Button asChild className="mt-4 w-full" variant="secondary">
          <Link to={`/zeladoria/nova?localId=${local.id}`}>
            <Plus className="h-4 w-4" />
            Abrir Zeladoria
          </Link>
        </Button>
      </section>

      <LocalAtivosSection local={local} ativos={ativos} />
    </AppScreen>
  );
}
