import { fetchMe, login } from "@/features/auth/services/auth";
import {
  clearSession,
  getAccessToken,
  setTokens,
} from "@/features/auth/lib/session";
import type { LoginPayload, PublicUser } from "@/features/auth/types/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as PublicUser | null,
    ready: false,
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.user && getAccessToken()),
    isAdmin: (s) => s.user?.role === "admin",
  },
  actions: {
    async hydrate() {
      if (!getAccessToken()) {
        this.ready = true;
        return;
      }
      try {
        this.user = await fetchMe();
      } catch {
        clearSession();
        this.user = null;
      } finally {
        this.ready = true;
      }
    },

    async login(payload: LoginPayload) {
      const tokens = await login(payload);
      setTokens(tokens);
      this.user = await fetchMe();
    },

    logout() {
      clearSession();
      this.user = null;
    },
  },
});
