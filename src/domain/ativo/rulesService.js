// TEMPORÁRIO:
// Validações de obrigatoriedade desabilitadas durante a fase de validação de UX.
// Reativar antes da integração definitiva com o backend.

export const AtivoRulesService = {
  canPublish(ativo) {
    return this.validateForPublish(ativo).valid;
  },

  validateForPublish(ativo) {
    const errors = [];

    // TEMPORÁRIO: Validações de obrigatoriedade desabilitadas
    // if (!ativo?.organizadorId) errors.push('organizadorId obrigatorio');
    // if (!ativo?.modalidade) errors.push('modalidade obrigatoria');
    // if (!ativo?.localId) errors.push('localId obrigatorio');
    // if (!ativo?.titulo?.trim()) errors.push('titulo obrigatorio');
    // if (!ativo?.dataHoraInicio) errors.push('dataHoraInicio obrigatoria');
    // if (!ativo?.dataHoraFim) errors.push('dataHoraFim obrigatoria');
    if (ativo?.dataHoraInicio && ativo?.dataHoraFim) {
      const startsAt = new Date(ativo.dataHoraInicio).getTime();
      const endsAt = new Date(ativo.dataHoraFim).getTime();
      if (endsAt <= startsAt) errors.push('dataHoraFim deve ser posterior a dataHoraInicio');
    }
    // TEMPORÁRIO: Validações de obrigatoriedade desabilitadas
    // if (Number(ativo?.minimoParticipantes) <= 0) {
    //   errors.push('minimoParticipantes deve ser maior que zero');
    // }
    if (
      ativo?.maximoParticipantes !== undefined &&
      Number(ativo.maximoParticipantes) < Number(ativo.minimoParticipantes)
    ) {
      errors.push('maximoParticipantes deve ser maior ou igual a minimoParticipantes');
    }
    // TEMPORÁRIO: Validações de obrigatoriedade desabilitadas
    // if (!ativo?.privacidade) {
    //   errors.push('privacidade obrigatoria');
    // }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  canConfirmParticipation(ativo) {
    return !['cancelado', 'realizado'].includes(ativo?.status);
  },
};
