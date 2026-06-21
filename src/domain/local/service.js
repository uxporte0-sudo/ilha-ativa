import { LocalRepository } from '@/domain/local/repository';

export const LocalService = {
  async list() {
    return LocalRepository.list();
  },

  async getById(localId) {
    return LocalRepository.getById(localId);
  },

  async search(params = {}) {
    return LocalRepository.search(params);
  },

  async listTrending(limit) {
    return LocalRepository.listTrending(limit);
  },
};
