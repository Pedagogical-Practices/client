import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import type { Protocol } from "~/types"; // Adjust the import path as necessary

interface ProtocolState {
  protocols: Protocol[];
  currentProtocol: Protocol | null;
}

export const useProtocolStore = defineStore(
  "protocol",
  () => {
    // State
    const protocols = ref<Protocol[]>([]);
    const currentProtocol = ref<Protocol | null>(null);

    // Actions
    const fetchProtocols = async () => {
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({
          query: gql`
            query Protocols {
              protocols {
                id
                name
                description
                form {
                  id
                  name
                }
                productType
                createdAt
                updatedAt
              }
            }
          `,
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
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({
          query: gql`
            query Protocol($id: ID!) {
              protocol(id: $id) {
                id
                name
                description
                form {
                  id
                  name
                }
                productType
                createdAt
                updatedAt
              }
            }
          `,
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

    const createProtocol = async (input: any): Promise<Protocol> => {
      const { mutate } = useMutation(gql`
        mutation CreateProtocol($input: CreateProtocolInput!) {
          createProtocol(input: $input) {
            id
            name
            description
            form {
              id
              name
            }
            productType
            createdAt
            updatedAt
          }
        }
      `);
      try {
        const result = await mutate({ input });
        if (result?.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al crear protocolo"
          );
        }
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
      input: any
    ): Promise<Protocol> => {
      const { mutate } = useMutation(gql`
        mutation UpdateProtocol($id: ID!, $input: UpdateProtocolInput!) {
          updateProtocol(id: $id, input: $input) {
            id
            name
            description
            form {
              id
              name
            }
            productType
            createdAt
            updatedAt
          }
        }
      `);
      try {
        const result = await mutate({ id, input });
        if (result?.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al actualizar protocolo"
          );
        }
        return result?.data?.updateProtocol;
      } catch (error: any) {
        console.error("protocolStore: UpdateProtocol error:", error);
        throw new Error(
          error.message || "Error desconocido al actualizar protocolo."
        );
      }
    };

    const deleteProtocol = async (id: string): Promise<boolean> => {
      const { mutate } = useMutation(gql`
        mutation DeleteProtocol($id: ID!) {
          deleteProtocol(id: $id)
        }
      `);
      try {
        const result = await mutate({ id });
        if (result?.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al eliminar protocolo"
          );
        }
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
