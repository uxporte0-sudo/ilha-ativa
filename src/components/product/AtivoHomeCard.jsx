import { UsersRound, Signal, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import QuadraPlaceholder from '@/components/assets/Quadra_placeholder.jpg';

function formatHora(value) {
  if (!value) return '--:--';

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatNivel(value) {
  if (!value) return 'Livre';

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getEmoji(modalidade) {
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

export default function AtivoHomeCard({
  ativo,
  local,
  participantes = 0,
  onOpen,
}) {
  const imagem =
    ativo.imagem ||
    local?.foto ||
    local?.imagem ||
    QuadraPlaceholder;

  const distancia = local?.distancia ?? '—';

  const cardContent = (
    <>
      {/* Imagem da quadra */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={imagem}
          alt={local?.nome ?? ativo.titulo}
          className="h-full w-full object-cover"
        />

        {/* Hora */}
        <Badge
          variant="secondary"
          className="
            absolute
            left-2
            top-2
            rounded-md
            bg-container-primary/95
            px-2
            py-0
            text-[10px]
            font-bold
            uppercase
            shadow-sm
          "
        >
          {formatHora(ativo.dataHoraInicio)}
        </Badge>

        {/* Distância */}
        <Badge
          variant="secondary"
          className="
            absolute
            bottom-2
            right-2
            rounded-md
            bg-container-primary/95
            px-2
            py-0
            text-[9px]
            shadow-sm
          "
        >
          <MapPin className="mr-1 h-3 w-3" />
          {distancia}
        </Badge>
      </div>

      {/* Conteúdo */}
      <div className="space-y-1 px-2 pb-2">
        <div className="text-base leading-none">
          {getEmoji(ativo.modalidade)}
        </div>

        <h3 className="line-clamp-2 text-sm font-bold text-text-primary">
          {ativo.titulo}
        </h3>

        <p className="truncate text-[11px] text-text-secondary">
          {local?.nome ?? 'Local'}
        </p>

        <div className="flex items-center gap-1 text-[10px] text-text-secondary">
          <UsersRound className="h-3 w-3" />
          <span>
            {participantes}/{ativo.minimoParticipantes}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-text-secondary">
          <Signal className="h-3 w-3" />
          <span>{formatNivel(ativo.nivelDificuldade)}</span>
        </div>
      </div>
    </>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          console.log('[ATIVO_OPEN] Card clicked', { id: ativo.id, titulo: ativo.titulo, hasCallback: !!onOpen });
          onOpen(ativo);
        }}
        className="
          w-[132px]
          shrink-0
          overflow-hidden
          rounded-xl
          border
          border-borderSemantic-subtle
          bg-surface-base
          shadow-card
          transition-all
          hover:-translate-y-1
          text-left
        "
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div
      className="
        w-[132px]
        shrink-0
        overflow-hidden
        rounded-xl
        border
        border-borderSemantic-subtle
        bg-surface-base
        shadow-card
        transition-all
        hover:-translate-y-1
      "
    >
      {cardContent}
    </div>
  );
}