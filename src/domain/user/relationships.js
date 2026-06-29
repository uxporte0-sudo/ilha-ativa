import { AtivoRepository } from '@/domain/ativo/repository';
import { ParticipacaoRepository } from '@/domain/participacao/repository';
import { ZeladoriaRepository } from '@/domain/zeladoria/repository';
import { RetrospectivaRepository } from '@/domain/retrospectiva/repository';
import { officialDataSource } from '@/data/officialDataSource';

export const UserRelationships = {
  async getCreatedAtivos(userId) {
    const ativos = await AtivoRepository.list();
    return ativos.filter((ativo) => ativo.organizadorId === userId);
  },

  async getParticipacoes(userId) {
    return ParticipacaoRepository.listByUser(userId);
  },

  async getParticipatingAtivos(userId) {
    const participacoes = await ParticipacaoRepository.listByUser(userId);
    const ativos = await AtivoRepository.list();

    const ativosIds = participacoes
      .filter((p) => p.status !== 'cancelado')
      .map((p) => p.ativoId);

    return ativos.filter((ativo) => ativosIds.includes(ativo.id));
  },

  async getCreatedZeladorias(userId) {
    const zeladorias = await ZeladoriaRepository.list();
    return zeladorias.filter((zeladoria) => zeladoria.criadorId === userId);
  },

  async getRetrospectiva(userId, periodoInicio, periodoFim) {
    return RetrospectivaRepository.getByUserAndPeriod(userId, periodoInicio, periodoFim);
  },

  async getFriends(userId) {
    try {
      const amizades = await officialDataSource.amizades.filter({ userId });
      return amizades.map((a) => a.friendId);
    } catch {
      return [];
    }
  },
};