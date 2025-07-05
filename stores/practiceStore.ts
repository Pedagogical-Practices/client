import { defineStore } from "pinia";
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
      const { data, error } = await useAsyncQuery(PracticesQuery);
      if (error.value) {
        console.error("Error fetching practices:", error.value);
        return;
      }
      if (data.value?.practices) {
        this.practices = data.value.practices;
      }
    },

    async fetchPractice(id: string) {
      const { data, error } = await useAsyncQuery(PracticeQuery, { id });
      if (error.value) {
        console.error("Error fetching practice:", error.value);
        return;
      }
      if (data.value?.practice) {
        this.currentPractice = data.value.practice;
      }
    },

    async createPractice(input: CreatePracticeInput) {
      const { mutate } = useMutation(CreatePracticeMutation);
      try {
        const result = await mutate({ createPracticeInput: input });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error creating practice");
        }
        if (result?.data?.createPractice) {
          this.practices.push(result.data.createPractice);
        }
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
        if (result?.data?.updatePractice) {
          const index = this.practices.findIndex((p) => p._id === result.data.updatePractice._id);
          if (index !== -1) {
            this.practices[index] = result.data.updatePractice;
          }
          this.currentPractice = result.data.updatePractice;
        }
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
        this.practices = this.practices.filter((p) => p._id !== id);
      } catch (error: any) {
        console.error("Error removing practice:", error);
        throw error;
      }
    },
  },
  persist: true,
});