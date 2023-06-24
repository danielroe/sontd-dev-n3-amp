import { defineStore } from 'pinia';
import { User } from '../types';

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => {
    return {
      user: null as null | User,
    };
  },

  getters: {
    loggedIn(): boolean {
      return !!this.user;
    },
  },

  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
  },
});
