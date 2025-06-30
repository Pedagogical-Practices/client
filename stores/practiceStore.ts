import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type { Practice } from "~/types/practice";
import type { CreatePracticeInput, UpdatePracticeInput } from "~/types/practice.input"; // Necesitamos crear este DTO

interface PracticeState {
  practices: Practice[];
  currentPractice: Practice | null;
}

export const usePracticeStore = defineStore("practice", {
  state: (): PracticeState => ({
    practices: [],
    currentPractice: null,
  }),
  actions: {
    async fetchPractices() {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const query = await import("~/queries/practices.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error fetching practices");
        }
        this.practices = data.data.practices;
      } catch (error: any) {
        console.error("Error fetching practices:", error);
      }
    },
    async fetchPractice(id: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const query = await import("~/queries/practice.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query,
            variables: { id },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error fetching practice");
        }
        this.currentPractice = data.data.practice;
      } catch (error: any) {
        console.error("Error fetching practice:", error);
      }
    },
    async createPractice(input: CreatePracticeInput) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const mutation = await import("~/queries/createPractice.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { createPracticeInput: input },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error creating practice");
        }
        this.practices.push(data.data.createPractice);
      } catch (error: any) {
        console.error("Error creating practice:", error);
        throw error;
      }
    },
    async updatePractice(input: UpdatePracticeInput) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const mutation = await import("~/queries/updatePractice.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { updatePracticeInput: input },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error updating practice");
        }
        const index = this.practices.findIndex((p) => p._id === data.data.updatePractice._id);
        if (index !== -1) {
          this.practices[index] = data.data.updatePractice;
        }
        this.currentPractice = data.data.updatePractice;
      } catch (error: any) {
        console.error("Error updating practice:", error);
        throw error;
      }
    },
    async removePractice(id: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const mutation = await import("~/queries/removePractice.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { id },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error removing practice");
        }
        this.practices = this.practices.filter((p) => p._id !== id);
      } catch (error: any) {
        console.error("Error removing practice:", error);
        throw error;
      }
    },
  },
  persist: true,
});