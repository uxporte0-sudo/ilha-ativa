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
 * @param {Object} props.entity - Dados do Local
 * @param {Function} props.onOpen - Callback (entity) ao clicar
 */
export default function LocalPin({ map, latitude, longitude, entity, onOpen }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return;
    }

    const marker = new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    if (onOpen && entity) {
      const element = marker.getElement();
      element.style.cursor = 'pointer';
      element.addEventListener('click', () => onOpen(entity));
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, latitude, longitude, entity, onOpen]);

  return null;
}