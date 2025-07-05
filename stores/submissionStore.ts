import { defineStore } from "pinia";
import type { Submission, CreateSubmissionInput } from "~/types/submission";

// Import GQL documents
import CreateSubmissionMutation from "~/queries/createSubmission.gql";
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
    async createSubmission(input: CreateSubmissionInput): Promise<Submission | null> {
      const { mutate } = useMutation(CreateSubmissionMutation);
      try {
        const result = await mutate({ createSubmissionInput: input });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error creating submission");
        }
        // Note: The original code returned `submitProtocol`, which might be a typo.
        // Assuming it should be `createSubmission` based on the mutation name.
        return result?.data?.createSubmission || null;
      } catch (error: any) {
        console.error("Error creating submission:", error);
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