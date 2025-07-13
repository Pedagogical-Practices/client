import { defineStore } from 'pinia';
import { useApolloClient } from '@vue/apollo-composable';
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
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({ query: InstitutionsQuery, variables: { search }, fetchPolicy: 'network-only' });
        if (errors) throw errors;
        this.institutions = data.institutions;
        console.log('institutionStore: Institutions fetched and assigned:', this.institutions);
      } catch (error: any) {
        console.error('Error fetching institutions:', error);
        throw error;
      }
    },

    async createInstitution(institution: Omit<Institution, '_id'>) {
      const { mutate } = useMutation(CreateInstitutionMutation);
      try {
        const result = await mutate({ createInstitutionInput: institution });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || 'Error creating institution');
        }
        await this.fetchInstitutions(); // Re-fetch the list
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
        await this.fetchInstitutions(); // Re-fetch the list
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
        await this.fetchInstitutions(); // Re-fetch the list
      } catch (error: any) {
        console.error('Error deleting institution:', error);
        throw error;
      }
    },

    async fetchInstitutionById(id: string): Promise<Institution | null> {
      const { client } = useApolloClient();
      try {
        const { data, errors } = await client.query({ query: InstitutionQuery, variables: { id }, fetchPolicy: 'network-only' });
        if (errors) throw errors;
        return data.institution || null;
      } catch (error: any) {
        console.error('Error fetching institution by ID:', error);
        throw error;
      }
    },
  },
});
