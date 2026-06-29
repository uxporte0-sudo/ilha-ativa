import { useState, useEffect } from 'react';
import { officialDataSource } from '@/data/officialDataSource';

/**
 * LocalLayer
 *
 * Camada de adaptação entre a base oficial de Locais e o mapa.
 * Responsável por consumir os Locais e transformá-los em uma coleção
 * pronta para renderização (GeoJSON FeatureCollection).
 *
 * NÃO renderiza markers. A responsabilidade termina na preparação dos dados.
 */

/**
 * Transforma um Local oficial em uma Feature GeoJSON.
 * @param {Object} local - Local da base oficial
 * @returns {Object} Feature GeoJSON
 */
export function localToFeature(local) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [local.longitude, local.latitude],
    },
    properties: {
      id: local.id,
      nome: local.nome,
      categoria: local.categoria,
      tipoCategoria: local.tipoCategoria || 'local',
      esportes: local.esportes ?? [],
      endereco: local.endereco,
      bairro: local.bairro,
      status: local.status,
    },
  };
}

/**
 * Transforma a coleção de Locais em uma FeatureCollection GeoJSON.
 * @param {Array} locais - Lista de Locais da base oficial
 * @returns {Object} FeatureCollection GeoJSON
 */
export function locaisToFeatureCollection(locais) {
  return {
    type: 'FeatureCollection',
    features: locais
      .filter((local) => typeof local.latitude === 'number' && typeof local.longitude === 'number')
      .map(localToFeature),
  };
}

/**
 * Hook que consome a base oficial de Locais e retorna a coleção
 * pronta para renderização no mapa.
 *
 * @param {Object} options - Opções de configuração
 * @param {string} [options.sortBy] - Campo para ordenação
 * @param {number} [options.limit] - Limite de registros
 * @returns {{ locais: Object[], featureCollection: Object, loading: boolean, error: Error|null }}
 */
export function useLocalLayer({ sortBy, limit } = {}) {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await officialDataSource.locais.list(sortBy, limit);
        if (!cancelled) {
          setLocais(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [sortBy, limit]);

  return {
    locais,
    featureCollection: locaisToFeatureCollection(locais),
    loading,
    error,
  };
}

/**
 * Componente LocalLayer.
 *
 * Camada de dados que prepara os Locais para renderização no mapa.
 * Não renderiza nenhum elemento visual diretamente.
 *
 * Expõe os dados preparados via render prop `children`.
 *
 * @param {Object} props
 * @param {Function} props.children - Render prop que recebe { locais, featureCollection, loading, error }
 * @param {string} [props.sortBy] - Campo para ordenação
 * @param {number} [props.limit] - Limite de registros
 */
export default function LocalLayer({ children, sortBy, limit }) {
  const data = useLocalLayer({ sortBy, limit });

  if (typeof children === 'function') {
    return children(data);
  }

  return null;
}
