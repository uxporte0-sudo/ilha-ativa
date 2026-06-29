import { Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// TrailCard - derivado do LocalCard
// Mantem a mesma estrutura visual, apenas substitui dados para trilha

function formatDifficulty(dificuldade) {
  if (!dificuldade) return 'Nao informado';
  const map = {
    facil: 'Facil',
    moderada: 'Moderada',
    dificil: 'Dificil',
  };
  return map[dificuldade] || dificuldade;
}

export default function TrailCard({ trail, className, onOpen }) {
  if (onOpen) {
    return (
      <button
        type="button"
        onClick={() => onOpen(trail)}
        className={cn(
          'flex h-24 w-[180px] shrink-0 items-center gap-3 rounded-xl border border-borderSemantic-subtle bg-surface-base p-2 text-left shadow-card transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus',
          className
        )}
      >
        <div className="flex h-full w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-primary-subtle">
          {trail.imagem ? (
            <img src={trail.imagem} alt={trail.nome} className="h-full w-full object-cover" />
          ) : (
            <Mountain className="h-7 w-7 text-text-secondary" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="line-clamp-2 text-sm font-bold leading-4 text-text-primary">{trail.nome}</h3>
          <p className="mt-1 truncate text-[11px] leading-4 text-text-secondary">
            {formatDifficulty(trail.dificuldade)} | {trail.distancia}km
          </p>
          <p className="truncate text-[11px] leading-4 text-text-tertiary">
            {trail.duracao}min
          </p>
        </div>
      </button>
    );
  }

  return (
    <Link
      to={'/trilhas/' + trail.id}
      className={cn(
        'flex h-24 w-[180px] shrink-0 items-center gap-3 rounded-xl border border-borderSemantic-subtle bg-container-secondary p-2 shadow-card transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus',
        className
      )}
    >
      <div className="flex h-full w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-primary-subtle">
        {trail.imagem ? (
          <img src={trail.imagem} alt={trail.nome} className="h-full w-full object-cover" />
        ) : (
          <Mountain className="h-7 w-7 text-text-secondary" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="line-clamp-2 text-sm font-bold leading-4 text-text-primary">{trail.nome}</h3>
        <p className="mt-1 truncate text-[11px] leading-4 text-text-secondary">
          {formatDifficulty(trail.dificuldade)} | {trail.distancia}km
        </p>
        <p className="truncate text-[11px] leading-4 text-text-tertiary">
          {trail.duracao}min
        </p>
      </div>
    </Link>
  );
}