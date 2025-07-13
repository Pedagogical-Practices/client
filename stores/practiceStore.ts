import { defineStore } from "pinia";
import { useApolloClient } from '@vue/apollo-composable';
import type { Practice, CreatePracticeInput, UpdatePracticeInput } from "~/types/practice";

// Import GQL documents
import PracticesQuery from "~/queries/practices.gql";
import PracticeQuery from "~/queries/practice.gql";
import CreatePracticeMutation from "~/queries/createPractice.gql";
import UpdatePracticeMutation from "~/queries/updatePractice.gql";
import RemovePracticeMutation from "~/queries/removePractice.gql";

interface PracticeState {
  practices: Practice[];
  currentPractice: Practice | null;
}

export const usePracticeStore = defineStore("practice", {
  state: (): PracticeState => ({
    practices: [],
    currentPractice: null,
  }),
  actions: {
    async fetchPractices() {
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({ query: PracticesQuery, fetchPolicy: 'network-only' });
        if (errors) throw errors;
        this.practices = data.practices;
      } catch (error: any) {
        console.error("Error fetching practices:", error);
        throw error;
      }
    },

    async fetchPractice(id: string) {
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({ query: PracticeQuery, variables: { id }, fetchPolicy: 'network-only' });
        if (errors) throw errors;
        this.currentPractice = data.practice;
      } catch (error: any) {
        console.error("Error fetching practice:", error);
        throw error;
      }
    },

    async createPractice(input: CreatePracticeInput) {
      const { mutate } = useMutation(CreatePracticeMutation);
      try {
        const result = await mutate({ createPracticeInput: input });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error creating practice");
        }
        await this.fetchPractices(); // Re-fetch the list
      } catch (error: any) {
        console.error("Error creating practice:", error);
        throw error;
      }
    },

    async updatePractice(input: UpdatePracticeInput) {
      const { mutate } = useMutation(UpdatePracticeMutation);
      try {
        const result = await mutate({ updatePracticeInput: input });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error updating practice");
        }
        await this.fetchPractices(); // Re-fetch the list
      } catch (error: any) {
        console.error("Error updating practice:", error);
        throw error;
      }
    },

    async removePractice(id: string) {
      const { mutate } = useMutation(RemovePracticeMutation);
      try {
        const result = await mutate({ id });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error removing practice");
        }
        await this.fetchPractices(); // Re-fetch the list
      } catch (error: any) {
        console.error("Error removing practice:", error);
        throw error;
      }
    },
  },
  persist: true,
});
