import { DEFAULT_CREATED_AT } from '@/domain/shared/date';

export const participacaoStatus = ['interessado', 'confirmado', 'participou', 'cancelado'];

export function createParticipacao(data = {}) {
  return {
    id: data.id,
    ativoId: data.ativoId,
    userId: data.userId,
    status: data.status ?? 'interessado',
    dataInteresse: data.dataInteresse,
    dataConfirmacao: data.dataConfirmacao,
    dataCancelamento: data.dataCancelamento,
    createdAt: data.createdAt ?? DEFAULT_CREATED_AT,
    updatedAt: data.updatedAt ?? data.createdAt ?? DEFAULT_CREATED_AT,
  };
}
