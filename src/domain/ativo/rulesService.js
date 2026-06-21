export const AtivoRulesService = {
  canPublish(ativo) {
    return this.validateForPublish(ativo).valid;
  },

  validateForPublish(ativo) {
    const errors = [];

    if (!ativo?.organizadorId) errors.push('organizadorId obrigatorio');
    if (!ativo?.modalidade) errors.push('modalidade obrigatoria');
    if (!ativo?.localId) errors.push('localId obrigatorio');
    if (!ativo?.dataHoraInicio) errors.push('dataHoraInicio obrigatoria');
    if (!ativo?.dataHoraFim) errors.push('dataHoraFim obrigatoria');
    if (ativo?.dataHoraInicio && ativo?.dataHoraFim) {
      const startsAt = new Date(ativo.dataHoraInicio).getTime();
      const endsAt = new Date(ativo.dataHoraFim).getTime();
      if (endsAt <= startsAt) errors.push('dataHoraFim deve ser posterior a dataHoraInicio');
    }
    if (Number(ativo?.minimoParticipantes) <= 0) {
      errors.push('minimoParticipantes deve ser maior que zero');
    }
    if (
      ativo?.maximoParticipantes !== undefined &&
      Number(ativo.maximoParticipantes) < Number(ativo.minimoParticipantes)
    ) {
      errors.push('maximoParticipantes deve ser maior ou igual a minimoParticipantes');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  canConfirmParticipation(ativo) {
    return !['cancelado', 'realizado'].includes(ativo?.status);
  },
};
