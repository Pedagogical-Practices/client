import { defineStore } from "pinia";
import type { User } from "~/types/user";
import { useRuntimeConfig } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost = GQL_HOST || "http://127.0.0.1:3000/graphql"; // Valor por defecto explícito
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const query = await import("~/queries/login.gql").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-apollo-operation-name": "Login",
          },
          body: JSON.stringify({
            query,
            variables: { email, password },
          }),
        });
        const { data, errors } = await response.json();
        if (errors) throw new Error(errors[0]?.message || "Error en login");
        this.user = data.login.user;
        this.token = data.login.token;
        if (this.token && process.client) {
          localStorage.setItem("token", this.token);
        }
      } catch (error: any) {
        throw new Error(error.message || "Error en login");
      }
    },
    async register(userInput: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost = GQL_HOST || "http://127.0.0.1:3000/graphql"; // Valor por defecto explícito
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const query = await import("@/queries/register.gql").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-apollo-operation-name": "Register",
          },
          body: JSON.stringify({
            query,
            variables: { createUserInput: userInput },
          }),
        });
        const { data, errors } = await response.json();
        if (errors) throw new Error(errors[0]?.message || "Error en registro");
        this.user = data.createUser.user;
        this.token = data.createUser.token;
        if (this.token && process.client) {
          localStorage.setItem("token", this.token);
        }
      } catch (error: any) {
        throw new Error(error.message || "Error en registro");
      }
    },
    async updateProfile(userInput: {
      name?: string;
      email?: string;
      password?: string;
    }) {
      try {
        if (!this.token) {
          throw new Error("No se encontró el token de autenticación");
        }
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost = GQL_HOST || "http://127.0.0.1:3000/graphql"; // Valor por defecto explícito
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const query = await import("~/queries/updateUser.gql").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
            "x-apollo-operation-name": "UpdateUser",
          },
          body: JSON.stringify({
            query,
            variables: { updateUserInput: userInput },
          }),
        });
        const { data, errors } = await response.json();
        if (errors)
          throw new Error(errors[0]?.message || "Error al actualizar perfil");
        this.user = data.updateUser;
      } catch (error: any) {
        throw new Error(error.message || "Error al actualizar perfil");
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      if (process.client) {
        localStorage.removeItem("token");
      }
    },
    async loadUserFromToken() {
      if (!process.client) return; // Evitar ejecución en SSR
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost = GQL_HOST || "http://127.0.0.1:3000/graphql"; // Valor por defecto explícito
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const query = await import("~/queries/me.gql").then((m) => m.default);

        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-apollo-operation-name": "Me",
          },
          body: JSON.stringify({ query }),
        });
        const { data, errors } = await response.json();
        if (errors)
          throw new Error(errors[0]?.message || "Error al cargar usuario");
        this.user = data.me;
        this.token = token;
      } catch (error: any) {
        this.logout();
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
  },
  persist: true,
});
