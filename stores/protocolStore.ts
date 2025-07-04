import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { Protocol, CreateProtocolInput } from "~/types/protocol"; // Asume que tienes estos tipos

import ProtocolsQuery from "~/queries/protocols.gql?raw";
import ProtocolQuery from "~/queries/protocol.gql?raw";
import CreateProtocolMutation from "~/queries/createProtocol.gql?raw";

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
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({ query: ProtocolsQuery });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error fetching protocols");
        }
        this.protocols = result.data.protocols;
      } catch (error: any) {
        console.error("fetchProtocols: Error:", error);
      }
    },

    async fetchProtocol(id: string) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({ query: ProtocolQuery, variables: { id } });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error fetching protocol");
        }
        this.currentProtocol = result.data.protocol;
      } catch (error: any) {
        console.error("Error fetching protocol:", error);
      }
    },

    async createProtocol(input: CreateProtocolInput) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: CreateProtocolMutation,
          variables: { createProtocolInput: input },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error creating protocol");
        }
        this.protocols.push(result.data.createProtocol);
      } catch (error: any) {
        console.error("Error creating protocol:", error);
        throw error;
      }
    },
  },
  persist: true,
});