import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import type { Practice } from "~/types";

// Import GQL documents using default imports
import PracticesQuery from "~/queries/practices.gql";
import MyPracticesQuery from "~/queries/myPractices.gql";
import PracticeQuery from "~/queries/practice.gql";
import PracticesByTeacherQuery from "~/queries/practicesByTeacher.gql";
import PracticesByStudentQuery from "~/queries/practicesByStudent.gql";
import CreatePracticeMutation from "~/queries/createPractice.gql";
import UpdatePracticeMutation from "~/queries/updatePractice.gql";
import DeletePracticeMutation from "~/queries/deletePractice.gql";

export const usePracticeStore = defineStore("practice", () => {
  const { client } = useApolloClient();

  // State
  const practices = ref<Practice[]>([]);
  const currentPractice = ref<Practice | null>(null);
  const loading = ref(false);

  // Actions
  const _handleError = (error: any, context: string) => {
    console.error(`practiceStore: Error in ${context}:`, error);
    const message = error.message || `Error desconocido en ${context}.`;
    throw new Error(message);
  };

  const fetchPractices = async () => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: PracticesQuery,
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      practices.value = data.practices;
    } catch (error: any) {
      _handleError(error, "fetchPractices");
    } finally {
      loading.value = false;
    }
  };

  const fetchMyPractices = async () => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: MyPracticesQuery,
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      practices.value = data.myPractices;
    } catch (error: any) {
      _handleError(error, "fetchMyPractices");
    } finally {
      loading.value = false;
    }
  };

  const fetchPractice = async (id: string) => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: PracticeQuery,
        variables: { id },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      currentPractice.value = data.practice;
    } catch (error: any) {
      _handleError(error, "fetchPractice");
    } finally {
      loading.value = false;
    }
  };

  const findPracticesByTeacher = async (teacherId: string) => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: PracticesByTeacherQuery,
        variables: { teacherId },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      practices.value = data.practicesByTeacher;
    } catch (error: any) {
      _handleError(error, "findPracticesByTeacher");
    } finally {
      loading.value = false;
    }
  };

  const findPracticesByStudent = async (studentId: string) => {
    loading.value = true;
    try {
      const { data, errors } = await client.query({
        query: PracticesByStudentQuery,
        variables: { studentId },
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      practices.value = data.practicesByStudent;
    } catch (error: any) {
      _handleError(error, "findPracticesByStudent");
    } finally {
      loading.value = false;
    }
  };

  const createPractice = async (input: any): Promise<Practice> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: CreatePracticeMutation,
        variables: { input },
      });
      if (errors) throw errors;
      await fetchPractices(); // Refetch
      return data.createPractice;
    } catch (error: any) {
      return _handleError(error, "createPractice");
    }
  };

  const updatePractice = async (id: string, input: any): Promise<Practice> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: UpdatePracticeMutation,
        variables: { id, input },
      });
      if (errors) throw errors;
      await fetchPractices(); // Refetch
      return data.updatePractice;
    } catch (error: any) {
      return _handleError(error, "updatePractice");
    }
  };

  const deletePractice = async (id: string): Promise<boolean> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: DeletePracticeMutation,
        variables: { id },
      });
      if (errors) throw errors;
      await fetchPractices(); // Refetch
      return data.deletePractice;
    } catch (error: any) {
      return _handleError(error, "deletePractice");
    }
  };

  return {
    practices,
    currentPractice,
    loading,
    fetchPractices,
    fetchMyPractices,
    fetchPractice,
    findPracticesByTeacher,
    findPracticesByStudent,
    createPractice,
    updatePractice,
    deletePractice,
  };
});
