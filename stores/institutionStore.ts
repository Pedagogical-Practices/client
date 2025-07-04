import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import type { Institution } from '~/types/institution'; // Asegúrate de tener este tipo definido

// Importar las consultas
import InstitutionsQuery from '~/queries/institutions.gql?raw';
import InstitutionQuery from '~/queries/institution.gql?raw';
import CreateInstitutionMutation from '~/queries/createInstitution.gql?raw';
import UpdateInstitutionMutation from '~/queries/updateInstitution.gql?raw';
import DeleteInstitutionMutation from '~/queries/deleteInstitution.gql?raw';

interface InstitutionState {
  institutions: Institution[];
}

export const useInstitutionStore = defineStore('institution', {
  state: (): InstitutionState => ({
    institutions: [],
  }),
  actions: {
    async fetchInstitutions(search?: string) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({ query: InstitutionsQuery, variables: { search } });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Error fetching institutions');
        }
        this.institutions = result.data.institutions;
      } catch (error: any) {
        console.error('Error fetching institutions:', error);
        throw error;
      }
    },

    async createInstitution(institution: Omit<Institution, '_id'>) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: CreateInstitutionMutation,
          variables: { createInstitutionInput: institution },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Error creating institution');
        }
        this.institutions.push(result.data.createInstitution);
      } catch (error: any) {
        console.error('Error creating institution:', error);
        throw error;
      }
    },

    async updateInstitution(institution: Institution) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: UpdateInstitutionMutation,
          variables: { updateInstitutionInput: institution },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Error updating institution');
        }
        const index = this.institutions.findIndex(i => i._id === result.data.updateInstitution._id);
        if (index !== -1) {
          this.institutions.splice(index, 1, result.data.updateInstitution);
        }
      } catch (error: any) {
        console.error('Error updating institution:', error);
        throw error;
      }
    },

    async deleteInstitution(id: string) {
      const { $apollo } = useNuxtApp();
      try {
        await $apollo.default.mutate({
          mutation: DeleteInstitutionMutation,
          variables: { id },
        });
        this.institutions = this.institutions.filter(i => i._id !== id);
      } catch (error: any) {
        console.error('Error deleting institution:', error);
        throw error;
      }
    },

    async fetchInstitutionById(id: string): Promise<Institution | null> {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({
          query: InstitutionQuery,
          variables: { id },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Error fetching institution by ID');
        }
        return result.data.institution;
      } catch (error: any) {
        console.error('Error fetching institution by ID:', error);
        throw error;
      }
    },
  },
});