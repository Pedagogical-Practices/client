import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { UserDto, CreateUserInput, UpdateUserInput } from "~/types/user";
import CreateUserMutation from "~/queries/register.gql?raw";
import LoginMutation from "~/queries/login.gql?raw";
import UpdateUserMutation from "~/queries/updateUser.gql?raw";
import MeQuery from "~/queries/me.gql?raw";
import { navigateTo } from "nuxt/app";

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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: LoginMutation,
          variables: { email, password },
        });
        if (!data.login) throw new Error("Login failed");

        this.user = data.login.user;
        this.token = data.login.token;

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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: CreateUserMutation,
          variables: { createUserInput: userInput },
        });
        if (!data.createUser) throw new Error("Registration failed");

        this.user = data.createUser.user;
        this.token = data.createUser.token;

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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: UpdateUserMutation,
          variables: { updateUserInput: userInput },
        });
        this.user = data.updateUser;
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
      // Opcional: Limpiar la caché de Apollo
      const { $gqlClient } = useNuxtApp();
      $gqlClient.clearStore();
      navigateTo("/login");
    },

    async loadUserFromToken(): Promise<void> {
      if (!process.client || !localStorage.getItem("token")) return;
      
      this.token = localStorage.getItem("token");
      const { $gqlClient } = useNuxtApp();

      try {
        const { data } = await $gqlClient.query({ query: MeQuery, fetchPolicy: 'network-only' });
        if (!data.me) {
          this.logout();
          return;
        }
        this.user = data.me;
      } catch (error) {
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