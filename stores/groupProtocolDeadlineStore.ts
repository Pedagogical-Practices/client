import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import type { GroupProtocolDeadline } from "~/types";

// Import GQL documents
import GroupProtocolDeadlinesQuery from "~/queries/groupProtocolDeadlines.gql";
import GroupProtocolDeadlineQuery from "~/queries/groupProtocolDeadline.gql";
import CreateGroupProtocolDeadlineMutation from "~/queries/createGroupProtocolDeadline.gql";
import UpdateGroupProtocolDeadlineMutation from "~/queries/updateGroupProtocolDeadline.gql";
import DeleteGroupProtocolDeadlineMutation from "~/queries/deleteGroupProtocolDeadline.gql";

export const useGroupProtocolDeadlineStore = defineStore("groupProtocolDeadline", () => {
  const { client } = useApolloClient();

  // State
  const deadlines = ref<GroupProtocolDeadline[]>([]);
  const currentDeadline = ref<GroupProtocolDeadline | null>(null);
  const loading = ref(false);

  // Actions
  const _handleError = (error: any, context: string) => {
    console.error(`groupProtocolDeadlineStore: Error in ${context}:`, error);
    const message = error.message || `Error desconocido en ${context}.`;
    throw new Error(message);
  };

  const fetchDeadlines = async () => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: GroupProtocolDeadlinesQuery,
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      deadlines.value = data.groupProtocolDeadlines;
    } catch (error: any) {
      _handleError(error, "fetchDeadlines");
    } finally {
      loading.value = false;
    }
  };

  const fetchDeadline = async (id: string) => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: GroupProtocolDeadlineQuery,
        variables: { id },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      currentDeadline.value = data.groupProtocolDeadline;
    } catch (error: any) {
      _handleError(error, "fetchDeadline");
    } finally {
      loading.value = false;
    }
  };

  const fetchDeadlinesByGroup = async (groupId: string) => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: gql`
          query groupProtocolDeadlinesByGroup($groupId: ID!) {
            groupProtocolDeadlines(groupId: $groupId) {
              id
              startDate
              endDate
              group {
                id
                name
              }
              protocol {
                id
                name
              }
            }
          }
        `,
        variables: { groupId },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      deadlines.value = data.groupProtocolDeadlines;
    } catch (error: any) {
      _handleError(error, "fetchDeadlinesByGroup");
    } finally {
      loading.value = false;
    }
  };

  const createDeadline = async (input: any): Promise<GroupProtocolDeadline> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: CreateGroupProtocolDeadlineMutation,
        variables: { input },
      });
      if (errors) throw errors;
      await fetchDeadlines(); // Refetch all deadlines
      return data.createGroupProtocolDeadline;
    } catch (error: any) {
      return _handleError(error, "createDeadline");
    }
  };

  const updateDeadline = async (id: string, input: any): Promise<GroupProtocolDeadline> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: UpdateGroupProtocolDeadlineMutation,
        variables: { id, input },
      });
      if (errors) throw errors;
      await fetchDeadlines(); // Refetch all deadlines
      return data.updateGroupProtocolDeadline;
    } catch (error: any) {
      return _handleError(error, "updateDeadline");
    }
  };

  const deleteDeadline = async (id: string): Promise<boolean> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: DeleteGroupProtocolDeadlineMutation,
        variables: { id },
      });
      if (errors) throw errors;
      await fetchDeadlines(); // Refetch all deadlines
      return data.deleteGroupProtocolDeadline;
    } catch (error: any) {
      return _handleError(error, "deleteDeadline");
    }
  };

  return {
    deadlines,
    currentDeadline,
    loading,
    fetchDeadlines,
    fetchDeadline,
    fetchDeadlinesByGroup,
    createDeadline,
    updateDeadline,
    deleteDeadline,
  };
});
