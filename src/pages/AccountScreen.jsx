import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  Bell,
  CalendarDays,
  ChevronRight,
  History,
  Lock,
  MapPin,
  Plus,
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
import { AgendaService } from '@/domain/participacao/agendaService';
import { ParticipacaoService } from '@/domain/participacao/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { SessionService } from '@/domain/user/sessionService';
import { cn } from '@/lib/utils';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'IA';
}

function formatPreference(value) {
  return String(value).replace(/_/g, ' ');
}

function preferenceLabel(enabled) {
  return enabled ? 'Ativo' : 'Inativo';
}

function AccountLoading() {
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
      <Skeleton className="h-48 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

function AccountError({ onRetry }) {
  return (
    <AppScreen variant="warm">
      <div className="rounded-[var(--radius-card)] border border-error/20 bg-container-secondary p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-error">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold text-text-primary">Nao foi possivel carregar sua Conta</h1>
        </div>
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          A sessao oficial, participacoes ou agenda nao responderam agora.
        </p>
        <Button onClick={onRetry}>Tentar novamente</Button>
      </div>
    </AppScreen>
  );
}

function AccountEmpty() {
  return (
    <AppScreen variant="warm">
      <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-5 text-center shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
          <UserRound className="h-6 w-6" />
        </div>
        <h1 className="mt-3 text-xl font-bold text-text-primary">Conta indisponivel</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          A sessao oficial nao retornou um User atual para consolidar.
        </p>
      </section>
    </AppScreen>
  );
}

function UserHero({ user }) {
  return (
    <header className="rounded-[var(--radius-card)] bg-surface-inverse p-5 text-text-inverse shadow-card">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-container-secondary/40">
          {user.foto ? <AvatarImage src={user.foto} alt={user.nome} /> : null}
          <AvatarFallback className="text-lg">{getInitials(user.nome)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Badge variant="secondary">Conta</Badge>
          <h1 className="mt-3 text-2xl font-bold leading-8">{user.nome}</h1>
          <p className="mt-1 break-words text-sm leading-5 text-text-inverse/80">{user.email}</p>
        </div>
      </div>

      {user.bio ? <p className="mt-4 text-sm leading-6 text-text-inverse/85">{user.bio}</p> : null}

      <div className="mt-4 grid gap-2 rounded-[var(--radius-card)] bg-container-secondary/10 p-3 text-sm">
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand-secondary" />
          Tela de consolidacao somente leitura nesta fase.
        </p>
        {user.telefone ? (
          <p className="text-text-inverse/75">Contato cadastrado: {user.telefone}</p>
        ) : null}
      </div>
    </header>
  );
}

function StatTile({ icon: Icon, label, value, tone = 'default' }) {
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

function StatisticsSection({ stats }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-text-primary">Estatisticas</h2>
        <Badge variant="outline">Oficial</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatTile icon={Trophy} label="Ativos criados" value={stats.ativosCriados} tone="accent" />
        <StatTile icon={CalendarDays} label="Confirmadas" value={stats.participacoesConfirmadas} tone="teal" />
        <StatTile icon={MapPin} label="Locais frequentados" value={stats.locaisFrequentados} tone="warm" />
        <StatTile icon={Sparkles} label="Proximos Ativos" value={stats.proximosAtivos} />
      </div>
    </section>
  );
}

function PreferencesSection({ user, session }) {
  const privacy = user.configuracoesPrivacidade ?? {};
  const notifications = user.configuracoesNotificacao ?? {};
  const preferences = user.preferenciasEsportivas ?? [];

  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-text-primary">Preferencias</h2>
        <Badge variant={session.preferenciasPendentes ? 'accent' : 'secondary'}>
          {session.preferenciasPendentes ? 'Pendentes' : 'Definidas'}
        </Badge>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase text-text-tertiary">Modalidades</p>
        {preferences.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.map((preference) => (
              <Badge key={preference} variant="secondary">{formatPreference(preference)}</Badge>
            ))}
          </div>
        ) : (
          <p className="mt-2 rounded-[var(--radius-card)] bg-container-primary p-3 text-sm text-text-secondary">
            Nenhuma modalidade definida.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        <PreferenceRow
          icon={Lock}
          label="Perfil publico"
          value={preferenceLabel(Boolean(privacy.perfilPublico))}
        />
        <PreferenceRow
          icon={History}
          label="Compartilhar retrospectiva"
          value={preferenceLabel(Boolean(privacy.compartilharRetrospectiva))}
        />
        <PreferenceRow
          icon={Bell}
          label="Lembrete de Ativo"
          value={preferenceLabel(Boolean(notifications.lembreteAtivo))}
        />
        <PreferenceRow
          icon={MapPin}
          label="Novidades de locais"
          value={preferenceLabel(Boolean(notifications.novidadesLocais))}
        />
      </div>
    </section>
  );
}

function PreferenceRow({ icon: Icon, label, value }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-card)] bg-container-primary p-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
        <Icon className="h-4 w-4 text-brand-primary" />
        {label}
      </span>
      <Badge variant={value === 'Ativo' ? 'success' : 'outline'}>{value}</Badge>
    </div>
  );
}

function ProfileSection({ user }) {
  const fields = [
    ['Nome', user.nome],
    ['Email', user.email],
    ['Telefone', user.telefone],
    ['Genero', user.genero],
  ];

  return (
    <section className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-text-primary">Perfil</h2>
        <Badge variant="outline">Somente leitura</Badge>
      </div>
      <div className="mt-4 grid gap-3">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-[var(--radius-card)] bg-container-primary p-3">
            <p className="text-xs font-bold uppercase text-text-tertiary">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold text-text-primary">{value || 'Nao informado'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickActionsSection() {
  const actions = [
    {
      to: '/agenda',
      icon: CalendarDays,
      title: 'Abrir Agenda',
      description: 'Ver proximos Ativos e historico recente.',
    },
    {
      to: '/ativos/novo',
      icon: Plus,
      title: 'Criar Ativo',
      description: 'Iniciar uma nova atividade oficial.',
    },
    {
      to: '/retrospectiva',
      icon: History,
      title: 'Ver Retrospectiva',
      description: 'Destino preparado para a fase propria.',
    },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-text-primary">Atalhos</h2>
      <div className="grid gap-3">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex min-h-20 items-center gap-3 rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-interaction-focus"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
              <action.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-text-primary">{action.title}</span>
              <span className="mt-1 block text-xs leading-5 text-text-secondary">{action.description}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function buildStats({ userId, participacoes, agenda }) {
  const items = agenda.items ?? [];
  const commitmentStatuses = new Set(['confirmado', 'participou']);
  const locaisFrequentados = new Set(
    items
      .filter((item) => commitmentStatuses.has(item.participacao?.status))
      .map((item) => item.ativo.localId)
      .filter(Boolean)
  );

  return {
    ativosCriados: items.filter((item) => item.isOrganizador || item.ativo.organizadorId === userId).length,
    participacoesConfirmadas: participacoes.filter((participacao) => participacao.status === 'confirmado').length,
    locaisFrequentados: locaisFrequentados.size,
    proximosAtivos: agenda.proximosAtivos?.length ?? 0,
  };
}

export default function AccountScreen() {
  const referenceDate = useMemo(() => new Date(), []);

  const sessionQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.current()),
    queryFn: () => SessionService.getSession(),
  });

  const user = sessionQuery.data?.user;
  const participacoesQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.participacoes.byUser(user?.id ?? 'aguardando-user')),
    queryFn: () => ParticipacaoService.listByUser(user.id),
    enabled: Boolean(user?.id),
  });

  const agendaQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.agenda.byUser(user?.id ?? 'aguardando-user', { scope: 'account' })),
    queryFn: () => AgendaService.getAgendaProjection(user.id, { referenceDate }),
    enabled: Boolean(user?.id),
  });

  if (sessionQuery.isLoading || participacoesQuery.isLoading || agendaQuery.isLoading) return <AccountLoading />;

  if (sessionQuery.isError || participacoesQuery.isError || agendaQuery.isError) {
    return (
      <AccountError
        onRetry={() => {
          sessionQuery.refetch();
          participacoesQuery.refetch();
          agendaQuery.refetch();
        }}
      />
    );
  }

  if (!user?.id) return <AccountEmpty />;

  const stats = buildStats({
    userId: user.id,
    participacoes: participacoesQuery.data ?? [],
    agenda: agendaQuery.data ?? {},
  });

  return (
    <AppScreen className="gap-5" variant="warm">
      <UserHero user={user} />
      <ProfileSection user={user} />
      <StatisticsSection stats={stats} />
      <PreferencesSection user={user} session={sessionQuery.data} />
      <QuickActionsSection />
    </AppScreen>
  );
}
