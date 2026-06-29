import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { getModalidadeEmoji } from '@/utils/modalidadeEmoji';

/**
 * AtivoPin
 *
 * Encapsula a criação de um Marker do MapLibre para um Ativo.
 * Utiliza o emoji da modalidade como elemento visual.
 *
 * O AtivoPin utiliza as coordenadas do Local como referência e distribui
 * os Ativos radialmente ao redor do LocalPin.
 *
 * Props:
 * @param {Object} props.map - Instância do mapa MapLibre
 * @param {number} props.latitude - Latitude do Local de referência
 * @param {number} props.longitude - Longitude do Local de referência
 * @param {Object} props.entity - Dados do Ativo
 * @param {Function} props.onOpen - Callback (entity) ao clicar
 * @param {number} props.index - Índice do Ativo na lista (para distribuição radial)
 * @param {number} props.total - Total de Ativos no Local (para distribuição radial)
 */
export default function AtivoPin({ map, latitude, longitude, entity, onOpen, index = 0, total = 1 }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return;
    }

    // Calcular posição radial ao redor do Local
    // Raio extremamente pequeno (~20m) para manter Ativos visualmente associados ao Local
    const raio = 0.0002;
    const angulo = (2 * Math.PI * index) / total; // Distribuição igualmente espaçada
    const latOffset = raio * Math.cos(angulo);
    const lngOffset = raio * Math.sin(angulo);

    const ativoLat = latitude + latOffset;
    const ativoLng = longitude + lngOffset;

    // Criar elemento customizado com emoji
    const emoji = getModalidadeEmoji(entity.modalidade);
    const element = document.createElement('div');
    element.className = 'ativo-pin';
    element.innerHTML = `<span class="ativo-pin-emoji">${emoji}</span>`;
    element.style.cursor = 'pointer';
    element.style.fontSize = '24px';
    element.style.lineHeight = '1';
    element.setAttribute('aria-label', entity.titulo || 'Ativo');

    const marker = new maplibregl.Marker({ element })
      .setLngLat([ativoLng, ativoLat])
      .addTo(map);

    markerRef.current = marker;

    if (onOpen && entity) {
      element.addEventListener('click', () => onOpen(entity));
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, latitude, longitude, entity, onOpen, index, total]);

  return null;
}