import {
  login as demoLogin,
  logout as demoLogout,
  register as demoRegister,
  getCurrentUser,
} from '@/domain/user/demoSession';

export class AuthService {
  static async login(credentials) {
    const user = demoLogin(credentials.email);

    return {
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      preferenciasPendentes: user.preferenciasEsportivas.length === 0,
    };
  }

  static async register(userData) {
    const user = demoRegister(userData);

    return {
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      preferenciasPendentes: user.preferenciasEsportivas.length === 0,
    };
  }

  static async getCurrentSession() {
    const user = getCurrentUser();

    return {
      user,
      isAuthenticated: Boolean(user?.id),
      isLoading: false,
      error: null,
      preferenciasPendentes: user ? user.preferenciasEsportivas.length === 0 : true,
    };
  }

  static async logout() {
    demoLogout();
    return Promise.resolve();
  }
}