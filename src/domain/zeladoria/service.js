import { ZeladoriaRepository } from '@/domain/zeladoria/repository';
import { ZeladoriaRulesService } from '@/domain/zeladoria/rulesService';

export const ZeladoriaService = {
  async list() {
    return ZeladoriaRepository.list();
  },

  async getById(zeladoriaId) {
    return ZeladoriaRepository.getById(zeladoriaId);
  },

  async listByLocal(localId) {
    return ZeladoriaRepository.listByLocal(localId);
  },

  async create(data) {
    const validation = ZeladoriaRulesService.validateForCreate(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }
    return ZeladoriaRepository.create(data);
  },

  validateForCreate(data) {
    return ZeladoriaRulesService.validateForCreate(data);
  },

  getInitialStatus() {
    return ZeladoriaRulesService.getInitialStatus();
  },
};