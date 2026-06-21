import { DEFAULT_CREATED_AT } from '@/domain/shared/date';

export function createRetrospectiva(data = {}) {
  return {
    id: data.id,
    userId: data.userId,
    periodoInicio: data.periodoInicio,
    periodoFim: data.periodoFim,
    ativosParticipados: data.ativosParticipados ?? [],
    modalidadesPraticadas: data.modalidadesPraticadas ?? [],
    horasAtivas: data.horasAtivas ?? 0,
    locaisVisitados: data.locaisVisitados ?? [],
    novosContatos: data.novosContatos,
    conquistas: data.conquistas,
    comparativos: data.comparativos,
    createdAt: data.createdAt ?? DEFAULT_CREATED_AT,
    updatedAt: data.updatedAt ?? data.createdAt ?? DEFAULT_CREATED_AT,
  };
}
