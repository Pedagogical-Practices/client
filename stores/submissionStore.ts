import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type { Submission } from "~/types/submission";

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
    async createSubmission(input: { formId: string; data: Record<string, any> }): Promise<Submission> {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const mutation = await import("~/queries/createSubmission.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { createSubmissionInput: input },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error creating submission");
        }
        // this.submissions.push(data.data.createSubmission); // Opcional: añadir a la lista local
        return data.data.createSubmission;
      } catch (error: any) {
        console.error("Error creating submission:", error);
        throw error;
      }
    },
    async fetchSubmission(id: string): Promise<Submission> {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const gqlHost: string = GQL_HOST || "http://127.0.0.1:4000/graphql";
        if (!gqlHost) {
          throw new Error("GQL_HOST no está definido en la configuración.");
        }
        const query = await import("~/queries/submission.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(gqlHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query,
            variables: { id },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error fetching submission");
        }
        this.currentSubmission = data.data.submission;
        return data.data.submission;
      } catch (error: any) {
        console.error("Error fetching submission:", error);
        throw error;
      }
    },
    // Puedes añadir más acciones como fetchSubmissions, updateSubmission, deleteSubmission
  },
  persist: true,
});