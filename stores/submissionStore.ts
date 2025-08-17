import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";

// Importando las queries desde archivos .gql
import createSubmissionMutation from "~/queries/createSubmission.gql";
import updateSubmissionMutation from "~/queries/updateSubmission.gql";
import submissionQuery from "~/queries/submission.gql";
import submissionsQuery from "~/queries/submissions.gql";
import submissionsByStudentQuery from "~/queries/submissionsByStudent.gql";
import submissionsByStudentAndGroupQuery from "~/queries/submissionsByStudentAndGroup.gql";
import submissionsByGroupQuery from "~/queries/submissionsByGroup.gql";
import submissionsByFormAndGroupQuery from "~/queries/submissionsByFormAndGroup.gql";
import evaluateSubmissionMutation from "~/queries/evaluateSubmission.gql";

export const useSubmissionStore = defineStore(
  "submission",
  () => {
    const { client } = useApolloClient();

    // State
    const submissions = ref<any[]>([]);
    const groupSubmissions = ref<any[]>([]);
    const formSubmissionsHistory = ref<any[]>([]);
    const currentSubmission = ref<any | null>(null);
    const isLoading = ref(false);
    const error = ref<any | null>(null);

    // Actions
    const setCurrentSubmission = (submission: any | null) => {
      currentSubmission.value = submission;
    };

    const createSubmission = async (input: any): Promise<any | null> => {
      isLoading.value = true;
      error.value = null;
      try {
        console.log("submissionStore: Input sent to createSubmission:", input);
        const { data, errors } = await client.mutate({
          mutation: createSubmissionMutation,
          variables: { input },
        });
        // if (errors) throw errors;
        console.log(
          "submissionStore: Errors received from createSubmission:",
          errors
        );

        console.log(
          "submissionStore: Data received from createSubmission:",
          data
        );

        return data?.createSubmission || null;
      } catch (e: any) {
        error.value = e;
        console.error("submissionStore: Error creating submission:", e);
        return null;
      } finally {
        isLoading.value = false;
      }
    };

    const updateSubmission = async (
      id: string,
      input: any
    ): Promise<any | null> => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, errors } = await client.mutate({
          mutation: updateSubmissionMutation,
          variables: { id, input },
        });
        if (errors) throw errors;
        return data?.updateSubmission || null;
      } catch (e: any) {
        error.value = e;
        console.error("submissionStore: Error updating submission:", e);
        return null;
      } finally {
        isLoading.value = false;
      }
    };

    const fetchSubmission = async (id: string): Promise<any | null> => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, errors } = await client.query({
          query: submissionQuery,
          variables: { id },
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        console.log(
          "submissionStore: Data fetched for single submission:",
          data
        );
        currentSubmission.value = data.submission;
        return data.submission;
      } catch (e: any) {
        error.value = e;
        console.error("submissionStore: Error fetching submission:", e);
        return null;
      } finally {
        isLoading.value = false;
      }
    };

    const fetchSubmissions = async (): Promise<any[]> => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, errors } = await client.query({
          query: submissionsQuery,
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        submissions.value = data.submissions;
        return data.submissions;
      } catch (e: any) {
        error.value = e;
        console.error("submissionStore: Error fetching submissions:", e);
        return [];
      } finally {
        isLoading.value = false;
      }
    };

    const fetchSubmissionsByStudent = async (
      studentId: string
    ): Promise<any[]> => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, errors } = await client.query({
          query: submissionsByStudentQuery,
          variables: { studentId },
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        submissions.value = data.submissionsByStudent;
        return data.submissionsByStudent;
      } catch (e: any) {
        error.value = e;
        console.error(
          "submissionStore: Error fetching submissions by student:",
          e
        );
        return [];
      } finally {
        isLoading.value = false;
      }
    };

    const fetchSubmissionsByStudentAndGroup = async (
      studentId: string,
      groupId: string
    ): Promise<any[]> => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, errors } = await client.query({
          query: submissionsByStudentAndGroupQuery,
          variables: { studentId, groupId },
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        submissions.value = data.submissionsByStudentAndGroup;
        return data.submissionsByStudentAndGroup;
      } catch (e: any) {
        error.value = e;
        console.error(
          "submissionStore: Error fetching submissions by student and group:",
          e
        );
        return [];
      } finally {
        isLoading.value = false;
      }
    };

    const fetchSubmissionsByGroup = async (groupId: string): Promise<any[]> => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, errors } = await client.query({
          query: submissionsByGroupQuery,
          variables: { groupId },
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        groupSubmissions.value = data.submissionsByGroup;
        return data.submissionsByGroup;
      } catch (e: any) {
        error.value = e;
        console.error(
          "submissionStore: Error fetching submissions by group:",
          e
        );
        return [];
      } finally {
        isLoading.value = false;
      }
    };

    const fetchSubmissionsByFormAndGroup = async (
      groupId: string,
      formId: string
    ): Promise<any[]> => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, errors } = await client.query({
          query: submissionsByFormAndGroupQuery,
          variables: { groupId, formId },
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        formSubmissionsHistory.value = data.submissionsByFormAndGroup;
        return data.submissionsByFormAndGroup;
      } catch (e: any) {
        error.value = e;
        console.error(
          "submissionStore: Error fetching submissions by form and group:",
          e
        );
        return [];
      } finally {
        isLoading.value = false;
      }
    };

    const evaluateSubmission = async (
      id: string,
      score: number,
      feedback: string,
      status: string
    ): Promise<any | null> => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, errors } = await client.mutate({
          mutation: evaluateSubmissionMutation,
          variables: { id, score, feedback, status },
        });
        if (errors) throw errors;
        return data?.evaluateSubmission || null;
      } catch (e: any) {
        error.value = e;
        console.error("submissionStore: Error evaluating submission:", e);
        return null;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      submissions,
      groupSubmissions,
      formSubmissionsHistory,
      currentSubmission,
      isLoading,
      error,
      setCurrentSubmission,
      createSubmission,
      updateSubmission,
      fetchSubmission,
      fetchSubmissions,
      fetchSubmissionsByStudent,
      fetchSubmissionsByStudentAndGroup,
      fetchSubmissionsByGroup,
      fetchSubmissionsByFormAndGroup,
      evaluateSubmission,
    };
  },
  {
    persist: {
      paths: [
        'submissions',
        'groupSubmissions',
        'formSubmissionsHistory',
        'currentSubmission',
        'isLoading',
        'error',
      ],
    },
  }
);
