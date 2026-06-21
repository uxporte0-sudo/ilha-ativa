import { DEFAULT_CREATED_AT } from '@/domain/shared/date';

export const ativoStatus = ['rascunho', 'publicado', 'confirmado', 'realizado', 'cancelado'];

export function createAtivo(data = {}) {
  return {
    id: data.id,
    titulo: data.titulo,
    descricao: data.descricao,
    modalidade: data.modalidade,
    organizadorId: data.organizadorId,
    localId: data.localId,
    dataHoraInicio: data.dataHoraInicio,
    dataHoraFim: data.dataHoraFim,
    minimoParticipantes: data.minimoParticipantes,
    maximoParticipantes: data.maximoParticipantes,
    nivelDificuldade: data.nivelDificuldade,
    privacidade: data.privacidade ?? 'publico',
    faixaEtaria: data.faixaEtaria,
    generoPermitido: data.generoPermitido,
    recomendacoes: data.recomendacoes,
    status: data.status ?? 'rascunho',
    createdAt: data.createdAt ?? DEFAULT_CREATED_AT,
    updatedAt: data.updatedAt ?? data.createdAt ?? DEFAULT_CREATED_AT,
  };
}
