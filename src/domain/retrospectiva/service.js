import { AtivoRepository } from '@/domain/ativo/repository';
import { ParticipacaoRepository } from '@/domain/participacao/repository';
import { createRetrospectiva } from '@/domain/retrospectiva/model';
import { inPeriod } from '@/domain/shared/date';

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function durationInHours(ativo) {
  const startsAt = new Date(ativo.dataHoraInicio).getTime();
  const endsAt = new Date(ativo.dataHoraFim).getTime();
  return Math.max(0, (endsAt - startsAt) / 36e5);
}

export const RetrospectivaService = {
  async calculateForUser(userId, periodoInicio, periodoFim) {
    const [ativos, participacoes] = await Promise.all([
      AtivoRepository.list(),
      ParticipacaoRepository.listByUser(userId),
    ]);
    const ativosById = new Map(ativos.map((ativo) => [ativo.id, ativo]));
    const participacoesRealizadas = participacoes.filter(
      (participacao) => participacao.status === 'participou'
    );
    const ativosParticipados = participacoesRealizadas
      .map((participacao) => ativosById.get(participacao.ativoId))
      .filter((ativo) => ativo && inPeriod(ativo.dataHoraInicio, periodoInicio, periodoFim));

    return createRetrospectiva({
      id: `retrospectiva-${userId}-${periodoInicio}-${periodoFim}`,
      userId,
      periodoInicio,
      periodoFim,
      ativosParticipados: ativosParticipados.map((ativo) => ativo.id),
      modalidadesPraticadas: unique(ativosParticipados.map((ativo) => ativo.modalidade)),
      horasAtivas: ativosParticipados.reduce((total, ativo) => total + durationInHours(ativo), 0),
      locaisVisitados: unique(ativosParticipados.map((ativo) => ativo.localId)),
      conquistas: [],
      comparativos: {},
    });
  },
};
