import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapCanvas.css';
import { useLocalLayer } from './LocalLayer';
import LocalMarkers from './LocalMarkers';

const ILHABELA_CENTER = [-45.3436, -23.7738];

/**
 * MapCanvas
 *
 * Componente de renderização do mapa usando MapLibre GL.
 * Utiliza ResizeObserver para detectar mudanças de tamanho do container
 * e atualizar o mapa automaticamente.
 *
 * Consome a camada LocalLayer para obter os Locais preparados para renderização.
 * Os marcadores dos Locais são renderizados pelo componente LocalMarkers.
 */
export default function MapCanvas({ className }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const { featureCollection, loading, error } = useLocalLayer();

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

      // Event listeners para debug
      map.on('load', () => {
        console.log('[MAP] load');
      });

      map.on('style.load', () => {
        console.log('[MAP] style.load');
      });

      map.on('render', () => {
        console.log('[MAP] render');
      });

      map.on('idle', () => {
        console.log('[MAP] idle');
      });

      map.on('error', (e) => {
        console.error('[MAP] error', e);
      });

      // ResizeObserver para detectar mudanças de tamanho
      // Garante que o mapa se adapte quando o container mudar
      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });

      resizeObserver.observe(containerRef.current);

      // Cleanup function
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

  // Log da camada de Locais (para debug)
  useEffect(() => {
    if (!loading && !error) {
      console.log('[MAP] LocalLayer ready:', {
        totalFeatures: featureCollection.features.length,
        sample: featureCollection.features.slice(0, 2),
      });
    }
    if (error) {
      console.error('[MAP] LocalLayer error:', error);
    }
  }, [featureCollection, loading, error]);

  return (
    <>
      <div
        ref={containerRef}
        className={className ? `map-canvas ${className}` : 'map-canvas'}
      />
      <LocalMarkers featureCollection={featureCollection} map={mapInstance} />
    </>
  );
}
