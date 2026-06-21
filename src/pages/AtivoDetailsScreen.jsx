import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Loader2,
  MapPin,
  ShieldCheck,
  UserRound,
  UsersRound,
  XCircle,
} from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AtivoService } from '@/domain/ativo/service';
import { LocalService } from '@/domain/local/service';
import { ParticipacaoService } from '@/domain/participacao/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { UserService } from '@/domain/user/service';
import { SessionService } from '@/domain/user/sessionService';
import { cn } from '@/lib/utils';

function formatLabel(value) {
  if (!value) return 'Nao informado';
  return String(value).replaceAll('_', ' ').replace(/^./, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return 'Data a confirmar';
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date(value));
}

function formatTimeRange(start, end) {
  if (!start || !end) return 'Horario a confirmar';
  const formatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
}

function getInitials(name) {
  return String(name ?? 'IA')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function AtivoDetailsLoading() {
  return (
    <AppScreen className="gap-5" variant="warm">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-64 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-52 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

function AtivoDetailsMessage({ title, description, onRetry, empty = false }) {
  return (
    <AppScreen variant="warm">
      <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-5 shadow-card">
        <div className={cn('mb-3 flex items-center gap-2', empty ? 'text-text-tertiary' : 'text-error')}>
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold text-text-primary">{title}</h1>
        </div>
        <p className="mb-4 text-sm leading-6 text-text-secondary">{description}</p>
        <div className="flex flex-col gap-2">
          {onRetry ? <Button onClick={onRetry}>Tentar novamente</Button> : null}
          <Button asChild variant="outline">
            <Link to="/">Voltar para Home</Link>
          </Button>
        </div>
      </div>
    </AppScreen>
  );
}

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-container-primary p-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-text-tertiary">
        <Icon className="h-4 w-4 text-brand-primary" />
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold leading-5 text-text-primary">{value}</p>
    </div>
  );
}

function AtivoHero({ ativo, local, organizador }) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-accent shadow-card">
      <div className="relative min-h-[260px] p-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.34)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.34)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="relative flex min-h-[220px] flex-col justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{formatLabel(ativo.modalidade)}</Badge>
            <Badge variant={ativo.status === 'cancelado' ? 'destructive' : 'outline'}>{formatLabel(ativo.status)}</Badge>
            <Badge variant="accent">{formatLabel(ativo.privacidade)}</Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold leading-10 text-text-primary">{ativo.titulo}</h1>
            <p className="text-sm leading-6 text-text-secondary">{ativo.descricao || 'Descricao ainda nao informada.'}</p>
          </div>

          <div className="flex items-center gap-3 rounded-[var(--radius-card)] bg-container-primary/90 p-3 shadow-sm">
            <Avatar>
              <AvatarImage src={organizador?.foto} alt={organizador?.nome} />
              <AvatarFallback>{getInitials(organizador?.nome)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold uppercase text-text-tertiary">Organizador</p>
              <p className="text-sm font-bold text-text-primary">{organizador?.nome ?? 'Organizador nao encontrado'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2 border-t border-borderSemantic-subtle bg-container-secondary p-4 sm:grid-cols-2">
        <InfoPill icon={MapPin} label="Local" value={local?.nome ?? 'Local a confirmar'} />
        <InfoPill icon={CalendarDays} label="Data" value={formatDate(ativo.dataHoraInicio)} />
        <InfoPill icon={Clock3} label="Horario" value={formatTimeRange(ativo.dataHoraInicio, ativo.dataHoraFim)} />
        <InfoPill icon={ShieldCheck} label="Nivel" value={formatLabel(ativo.nivelDificuldade)} />
      </div>
    </section>
  );
}

function ParticipacaoCard({ ativo, participacao, participantesConfirmados, actions, isMutating, onInterest, onConfirm, onCancel }) {
  const quorumLabel = `${participantesConfirmados}/${ativo.minimoParticipantes}+ confirmados`;

  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant={participacao ? 'accent' : 'outline'}>
            {participacao ? formatLabel(participacao.status) : 'Sem participacao'}
          </Badge>
          <h2 className="mt-3 text-xl font-bold text-text-primary">Participacao</h2>
          <p className="mt-1 text-sm leading-5 text-text-secondary">
            {participacao ? 'Seu vinculo com este Ativo esta registrado.' : 'Escolha como quer se envolver neste Ativo.'}
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
          <UsersRound className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm font-semibold text-text-secondary">
        <span>{quorumLabel}</span>
        <span>{ativo.maximoParticipantes ? `Limite de ${ativo.maximoParticipantes} participantes` : 'Sem limite maximo informado'}</span>
      </div>

      <div className="mt-4 grid gap-2">
        {actions.canDemonstrarInteresse ? (
          <Button type="button" variant="outline" disabled={isMutating} onClick={onInterest}>
            {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
            Demonstrar interesse
          </Button>
        ) : null}
        {actions.canConfirmar ? (
          <Button type="button" disabled={isMutating} onClick={onConfirm}>
            {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Confirmar participacao
          </Button>
        ) : null}
        {actions.canCancelar ? (
          <Button type="button" variant="destructive" disabled={isMutating} onClick={onCancel}>
            {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Cancelar participacao
          </Button>
        ) : null}
        {!actions.canDemonstrarInteresse && !actions.canConfirmar && !actions.canCancelar ? (
          <p className="rounded-[var(--radius-card)] bg-container-primary p-3 text-sm font-semibold leading-5 text-text-secondary">
            Nenhuma acao de Participacao esta disponivel para o estado atual deste Ativo.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ParticipantesSection({ participacoes }) {
  const ativas = participacoes.filter((participacao) => participacao.status !== 'cancelado');
  const confirmadas = participacoes.filter((participacao) => participacao.status === 'confirmado');
  const interessadas = participacoes.filter((participacao) => participacao.status === 'interessado');

  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Participantes</h2>
          <p className="text-sm leading-5 text-text-secondary">{ativas.length} vinculos ativos neste Ativo.</p>
        </div>
        <Badge variant="outline">{confirmadas.length} confirmados</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <InfoPill icon={CheckCircle2} label="Confirmados" value={String(confirmadas.length)} />
        <InfoPill icon={Heart} label="Interessados" value={String(interessadas.length)} />
      </div>

      {ativas.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {ativas.slice(0, 6).map((participacao) => (
            <div key={participacao.id} className="flex items-center justify-between rounded-[var(--radius-card)] bg-container-primary p-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <UserRound className="h-4 w-4 text-text-tertiary" />
                Participante
              </span>
              <Badge variant={participacao.status === 'confirmado' ? 'success' : 'accent'}>{formatLabel(participacao.status)}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-[var(--radius-card)] bg-container-primary p-3 text-sm leading-5 text-text-secondary">
          Ainda nao ha Participacoes ativas neste Ativo.
        </p>
      )}
    </section>
  );
}

function DetailsSection({ ativo, local }) {
  return (
    <section className="grid gap-3">
      <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
        <h2 className="text-xl font-bold text-text-primary">Recomendacoes</h2>
        {ativo.recomendacoes?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {ativo.recomendacoes.map((recomendacao) => (
              <Badge key={recomendacao} variant="outline">{recomendacao}</Badge>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-text-secondary">Nenhuma recomendacao informada.</p>
        )}
      </div>

      <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
        <h2 className="text-xl font-bold text-text-primary">Local</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {[local?.endereco, local?.bairro, local?.cidade].filter(Boolean).join(', ') || 'Endereco nao informado.'}
        </p>
        {local?.id ? (
          <Button asChild className="mt-4 w-full" variant="outline">
            <Link to={`/locais/${local.id}`}>
              <MapPin className="h-4 w-4" />
              Abrir Local
            </Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export default function AtivoDetailsScreen() {
  const { ativoId } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sessionQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.current()),
    queryFn: () => SessionService.getSession(),
  });
  const ativoQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.ativos.byId(ativoId)),
    queryFn: () => AtivoService.getById(ativoId),
    enabled: Boolean(ativoId),
  });

  const ativo = ativoQuery.data;
  const user = sessionQuery.data?.user;

  const localQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.locais.byId(ativo?.localId ?? 'aguardando-ativo')),
    queryFn: () => LocalService.getById(ativo.localId),
    enabled: Boolean(ativo?.localId),
  });
  const organizadorQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.byId(ativo?.organizadorId ?? 'aguardando-ativo')),
    queryFn: () => UserService.getById(ativo.organizadorId),
    enabled: Boolean(ativo?.organizadorId),
  });
  const participacoesQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.participacoes.byAtivo(ativoId)),
    queryFn: () => ParticipacaoService.listByAtivo(ativoId),
    enabled: Boolean(ativoId),
  });
  const participacaoUsuarioQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.participacoes.currentUserForAtivo(ativoId)),
    queryFn: () => ParticipacaoService.getActiveParticipation(user.id, ativoId),
    enabled: Boolean(user?.id && ativoId),
  });

  const activeParticipation = participacaoUsuarioQuery.data ?? null;
  const participationActions = useMemo(
    () => ParticipacaoService.getParticipationActions({ ativo, participacao: activeParticipation }),
    [ativo, activeParticipation]
  );

  const invalidateParticipationData = async () => {
    const invalidations = [
      queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.participacoes.all()) }),
      queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.participacoes.byAtivo(ativoId)) }),
      queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.participacoes.currentUserForAtivo(ativoId)) }),
      queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.ativos.byId(ativoId)) }),
      queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.ativos.all()) }),
    ];

    if (user?.id) {
      invalidations.push(
        queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.participacoes.byUser(user.id)) }),
        queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.agenda.byUser(user.id, { scope: 'future' })) })
      );
    }

    await Promise.all(invalidations);
  };

  const participationMutation = useMutation({
    mutationFn: async (action) => {
      if (action === 'interesse') return ParticipacaoService.demonstrarInteresse(user.id, ativoId, ativo);
      if (action === 'confirmar') return ParticipacaoService.confirmar(user.id, ativoId, ativo);
      return ParticipacaoService.cancelar(user.id, ativoId, ativo);
    },
    onSuccess: async (_, action) => {
      await invalidateParticipationData();
      toast({
        title: 'Participacao atualizada',
        description: action === 'cancelar' ? 'Seu vinculo foi cancelado.' : 'Seu vinculo foi salvo nos dados oficiais.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Participacao nao atualizada',
        description: error.message ?? 'Nao foi possivel concluir a acao.',
        variant: 'destructive',
      });
    },
  });

  const isLoading =
    sessionQuery.isLoading ||
    ativoQuery.isLoading ||
    localQuery.isLoading ||
    organizadorQuery.isLoading ||
    participacoesQuery.isLoading ||
    participacaoUsuarioQuery.isLoading;
  const hasError =
    sessionQuery.isError ||
    ativoQuery.isError ||
    localQuery.isError ||
    organizadorQuery.isError ||
    participacoesQuery.isError ||
    participacaoUsuarioQuery.isError;

  if (!ativoId) {
    return (
      <AtivoDetailsMessage
        empty
        title="Ativo nao informado"
        description="A rota de Detalhes precisa receber um identificador de Ativo."
      />
    );
  }

  if (isLoading) return <AtivoDetailsLoading />;

  if (hasError) {
    return (
      <AtivoDetailsMessage
        title="Nao foi possivel carregar o Ativo"
        description="Os dados oficiais de Ativo, Local, User ou Participacao nao responderam agora."
        onRetry={() => {
          sessionQuery.refetch();
          ativoQuery.refetch();
          localQuery.refetch();
          organizadorQuery.refetch();
          participacoesQuery.refetch();
          participacaoUsuarioQuery.refetch();
        }}
      />
    );
  }

  if (!ativo) {
    return (
      <AtivoDetailsMessage
        empty
        title="Ativo nao encontrado"
        description="Este Ativo nao existe na camada oficial de dados."
      />
    );
  }

  const participacoes = participacoesQuery.data ?? [];
  const participantesConfirmados = participacoes.filter((participacao) => participacao.status === 'confirmado').length;

  return (
    <AppScreen className="gap-5" variant="warm">
      <Button asChild variant="link" className="w-fit text-sm font-bold">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Home
        </Link>
      </Button>

      <AtivoHero ativo={ativo} local={localQuery.data} organizador={organizadorQuery.data} />

      <ParticipacaoCard
        ativo={ativo}
        participacao={activeParticipation}
        participantesConfirmados={participantesConfirmados}
        actions={participationActions}
        isMutating={participationMutation.isPending}
        onInterest={() => participationMutation.mutate('interesse')}
        onConfirm={() => participationMutation.mutate('confirmar')}
        onCancel={() => participationMutation.mutate('cancelar')}
      />

      <ParticipantesSection participacoes={participacoes} />
      <DetailsSection ativo={ativo} local={localQuery.data} />
    </AppScreen>
  );
}
