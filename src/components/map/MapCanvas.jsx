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
 * Componente de renderizacao do mapa usando MapLibre GL.
 * Utiliza ResizeObserver para detectar mudancas de tamanho do container
 * e atualizar o mapa automaticamente.
 *
 * Consome a camada LocalLayer para obter os Locais preparados para renderizacao.
 * Os marcadores dos Locais sao renderizados pelo componente LocalMarkers.
 *
 * @param {Object} props
 * @param {string} props.className - Classes CSS adicionais
 * @param {Function} props.onSelectLocal - Callback (longitude, latitude, props) ao clicar pin
 */
export default function MapCanvas({ className, onSelectLocal }) {
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

  return (
    <>
      <div
        ref={containerRef}
        className={className ? 'map-canvas ' + className : 'map-canvas'}
      />
      <LocalMarkers featureCollection={featureCollection} map={mapInstance} onSelectLocal={onSelectLocal} />
    </>
  );
}
