import { useEffect, useRef } from 'react';

/**
 * Hook useTrailLayer
 * Retorna o FeatureCollection diretamente das trilhas do domínio
 */
export function useTrailLayer(trails) {
  if (!trails || trails.length === 0) {
    return {
      featureCollection: { type: 'FeatureCollection', features: [] },
      loading: false,
      error: null,
    };
  }

  const allFeatures = [];
  for (const trail of trails) {
    if (trail.geometry && trail.geometry.features) {
      for (const feature of trail.geometry.features) {
        allFeatures.push({
          type: 'Feature',
          properties: {
            trailId: trail.id,
            trailNome: trail.nome,
          },
          geometry: feature.geometry,
        });
      }
    }
  }

  return {
    featureCollection: {
      type: 'FeatureCollection',
      features: allFeatures,
    },
    loading: false,
    error: null,
  };
}

/**
 * Verifica se a instância do mapa ainda está funcional.
 * Não confia apenas em `if (map)` pois o objeto pode existir
 * enquanto sua estrutura interna já foi desmontada por map.remove().
 */
function isMapAlive(map) {
  return (
    map &&
    typeof map.getLayer === 'function' &&
    typeof map.getSource === 'function' &&
    typeof map.removeLayer === 'function' &&
    typeof map.removeSource === 'function' &&
    typeof map.off === 'function' &&
    map.style != null
  );
}

/**
 * TrailLineLayer
 *
 * Componente que renderiza as trilhas como Polyline no mapa.
 * Utiliza diretamente o FeatureCollection do dominio sem reconstruir geometrias.
 */
export default function TrailLineLayer({ trails, map, onSelectTrail }) {
  const cleanedUpRef = useRef(false);

  useEffect(() => {
    if (!map || !trails || trails.length === 0) {
      return;
    }

    cleanedUpRef.current = false;

    const sourceId = 'trails-source';
    const layerId = 'trails-layer';

    // Referências estáveis para os handlers — necessárias para remover listeners
    const handleClick = (e) => {
      const feature = e.features?.[0];
      if (feature && onSelectTrail) {
        const trailId = feature.properties.trailId;
        const trail = trails.find((t) => t.id === trailId);
        if (trail) {
          onSelectTrail(trail);
        }
      }
    };

    const handleMouseEnter = () => {
      if (isMapAlive(map)) {
        map.getCanvas().style.cursor = 'pointer';
      }
    };

    const handleMouseLeave = () => {
      if (isMapAlive(map)) {
        map.getCanvas().style.cursor = '';
      }
    };

    const handleMapLoad = () => {
      if (cleanedUpRef.current) return;
      if (!isMapAlive(map)) return;

      try {
        // Criar FeatureCollection combinando todas as trilhas
        // Cada trail.geometria ja e um FeatureCollection completo do dominio
        const allFeatures = [];
        for (const trail of trails) {
          if (trail.geometry && trail.geometry.features) {
            for (const feature of trail.geometry.features) {
              allFeatures.push({
                type: 'Feature',
                properties: {
                  trailId: trail.id,
                  trailNome: trail.nome,
                },
                geometry: feature.geometry,
              });
            }
          }
        }

        const geojsonData = {
          type: 'FeatureCollection',
          features: allFeatures,
        };

        if (!isMapAlive(map)) return;

        // Source para trilhas
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: geojsonData,
          });
        } else {
          map.getSource(sourceId).setData(geojsonData);
        }

        if (!isMapAlive(map)) return;

        // Layer de linha para trilhas
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#256374',
              'line-width': 4,
              'line-opacity': 0.8,
            },
          });
        }

        if (!isMapAlive(map)) return;

        // Click handler
        map.on('click', layerId, handleClick);

        // Cursor pointer
        map.on('mouseenter', layerId, handleMouseEnter);
        map.on('mouseleave', layerId, handleMouseLeave);
      } catch (err) {
        console.error('[Trail] ERRO:', err);
      }
    };

    if (map.isStyleLoaded()) {
      handleMapLoad();
    } else {
      map.once('load', handleMapLoad);
    }

    return () => {
      cleanedUpRef.current = true;

      // Remove listeners primeiro — map.off é seguro mesmo se o mapa estiver parcialmente destruído,
      // mas verificamos isMapAlive para evitar crash em mapas totalmente destruídos
      try {
        if (isMapAlive(map)) {
          map.off('click', layerId, handleClick);
          map.off('mouseenter', layerId, handleMouseEnter);
          map.off('mouseleave', layerId, handleMouseLeave);
        }
      } catch (e) {
        // Silencioso — cleanup deve ser idempotente
      }

      // Remover layer e source com validação defensiva
      try {
        if (isMapAlive(map) && map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      } catch (e) {
        // Silencioso — cleanup deve ser idempotente
      }

      try {
        if (isMapAlive(map) && map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      } catch (e) {
        // Silencioso — cleanup deve ser idempotente
      }
    };
  }, [map, trails, onSelectTrail]);

  return null;
}