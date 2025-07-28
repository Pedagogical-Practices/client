import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import type { Institution } from "~/types";

// Import GQL documents using default imports
import InstitutionsQuery from "~/queries/institutions.gql";
import InstitutionQuery from "~/queries/institution.gql";
import CreateInstitutionMutation from "~/queries/createInstitution.gql";
import UpdateInstitutionMutation from "~/queries/updateInstitution.gql";
import DeleteInstitutionMutation from "~/queries/deleteInstitution.gql";

export const useInstitutionStore = defineStore("institution", () => {
  const { client } = useApolloClient();

  // State
  const institutions = ref<Institution[]>([]);
  const currentInstitution = ref<Institution | null>(null);
  const loading = ref(false);

  // Actions
  const _handleError = (error: any, context: string) => {
    console.error(`institutionStore: Error in ${context}:`, error);
    const message = error.message || `Error desconocido en ${context}.`;
    throw new Error(message);
  };

  const fetchInstitutions = async () => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: InstitutionsQuery,
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      institutions.value = data.institutions;
    } catch (error: any) {
      _handleError(error, "fetchInstitutions");
    } finally {
      loading.value = false;
    }
  };

  const fetchInstitutionById = async (id: string): Promise<Institution | null> => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: InstitutionQuery,
        variables: { id },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      currentInstitution.value = data.institution;
      return data.institution;
    } catch (error: any) {
      _handleError(error, "fetchInstitutionById");
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createInstitution = async (input: any): Promise<Institution> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: CreateInstitutionMutation,
        variables: { createInstitutionInput: input },
      });
      if (errors) throw errors;
      await fetchInstitutions(); // Refetch
      return data.createInstitution;
    } catch (error: any) {
      return _handleError(error, "createInstitution");
    }
  };

  const updateInstitution = async (input: any): Promise<Institution> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: UpdateInstitutionMutation,
        variables: { updateInstitutionInput: input },
      });
      if (errors) throw errors;
      await fetchInstitutions(); // Refetch
      return data.updateInstitution;
    } catch (error: any) {
      return _handleError(error, "updateInstitution");
    }
  };

  const deleteInstitution = async (id: string): Promise<boolean> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: DeleteInstitutionMutation,
        variables: { id },
      });
      if (errors) throw errors;
      await fetchInstitutions(); // Refetch
      return data.removeInstitution;
    } catch (error: any) {
      return _handleError(error, "deleteInstitution");
    }
  };

  return {
    institutions,
    currentInstitution,
    loading,
    fetchInstitutions,
    fetchInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution,
  };
});
