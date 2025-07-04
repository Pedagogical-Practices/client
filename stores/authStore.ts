import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { navigateTo } from "nuxt/app";
import type { UserDto, CreateUserInput, UpdateUserInput } from "~/types/user";

import CreateUserMutation from "~/queries/register.gql?raw";
import LoginMutation from "~/queries/login.gql?raw";
import UpdateUserMutation from "~/queries/updateUser.gql?raw";
import MeQuery from "~/queries/me.gql?raw";

interface AuthState {
  user: UserDto | null;
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(email: string, password: string): Promise<void> {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: LoginMutation,
          variables: { email, password },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error en login");
        }
        this.user = result.data.login.user;
        this.token = result.data.login.token;
        if (this.token && process.client) {
          localStorage.setItem("token", this.token);
          await navigateTo(this.user?.role === "admin" ? "/editor" : "/");
        }
      } catch (error: any) {
        console.error("authStore: Login error:", error);
        throw new Error(error.message || "Error en login");
      }
    },

    async register(userInput: CreateUserInput): Promise<void> {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: CreateUserMutation,
          variables: { createUserInput: userInput },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error en registro");
        }
        this.user = result.data.createUser.user;
        this.token = result.data.createUser.token;
        if (this.token && process.client) {
          localStorage.setItem("token", this.token);
          await navigateTo(this.user?.role === "admin" ? "/editor" : "/");
        }
      } catch (error: any) {
        console.error("authStore: Register error:", error);
        throw new Error(error.message || "Error en registro");
      }
    },

    async updateProfile(userInput: UpdateUserInput): Promise<void> {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: UpdateUserMutation,
          variables: { updateUserInput: userInput },
          context: {
            headers: {
              Authorization: `Bearer ${this.token?.trim()}`,
            },
          },
        });
        
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error al actualizar perfil");
        }
        this.user = result.data.updateUser;
      } catch (error: any) {
        console.error("authStore: UpdateProfile error:", error);
        throw new Error(error.message || "Error al actualizar perfil");
      }
    },

    logout(): void {
      this.user = null;
      this.token = null;
      if (process.client) {
        localStorage.removeItem("token");
      }
      const { $apollo } = useNuxtApp();
      $apollo.default.clearStore();
      navigateTo("/login");
    },

    async loadUserFromToken(): Promise<void> {
      if (!process.client) return;
      const token: string | null = localStorage.getItem("token");
      if (!token) return;
      
      const { $apollo } = useNuxtApp();

      try {
        const result = await $apollo.default.query({ query: MeQuery, fetchPolicy: 'network-only', context: { headers: { Authorization: `Bearer ${token.trim()}` } } });
        
        if (result.errors) {
          console.warn("authStore: loadUserFromToken errors:", result.errors);
          this.logout();
          return;
        }
        if (!result.data?.me) {
          console.warn("authStore: No user data in me query response:", result);
          this.logout();
          return;
        }
        this.user = result.data.me;
        this.token = token;
      } catch (error: any) {
        console.error("authStore: LoadUser error:", error);
        this.logout();
      }
    },
  },
  getters: {
    isAuthenticated: (state: AuthState): boolean => !!state.user && !!state.token,
    isAdmin: (state: AuthState): boolean => state.user?.role === "admin",
  },
  persist: true,
});