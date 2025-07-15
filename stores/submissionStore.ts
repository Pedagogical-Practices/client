import { defineStore } from "pinia";
import { useApolloClient } from '@vue/apollo-composable';
import type { Submission, CreateSubmissionInput, UpdateSubmissionInput } from "~/types/submission";

// Import GQL documents
import CreateSubmissionMutation from "~/queries/createSubmission.gql";
import UpdateSubmissionMutation from "~/queries/updateSubmission.gql";
import SubmissionQuery from "~/queries/submission.gql";

interface SubmissionState {
  submissions: Submission[];
  currentSubmission: Submission | null;
}

export const useSubmissionStore = defineStore("submission", {
  state: (): SubmissionState => ({
    submissions: [],
    currentSubmission: null,
  }),
  actions: {
    setCurrentSubmission(submission: Submission | null) {
      this.currentSubmission = submission;
    },
    async createSubmission(practiceId: string, formId: string, data: Record<string, any>): Promise<Submission | null> {
      const { client } = useApolloClient();
      const input: CreateSubmissionInput = { protocolId: practiceId, formId, data };
      try {
        const result = await client.mutate({
          mutation: CreateSubmissionMutation,
          variables: { createSubmissionInput: input },
        });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error creating submission");
        }

        const newSubmission = result?.data?.submitProtocol;
        if (newSubmission) {
          const practiceStore = usePracticeStore();
          await practiceStore.registerFormSubmission({
            practiceId: practiceId,
            formId: formId,
            submissionId: newSubmission._id,
          });
        }
        return newSubmission || null;
      } catch (error: any) {
        console.error("Error creating submission:", error);
        throw error;
      }
    },
    async updateSubmission(id: string, data: Record<string, any>): Promise<Submission | null> {
      const { client } = useApolloClient();
      const input: UpdateSubmissionInput = { id, data };
      try {
        const result = await client.mutate({
          mutation: UpdateSubmissionMutation,
          variables: { updateSubmissionInput: input },
        });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error updating submission");
        }
        return result?.data?.updateSubmission || null;
      } catch (error: any) {
        console.error("Error updating submission:", error);
        throw error;
      }
    },
    async fetchSubmission(id: string): Promise<Submission | null> {
      const { data, error } = await useAsyncQuery(SubmissionQuery, { id });
      if (error.value) {
        console.error("Error fetching submission:", error.value);
        throw error.value;
      }
      if (data.value?.submission) {
        this.currentSubmission = data.value.submission;
        return data.value.submission;
      }
      return null;
    },
  },
  persist: true,
});
