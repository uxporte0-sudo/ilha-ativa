import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Mountain, Ruler, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ViewerCard } from '@/components/viewer';

// TrailFloatingWindow - derivado do LocalFloatingWindow
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

function formatDuration(minutes) {
  if (!minutes) return 'Nao informado';
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

function TrailFloatingHeader({ trail, onClose }) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
        <Mountain className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            {formatDifficulty(trail.dificuldade)}
          </Badge>
        </div>
        <h1 className="mt-1 truncate text-lg font-bold leading-6 text-text-primary">{trail.nome}</h1>
        <p className="mt-0.5 truncate text-xs text-text-secondary">{trail.descricao}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-base text-text-secondary hover:bg-container-tertiary"
        aria-label="Fechar"
      >
        <span className="text-lg leading-none">&times;</span>
      </button>
    </div>
  );
}

function TrailStats({ trail }) {
  return (
    <div className="px-4 pb-3">
      <ViewerCard className="p-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1">
            <Ruler className="h-5 w-5 text-brand-primary" />
            <span className="text-sm font-bold text-text-primary">{trail.distancia}km</span>
            <span className="text-[10px] text-text-tertiary">Distancia</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Clock className="h-5 w-5 text-brand-primary" />
            <span className="text-sm font-bold text-text-primary">{formatDuration(trail.duracao)}</span>
            <span className="text-[10px] text-text-tertiary">Duracao</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <TrendingUp className="h-5 w-5 text-brand-primary" />
            <span className="text-sm font-bold text-text-primary">{formatDifficulty(trail.dificuldade)}</span>
            <span className="text-[10px] text-text-tertiary">Nivel</span>
          </div>
        </div>
      </ViewerCard>
    </div>
  );
}

function TrailAlerts() {
  return (
    <div className="px-4 pb-3">
      <ViewerCard className="p-3 border-success/30 bg-success/5">
        <div className="mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span className="text-xs font-bold text-success">Trilha sinalizada</span>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs">
            <Link to="/zeladoria/nova">Reportar problema</Link>
          </Button>
        </div>
      </ViewerCard>
    </div>
  );
}

function TrailPrimaryActions({ trail }) {
  return (
    <div className="px-4 pb-2">
      <Button asChild className="w-full" variant="default" size="lg">
        <Link to={`/ativos/novo?trailId=${trail.id}`}>
          <Mountain className="h-4 w-4" />
          Criar Ativo nesta Trilha
        </Link>
      </Button>
    </div>
  );
}

export default function TrailFloatingWindow({ trail, onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!trail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-2 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-container-secondary shadow-xl sm:rounded-2xl">
        <TrailFloatingHeader trail={trail} onClose={onClose} />
        <div className="flex-1 overflow-y-auto">
          <TrailStats trail={trail} />
          <TrailAlerts />
        </div>
        <div className="border-t border-borderSemantic-subtle bg-container-secondary p-4">
          <TrailPrimaryActions trail={trail} />
        </div>
      </div>
    </div>
  );
}