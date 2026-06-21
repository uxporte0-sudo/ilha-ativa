import { AtivoRepository } from '@/domain/ativo/repository';

export const AtivoService = {
  async list() {
    return AtivoRepository.list();
  },

  async getById(ativoId) {
    return AtivoRepository.getById(ativoId);
  },

  async listByLocal(localId) {
    return AtivoRepository.listByLocal(localId);
  },

  async create(data) {
    return AtivoRepository.create(data);
  },
};
