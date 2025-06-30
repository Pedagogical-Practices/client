// stores/authStore.ts
import { defineStore } from "pinia";
import type {
  UserDto,
  CreateUserResponse,
  LoginResponse,
  UpdateUserResponse,
  MeResponse,
  GraphQLResponse,
} from "~/types/user";
import { useRuntimeConfig } from "#app";
import CreateUserQuery from "~/queries/register.gql?raw";
import LoginQuery from "~/queries/login.gql?raw";
import UpdateUserQuery from "~/queries/updateUser.gql?raw";
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
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: LoginQuery,
            variables: { email, password },
          }),
        });
        const result: GraphQLResponse<LoginResponse> = await response.json();
        console.log("authStore: Login response:", result);
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error en login");
        }
        this.user = result.data.login.user;
        this.token = result.data.login.token;
        if (this.token && process.client) {
          localStorage.setItem("token", this.token);
          console.log("authStore: Token saved:", this.token);
          console.log("authStore: User set:", this.user);
          await navigateTo(this.user?.role === "admin" ? "/editor" : "/");
        }
      } catch (error: any) {
        console.error("authStore: Login error:", error);
        throw new Error(error.message || "Error en login");
      }
    },
    async register(userInput: {
      name: string;
      email: string;
      password: string;
      role: string;
    }): Promise<void> {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: CreateUserQuery,
            variables: { createUserInput: userInput },
          }),
        });
        const result: GraphQLResponse<CreateUserResponse> =
          await response.json();
        console.log("authStore: Register response:", result);
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error en registro");
        }
        this.user = result.data.createUser.user;
        this.token = result.data.createUser.token;
        if (this.token && process.client) {
          localStorage.setItem("token", this.token);
          console.log("authStore: Token saved:", this.token);
          console.log("authStore: User set:", this.user);
          await navigateTo(this.user?.role === "admin" ? "/editor" : "/");
        }
      } catch (error: any) {
        console.error("authStore: Register error:", error);
        throw new Error(error.message || "Error en registro");
      }
    },
    async updateProfile(userInput: {
      name?: string;
      email?: string;
      password?: string;
    }): Promise<void> {
      try {
        if (!this.token) {
          throw new Error("No se encontró el token de autenticación");
        }
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token.trim()}`,
          },
          body: JSON.stringify({
            query: UpdateUserQuery,
            variables: { updateUserInput: userInput },
          }),
        });
        const result: GraphQLResponse<UpdateUserResponse> =
          await response.json();
        console.log("authStore: UpdateProfile response:", result);
        if (result.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al actualizar perfil"
          );
        }
        this.user = result.data.updateUser;
        console.log("authStore: User updated:", this.user);
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
        console.log("authStore: Logged out");
      }
    },
    async loadUserFromToken(): Promise<void> {
      if (!process.client) return;
      const token: string | null = localStorage.getItem("token");
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("authStore: Decoded token payload:", payload);
        if (!payload.sub) {
          console.log("authStore: Token does not contain sub, clearing token");
          this.logout();
          return;
        }
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.trim()}`,
          },
          body: JSON.stringify({
            query: MeQuery,
          }),
        });
        const result: GraphQLResponse<MeResponse> = await response.json();
        console.log("authStore: LoadUser response:", result);
        if (result.errors) {
          console.warn("authStore: loadUserFromToken errors:", result.errors);
          return; // No ejecutar logout
        }
        if (!result.data?.me) {
          console.warn("authStore: No user data in me query response:", result);
          return; // Mantener this.user del login
        }
        this.user = result.data.me;
        this.token = token;
        console.log("authStore: User loaded:", this.user);
      } catch (error: any) {
        console.error("authStore: LoadUser error:", error);
      }
    },
  },
  getters: {
    isAuthenticated: (state: AuthState): boolean =>
      !!state.user && !!state.token,
    isAdmin: (state: AuthState): boolean => state.user?.role === "admin",
  },
  persist: true,
});
