import { UserRepository } from '@/domain/user/repository';

export const UserService = {
  async getById(userId) {
    return UserRepository.getById(userId);
  },
};
