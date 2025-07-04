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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({ query: PracticesQuery });
        this.practices = data.practices;
      } catch (error: any) {
        console.error("Error fetching practices:", error);
      }
    },

    async fetchPractice(id: string) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({ query: PracticeQuery, variables: { id } });
        this.currentPractice = data.practice;
      } catch (error: any) {
        console.error("Error fetching practice:", error);
      }
    },

    async createPractice(input: CreatePracticeInput) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: CreatePracticeMutation,
          variables: { createPracticeInput: input },
        });
        this.practices.push(data.createPractice);
      } catch (error: any) {
        console.error("Error creating practice:", error);
        throw error;
      }
    },

    async updatePractice(input: UpdatePracticeInput) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: UpdatePracticeMutation,
          variables: { updatePracticeInput: input },
        });
        const index = this.practices.findIndex((p) => p._id === data.updatePractice._id);
        if (index !== -1) {
          this.practices[index] = data.updatePractice;
        }
        this.currentPractice = data.updatePractice;
      } catch (error: any) {
        console.error("Error updating practice:", error);
        throw error;
      }
    },

    async removePractice(id: string) {
      const { $gqlClient } = useNuxtApp();
      try {
        await $gqlClient.mutate({ mutation: RemovePracticeMutation, variables: { id } });
        this.practices = this.practices.filter((p) => p._id !== id);
      } catch (error: any) {
        console.error("Error removing practice:", error);
        throw error;
      }
    },
  },
  persist: true,
});
