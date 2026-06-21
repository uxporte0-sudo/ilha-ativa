import { LocalRepository } from '@/domain/local/repository';

export const LocalDiscoveryService = {
  async search(params = {}) {
    return LocalRepository.search(params);
  },

  async listTrending(limit) {
    return LocalRepository.listTrending(limit);
  },
};
