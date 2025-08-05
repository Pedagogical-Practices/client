import { defineStore } from 'pinia';
import { useApolloClient } from '@nuxtjs/apollo';

import practicesQuery from '~/queries/practices.gql';
import practiceQuery from '~/queries/practice.gql';
import createPracticeMutation from '~/queries/createPractice.gql';
import updatePracticeMutation from '~/queries/updatePractice.gql';
import deletePracticeMutation from '~/queries/deletePractice.gql';

export const usePracticeStore = defineStore('practice', {
  state: () => ({
    practices: [],
    currentPractice: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAllPractices() {
      this.loading = true;
      this.error = null;
      try {
        const { client } = useApolloClient();
        const { data } = await client.query({
          query: practicesQuery,
        });
        this.practices = data.practices;
      } catch (error) {
        this.error = error;
        console.error('Error fetching practices:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchPracticeById(id) {
      this.loading = true;
      this.error = null;
      try {
        const { client } = useApolloClient();
        const { data } = await client.query({
          query: practiceQuery,
          variables: { id },
        });
        this.currentPractice = data.practice;
      } catch (error) {
        this.error = error;
        console.error(`Error fetching practice with ID ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },

    async createPractice(input) {
      this.loading = true;
      this.error = null;
      try {
        const { client } = useApolloClient();
        const { data } = await client.mutate({
          mutation: createPracticeMutation,
          variables: { input },
        });
        this.practices.push(data.createPractice);
        return data.createPractice;
      } catch (error) {
        this.error = error;
        console.error('Error creating practice:', error);
      } finally {
        this.loading = false;
      }
    },

    async updatePractice(id, input) {
      this.loading = true;
      this.error = null;
      try {
        const { client } = useApolloClient();
        const { data } = await client.mutate({
          mutation: updatePracticeMutation,
          variables: { id, input },
        });
        const index = this.practices.findIndex(p => p.id === id);
        if (index !== -1) {
          Object.assign(this.practices[index], data.updatePractice);
        }
        this.currentPractice = data.updatePractice;
        return data.updatePractice;
      } catch (error) {
        this.error = error;
        console.error(`Error updating practice with ID ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },

    async deletePractice(id) {
      this.loading = true;
      this.error = null;
      try {
        const { client } = useApolloClient();
        await client.mutate({
          mutation: deletePracticeMutation,
          variables: { id },
        });
        this.practices = this.practices.filter(p => p.id !== id);
        return true;
      } catch (error) {
        this.error = error;
        console.error(`Error deleting practice with ID ${id}:`, error);
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
