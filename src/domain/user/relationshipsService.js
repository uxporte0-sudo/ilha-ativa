import { AtivoRepository } from '@/domain/ativo/repository';
import { ParticipacaoRepository } from '@/domain/participacao/repository';
import { ZeladoriaRepository } from '@/domain/zeladoria/repository';
import { RetrospectivaRepository } from '@/domain/retrospectiva/repository';
import { officialDataSource } from '@/data/officialDataSource';

export const UserRelationshipsService = {
  async ativosCriados(userId) {
    const ativos = await AtivoRepository.list();
    return ativos.filter((ativo) => ativo.organizadorId === userId);
  },

  async ativosParticipando(userId) {
    const participacoes = await ParticipacaoRepository.listByUser(userId);
    const ativos = await AtivoRepository.list();

    const ativosIds = participacoes
      .filter((p) => p.status !== 'cancelado')
      .map((p) => p.ativoId);

    return ativos.filter((ativo) => ativosIds.includes(ativo.id));
  },

  async participacoes(userId) {
    return ParticipacaoRepository.listByUser(userId);
  },

  async retrospectiva(userId, periodoInicio, periodoFim) {
    return RetrospectivaRepository.getByUserAndPeriod(userId, periodoInicio, periodoFim);
  },

  async zeladorias(userId) {
    const zeladorias = await ZeladoriaRepository.list();
    return zeladorias.filter((zeladoria) => zeladoria.criadorId === userId);
  },

  async amigos(userId) {
    const amizades = await officialDataSource.amizades.filter({ userId });
    return amizades.map((a) => a.friendId);
  },

  async adicionarAmigo(userId, friendId) {
    const existing = await officialDataSource.amizades.filter({ userId, friendId });
    if (existing.length > 0) {
      return existing[0];
    }

    const amizade = await officialDataSource.amizades.create({
      userId,
      friendId,
      status: 'ativo',
      createdAt: new Date().toISOString(),
    });

    await officialDataSource.amizades.create({
      userId: friendId,
      friendId: userId,
      status: 'ativo',
      createdAt: new Date().toISOString(),
    });

    return amizade;
  },

  async removerAmigo(userId, friendId) {
    const amizades = await officialDataSource.amizades.list();
    const toRemove = amizades.filter(
      (a) =>
        (a.userId === userId && a.friendId === friendId) ||
        (a.userId === friendId && a.friendId === userId)
    );

    for (const amizade of toRemove) {
      await officialDataSource.amizades.delete(amizade.id);
    }

    return true;
  },
};