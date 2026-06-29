import { defineStore } from 'pinia';

interface User {
  name: string;
  userId: number;
}

export const useUserStore = defineStore('user', {
  state: (): { user: User | null } => {
    const storedUser = localStorage.getItem('user');
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  },

  getters: {
    userName: (state): string | null => {
      return state.user?.name || null;
    },

    userId: (state): number | null => {
      return state.user?.userId || null;
    },
  },

  actions: {
    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    clearUser() {
      this.user = null;
      localStorage.removeItem('user');
    },
  },
});
