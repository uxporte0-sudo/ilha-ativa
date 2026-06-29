import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, Sparkles } from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import AtivoHomeCard from '@/components/product/AtivoHomeCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AgendaService } from '@/domain/participacao/agendaService';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { SessionService } from '@/domain/user/sessionService';
import { cn } from '@/lib/utils';

function toDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildCalendarDays(monthDate) {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const firstGridDate = new Date(start);
  firstGridDate.setDate(start.getDate() - start.getDay());

  const days = [];
  for (let index = 0; index < 42; index += 1) {
    const date = new Date(firstGridDate);
    date.setDate(firstGridDate.getDate() + index);
    days.push({
      date,
      key: toDateKey(date),
      inMonth: date.getMonth() === monthDate.getMonth(),
      isToday: toDateKey(date) === toDateKey(new Date()),
    });
  }

  return days;
}

function formatMonth(value) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(value);
}

function formatSelectedDay(value) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(value);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getCreateAtivoPath(dateKey) {
  return `/ativos/novo?date=${dateKey}`;
}

function AgendaLoading() {
  return (
    <AppScreen className="gap-5" variant="warm">
      <Skeleton className="h-24 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-80 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

function AgendaError({ onRetry }) {
  return (
    <AppScreen variant="warm">
      <div className="rounded-[var(--radius-card)] border border-error/20 bg-surface-base p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-error">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold text-text-primary">Nao foi possivel carregar a Agenda</h1>
        </div>
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          Os dados oficiais de User, Ativos ou Participacoes nao responderam agora.
        </p>
        <Button onClick={onRetry}>Tentar novamente</Button>
      </div>
    </AppScreen>
  );
}

function AgendaEmpty({ selectedDateKey }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-surface-base p-5 text-center shadow-card">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
        <CalendarDays className="h-6 w-6" />
      </div>
      <h2 className="mt-3 text-xl font-bold text-text-primary">Agenda livre neste recorte</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Crie um Ativo com esta data para transformar o espaco vazio em movimento.
      </p>
      <Button asChild className="mt-4 w-full">
        <Link to={getCreateAtivoPath(selectedDateKey)}>
          <Plus className="h-4 w-4" />
          Criar Ativo nesta data
        </Link>
      </Button>
    </section>
  );
}

function CalendarMonth({ monthDate, selectedDateKey, markers, onSelectDay, onPreviousMonth, onNextMonth }) {
  const days = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-surface-base p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button type="button" size="icon" variant="outline" onClick={onPreviousMonth} aria-label="Mes anterior">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-bold capitalize text-text-primary">{formatMonth(monthDate)}</h2>
          <p className="text-xs font-semibold text-text-tertiary">Selecione um dia</p>
        </div>
        <Button type="button" size="icon" variant="outline" onClick={onNextMonth} aria-label="Proximo mes">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-text-tertiary">
        {weekDays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const selected = day.key === selectedDateKey;
          const markerCount = markers[day.key] ?? 0;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onSelectDay(day.date)}
              className={cn(
                'flex aspect-square min-h-10 flex-col items-center justify-center rounded-[var(--radius-card)] border text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-interaction-focus',
                selected ? 'border-brand-primary bg-brand-primary text-text-inverse' : 'border-transparent bg-container-primary text-text-primary hover:bg-brand-primary-subtle',
                !day.inMonth && 'text-text-disabled',
                day.isToday && !selected && 'border-brand-secondary'
              )}
            >
              <span>{day.date.getDate()}</span>
              <span className={cn('mt-1 h-1.5 w-1.5 rounded-full', markerCount ? 'bg-brand-secondary' : 'bg-transparent', selected && markerCount && 'bg-text-inverse')} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AgendaItem({ item }) {
  const { ativo, participacao, isOrganizador } = item;

  return (
    <Link
      to={`/ativos/${ativo.id}`}
      className="block rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-surface-base p-4 shadow-card outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-interaction-focus"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{ativo.modalidade}</Badge>
            {isOrganizador ? <Badge variant="accent">Organizado por voce</Badge> : null}
            {participacao ? <Badge variant={participacao.status === 'confirmado' ? 'success' : 'outline'}>{participacao.status}</Badge> : null}
          </div>
          <h3 className="mt-3 text-lg font-bold leading-6 text-text-primary">{ativo.titulo}</h3>
          {ativo.descricao ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-text-secondary">{ativo.descricao}</p> : null}
        </div>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-text-secondary">
        <Clock3 className="h-4 w-4 text-text-tertiary" />
        {formatDateTime(ativo.dataHoraInicio)}
      </p>
    </Link>
  );
}

function AgendaSection({ title, icon: Icon, items, emptyLabel, horizontal = false }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold leading-6 text-text-primary">
          <Icon className="h-5 w-5 text-brand-primary" />
          {title}
        </h2>
        <Badge variant="outline">{items.length}</Badge>
      </div>
      {items.length > 0 ? (
        horizontal ? (
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
            {items.map((item) => (
              <AtivoHomeCard
                key={item.ativo.id}
                ativo={item.ativo}
                participacao={item.participacao}
                participantes={item.participacao?.status === 'confirmado' ? 1 : 0}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => <AgendaItem key={item.ativo.id} item={item} />)}
          </div>
        )
      ) : (
        <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-surface-ba p-4 text-sm leading-6 text-text-secondary shadow-card">
          {emptyLabel}
        </div>
      )}
    </section>
  );
}

export default function AgendaScreen() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthDate, setMonthDate] = useState(startOfMonth(today));
  const selectedDateKey = toDateKey(selectedDate);
  const monthParams = useMemo(() => ({
    month: toDateKey(startOfMonth(monthDate)),
  }), [monthDate]);

  const sessionQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.current()),
    queryFn: () => SessionService.getSession(),
  });

  const user = sessionQuery.data?.user;
  const agendaQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.agenda.byUser(user?.id ?? 'aguardando-user', monthParams)),
    queryFn: () => AgendaService.getAgendaProjection(user.id, {
      periodoInicio: startOfMonth(monthDate).toISOString(),
      periodoFim: endOfMonth(monthDate).toISOString(),
      diaSelecionado: selectedDate.toISOString(),
      referenceDate: today,
    }),
    enabled: Boolean(user?.id),
  });

  if (sessionQuery.isLoading || agendaQuery.isLoading) return <AgendaLoading />;

  if (sessionQuery.isError || agendaQuery.isError) {
    return (
      <AgendaError
        onRetry={() => {
          sessionQuery.refetch();
          agendaQuery.refetch();
        }}
      />
    );
  }

  const agenda = agendaQuery.data ?? { markers: {}, ativosDoDia: [], proximosAtivos: [], historicoRecente: [], items: [] };
  const hasAnyContent = agenda.items.length > 0 || agenda.ativosDoDia.length > 0 || agenda.proximosAtivos.length > 0 || agenda.historicoRecente.length > 0;

  return (
    <AppScreen className="gap-5" variant="warm">

      <CalendarMonth
        monthDate={monthDate}
        selectedDateKey={selectedDateKey}
        markers={agenda.markers}
        onSelectDay={(date) => {
          setSelectedDate(date);
          setMonthDate(startOfMonth(date));
        }}
        onPreviousMonth={() => {
          const nextMonth = addMonths(monthDate, -1);
          setMonthDate(nextMonth);
          setSelectedDate(startOfMonth(nextMonth));
        }}
        onNextMonth={() => {
          const nextMonth = addMonths(monthDate, 1);
          setMonthDate(nextMonth);
          setSelectedDate(startOfMonth(nextMonth));
        }}
      />

      {!hasAnyContent ? <AgendaEmpty selectedDateKey={selectedDateKey} /> : null}

      <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-surface-base p-4 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold capitalize text-text-primary">{formatSelectedDay(selectedDate)}</h2>
          <Button asChild variant="outlined" size="sm" className="shrink-0">
            <Link to={getCreateAtivoPath(selectedDateKey)}>
              <Plus className="h-4 w-4" />
              Criar Ativo
            </Link>
          </Button>
        </div>
        <p className="mt-2 text-sm leading-5 text-text-secondary">
          Compromissos confirmados e Ativos organizados por voce nesta data.
        </p>
        {agenda.ativosDoDia.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {agenda.ativosDoDia.map((item) => <AgendaItem key={item.ativo.id} item={item} />)}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-5 text-text-secondary">Nenhum Ativo confirmado ou organizado nesta data.</p>
        )}
      </section>

      <AgendaSection
        title="Proximos Ativos"
        icon={Sparkles}
        items={agenda.proximosAtivos}
        emptyLabel="Nenhum Ativo futuro na sua Agenda deste mes."
        horizontal
      />

      
    </AppScreen>
  );
}
