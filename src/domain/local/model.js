import { DEFAULT_CREATED_AT } from '@/domain/shared/date';

export function createLocal(data = {}) {
  return {
    id: data.id,
    nome: data.nome,
    descricao: data.descricao,
    categoria: data.categoria,
    tipoCategoria: data.tipoCategoria || 'local',
    latitude: data.latitude,
    longitude: data.longitude,
    endereco: data.endereco,
    bairro: data.bairro,
    cidade: data.cidade,
    fotos: data.fotos,
    acessibilidade: data.acessibilidade,
    estrutura: data.estrutura,
    status: data.status,
    createdAt: data.createdAt ?? DEFAULT_CREATED_AT,
    updatedAt: data.updatedAt ?? data.createdAt ?? DEFAULT_CREATED_AT,
  };
}
