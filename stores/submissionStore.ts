import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { Submission, CreateSubmissionInput } from "~/types/submission"; // Asume que tienes estos tipos

import CreateSubmissionMutation from "~/queries/createSubmission.gql?raw";
import SubmissionQuery from "~/queries/submission.gql?raw";

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
    async createSubmission(input: CreateSubmissionInput): Promise<Submission> {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: CreateSubmissionMutation,
          variables: { createSubmissionInput: input },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error creating submission");
        }
        return result.data.submitProtocol;
      } catch (error: any) {
        console.error("Error creating submission:", error);
        throw error;
      }
    },
    async fetchSubmission(id: string): Promise<Submission> {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({
          query: SubmissionQuery,
          variables: { id },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error fetching submission");
        }
        this.currentSubmission = result.data.submission;
        return result.data.submission;
      } catch (error: any) {
        console.error("Error fetching submission:", error);
        throw error;
      }
    },
    // Puedes añadir más acciones como fetchSubmissions, updateSubmission, deleteSubmission
  },
  persist: true,
});
