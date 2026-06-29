import { useEffect } from 'react';

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
 * TrailLineLayer
 *
 * Componente que renderiza as trilhas como Polyline no mapa.
 * Utiliza diretamente o FeatureCollection do dominio sem reconstruir geometrias.
 */
export default function TrailLineLayer({ trails, map, onSelectTrail }) {
  useEffect(() => {
    if (!map || !trails || trails.length === 0) {
      return;
    }

    const sourceId = 'trails-source';
    const layerId = 'trails-layer';

    const handleMapLoad = () => {
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

        // Source para trilhas
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: geojsonData,
          });
        } else {
          map.getSource(sourceId).setData(geojsonData);
        }

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

        // Click handler
        map.on('click', layerId, (e) => {
          const feature = e.features?.[0];
          if (feature && onSelectTrail) {
            const trailId = feature.properties.trailId;
            const trail = trails.find((t) => t.id === trailId);
            if (trail) {
              onSelectTrail(trail);
            }
          }
        });

        // Cursor pointer
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
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
      if (map && map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map && map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, trails, onSelectTrail]);

  return null;
}
