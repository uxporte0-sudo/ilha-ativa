import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

/**
 * LocalPin
 *
 * Encapsula a criacao de um Marker do MapLibre para um Local.
 * Utiliza o marcador padrao do MapLibre.
 *
 * Props:
 * @param {Object} props.map - Instancia do mapa MapLibre
 * @param {number} props.latitude - Latitude do Local
 * @param {number} props.longitude - Longitude do Local
 * @param {Function} props.onClick - Callback (longitude, latitude) ao clicar
 */
export default function LocalPin({ map, latitude, longitude, onClick }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return;
    }

    const marker = new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    if (onClick) {
      const element = marker.getElement();
      element.style.cursor = 'pointer';
      element.addEventListener('click', () => onClick(longitude, latitude));
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, latitude, longitude, onClick]);

  return null;
}
