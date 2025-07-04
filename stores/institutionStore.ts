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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({
          query: InstitutionsQuery,
          variables: { search },
        });
        this.institutions = data.institutions;
      } catch (error: any) {
        console.error('Error fetching institutions:', error);
        throw error;
      }
    },

    async createInstitution(institution: Omit<Institution, '_id'>) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: CreateInstitutionMutation,
          variables: { createInstitutionInput: institution },
        });
        this.institutions.push(data.createInstitution);
      } catch (error: any) {
        console.error('Error creating institution:', error);
        throw error;
      }
    },

    async updateInstitution(institution: Institution) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: UpdateInstitutionMutation,
          variables: { updateInstitutionInput: institution },
        });
        const index = this.institutions.findIndex(i => i._id === data.updateInstitution._id);
        if (index !== -1) {
          this.institutions.splice(index, 1, data.updateInstitution);
        }
      } catch (error: any) {
        console.error('Error updating institution:', error);
        throw error;
      }
    },

    async deleteInstitution(id: string) {
      const { $gqlClient } = useNuxtApp();
      try {
        await $gqlClient.mutate({
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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({
          query: InstitutionQuery,
          variables: { id },
        });
        return data.institution;
      } catch (error: any) {
        console.error('Error fetching institution by ID:', error);
        throw error;
      }
    },
  },
});