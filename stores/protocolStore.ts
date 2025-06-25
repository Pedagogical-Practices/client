import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export interface Protocol {
  _id: string;
  courseId: string;
  name: string;
  module: string;
  formId: string;
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
    async fetchProtocols(courseId: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/protocols.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query,
            variables: { courseId },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(
            data.errors[0]?.message || "Error fetching protocols"
          );
        }
        this.protocols = data.data.protocols;
      } catch (error: any) {
        console.error("Error fetching protocols:", error);
      }
    },
    async fetchProtocol(id: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/protocol.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
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
      courseId: string;
      name: string;
      module: string;
      formId: string;
    }) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const mutation = await import("~/queries/createProtocol.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
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
