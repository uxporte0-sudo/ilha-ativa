import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  MoreHorizontal,
  Share2,
  Flag,
  Star,
  Trash2,
  X,
  UsersRound,
  UserRound,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  ViewerSection,
  ViewerHorizontalScroller,
} from '@/components/viewer';

function formatLabel(value) {
  if (!value) return 'Nao informado';
  return String(value).replaceAll('_', ' ').replace(/^./, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return 'Data a confirmar';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return 'Horario a confirmar';
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
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

function getQuorumStatus(participantesConfirmados, minimoParticipantes) {
  if (participantesConfirmados >= minimoParticipantes) {
    return { label: 'Quórum atingido', color: 'text-success' };
  }
  const faltam = minimoParticipantes - participantesConfirmados;
  return { label: `Faltam ${faltam} participante${faltam > 1 ? 's' : ''}`, color: 'text-warning' };
}

function getModalidadeEmoji(modalidade) {
  const emojis = {
    futebol: '⚽',
    volei: '🏐',
    vôlei: '🏐',
    basquete: '🏀',
    tenis: '🎾',
    tênis: '🎾',
    corrida: '🏃',
    caminhada: '🚶',
    trilha: '🥾',
    ciclismo: '🚴',
    pedal: '🚴',
    surf: '🏄',
    yoga: '🧘',
    natacao: '🏊',
    natação: '🏊',
  };

  return emojis[modalidade?.toLowerCase()] ?? '🏅';
}

function AtivoDetailsMessage({ title, description, onRetry, empty = false }) {
  return (
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
  );
}

function AtivoHero({ ativo, onClose }) {
  const emoji = getModalidadeEmoji(ativo.modalidade);

  return (
    <div className="flex bg-container-primary p-3">
      <div className="flex w-16 items-center justify-center">
        <span className="text-4xl">{emoji}</span>
      </div>
      <div className="ml-3 flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="text-xs font-medium">
            {formatLabel(ativo.modalidade)}
          </Badge>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-container-tertiary/50 text-text-secondary hover:bg-container-tertiary"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h1 className="mt-1 text-base font-bold leading-tight text-text-primary">
          {ativo.titulo}
        </h1>
        <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3 text-brand-primary" />
            <span>{formatDate(ativo.dataHoraInicio)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock3 className="h-3 w-3 text-brand-primary" />
            <span>{formatTime(ativo.dataHoraInicio)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AtivoLocationCard({ local }) {
  return (
    <ViewerSection className="mx-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-subtle">
            <MapPin className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{local?.nome ?? 'Local a confirmar'}</p>
            <p className="text-xs text-text-tertiary">{local?.endereco ?? 'Endereco nao informado'}</p>
            {local?.distancia && (
              <p className="text-xs text-brand-primary">{local.distancia}</p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          Ver no mapa
        </Button>
      </div>
    </ViewerSection>
  );
}

function AtivoQuorum({ participantesConfirmados, minimoParticipantes }) {
  const progresso = Math.min((participantesConfirmados / minimoParticipantes) * 100, 100);
  const status = getQuorumStatus(participantesConfirmados, minimoParticipantes);

  return (
    <ViewerSection className="mx-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-brand-primary" />
          <span className="text-sm font-medium text-text-primary">
            {participantesConfirmados} / {minimoParticipantes} participantes
          </span>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-container-tertiary">
        <div
          className="h-full rounded-full bg-brand-primary transition-all"
          style={{ width: `${progresso}%` }}
        />
      </div>
      <p className={cn('mt-2 text-xs font-medium', status.color)}>{status.label}</p>
    </ViewerSection>
  );
}

function AtivoOrganizerCard({ organizador, isOwner, onTogglePrivacy, onDelete }) {
  return (
    <ViewerSection className="mx-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={organizador?.imagem} />
          <AvatarFallback>{getInitials(organizador?.nome)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">{organizador?.nome ?? 'Nao informado'}</p>
          <p className="text-xs text-text-tertiary">{organizador?.ativosCount ?? 0} ativos criados</p>
        </div>
        <UserRound className="h-5 w-5 text-text-tertiary" />
      </div>
      {isOwner && (
        <div className="mt-4 space-y-3 border-t border-borderSemantic-subtle pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Ativo publico</span>
            <Switch onCheckedChange={onTogglePrivacy} />
          </div>
          <Button
            variant="outline"
            className="w-full text-error hover:bg-error/10 hover:text-error"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir Ativo
          </Button>
        </div>
      )}
    </ViewerSection>
  );
}

function AtivoParticipantCard({ participacao }) {
  return (
    <div className="flex w-24 flex-col items-center gap-2">
      <Avatar className="h-14 w-14">
        <AvatarImage src={participacao.user?.imagem} />
        <AvatarFallback>{getInitials(participacao.user?.nome)}</AvatarFallback>
      </Avatar>
      <p className="w-full truncate text-center text-xs font-medium text-text-primary">
        {participacao.user?.nome ?? 'Usuario'}
      </p>
      <Button variant="outline" size="sm" className="h-7 w-full text-[10px]">
        Adicionar
      </Button>
    </div>
  );
}

function AtivoParticipantsCarousel({ participacoes }) {
  if (!participacoes || participacoes.length === 0) return null;

  return (
    <div className="mx-4">
      <ViewerHorizontalScroller>
        {participacoes.map((participacao) => (
          <AtivoParticipantCard key={participacao.id} participacao={participacao} />
        ))}
      </ViewerHorizontalScroller>
    </div>
  );
}

function AtivoCTA({ participacao, actions, isMutating, onInterest, onConfirm, onCancel }) {
  if (actions.includes('confirmar') && participacao?.status === 'confirmado') {
    return (
      <div className="mx-4">
        <Button
          variant="outline"
          className="w-full text-error hover:bg-error/10 hover:text-error"
          disabled={isMutating}
          onClick={onCancel}
        >
          Cancelar presenca
        </Button>
      </div>
    );
  }

  if (actions.includes('confirmar')) {
    return (
      <div className="mx-4">
        <Button
          variant="default"
          className="w-full"
          disabled={isMutating}
          onClick={onConfirm}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Confirmar presenca
        </Button>
      </div>
    );
  }

  if (actions.includes('interesse')) {
    return (
      <div className="mx-4">
        <Button
          variant="outline"
          className="w-full"
          disabled={isMutating}
          onClick={onInterest}
        >
          <Heart className="mr-2 h-4 w-4" />
          Demonstrar Interesse
        </Button>
      </div>
    );
  }

  return null;
}

function AtivoSecondaryActions({ ativoId }) {
  return (
    <div className="mx-4 flex items-center justify-between gap-2">
      <Button variant="ghost" size="sm" className="flex-1">
        <Share2 className="mr-2 h-4 w-4" />
        Compartilhar
      </Button>
      <Button variant="ghost" size="sm" className="flex-1">
        <Star className="mr-2 h-4 w-4" />
        Favoritar
      </Button>
      <Button variant="ghost" size="sm" className="flex-1">
        <Flag className="mr-2 h-4 w-4" />
        Reportar
      </Button>
      <Button asChild variant="ghost" size="sm" className="flex-1">
        <Link to={`/ativos/${ativoId}`}>
          <MoreHorizontal className="mr-2 h-4 w-4" />
          Mais
        </Link>
      </Button>
    </div>
  );
}

export default function AtivoViewer({
  ativo,
  local,
  organizador,
  participacoes,
  activeParticipation,
  participationActions,
  actions,
  isMutating,
  onInterest,
  onConfirm,
  onCancel,
  onClose,
  isOwner = false,
  onTogglePrivacy,
  onDelete,
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
    <div className="flex h-full flex-col gap-3 overflow-y-auto pb-4">
      <AtivoHero ativo={ativo} onClose={onClose} />
      <AtivoLocationCard local={local} />
      <AtivoQuorum
        participantesConfirmados={participantesConfirmados}
        minimoParticipantes={ativo.minimoParticipantes ?? 2}
      />
      <AtivoOrganizerCard
        organizador={organizador}
        isOwner={isOwner}
        onTogglePrivacy={onTogglePrivacy}
        onDelete={onDelete}
      />
      <AtivoParticipantsCarousel participacoes={participacoes} />
      <div className="mt-auto">
        <AtivoCTA
          participacao={activeParticipation}
          actions={actions}
          isMutating={isMutating}
          onInterest={onInterest}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
        <div className="mt-3">
          <AtivoSecondaryActions ativoId={ativo.id} />
        </div>
      </div>
    </div>
  );
}