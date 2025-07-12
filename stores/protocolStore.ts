import { defineStore } from "pinia";
import type { Protocol, CreateProtocolInput } from "~/types/protocol";

// Import GQL documents
import ProtocolsQuery from "~/queries/protocols.gql";
import ProtocolQuery from "~/queries/protocol.gql";
import CreateProtocolMutation from "~/queries/createProtocol.gql";
import { UpdateProtocol, DeleteProtocol } from '~/queries/admin-protocols.gql';
import GetFormsForSelect from '~/queries/forms-for-select.gql';

interface ProtocolState {
  protocols: Protocol[];
  currentProtocol: Protocol | null;
  forms: any[]; // Para el selector de formularios
}

export const useProtocolStore = defineStore("protocol", {
  state: (): ProtocolState => ({
    protocols: [],
    currentProtocol: null,
    forms: [],
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

    async updateProtocol(id: string, data: any) {
      const { mutate, error } = useMutation(UpdateProtocol);
      if (error.value) {
        console.error("updateProtocol: Error:", error.value);
        return;
      }
      await mutate({ updateProtocolInput: { id, ...data } });
      await this.fetchProtocols(); // Re-fetch
    },

    async deleteProtocol(id: string) {
      const { mutate, error } = useMutation(DeleteProtocol);
      if (error.value) {
        console.error("deleteProtocol: Error:", error.value);
        return;
      }
      await mutate({ id });
      await this.fetchProtocols(); // Re-fetch
    },

    async fetchFormsForSelect() {
      const { data, error } = await useAsyncQuery(GetFormsForSelect);
      if (error.value) {
        console.error("fetchFormsForSelect: Error:", error.value);
        return;
      }
      if (data.value?.forms) {
        this.forms = data.value.forms;
      }
    },
  },
  persist: true,
});