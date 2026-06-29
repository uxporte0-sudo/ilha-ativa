import { UserRepository } from '@/domain/user/repository';

export const UserService = {
  async getById(userId) {
    return UserRepository.getById(userId);
  },

  async getByEmail(email) {
    return UserRepository.getByEmail(email);
  },

  async list() {
    return UserRepository.list();
  },

  async update(userId, data) {
    return UserRepository.update(userId, data);
  },
};