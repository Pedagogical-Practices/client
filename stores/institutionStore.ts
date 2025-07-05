import { defineStore } from 'pinia';
import type { Institution } from '~/types/institution';

// Import GQL documents
import InstitutionsQuery from '~/queries/institutions.gql';
import InstitutionQuery from '~/queries/institution.gql';
import CreateInstitutionMutation from '~/queries/createInstitution.gql';
import UpdateInstitutionMutation from '~/queries/updateInstitution.gql';
import DeleteInstitutionMutation from '~/queries/deleteInstitution.gql';

interface InstitutionState {
  institutions: Institution[];
}

export const useInstitutionStore = defineStore('institution', {
  state: (): InstitutionState => ({
    institutions: [],
  }),
  actions: {
    async fetchInstitutions(search?: string) {
      const { data, error } = await useAsyncQuery(InstitutionsQuery, { search });
      if (error.value) {
        console.error('Error fetching institutions:', error.value);
        throw error.value;
      }
      console.log('fetchInstitutions: Data received:', data.value);
      if (data.value?.institutions) {
        this.institutions = data.value.institutions;
        console.log('fetchInstitutions: Store updated with', this.institutions.length, 'institutions.');
      }
    },

    async createInstitution(institution: Omit<Institution, '_id'>) {
      const { mutate } = useMutation(CreateInstitutionMutation);
      try {
        const result = await mutate({ createInstitutionInput: institution });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || 'Error creating institution');
        }
        if (result?.data?.createInstitution) {
          this.institutions.push(result.data.createInstitution);
        }
      } catch (error: any) {
        console.error('Error creating institution:', error);
        throw error;
      }
    },

    async updateInstitution(institution: Institution) {
      const { mutate } = useMutation(UpdateInstitutionMutation);
      try {
        const result = await mutate({ updateInstitutionInput: institution });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || 'Error updating institution');
        }
        if (result?.data?.updateInstitution) {
          const index = this.institutions.findIndex(i => i._id === result.data.updateInstitution._id);
          if (index !== -1) {
            this.institutions.splice(index, 1, result.data.updateInstitution);
          }
        }
      } catch (error: any) {
        console.error('Error updating institution:', error);
        throw error;
      }
    },

    async deleteInstitution(id: string) {
      const { mutate } = useMutation(DeleteInstitutionMutation);
      try {
        const result = await mutate({ id });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || 'Error deleting institution');
        }
        this.institutions = this.institutions.filter(i => i._id !== id);
      } catch (error: any) {
        console.error('Error deleting institution:', error);
        throw error;
      }
    },

    async fetchInstitutionById(id: string): Promise<Institution | null> {
      const { data, error } = await useAsyncQuery(InstitutionQuery, { id });
      if (error.value) {
        console.error('Error fetching institution by ID:', error.value);
        throw error.value;
      }
      return data.value?.institution || null;
    },
  },
});