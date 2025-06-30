import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type { Form } from "~/types/form"; // Asumiendo que tienes un tipo Form en ~/types/form.ts

export interface Protocol {
  _id: string;
  // courseId: string; // Eliminado
  name: string;
  module: string;
  // formId: string; // Eliminado
  forms: Form[]; // Nuevo campo: array de objetos Form
  createdAt: string;
}

interface ProtocolState {
  protocols: Protocol[];
  currentProtocol: Protocol | null;
}

export const useProtocolStore = defineStore("protocol", {
  state: (): ProtocolState => ({
    protocols: [],
    currentProtocol: null,
  }),
  actions: {
    async fetchProtocols() {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/protocols.gql?raw").then(
          (m) => m.default
        );
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query,
          }),
        });
        const data = await response.json();
        console.log("fetchProtocols: API Response Data:", data); // Añadido para depuración
        if (data.errors) {
          throw new Error(
            data.errors[0]?.message || "Error fetching protocols"
          );
        }
        this.protocols = data.data.protocols;
      } catch (error: any) {
        console.error("fetchProtocols: Error:", error);
      }
    },
    async fetchProtocol(id: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const query = await import("~/queries/protocol.gql?raw").then(
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
          throw new Error(data.errors[0]?.message || "Error fetching protocol");
        }
        this.currentProtocol = data.data.protocol;
      } catch (error: any) {
        console.error("Error fetching protocol:", error);
      }
    },
    async createProtocol(input: {
      name: string;
      module: string;
      formIds: string[];
    }) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const mutation = await import("~/queries/createProtocol.gql?raw").then(
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
            variables: { createProtocolInput: input },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error creating protocol");
        }
        this.protocols.push(data.data.createProtocol);
      } catch (error: any) {
        console.error("Error creating protocol:", error);
        throw error;
      }
    },
  },
  persist: true,
});
