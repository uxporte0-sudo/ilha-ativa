import { createLocal } from '@/domain/local/model';
import { DEFAULT_CREATED_AT } from '@/domain/shared/date';

const DEFAULT_COORDINATES = {
  latitude: -23.7785,
  longitude: -45.3581,
};

export function courtToLocal(court = {}) {
  return createLocal({
    id: court.id,
    nome: court.nome ?? court.name ?? '',
    descricao: court.descricao ?? court.description,
    categoria: court.categoria ?? court.type ?? 'quadra',
    latitude: Number(court.latitude ?? DEFAULT_COORDINATES.latitude),
    longitude: Number(court.longitude ?? DEFAULT_COORDINATES.longitude),
    endereco: court.endereco ?? court.location,
    bairro: court.bairro ?? court.location,
    cidade: court.cidade ?? 'Ilhabela',
    fotos: court.fotos ?? (court.image_url ? [court.image_url] : undefined),
    acessibilidade: court.acessibilidade,
    estrutura: court.estrutura,
    status: court.status,
    createdAt: court.createdAt ?? court.created_date,
    updatedAt: court.updatedAt ?? court.updated_date ?? court.created_date,
  });
}

export function trailToLocal(trail = {}) {
  const coords = trail.geometry?.features?.[0]?.geometry?.coordinates?.[0] || [DEFAULT_COORDINATES.longitude, DEFAULT_COORDINATES.latitude];
  
  return createLocal({
    id: trail.id,
    nome: trail.nome,
    descricao: trail.descricao || '',
    categoria: 'trilha',
    tipoCategoria: 'trilha',
    latitude: coords[1],
    longitude: coords[0],
    endereco: '',
    bairro: '',
    cidade: 'Ilhabela',
    fotos: undefined,
    acessibilidade: undefined,
    estrutura: undefined,
    status: 'ativo',
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_CREATED_AT,
  });
}
