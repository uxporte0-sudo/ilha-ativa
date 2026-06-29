import { useMemo } from 'react';
import AtivoPin from './AtivoPin';

/**
 * AtivoMarkers
 *
 * Componente responsavel por renderizar marcadores de Ativos no mapa.
 * Agrupa os Ativos por localId e calcula a distribuicao radial de cada Ativo
 * ao redor do Local correspondente.
 *
 * @param {Object} props
 * @param {Array} props.ativos - Lista de Ativos
 * @param {Array} props.locais - Lista de Locais (para obter coordenadas)
 * @param {Object} props.map - Referencia ao mapa MapLibre
 * @param {Function} props.onOpenAtivo - Callback (ativo) ao clicar pin
 */
export default function AtivoMarkers({ ativos, locais, map, onOpenAtivo }) {
  const ativosAgrupados = useMemo(() => {
    if (!ativos?.length || !locais?.length) {
      return {};
    }

    const grupos = {};
    ativos.forEach((ativo) => {
      const local = locais.find((l) => l.id === ativo.localId);
      if (!local) return;

      if (!grupos[ativo.localId]) {
        grupos[ativo.localId] = {
          latitude: local.latitude,
          longitude: local.longitude,
          ativos: [],
        };
      }
      grupos[ativo.localId].ativos.push(ativo);
    });

    return grupos;
  }, [ativos, locais]);

  if (!map || !ativos?.length || !locais?.length) {
    return null;
  }

  const MAX_ATIVOS_POR_LOCAL = 4;

  return (
    <>
      {Object.entries(ativosAgrupados).map(([localId, grupo]) => {
        const ativosLimitados = grupo.ativos.slice(0, MAX_ATIVOS_POR_LOCAL);
        const total = ativosLimitados.length;
        return ativosLimitados.map((ativo, index) => (
          <AtivoPin
            key={ativo.id || `${localId}-${index}`}
            map={map}
            latitude={grupo.latitude}
            longitude={grupo.longitude}
            entity={ativo}
            index={index}
            total={total}
            onOpen={onOpenAtivo}
          />
        ));
      })}
    </>
  );
}