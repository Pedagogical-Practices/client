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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: CreateSubmissionMutation,
          variables: { createSubmissionInput: input },
        });
        return data.createSubmission;
      } catch (error: any) {
        console.error("Error creating submission:", error);
        throw error;
      }
    },
    async fetchSubmission(id: string): Promise<Submission> {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({
          query: SubmissionQuery,
          variables: { id },
        });
        this.currentSubmission = data.submission;
        return data.submission;
      } catch (error: any) {
        console.error("Error fetching submission:", error);
        throw error;
      }
    },
    // Puedes añadir más acciones como fetchSubmissions, updateSubmission, deleteSubmission
  },
  persist: true,
});
