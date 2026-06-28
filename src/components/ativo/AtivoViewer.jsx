import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
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
import { cn } from '@/lib/utils';
import { ViewerSection, ViewerSectionTitle } from '@/components/viewer';

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
      <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

function AtivoHero({ ativo, local, organizador }) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-primary shadow-card">
      <div className="relative h-48 w-full bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-transparent">
        {ativo.imagem ? (
          <img src={ativo.imagem} alt={ativo.nome} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="h-12 w-12 text-brand-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-container-primary/90 text-text-primary backdrop-blur-sm">
              {formatLabel(ativo.categoria)}
            </Badge>
            <Badge variant="secondary" className="bg-container-primary/90 text-text-primary backdrop-blur-sm">
              {formatLabel(ativo.tipo)}
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white drop-shadow-lg">{ativo.nome}</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={organizador?.imagem} />
            <AvatarFallback>{getInitials(organizador?.nome)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-text-tertiary">Organizado por</p>
            <p className="text-sm font-medium text-text-primary">{organizador?.nome ?? 'Nao informado'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CalendarDays className="h-4 w-4 text-brand-primary" />
            <span>{formatDate(ativo.dataInicio)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock3 className="h-4 w-4 text-brand-primary" />
            <span>{formatTimeRange(ativo.dataInicio, ativo.dataFim)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="h-4 w-4 text-brand-primary" />
            <span>{local?.nome ?? 'Local a confirmar'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParticipacaoCard({
  ativo,
  participacao,
  participantesConfirmados,
  actions,
  isMutating,
  onInterest,
  onConfirm,
  onCancel,
}) {
  const statusConfig = {
    interesse: { icon: Heart, color: 'text-brand-primary', label: 'Interessado' },
    confirmado: { icon: CheckCircle2, color: 'text-success', label: 'Confirmado' },
    cancelado: { icon: XCircle, color: 'text-error', label: 'Cancelado' },
  };

  const currentStatus = participacao?.status;
  const currentConfig = currentStatus ? statusConfig[currentStatus] : null;

  return (
    <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-primary p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-brand-primary" />
          <h2 className="text-lg font-bold text-text-primary">Participacao</h2>
        </div>
        {currentConfig && (
          <div className={cn('flex items-center gap-1 text-sm font-medium', currentConfig.color)}>
            <currentConfig.icon className="h-4 w-4" />
            <span>{currentConfig.label}</span>
          </div>
        )}
      </div>

      <p className="mb-3 text-sm text-text-secondary">
        {participantesConfirmados} {participantesConfirmados === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'}
      </p>

      <div className="flex flex-col gap-2">
        {actions.includes('interesse') && (
          <Button
            variant={currentStatus === 'interesse' ? 'default' : 'outline'}
            className="w-full"
            disabled={isMutating}
            onClick={onInterest}
          >
            <Heart className="mr-2 h-4 w-4" />
            Demonstrar Interesse
          </Button>
        )}
        {actions.includes('confirmar') && (
          <Button
            variant={currentStatus === 'confirmado' ? 'default' : 'outline'}
            className="w-full"
            disabled={isMutating}
            onClick={onConfirm}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirmar Presenca
          </Button>
        )}
        {actions.includes('cancelar') && (
          <Button
            variant="outline"
            className="w-full text-error hover:bg-error/10 hover:text-error"
            disabled={isMutating}
            onClick={onCancel}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar Participacao
          </Button>
        )}
      </div>
    </div>
  );
}

function ParticipantesSection({ participacoes }) {
  if (!participacoes || participacoes.length === 0) return null;

  return (
    <ViewerSection className="bg-container-primary">
      <ViewerSectionTitle icon={UsersRound}>Participantes</ViewerSectionTitle>
      <div className="flex flex-col gap-3">
        {participacoes.map((participacao) => (
          <div key={participacao.id} className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={participacao.user?.imagem} />
              <AvatarFallback>{getInitials(participacao.user?.nome)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{participacao.user?.nome ?? 'Usuario'}</p>
              <p className="text-xs text-text-tertiary">{participacao.user?.apelido ?? ''}</p>
            </div>
            <Badge
              variant={participacao.status === 'confirmado' ? 'default' : 'secondary'}
              className={participacao.status === 'confirmado' ? 'bg-success/10 text-success' : ''}
            >
              {formatLabel(participacao.status)}
            </Badge>
          </div>
        ))}
      </div>
    </ViewerSection>
  );
}

function DetailsSection({ ativo, local }) {
  return (
    <ViewerSection className="bg-container-primary">
      <ViewerSectionTitle icon={ShieldCheck}>Detalhes</ViewerSectionTitle>

      {ativo.descricao && (
        <p className="mb-4 text-sm leading-6 text-text-secondary">{ativo.descricao}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <InfoPill icon={CalendarDays} label="Data" value={formatDate(ativo.dataInicio)} />
        <InfoPill icon={Clock3} label="Horario" value={formatTimeRange(ativo.dataInicio, ativo.dataFim)} />
        <InfoPill icon={MapPin} label="Local" value={local?.nome ?? 'Nao informado'} />
        <InfoPill icon={UserRound} label="Organizador" value={ativo.organizadorNome ?? 'Nao informado'} />
      </div>

      {ativo.tags && ativo.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {ativo.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-container-secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </ViewerSection>
  );
}

export default function AtivoViewer({
  ativo,
  local,
  organizador,
  participacoes,
  activeParticipation,
  participationActions,
  isMutating,
  onInterest,
  onConfirm,
  onCancel,
  notFound = false,
  error = false,
}) {
  if (!ativo) {
    if (notFound) {
      return (
        <AtivoDetailsMessage
          empty
          title="Ativo nao informado"
          description="A rota de Detalhes precisa receber um identificador de Ativo."
        />
      );
    }
    if (error) {
      return (
        <AtivoDetailsMessage
          title="Nao foi possivel carregar o Ativo"
          description="Os dados oficiais de Ativo, Local, User ou Participacao nao responderam agora."
        />
      );
    }
    return (
      <AtivoDetailsMessage
        title="Ativo nao encontrado"
        description="Este Ativo nao existe na camada oficial de dados."
      />
    );
  }

  const participantesConfirmados = (participacoes ?? []).filter(
    (participacao) => participacao.status === 'confirmado'
  ).length;

  return (
    <AppScreen className="gap-5" variant="warm">
      <Button asChild variant="link" className="w-fit text-sm font-bold">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Home
        </Link>
      </Button>

      <AtivoHero ativo={ativo} local={local} organizador={organizador} />

      <ParticipacaoCard
        ativo={ativo}
        participacao={activeParticipation}
        participantesConfirmados={participantesConfirmados}
        actions={participationActions}
        isMutating={isMutating}
        onInterest={onInterest}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <ParticipantesSection participacoes={participacoes} />
      <DetailsSection ativo={ativo} local={local} />
    </AppScreen>
  );
}
