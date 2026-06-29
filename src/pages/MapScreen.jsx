import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { List, Map, SlidersHorizontal } from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import MapCanvas from '@/components/map/MapCanvas';
import LocalFloatingWindow from '@/components/local/LocalFloatingWindow';
import AtivoFloatingWindow from '@/components/ativo/AtivoFloatingWindow';
import TrailFloatingWindow from '@/components/trail/TrailFloatingWindow';
import SearchField from '@/components/product/SearchField';
import LocalCard from '@/components/product/LocalCard';
import AtivoHomeCard from '@/components/product/AtivoHomeCard';
import { LocalService } from '@/domain/local/service';
import { AtivoService } from '@/domain/ativo/service';
import { TrailService } from '@/domain/trail/model';
import { trailToLocal } from '@/domain/local/adapters';
import { Button } from '@/components/ui/button';

const SUGGESTION_BADGES = [
  { label: 'Quadras', variant: 'local' },
  { label: 'Trilhas', variant: 'local' },
  { label: 'Futebol', variant: 'ativo' },
  { label: 'Basquete', variant: 'ativo' },
  { label: 'Corrida', variant: 'ativo' },
];

export default function MapScreen() {
  const [selectedLocalId, setSelectedLocalId] = useState(null);
  const [selectedAtivoId, setSelectedAtivoId] = useState(null);
  const [selectedTrailId, setSelectedTrailId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState('mapa');
  const [activeTab, setActiveTab] = useState('lugares');

  const selectedLocalQuery = useQuery({
    queryKey: ['local', selectedLocalId],
    queryFn: () => LocalService.getById(selectedLocalId),
    enabled: !!selectedLocalId,
  });

  const locaisQuery = useQuery({
    queryKey: ['locais', 'discovery'],
    queryFn: () => LocalService.list(),
  });

  const ativosQuery = useQuery({
    queryKey: ['ativos', 'discovery'],
    queryFn: () => AtivoService.list(),
  });

  const trilhasQuery = useQuery({
    queryKey: ['trilhas', 'discovery'],
    queryFn: () => TrailService.list(),
  });

  const selectedTrailQuery = useQuery({
    queryKey: ['trail', selectedTrailId],
    queryFn: () => TrailService.getById(selectedTrailId),
    enabled: !!selectedTrailId,
  });

  const handleOpenLocal = useCallback((local) => {
    setSelectedLocalId(local.id);
  }, []);

  const handleOpenAtivo = useCallback((ativo) => {
    console.log('[ATIVO_OPEN] handleOpenAtivo', { screen: 'MapScreen', id: ativo.id, ativo });
    setSelectedAtivoId(ativo.id);
    console.log('[ATIVO_OPEN] selectedAtivoId updated', { value: ativo.id });
  }, []);

  const handleSelectTrail = useCallback((trail) => {
    setSelectedTrailId(trail.id);
  }, []);

  const handleCloseLocal = useCallback(() => {
    setSelectedLocalId(null);
  }, []);

  const handleCloseAtivo = useCallback(() => {
    setSelectedAtivoId(null);
  }, []);

  const handleCloseTrail = useCallback(() => {
    setSelectedTrailId(null);
  }, []);

const locaisBase = locaisQuery.data ?? [];
  const ativos = ativosQuery.data ?? [];
  const trilhas = trilhasQuery.data ?? [];

  const locais = useMemo(() => {
    const trilhasComoLocais = trilhas.map(trailToLocal);
    return [...locaisBase, ...trilhasComoLocais];
  }, [locaisBase, trilhas]);

  return (
    <AppScreen variant="warm" fullscreen>
      <div className="flex h-full max-h-full w-full flex-col">
        {/* Controle Lista | Mapa - seção própria acima do mapa */}
        <div className="shrink-0 px-5 pb-2 pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'lista' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => setViewMode('lista')}
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'mapa' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => setViewMode('mapa')}
            >
              <Map className="h-4 w-4" />
              Mapa
            </Button>
          </div>
        </div>

        {/* Superfície principal: Mapa ou Lista */}
        {viewMode === 'mapa' ? (
          /* Modo Mapa */
          <div className="relative flex-1 min-h-0 px-5 pb-4">
            <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-card)] shadow-card">
              {/* Mapa */}
              <div className="absolute inset-0">
                <MapCanvas
                  onOpenLocal={handleOpenLocal}
                  onOpenAtivo={handleOpenAtivo}
                  onSelectTrail={handleSelectTrail}
                  ativos={ativos}
                  locais={locais}
                  trilhas={trilhas}
                />
              </div>

              {/* Overlay de busca e filtros sobre o mapa */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4">
                {/* SearchBar + botão de filtro */}
                <div className="pointer-events-auto flex items-center gap-2">
                  <SearchField value={searchValue} onChange={setSearchValue} placeholder="Buscar no mapa" />
                  <button
                    type="button"
                    aria-label="Filtros"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-borderSemantic-subtle bg-surface-base shadow-sm"
                  >
                    <SlidersHorizontal className="h-5 w-5 text-text-primary" />
                  </button>
                </div>

                {/* Badges de sugestão */}
                <div className="pointer-events-none flex flex-wrap gap-2">
                  {SUGGESTION_BADGES.map((badge) => (
                    <span
                      key={badge.label}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        badge.variant === 'local'
                          ? 'bg-container-secondary-strong text-text-primary'
                          : 'bg-container-primary-strong text-text-primary'
                      }`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Modo Lista */
          <div className="flex-1 min-h-0 border-t border-borderSemantic-subtle bg-surface-base">
            {/* Tabs de navegação interna */}
            <div className="flex border-b border-borderSemantic-subtle">
              <button
                type="button"
                onClick={() => setActiveTab('lugares')}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === 'lugares'
                    ? 'border-b-2 border-brand-primary text-text-primary'
                    : 'text-text-secondary'
                }`}
              >
                Lugares
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ativos')}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === 'ativos'
                    ? 'border-b-2 border-brand-primary text-text-primary'
                    : 'text-text-secondary'
                }`}
              >
                Ativos
              </button>
            </div>

            {/* Conteúdo da lista com rolagem */}
            <div className="h-full overflow-y-auto p-4">
              {activeTab === 'lugares' && (
                <div className="flex flex-col gap-3">
                  {locais.length === 0 ? (
                    <p className="py-4 text-center text-sm text-text-secondary">
                      Nenhum lugar encontrado
                    </p>
                  ) : (
                    locais.map((local) => (
                      <LocalCard
                        key={local.id}
                        local={local}
                        onOpen={handleOpenLocal}
                      />
                    ))
                  )}
                </div>
              )}

              {activeTab === 'ativos' && (
                <div className="flex flex-col gap-3">
                  {ativos.length === 0 ? (
                    <p className="py-4 text-center text-sm text-text-secondary">
                      Nenhum ativo encontrado
                    </p>
                  ) : (
                    ativos.map((ativo) => {
                      const local = locais.find((l) => l.id === ativo.localId);
                      return (
                        <AtivoHomeCard
                          key={ativo.id}
                          ativo={ativo}
                          local={local}
                          onOpen={handleOpenAtivo}
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlays de visualização - independentes do modo */}
        {selectedLocalId && selectedLocalQuery.data && (
          <LocalFloatingWindow
            local={selectedLocalQuery.data}
            onClose={handleCloseLocal}
          />
        )}

        {selectedAtivoId && (
          <AtivoFloatingWindow
            ativoId={selectedAtivoId}
            onClose={handleCloseAtivo}
          />
        )}

        {selectedTrailId && selectedTrailQuery.data && (
          <TrailFloatingWindow
            trail={selectedTrailQuery.data}
            onClose={handleCloseTrail}
          />
        )}
      </div>
    </AppScreen>
  );
}
