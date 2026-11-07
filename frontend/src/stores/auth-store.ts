import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("businessos_token", token);
      localStorage.setItem("businessos_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("businessos_token");
      localStorage.removeItem("businessos_user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("businessos_token");
      const userStr = localStorage.getItem("businessos_user");
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          set({ user, token, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      }
    }
  },
}));
