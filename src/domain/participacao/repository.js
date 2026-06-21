import { officialDataSource } from '@/data/officialDataSource';
import { createParticipacao } from '@/domain/participacao/model';

async function listOfficialParticipacoes() {
  const participacoes = await officialDataSource.participacoes.list();
  return participacoes.map(createParticipacao);
}

export const ParticipacaoRepository = {
  async list() {
    return listOfficialParticipacoes();
  },

  async getById(participacaoId) {
    const participacoes = await this.list();
    return participacoes.find((participacao) => participacao.id === participacaoId) ?? null;
  },

  async listByUser(userId) {
    const participacoes = await this.list();
    return participacoes.filter((participacao) => participacao.userId === userId);
  },

  async listByAtivo(ativoId) {
    const participacoes = await this.list();
    return participacoes.filter((participacao) => participacao.ativoId === ativoId);
  },

  async getActiveByUserAndAtivo(userId, ativoId) {
    const participacoes = await this.listByUser(userId);
    return (
      participacoes.find(
        (participacao) =>
          participacao.ativoId === ativoId && participacao.status !== 'cancelado'
      ) ?? null
    );
  },

  async create(data) {
    const participacao = createParticipacao(data);
    const createdParticipacao = await officialDataSource.participacoes.create(participacao);
    return createParticipacao(createdParticipacao);
  },

  async update(participacaoId, data) {
    const updatedParticipacao = await officialDataSource.participacoes.update(participacaoId, data);
    return updatedParticipacao ? createParticipacao(updatedParticipacao) : null;
  },
};
