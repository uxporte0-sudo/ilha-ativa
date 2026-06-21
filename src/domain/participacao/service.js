import { AtivoRulesService } from '@/domain/ativo/rulesService';
import { ParticipacaoRepository } from '@/domain/participacao/repository';

function now() {
  return new Date().toISOString();
}

function assertCanAct(condition, message) {
  if (!condition) throw new Error(message);
}

export const ParticipacaoService = {
  async listByUser(userId) {
    return ParticipacaoRepository.listByUser(userId);
  },

  async listByAtivo(ativoId) {
    return ParticipacaoRepository.listByAtivo(ativoId);
  },

  async getActiveParticipation(userId, ativoId) {
    return ParticipacaoRepository.getActiveByUserAndAtivo(userId, ativoId);
  },

  canDemonstrarInteresse({ ativo, participacao } = {}) {
    return AtivoRulesService.canConfirmParticipation(ativo) && !participacao;
  },

  canConfirmar({ ativo, participacao } = {}) {
    return (
      AtivoRulesService.canConfirmParticipation(ativo) &&
      (!participacao || participacao.status === 'interessado')
    );
  },

  canCancelar({ ativo, participacao } = {}) {
    return Boolean(participacao?.id && participacao.status !== 'cancelado' && ativo?.status !== 'realizado');
  },

  getParticipationActions({ ativo, participacao } = {}) {
    return {
      canDemonstrarInteresse: this.canDemonstrarInteresse({ ativo, participacao }),
      canConfirmar: this.canConfirmar({ ativo, participacao }),
      canCancelar: this.canCancelar({ ativo, participacao }),
    };
  },

  async demonstrarInteresse(userId, ativoId, ativo) {
    const active = await this.getActiveParticipation(userId, ativoId);
    assertCanAct(
      this.canDemonstrarInteresse({ ativo, participacao: active }),
      'Nao e possivel demonstrar interesse neste Ativo.'
    );

    const timestamp = now();
    return ParticipacaoRepository.create({
      id: `participacao-${ativoId}-${userId}`,
      ativoId,
      userId,
      status: 'interessado',
      dataInteresse: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },

  async confirmar(userId, ativoId, ativo) {
    const active = await this.getActiveParticipation(userId, ativoId);
    assertCanAct(
      this.canConfirmar({ ativo, participacao: active }),
      'Nao e possivel confirmar participacao neste Ativo.'
    );

    const timestamp = now();
    if (active) {
      return ParticipacaoRepository.update(active.id, {
        status: 'confirmado',
        dataConfirmacao: timestamp,
        updatedAt: timestamp,
      });
    }

    return ParticipacaoRepository.create({
      id: `participacao-${ativoId}-${userId}`,
      ativoId,
      userId,
      status: 'confirmado',
      dataConfirmacao: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },

  async cancelar(userId, ativoId, ativo) {
    const active = await this.getActiveParticipation(userId, ativoId);
    assertCanAct(
      this.canCancelar({ ativo, participacao: active }),
      'Nao e possivel cancelar participacao neste Ativo.'
    );

    return ParticipacaoRepository.update(active.id, {
      status: 'cancelado',
      dataCancelamento: now(),
      updatedAt: now(),
    });
  },
};
