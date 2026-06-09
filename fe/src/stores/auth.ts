import { defineStore } from 'pinia';
import { useUserStore } from './user';
import AuthController from '@/network/lib/auth';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const token = localStorage.getItem('access_token');
    return {
      isAuthenticated: !!token,
      token: token,
    };
  },

  getters: {
    isSessionValid: (state): boolean => {
      return !!state.token;
    },
  },

  actions: {
    async initializeAuth() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.clearAuth();
        return false;
      }

      const authController = new AuthController();
      try {
        const user = await authController.sessionStatus();
        if (user) {
          this.isAuthenticated = true;
          const userStore = useUserStore();
          userStore.setUser({
            userId: user.id || (user as any).userId,
            name: user.username
          });
          return true;
        } else {
          this.clearAuth();
          return false;
        }
      } catch (error) {
        this.clearAuth();
        return false;
      }
    },

    setToken(token: string) {
      this.token = token;
      this.isAuthenticated = true;
      localStorage.setItem('access_token', token);
    },

    setAuthenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated;
    },

    clearAuth() {
      this.isAuthenticated = false;
      this.token = null;
      localStorage.removeItem('access_token');

      const userStore = useUserStore();
      userStore.clearUser();
    },
  }
});
