import { ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

export default function LocalCard({ local, className }) {
  return (
    <Link
      to={`/locais/${local.id}`}
      className={cn(
        'flex h-24 w-[180px] shrink-0 items-center gap-3 rounded-xl border border-borderSemantic-subtle bg-container-secondary p-2 shadow-card transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus',
        className
      )}
    >
      <div className="flex h-full w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-primary-subtle">
        {local.imagem ? (
          <img
            src={local.imagem}
            alt={local.nome}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-7 w-7 text-text-secondary" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="line-clamp-2 text-sm font-bold leading-4 text-text-primary">
          {local.nome}
        </h3>

        <p className="mt-1 truncate text-[11px] leading-4 text-text-secondary">
          {local.logradouro ??
            local.endereco ??
            'Logradouro'}
          {local.numero && ` | Nº ${local.numero}`}
        </p>

        <p className="truncate text-[11px] leading-4 text-text-tertiary">
          {local.bairro ?? 'Bairro'}
          {' | '}
          {local.cidade ?? 'Cidade'}
        </p>
      </div>
    </Link>
  );
}