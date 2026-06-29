/**
 * TrailService
 *
 * Serviço de domínio para Trilhas.
 * Consome o TrailRepository para obter dados do export.geojson.
 */

import { getAllTrails, getTrailById } from './repository';

/**
 * Entidade Trail consumível pela aplicação
 * O campo geometria contém o FeatureCollection completo do OSM
 */

export const TrailService = {
  list: async () => {
    return getAllTrails();
  },
  getById: async (id) => {
    return getTrailById(id);
  },
};