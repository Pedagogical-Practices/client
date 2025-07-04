import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { Practice, CreatePracticeInput, UpdatePracticeInput } from "~/types/practice";

import PracticesQuery from "~/queries/practices.gql?raw";
import PracticeQuery from "~/queries/practice.gql?raw";
import CreatePracticeMutation from "~/queries/createPractice.gql?raw";
import UpdatePracticeMutation from "~/queries/updatePractice.gql?raw";
import RemovePracticeMutation from "~/queries/removePractice.gql?raw";

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
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({ query: PracticesQuery });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error fetching practices");
        }
        this.practices = result.data.practices;
      } catch (error: any) {
        console.error("Error fetching practices:", error);
      }
    },

    async fetchPractice(id: string) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({ query: PracticeQuery, variables: { id } });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error fetching practice");
        }
        this.currentPractice = result.data.practice;
      } catch (error: any) {
        console.error("Error fetching practice:", error);
      }
    },

    async createPractice(input: CreatePracticeInput) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: CreatePracticeMutation,
          variables: { createPracticeInput: input },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error creating practice");
        }
        this.practices.push(result.data.createPractice);
      } catch (error: any) {
        console.error("Error creating practice:", error);
        throw error;
      }
    },

    async updatePractice(input: UpdatePracticeInput) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: UpdatePracticeMutation,
          variables: { updatePracticeInput: input },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error updating practice");
        }
        const index = this.practices.findIndex((p) => p._id === result.data.updatePractice._id);
        if (index !== -1) {
          this.practices[index] = result.data.updatePractice;
        }
        this.currentPractice = result.data.updatePractice;
      } catch (error: any) {
        console.error("Error updating practice:", error);
        throw error;
      }
    },

    async removePractice(id: string) {
      const { $apollo } = useNuxtApp();
      try {
        await $apollo.default.mutate({ mutation: RemovePracticeMutation, variables: { id } });
        this.practices = this.practices.filter((p) => p._id !== id);
      } catch (error: any) {
        console.error("Error removing practice:", error);
        throw error;
      }
    },
  },
  persist: true,
});
