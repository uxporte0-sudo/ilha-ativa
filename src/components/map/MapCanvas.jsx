import { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapCanvas.css';
import { useLocalLayer, localToFeature } from './LocalLayer';
import LocalMarkers from './LocalMarkers';
import AtivoMarkers from './AtivoMarkers';
import TrailLineLayer from './TrailLayer';

const ILHABELA_CENTER = [-45.3436, -23.7738];

/**
 * MapCanvas
 *
 * Componente de renderizacao do mapa usando MapLibre GL.
 * Utiliza ResizeObserver para detectar mudancas de tamanho do container
 * e atualizar o mapa automaticamente.
 *
 * Consome a camada LocalLayer para obter os Locais preparados para renderizacao.
 * Os marcadores dos Locais sao renderizados pelo componente LocalMarkers.
 *
 * @param {Object} props
 * @param {string} props.className - Classes CSS adicionais
 * @param {Array} props.ativos - Lista de Ativos
 * @param {Array} props.locais - Lista de Locais (inclui trilhas convertidas)
 * @param {Array} props.trilhas - Lista de Trilhas (para geometria)
 * @param {Function} props.onOpenLocal - Callback (entity) ao clicar pin
 * @param {Function} props.onOpenAtivo - Callback (ativo) ao clicar pin
 * @param {Function} props.onSelectTrail - Callback (trail) ao clicar na trilha
 */
export default function MapCanvas({ className, ativos, locais, trilhas, onOpenLocal, onOpenAtivo, onSelectTrail }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const { featureCollection: baseFeatureCollection, loading, error } = useLocalLayer();

  const featureCollection = useMemo(() => {
    const trailFeatures = locais
      .filter(l => l.tipoCategoria === 'trilha')
      .map(localToFeature);
    
    return {
      type: 'FeatureCollection',
      features: [...baseFeatureCollection.features, ...trailFeatures],
    };
  }, [baseFeatureCollection, locais]);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    let resizeObserver = null;

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm-tiles',
            },
          ],
        },
        center: ILHABELA_CENTER,
        zoom: 10,
      });

      mapRef.current = map;
      setMapInstance(map);

      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        map.remove();
        mapRef.current = null;
        setMapInstance(null);
      };
    } catch (e) {
      console.error('[MAP] initialization error:', e);
    }
  }, []);

  // Log de diagnóstico: MapCanvas
  console.groupCollapsed('[Trail] MapCanvas');
  console.log('[Trail] map existe?', !!mapInstance);
  console.log('[Trail] quantidade de trilhas:', trilhas?.length ?? 0);
  console.log('[Trail] trilhas:', trilhas?.map(t => ({ id: t.id, nome: t.nome, geometriaValida: !!t.geometria })));
  console.groupEnd();

  return (
    <>
      <div
        ref={containerRef}
        className={className ? 'map-canvas ' + className : 'map-canvas'}
      />
      <LocalMarkers featureCollection={featureCollection} map={mapInstance} onOpenLocal={onOpenLocal} />
      <AtivoMarkers ativos={ativos} locais={locais} map={mapInstance} onOpenAtivo={onOpenAtivo} />
      <TrailLineLayer trails={trilhas} map={mapInstance} onSelectTrail={onSelectTrail} />
    </>
  );
}
