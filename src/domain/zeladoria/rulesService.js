export const ZeladoriaRulesService = {
  validateForCreate(zeladoria) {
    const errors = [];

    if (!zeladoria?.localId) errors.push('localId obrigatorio');
    if (!zeladoria?.criadorId) errors.push('criadorId obrigatorio');
    if (!zeladoria?.titulo) errors.push('titulo obrigatorio');
    if (!zeladoria?.descricao) errors.push('descricao obrigatoria');

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  getInitialStatus() {
    return 'aberto';
  },
};
