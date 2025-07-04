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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({ query: ProtocolsQuery });
        this.protocols = data.protocols;
      } catch (error: any) {
        console.error("fetchProtocols: Error:", error);
      }
    },

    async fetchProtocol(id: string) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({ query: ProtocolQuery, variables: { id } });
        this.currentProtocol = data.protocol;
      } catch (error: any) {
        console.error("Error fetching protocol:", error);
      }
    },

    async createProtocol(input: CreateProtocolInput) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: CreateProtocolMutation,
          variables: { createProtocolInput: input },
        });
        this.protocols.push(data.createProtocol);
      } catch (error: any) {
        console.error("Error creating protocol:", error);
        throw error;
      }
    },
  },
  persist: true,
});