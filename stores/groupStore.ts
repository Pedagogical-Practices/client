import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import type { Group } from "~/types";

// Import GQL documents using default imports
import GroupsQuery from "~/queries/groups.gql";
import MyGroupsQuery from "~/queries/myGroups.gql";
import GroupQuery from "~/queries/group.gql";
import GroupsByTutorQuery from "~/queries/groupsByTutor.gql";
import GroupsByStudentQuery from "~/queries/groupsByStudent.gql";
import CreateGroupMutation from "~/queries/createGroup.gql";
import UpdateGroupMutation from "~/queries/updateGroup.gql";
import DeleteGroupMutation from "~/queries/deleteGroup.gql";

export const useGroupStore = defineStore("group", () => {
  const { client } = useApolloClient();

  // State
  const groups = ref<Group[]>([]);
  const currentGroup = ref<Group | null>(null);
  const loading = ref(false);

  // Actions
  const _handleError = (error: any, context: string) => {
    console.error(`practiceStore: Error in ${context}:`, error);
    const message = error.message || `Error desconocido en ${context}.`;
    throw new Error(message);
  };

  const fetchGroups = async () => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: GroupsQuery,
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      groups.value = data.groups.map((group: any) => ({
        ...group,
        practice: group.practice
          ? Object.assign({}, group.practice)
          : group.practice,
        tutor: group.tutor ? Object.assign({}, group.tutor) : group.tutor,
        students: group.students
          ? group.students.map((s: any) => Object.assign({}, s))
          : group.students,
        institutions: group.institutions
          ? group.institutions.map((i: any) => Object.assign({}, i))
          : group.institutions,
      }));
    } catch (error: any) {
      _handleError(error, "fetchGroups");
    } finally {
      loading.value = false;
    }
  };

  const fetchMyGroups = async () => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: MyGroupsQuery,
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      groups.value = data.myGroups;
    } catch (error: any) {
      _handleError(error, "fetchMyGroups");
    } finally {
      loading.value = false;
    }
  };

  const fetchGroup = async (id: string) => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: GroupQuery,
        variables: { id },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      currentGroup.value = data.group;
    } catch (error: any) {
      _handleError(error, "fetchGroup");
    } finally {
      loading.value = false;
    }
  };

  const findGroupsByTutor = async (tutorId: string) => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: GroupsByTutorQuery,
        variables: { tutorId },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      groups.value = data.groupsByTutor;
    } catch (error: any) {
      _handleError(error, "findGroupsByTutor");
    } finally {
      loading.value = false;
    }
  };

  const findGroupsByStudent = async (studentId: string) => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: GroupsByStudentQuery,
        variables: { studentId },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      groups.value = data.groupsByStudent;
    } catch (error: any) {
      _handleError(error, "findGroupsByStudent");
    } finally {
      loading.value = false;
    }
  };

  const createGroup = async (input: any): Promise<Group> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: CreateGroupMutation,
        variables: { input },
      });
      if (errors) throw errors;
      await fetchGroups(); // Refetch
      return data.createGroup;
    } catch (error: any) {
      return _handleError(error, "createGroup");
    }
  };

  const updateGroup = async (id: string, input: any): Promise<Group> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: UpdateGroupMutation,
        variables: { id, input },
      });
      if (errors) throw errors;
      await fetchGroups(); // Refetch
      return data.updateGroup;
    } catch (error: any) {
      return _handleError(error, "updateGroup");
    }
  };

  const deleteGroup = async (id: string): Promise<boolean> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: DeleteGroupMutation,
        variables: { id },
      });
      if (errors) throw errors;
      await fetchGroups(); // Refetch
      return data.deleteGroup;
    } catch (error: any) {
      return _handleError(error, "deleteGroup");
    }
  };

  return {
    groups,
    currentGroup,
    loading,
    fetchGroups,
    fetchMyGroups,
    fetchGroup,
    findGroupsByTutor,
    findGroupsByStudent,
    createGroup,
    updateGroup,
    deleteGroup,
  };
});
