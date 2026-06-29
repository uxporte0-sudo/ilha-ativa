/**
 * TrailRepository
 *
 * Responsável por carregar e processar o export.geojson
 * fornecido pelo OpenStreetMap via Overpass Turbo.
 */

let trailsCache = null;
let rawCache = null;

/**
 * Mapeia propriedades do OSM para formato interno
 */
function mapProperties(osmProperties) {
  const name = osmProperties.name || 'Trilha sem nome';
  
  // Mapeia dificuldade do sac_scale do OSM
  let dificuldade = 'moderada';
  const sacScale = osmProperties.sac_scale;
  if (sacScale) {
    if (['hiking', 'T1'].includes(sacScale)) {
      dificuldade = 'facil';
    } else if (['mountain_hiking', 'T2'].includes(sacScale)) {
      dificuldade = 'moderada';
    } else if (['demanding_mountain_hiking', 'T3', 'T4'].includes(sacScale)) {
      dificuldade = 'dificil';
    }
  }

  return {
    id: osmProperties['@id'] || osmProperties.id,
    nome: name,
    descricao: osmProperties.description || '',
    dificuldade: dificuldade,
    superficie: osmProperties.surface || '',
    visibilidade: osmProperties.trail_visibility || '',
  };
}

/**
 * Agrupa features por nome e monta FeatureCollection para cada trilha
 */
function groupFeaturesByName(features) {
  const groups = {};

  for (const feature of features) {
    const name = feature.properties?.name || 'sem_nome';
    
    if (!groups[name]) {
      groups[name] = {
        type: 'FeatureCollection',
        features: [],
      };
    }
    
    groups[name].features.push(feature);
  }

  return groups;
}

/**
 * Calcula a distância total em km a partir das coordenadas
 */
function calculateDistance(features) {
  let totalDistance = 0;
  
  for (const feature of features) {
    const coords = feature.geometry?.coordinates || [];
    for (let i = 1; i < coords.length; i++) {
      const [lon1, lat1] = coords[i - 1];
      const [lon2, lat2] = coords[i];
      totalDistance += haversineDistance(lat1, lon1, lat2, lon2);
    }
  }
  
  return Math.round(totalDistance * 10) / 10;
}

/**
 * Haversine distance em km
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Monta a entidade Trail a partir de um grupo de features
 */
function buildTrail(featureCollection, index) {
  const features = featureCollection.features;
  const firstFeature = features[0];
  const osmProps = firstFeature.properties || {};

  const id = osmProps.name
    ? osmProps.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    : 'trail-' + index;

  const distancia = calculateDistance(features);
  const duracao = Math.round(distancia * 20);

  return {
    id: id,
    nome: osmProps.name || 'Trilha sem nome',
    descricao: osmProps.description || '',
    distancia: distancia,
    duracao: duracao,
    dificuldade: mapProperties(osmProps).dificuldade,
    propriedades: mapProperties(osmProps),
    geometry: featureCollection,
  };
}

async function loadExportGeoJSON() {
  if (rawCache) {
    return rawCache;
  }
  const response = await fetch('/ilha-ativa/export.geojson');
  if (!response.ok) {
    throw new Error('Failed to load export.geojson: ' + response.status);
  }
  rawCache = await response.json();
  return rawCache;
}

async function processTrails() {
  if (trailsCache) {
    return trailsCache;
  }
  const featureCollection = await loadExportGeoJSON();
  const groupedFeatures = groupFeaturesByName(featureCollection.features || []);
  trailsCache = Object.values(groupedFeatures).map((fc, i) => buildTrail(fc, i));
  return trailsCache;
}

export async function getAllTrails() {
  return processTrails();
}

export async function getTrailById(id) {
  const trails = await processTrails();
  return trails.find((t) => t.id === id);
}

export async function getRawFeatureCollection() {
  return loadExportGeoJSON();
}

export const TrailRepository = {
  getAll: getAllTrails,
  getById: getTrailById,
  getRawFeatureCollection,
};
