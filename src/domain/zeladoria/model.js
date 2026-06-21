import { DEFAULT_CREATED_AT } from '@/domain/shared/date';

export const zeladoriaStatus = ['aberto', 'em_analise', 'resolvido', 'arquivado'];

export function createZeladoria(data = {}) {
  return {
    id: data.id,
    criadorId: data.criadorId,
    localId: data.localId,
    titulo: data.titulo,
    tipo: data.tipo,
    descricao: data.descricao,
    fotos: data.fotos,
    status: data.status ?? 'aberto',
    dataCriacao: data.dataCriacao ?? data.createdAt ?? DEFAULT_CREATED_AT,
    dataResolucao: data.dataResolucao,
    createdAt: data.createdAt ?? DEFAULT_CREATED_AT,
    updatedAt: data.updatedAt ?? data.createdAt ?? DEFAULT_CREATED_AT,
  };
}
