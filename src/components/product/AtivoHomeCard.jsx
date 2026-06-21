import { CalendarDays, MapPin, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

function formatDateTime(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatModalidade(value) {
  if (!value) return 'Ativo';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AtivoHomeCard({ ativo, local, participacao, participantes = 0 }) {
  const quorumLabel = `${participantes}/${ativo.minimoParticipantes}+`;

  return (
    <Link
      to={`/ativos/${ativo.id}`}
      className="flex h-full min-h-[178px] w-[310px] shrink-0 flex-col justify-between rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-interaction-focus"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant="secondary">{formatModalidade(ativo.modalidade)}</Badge>
        {participacao ? <Badge variant="accent">{participacao.status}</Badge> : null}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="line-clamp-2 text-lg font-bold leading-6 text-text-primary">{ativo.titulo}</h3>
        {ativo.descricao ? (
          <p className="line-clamp-2 text-sm leading-5 text-text-secondary">{ativo.descricao}</p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2 text-xs font-medium text-text-secondary">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-text-tertiary" />
          {formatDateTime(ativo.dataHoraInicio)}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-text-tertiary" />
          <span className="truncate">{local?.nome ?? 'Local a confirmar'}</span>
        </span>
        <span className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-text-tertiary" />
          {quorumLabel} participantes
        </span>
      </div>
    </Link>
  );
}
