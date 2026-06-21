import { MapPin, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function formatCategoria(value) {
  if (!value) return 'Local';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function LocalCard({ local, ativosCount = 0, className }) {
  return (
    <Link
      to={`/locais/${local.id}`}
      className={cn(
        'flex min-h-[152px] w-[260px] shrink-0 flex-col justify-between rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-primary p-4 shadow-card outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-interaction-focus',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
          <Waves className="h-5 w-5" />
        </span>
        <Badge variant="outline">{formatCategoria(local.categoria)}</Badge>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="line-clamp-2 text-base font-bold leading-5 text-text-primary">{local.nome}</h3>
        <p className="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <MapPin className="h-4 w-4 shrink-0 text-text-tertiary" />
          <span className="truncate">{local.bairro ?? local.cidade ?? 'Ilhabela'}</span>
        </p>
      </div>

      <p className="mt-3 text-xs font-semibold text-text-tertiary">
        {ativosCount === 1 ? '1 Ativo conectado' : `${ativosCount} Ativos conectados`}
      </p>
    </Link>
  );
}