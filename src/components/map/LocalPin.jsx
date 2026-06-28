import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

/**
 * LocalPin
 *
 * Encapsula a criação de um Marker do MapLibre para um Local.
 * Utiliza o marcador padrão do MapLibre.
 *
 * Props:
 * @param {Object} props.map - Instância do mapa MapLibre
 * @param {number} props.latitude - Latitude do Local
 * @param {number} props.longitude - Longitude do Local
 */
export default function LocalPin({ map, latitude, longitude }) {
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
