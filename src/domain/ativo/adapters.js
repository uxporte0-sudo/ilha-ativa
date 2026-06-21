import { addHours, toIsoDateTime } from '@/domain/shared/date';
import { createAtivo } from '@/domain/ativo/model';

const DEFAULT_LOCAL_ID = 'local-pendente';
const DEFAULT_USER_ID = 'user-pendente';

export function atividadeToAtivo(atividade = {}, options = {}) {
  const dataHoraInicio = toIsoDateTime(atividade.data ?? atividade.dataHoraInicio);

  return createAtivo({
    id: atividade.id,
    titulo: atividade.titulo ?? atividade.nome ?? '',
    descricao: atividade.descricao,
    modalidade: atividade.modalidade ?? atividade.tipo ?? '',
    organizadorId: atividade.organizadorId ?? options.defaultUserId ?? DEFAULT_USER_ID,
    localId: atividade.localId ?? options.defaultLocalId ?? DEFAULT_LOCAL_ID,
    dataHoraInicio,
    dataHoraFim: atividade.dataHoraFim ?? addHours(dataHoraInicio, 1),
    minimoParticipantes: Number(atividade.minimoParticipantes ?? atividade.minParticipantes ?? 1),
    maximoParticipantes: atividade.maximoParticipantes,
    nivelDificuldade: atividade.nivelDificuldade,
    privacidade: atividade.privacidade ?? 'publico',
    faixaEtaria: atividade.faixaEtaria,
    generoPermitido: atividade.generoPermitido,
    recomendacoes: atividade.recomendacoes,
    status: atividade.status ?? 'publicado',
    createdAt: atividade.createdAt ?? atividade.created_date,
    updatedAt: atividade.updatedAt ?? atividade.updated_date ?? atividade.created_date,
  });
}
