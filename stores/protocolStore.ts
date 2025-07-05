import { defineStore } from "pinia";
import type { Protocol, CreateProtocolInput } from "~/types/protocol";

// Import GQL documents
import ProtocolsQuery from "~/queries/protocols.gql";
import ProtocolQuery from "~/queries/protocol.gql";
import CreateProtocolMutation from "~/queries/createProtocol.gql";

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
      const { data, error } = await useAsyncQuery(ProtocolsQuery);
      if (error.value) {
        console.error("fetchProtocols: Error:", error.value);
        return;
      }
      if (data.value?.protocols) {
        this.protocols = data.value.protocols;
      }
    },

    async fetchProtocol(id: string) {
      const { data, error } = await useAsyncQuery(ProtocolQuery, { id });
      if (error.value) {
        console.error("Error fetching protocol:", error.value);
        return;
      }
      if (data.value?.protocol) {
        this.currentProtocol = data.value.protocol;
      }
    },

    async createProtocol(input: CreateProtocolInput) {
      const { mutate } = useMutation(CreateProtocolMutation);
      try {
        const result = await mutate({ createProtocolInput: input });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error creating protocol");
        }
        if (result?.data?.createProtocol) {
          this.protocols.push(result.data.createProtocol);
        }
      } catch (error: any) {
        console.error("Error creating protocol:", error);
        throw error;
      }
    },
  },
  persist: true,
});