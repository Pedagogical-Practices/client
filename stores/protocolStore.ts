import { defineStore } from "pinia";
import { useApolloClient } from '@vue/apollo-composable';
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
  forms: any[];
}

export const useProtocolStore = defineStore("protocol", {
  state: (): ProtocolState => ({
    protocols: [],
    currentProtocol: null,
    forms: [],
  }),
  actions: {
    async fetchProtocols() {
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({ query: ProtocolsQuery, fetchPolicy: 'network-only' });
        if (errors) throw errors;
      this.protocols = data.protocols;
      console.log('protocolStore: Protocols fetched and assigned:', this.protocols);
    } catch (error) {
        console.error("Error fetching protocols:", error);
      }
    },

    async fetchProtocol(id: string) {
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({ query: ProtocolQuery, variables: { id }, fetchPolicy: 'network-only' });
        if (errors) throw errors;
        this.currentProtocol = data.protocol;
      } catch (error) {
        console.error("Error fetching protocol:", error);
      }
    },

    async createProtocol(input: CreateProtocolInput) {
      const { mutate } = useMutation(CreateProtocolMutation);
      try {
        const result = await mutate({ createProtocolInput: input });
        if (result?.errors) throw new Error(result.errors[0]?.message);
        await this.fetchProtocols(); // Re-fetch the list
      } catch (error: any) {
        console.error("Error creating protocol:", error);
        throw error;
      }
    },

    async updateProtocol(id: string, data: any) {
      const { mutate } = useMutation(UpdateProtocol);
      try {
        await mutate({ updateProtocolInput: { id, ...data } });
        await this.fetchProtocols(); // Re-fetch the list
      } catch (error: any) {
        console.error("Error updating protocol:", error);
        throw error;
      }
    },

    async deleteProtocol(id: string) {
      const { mutate } = useMutation(DeleteProtocol);
      try {
        await mutate({ id });
        await this.fetchProtocols(); // Re-fetch the list
      } catch (error: any) {
        console.error("Error deleting protocol:", error);
        throw error;
      }
    },

    async fetchFormsForSelect() {
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({ query: GetFormsForSelect, fetchPolicy: 'network-only' });
        if (errors) throw errors;
        this.forms = data.forms;
      } catch (error) {
        console.error("Error fetching forms for select:", error);
      }
    },
  },
  persist: true,
});
