import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import type { Protocol } from "~/types";

// Import GraphQL operations from .gql files
import protocolsQuery from "~/queries/protocols.gql";
import getProtocolForEditingQuery from "~/queries/getProtocolForEditing.gql";
import createProtocolMutation from "~/queries/createProtocol.gql";
import updateProtocolMutation from "~/queries/updateProtocol.gql";
import deleteProtocolMutation from "~/queries/deleteProtocol.gql";

export const useProtocolStore = defineStore(
  "protocol",
  () => {
    const protocols = ref<Protocol[]>([]);
    const currentProtocol = ref<Protocol | null>(null);
    const { client } = useApolloClient();

    const fetchProtocols = async () => {
      try {
        const { data, errors } = await client.query({
          query: protocolsQuery,
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        protocols.value = data.protocols;
      } catch (error: any) {
        console.error("protocolStore: Error fetching protocols:", error);
        throw new Error(
          error.message || "Error desconocido al cargar protocolos."
        );
      }
    };

    const fetchProtocol = async (id: string) => {
      try {
        const { data, errors } = await client.query({
          query: getProtocolForEditingQuery,
          variables: { id },
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        currentProtocol.value = data.protocol;
      } catch (error: any) {
        console.error("protocolStore: Error fetching protocol:", error);
        throw new Error(
          error.message || "Error desconocido al cargar protocolo."
        );
      }
    };

    const createProtocol = async (
      protocolData: any
    ): Promise<Protocol | undefined> => {
      const { mutate } = useMutation(createProtocolMutation);
      try {
        const input = {
          name: protocolData.name,
          description: protocolData.description,
          productType: protocolData.productType,
          formIds: protocolData.formIds || [],
        };
        const result = await mutate({ input });
        if (result?.errors) throw result.errors;
        await fetchProtocols();
        return result?.data?.createProtocol;
      } catch (error: any) {
        console.error("protocolStore: CreateProtocol error:", error);
        throw new Error(
          error.message || "Error desconocido al crear protocolo."
        );
      }
    };

    const updateProtocol = async (
      id: string,
      protocolData: any
    ): Promise<Protocol | undefined> => {
      const { mutate } = useMutation(updateProtocolMutation);
      try {
        const input = {
          name: protocolData.name,
          description: protocolData.description,
          productType: protocolData.productType,
          formIds: protocolData.formIds || [],
        };
        const result = await mutate({ id, input });
        if (result?.errors) throw result.errors;
        await fetchProtocols();
        return result?.data?.updateProtocol;
      } catch (error: any) {
        console.error("protocolStore: UpdateProtocol error:", error);
        throw new Error(
          error.message || "Error desconocido al actualizar protocolo."
        );
      }
    };

    const deleteProtocol = async (id: string): Promise<boolean | undefined> => {
      const { mutate } = useMutation(deleteProtocolMutation);
      try {
        const result = await mutate({ id });
        if (result?.errors) throw result.errors;
        await fetchProtocols();
        return result?.data?.deleteProtocol;
      } catch (error: any) {
        console.error("protocolStore: DeleteProtocol error:", error);
        throw new Error(
          error.message || "Error desconocido al eliminar protocolo."
        );
      }
    };

    return {
      protocols,
      currentProtocol,
      fetchProtocols,
      fetchProtocol,
      createProtocol,
      updateProtocol,
      deleteProtocol,
    };
  },
  {
    persist: true,
  }
);
