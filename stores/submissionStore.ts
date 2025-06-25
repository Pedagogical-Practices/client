import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export interface Submission {
  _id: string;
  protocolId: string;
  formId: string;
  data: Record<string, any>;
  submittedBy: string;
  createdAt: string;
}

interface SubmissionState {
  submissions: Submission[];
}

export const useSubmissionStore = defineStore("submission", {
  state: (): SubmissionState => ({
    submissions: [],
  }),
  actions: {
    async submitProtocol(input: {
      protocolId: string;
      formId: string;
      data: Record<string, any>;
    }) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const mutation = await import("~/queries/submitProtocol.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
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
          throw new Error(
            data.errors[0]?.message || "Error submitting protocol"
          );
        }
        this.submissions.push(data.data.submitProtocol);
      } catch (error: any) {
        console.error("Error submitting protocol:", error);
        throw error;
      }
    },
    async fetchSubmissions(protocolId: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/submissions.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query,
            variables: { protocolId },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(
            data.errors[0]?.message || "Error fetching submissions"
          );
        }
        this.submissions = data.data.submissions;
      } catch (error: any) {
        console.error("Error fetching submissions:", error);
      }
    },
  },
  persist: true,
});
