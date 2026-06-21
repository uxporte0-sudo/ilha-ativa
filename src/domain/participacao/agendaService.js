import { AtivoRepository } from '@/domain/ativo/repository';
import { ParticipacaoRepository } from '@/domain/participacao/repository';

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function toDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function byStartDate(left, right) {
  return new Date(left.ativo.dataHoraInicio).getTime() - new Date(right.ativo.dataHoraInicio).getTime();
}

function byRecentDate(left, right) {
  return new Date(right.ativo.dataHoraInicio).getTime() - new Date(left.ativo.dataHoraInicio).getTime();
}

function isCanceledParticipation(participacao) {
  return participacao?.status === 'cancelado';
}

function isConfirmedParticipation(participacao) {
  return participacao?.status === 'confirmado';
}

function isOrganizedByUser(ativo, userId) {
  return ativo.organizadorId === userId;
}

function isFutureOrToday(ativo, referenceDate) {
  return new Date(ativo.dataHoraInicio).getTime() >= startOfDay(referenceDate).getTime();
}

function isPast(ativo, referenceDate) {
  return new Date(ativo.dataHoraFim || ativo.dataHoraInicio).getTime() < startOfDay(referenceDate).getTime();
}

function isAgendaRelated(item, userId) {
  return isOrganizedByUser(item.ativo, userId) || Boolean(item.participacao && !isCanceledParticipation(item.participacao));
}

function isDayCommitment(item, userId) {
  return isOrganizedByUser(item.ativo, userId) || isConfirmedParticipation(item.participacao);
}

function isFutureCommitment(item, userId, referenceDate) {
  return isFutureOrToday(item.ativo, referenceDate) && isAgendaRelated(item, userId);
}

function isHistoricItem(item, userId, referenceDate) {
  return (
    item.ativo.status === 'realizado' ||
    (isPast(item.ativo, referenceDate) && isAgendaRelated(item, userId))
  );
}

function buildMarkers(items) {
  return items.reduce((markers, item) => {
    const key = toDateKey(item.ativo.dataHoraInicio);
    markers[key] = (markers[key] ?? 0) + 1;
    return markers;
  }, {});
}

export const AgendaService = {
  async getAgendaForUser(userId, { periodoInicio, periodoFim } = {}) {
    const [ativos, participacoes] = await Promise.all([
      periodoInicio && periodoFim
        ? AtivoRepository.listByPeriod(periodoInicio, periodoFim)
        : AtivoRepository.list(),
      ParticipacaoRepository.listByUser(userId),
    ]);
    const participacoesPorAtivo = new Map(
      participacoes.map((participacao) => [participacao.ativoId, participacao])
    );

    return ativos
      .filter((ativo) => participacoesPorAtivo.has(ativo.id) || ativo.organizadorId === userId)
      .map((ativo) => ({
        ativo,
        participacao: participacoesPorAtivo.get(ativo.id) ?? null,
        isOrganizador: ativo.organizadorId === userId,
      }));
  },

  async getAgendaProjection(userId, { periodoInicio, periodoFim, diaSelecionado, referenceDate = new Date() } = {}) {
    const items = await this.getAgendaForUser(userId, { periodoInicio, periodoFim });
    const selectedDay = diaSelecionado ? new Date(diaSelecionado) : new Date(referenceDate);
    const selectedDayKey = toDateKey(selectedDay);
    const relatedItems = items.filter((item) => isAgendaRelated(item, userId));

    const ativosDoDia = relatedItems
      .filter((item) => toDateKey(item.ativo.dataHoraInicio) === selectedDayKey)
      .filter((item) => isDayCommitment(item, userId))
      .sort(byStartDate);

    const proximosAtivos = relatedItems
      .filter((item) => isFutureCommitment(item, userId, referenceDate))
      .sort(byStartDate)
      .slice(0, 8);

    const historicoRecente = relatedItems
      .filter((item) => isHistoricItem(item, userId, referenceDate))
      .sort(byRecentDate)
      .slice(0, 8);

    return {
      items: relatedItems.sort(byStartDate),
      markers: buildMarkers(relatedItems),
      ativosDoDia,
      proximosAtivos,
      historicoRecente,
    };
  },
};
