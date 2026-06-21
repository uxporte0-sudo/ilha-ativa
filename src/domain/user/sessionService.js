import { UserRepository } from '@/domain/user/repository';

export const SessionService = {
  async getSession() {
    const user = await UserRepository.getCurrent();

    return {
      user,
      isAuthenticated: Boolean(user?.id),
      isLoading: false,
      error: null,
      preferenciasPendentes: user.preferenciasEsportivas.length === 0,
    };
  },
};
