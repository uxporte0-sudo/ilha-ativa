import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

/**
 * AtivoPin
 *
 * Encapsula a criação de um Marker do MapLibre para um Ativo.
 * Utiliza o marcador padrão do MapLibre.
 *
 * Props:
 * @param {Object} props.map - Instância do mapa MapLibre
 * @param {number} props.latitude - Latitude do Ativo
 * @param {number} props.longitude - Longitude do Ativo
 */
export default function AtivoPin({ map, latitude, longitude }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return;
    }

    const marker = new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, latitude, longitude]);

  return null;
}
