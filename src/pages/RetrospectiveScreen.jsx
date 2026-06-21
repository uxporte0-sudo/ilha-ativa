import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Clock3,
  History,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
} from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LocalService } from '@/domain/local/service';
import { AgendaService } from '@/domain/participacao/agendaService';
import { ParticipacaoService } from '@/domain/participacao/service';
import { RetrospectivaService } from '@/domain/retrospectiva/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { SessionService } from '@/domain/user/sessionService';
import { cn } from '@/lib/utils';

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function toPeriodKey(value) {
  return value.toISOString();
}

function inPeriod(isoDate, periodStart, periodEnd) {
  const time = new Date(isoDate).getTime();
  return time >= new Date(periodStart).getTime() && time <= new Date(periodEnd).getTime();
}

function formatMonth(value) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function formatHours(value) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value);
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'IA';
}

function formatLabel(value) {
  return String(value || 'sem registro').replace(/-/g, ' ').replace(/_/g, ' ');
}

function countBy(values) {
  return values.reduce((counts, value) => {
    if (!value) return counts;
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function topEntry(counts, fallback = 'Sem historico') {
  const entries = Object.entries(counts).sort((left, right) => right[1] - left[1]);
  if (!entries[0]) return { label: fallback, value: 0 };
  return { label: entries[0][0], value: entries[0][1] };
}

function buildBreakdown(counts, labelFor = (value) => value) {
  const max = Math.max(1, ...Object.values(counts));
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .map(([key, value]) => ({
      key,
      label: labelFor(key),
      value,
      percentage: Math.round((value / max) * 100),
    }));
}

function getDurationInHours(ativo) {
  const startsAt = new Date(ativo.dataHoraInicio).getTime();
  const endsAt = new Date(ativo.dataHoraFim || ativo.dataHoraInicio).getTime();
  return Math.max(0, (endsAt - startsAt) / 36e5);
}

function buildPeriodOptions(referenceDate) {
  const current = startOfMonth(referenceDate);
  return [0, -1, -2].map((offset) => {
    const month = addMonths(current, offset);
    return {
      key: toPeriodKey(month),
      label: offset === 0 ? 'Este mes' : formatMonth(month),
      periodoInicio: startOfMonth(month).toISOString(),
      periodoFim: endOfMonth(month).toISOString(),
      month,
    };
  });
}

function RetrospectiveLoading() {
  return (
    <AppScreen className="gap-5" variant="warm">
      <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-[var(--radius-card)]" />
        <Skeleton className="h-24 rounded-[var(--radius-card)]" />
        <Skeleton className="h-24 rounded-[var(--radius-card)]" />
        <Skeleton className="h-24 rounded-[var(--radius-card)]" />
      </div>
      <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-56 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

function RetrospectiveError({ onRetry }) {
  return (
    <AppScreen variant="warm">
      <div className="rounded-[var(--radius-card)] border border-error/20 bg-container-secondary p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-error">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold text-text-primary">Nao foi possivel montar a Retrospectiva</h1>
        </div>
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          Os dados oficiais de sessao, participacao, agenda ou locais nao responderam agora.
        </p>
        <Button onClick={onRetry}>Tentar novamente</Button>
      </div>
    </AppScreen>
  );
}

function RetrospectiveEmpty({ periodLabel }) {
  return (
    <AppScreen variant="warm">
      <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-5 text-center shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
          <History className="h-6 w-6" />
        </div>
        <h1 className="mt-3 text-xl font-bold text-text-primary">Sem participacoes concluidas</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {periodLabel} ainda nao tem Ativos com participacao concluida. Quando voce participar de um Ativo realizado, ele aparece aqui.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link to="/agenda">
            <CalendarDays className="h-4 w-4" />
            Abrir Agenda
          </Link>
        </Button>
      </section>
    </AppScreen>
  );
}

function RetrospectiveHero({ user, periodLabel, sharingEnabled }) {
  return (
    <header className="rounded-[var(--radius-card)] bg-surface-inverse p-5 text-text-inverse shadow-card">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-container-secondary/40">
          {user.foto ? <AvatarImage src={user.foto} alt={user.nome} /> : null}
          <AvatarFallback className="text-lg">{getInitials(user.nome)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Badge variant="secondary">Retrospectiva</Badge>
          <h1 className="mt-3 text-2xl font-bold leading-8">Sua memoria em movimento</h1>
          <p className="mt-1 text-sm leading-5 text-text-inverse/80">
            {user.nome}, este e o resumo de {periodLabel}.
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-card)] bg-container-secondary/10 p-3 text-sm text-text-inverse/85">
        <ShieldCheck className="h-4 w-4 text-brand-secondary" />
        {sharingEnabled ? 'Compartilhamento permitido nas preferencias.' : 'Compartilhamento bloqueado nas preferencias.'}
      </div>
    </header>
  );
}

function PeriodSelector({ options, activeKey, onChange }) {
  return (
    <section className="flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => {
        const active = option.key === activeKey;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={cn(
              'min-h-10 shrink-0 rounded-[var(--radius-control)] border px-4 text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-interaction-focus',
              active ? 'border-brand-primary bg-brand-primary text-text-inverse' : 'border-borderSemantic-subtle bg-container-secondary text-text-primary'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </section>
  );
}

function SummaryTile({ icon: Icon, label, value, tone = 'default' }) {
  const toneClass = {
    default: 'bg-container-secondary',
    warm: 'bg-container-primary',
    accent: 'bg-container-accent-strong',
    teal: 'bg-container-secondary-strong',
  }[tone];

  return (
    <div className={cn('min-h-24 rounded-[var(--radius-card)] border border-borderSemantic-subtle p-4 shadow-card', toneClass)}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-2xl font-bold text-text-primary">{value}</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-5 text-text-secondary">{label}</p>
    </div>
  );
}

function SummarySection({ summary }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-text-primary">Resumo geral</h2>
        <Badge variant="outline">{formatHours(summary.horasAtivas)} h</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SummaryTile icon={Trophy} label="Ativos realizados" value={summary.ativosRealizados} tone="accent" />
        <SummaryTile icon={Activity} label="Participacoes" value={summary.participacoesConcluidas} tone="teal" />
        <SummaryTile icon={Sparkles} label="Modalidades" value={summary.modalidadesPraticadas} tone="warm" />
        <SummaryTile icon={MapPin} label="Locais visitados" value={summary.locaisVisitados} />
      </div>
    </section>
  );
}

function HighlightsSection({ highlights }) {
  const cards = [
    { label: 'Modalidade favorita', value: formatLabel(highlights.modalidadeFavorita.label), meta: `${highlights.modalidadeFavorita.value} participacao`, icon: Sparkles },
    { label: 'Local mais visitado', value: highlights.localMaisVisitado.label, meta: `${highlights.localMaisVisitado.value} visita`, icon: MapPin },
    { label: 'Periodo mais ativo', value: highlights.periodoMaisAtivo.label, meta: `${highlights.periodoMaisAtivo.value} participacao`, icon: CalendarDays },
  ];

  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <h2 className="text-xl font-bold text-text-primary">Destaques</h2>
      <div className="mt-4 grid gap-3">
        {cards.map((card) => (
          <div key={card.label} className="flex items-center gap-3 rounded-[var(--radius-card)] bg-container-primary p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
              <card.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase text-text-tertiary">{card.label}</p>
              <p className="mt-1 break-words text-sm font-bold capitalize text-text-primary">{card.value}</p>
            </div>
            <Badge variant="secondary">{card.meta}</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineSection({ items, localNameById }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-text-primary">Linha do tempo</h2>
        <Badge variant="outline">{items.length}</Badge>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.ativo.id}
            to={`/ativos/${item.ativo.id}`}
            className="block rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-interaction-focus"
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-container-secondary-strong text-brand-primary">
                <Trophy className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">participou</Badge>
                  <Badge variant="secondary">{formatLabel(item.ativo.modalidade)}</Badge>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-6 text-text-primary">{item.ativo.titulo}</h3>
                <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-text-secondary">
                  <CalendarDays className="h-4 w-4 text-text-tertiary" />
                  {formatDate(item.ativo.dataHoraInicio)}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-text-secondary">
                  <MapPin className="h-4 w-4 text-text-tertiary" />
                  {localNameById.get(item.ativo.localId) ?? formatLabel(item.ativo.localId)}
                </p>
              </div>
              <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-text-tertiary" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BreakdownSection({ title, items }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <h2 className="text-xl font-bold text-text-primary">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item.key}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-bold capitalize text-text-primary">{item.label}</span>
              <Badge variant="secondary">{item.value}</Badge>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-container-primary">
              <div className="h-full rounded-full bg-brand-primary" style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FrequencySection({ frequency }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-accent-strong p-4 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-container-secondary text-brand-primary">
          <Clock3 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Frequencia</h2>
          <p className="mt-1 text-sm leading-5 text-text-secondary">
            {frequency.label}
          </p>
        </div>
      </div>
    </section>
  );
}

function buildViewModel({ retrospectiva, participacoes, agenda, locais }) {
  const localNameById = new Map(locais.map((local) => [local.id, local.nome]));
  const completedParticipations = participacoes.filter(
    (participacao) => participacao.status === 'participou'
  );
  const completedItems = (agenda.items ?? [])
    .filter((item) => item.participacao?.status === 'participou')
    .filter((item) => inPeriod(item.ativo.dataHoraInicio, retrospectiva.periodoInicio, retrospectiva.periodoFim))
    .sort((left, right) => new Date(left.ativo.dataHoraInicio).getTime() - new Date(right.ativo.dataHoraInicio).getTime());

  const modalidadeCounts = countBy(completedItems.map((item) => item.ativo.modalidade));
  const localCounts = countBy(completedItems.map((item) => item.ativo.localId));
  const monthCounts = countBy(completedItems.map((item) => formatMonth(new Date(item.ativo.dataHoraInicio))));
  const localTop = topEntry(localCounts);
  const periodDays = Math.max(1, Math.ceil((new Date(retrospectiva.periodoFim).getTime() - new Date(retrospectiva.periodoInicio).getTime()) / 864e5));
  const periodWeeks = Math.max(1, Math.ceil(periodDays / 7));
  const average = completedItems.length / periodWeeks;

  return {
    localNameById,
    summary: {
      ativosRealizados: retrospectiva.ativosParticipados.length,
      participacoesConcluidas: completedParticipations.filter((participacao) => {
        const item = completedItems.find((agendaItem) => agendaItem.participacao?.id === participacao.id);
        return Boolean(item);
      }).length,
      modalidadesPraticadas: retrospectiva.modalidadesPraticadas.length,
      locaisVisitados: retrospectiva.locaisVisitados.length,
      horasAtivas: completedItems.reduce((total, item) => total + getDurationInHours(item.ativo), 0) || retrospectiva.horasAtivas,
    },
    highlights: {
      modalidadeFavorita: topEntry(modalidadeCounts),
      localMaisVisitado: {
        label: localNameById.get(localTop.label) ?? formatLabel(localTop.label),
        value: localTop.value,
      },
      periodoMaisAtivo: topEntry(monthCounts),
    },
    timeline: completedItems,
    frequency: {
      value: average,
      label: `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(average)} participacao por semana neste periodo.`,
    },
    byModalidade: buildBreakdown(modalidadeCounts, formatLabel),
    byLocal: buildBreakdown(localCounts, (localId) => localNameById.get(localId) ?? formatLabel(localId)),
  };
}

export default function RetrospectiveScreen() {
  const referenceDate = useMemo(() => new Date(), []);
  const periodOptions = useMemo(() => buildPeriodOptions(referenceDate), [referenceDate]);
  const [activePeriodKey, setActivePeriodKey] = useState(periodOptions[0].key);
  const activePeriod = periodOptions.find((option) => option.key === activePeriodKey) ?? periodOptions[0];
  const periodLabel = formatMonth(activePeriod.month);

  const sessionQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.current()),
    queryFn: () => SessionService.getSession(),
  });

  const user = sessionQuery.data?.user;
  const retrospectivaQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.retrospectiva.byUserAndPeriod(user?.id ?? 'aguardando-user', activePeriod.periodoInicio, activePeriod.periodoFim)),
    queryFn: () => RetrospectivaService.calculateForUser(user.id, activePeriod.periodoInicio, activePeriod.periodoFim),
    enabled: Boolean(user?.id),
  });

  const participacoesQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.participacoes.byUser(user?.id ?? 'aguardando-user')),
    queryFn: () => ParticipacaoService.listByUser(user.id),
    enabled: Boolean(user?.id),
  });

  const agendaQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.agenda.byUser(user?.id ?? 'aguardando-user', {
      scope: 'retrospective',
      periodoInicio: activePeriod.periodoInicio,
      periodoFim: activePeriod.periodoFim,
    })),
    queryFn: () => AgendaService.getAgendaProjection(user.id, {
      periodoInicio: activePeriod.periodoInicio,
      periodoFim: activePeriod.periodoFim,
      referenceDate,
    }),
    enabled: Boolean(user?.id),
  });

  const locaisQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.locais.all()),
    queryFn: () => LocalService.list(),
  });

  if (sessionQuery.isLoading || retrospectivaQuery.isLoading || participacoesQuery.isLoading || agendaQuery.isLoading || locaisQuery.isLoading) {
    return <RetrospectiveLoading />;
  }

  if (sessionQuery.isError || retrospectivaQuery.isError || participacoesQuery.isError || agendaQuery.isError || locaisQuery.isError) {
    return (
      <RetrospectiveError
        onRetry={() => {
          sessionQuery.refetch();
          retrospectivaQuery.refetch();
          participacoesQuery.refetch();
          agendaQuery.refetch();
          locaisQuery.refetch();
        }}
      />
    );
  }

  const retrospectiva = retrospectivaQuery.data;
  if (!user?.id || !retrospectiva || retrospectiva.ativosParticipados.length === 0) {
    return <RetrospectiveEmpty periodLabel={periodLabel} />;
  }

  const viewModel = buildViewModel({
    retrospectiva,
    participacoes: participacoesQuery.data ?? [],
    agenda: agendaQuery.data ?? {},
    locais: locaisQuery.data ?? [],
  });
  const sharingEnabled = Boolean(user.configuracoesPrivacidade?.compartilharRetrospectiva);

  return (
    <AppScreen className="gap-5" variant="warm">
      <RetrospectiveHero user={user} periodLabel={periodLabel} sharingEnabled={sharingEnabled} />
      <PeriodSelector options={periodOptions} activeKey={activePeriodKey} onChange={setActivePeriodKey} />
      <SummarySection summary={viewModel.summary} />
      <HighlightsSection highlights={viewModel.highlights} />
      <FrequencySection frequency={viewModel.frequency} />
      <BreakdownSection title="Participacao por modalidade" items={viewModel.byModalidade} />
      <BreakdownSection title="Participacao por local" items={viewModel.byLocal} />
      <TimelineSection items={viewModel.timeline} localNameById={viewModel.localNameById} />
      <Button asChild variant="outline" className="w-full">
        <Link to="/conta">
          <UserRound className="h-4 w-4" />
          Abrir Conta
        </Link>
      </Button>
    </AppScreen>
  );
}
