import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

export interface Institution {
  _id?: string;
  name: string;
  address?: string;
  phone?: string;
}

interface InstitutionState {
  institutions: Institution[];
}

export const useInstitutionStore = defineStore('institution', {
  state: (): InstitutionState => ({
    institutions: [],
  }),
  actions: {
    async fetchInstitutions(search?: string) {
      try {
        const { public: { GQL_HOST } } = useRuntimeConfig();
        const authStore = useAuthStore();
        const query = `
          query Institutions($search: String) {
            institutions(search: $search) {
              _id
              name
              address
              phone
            }
          }
        `;
        const response = await fetch(GQL_HOST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            query,
            variables: { search },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'Error fetching institutions');
        }
        this.institutions = data.data.institutions;
      } catch (error: any) {
        console.error('Error fetching institutions:', error);
        throw error;
      }
    },

    async createInstitution(institution: Institution) {
      try {
        const { public: { GQL_HOST } } = useRuntimeConfig();
        const authStore = useAuthStore();

        // Crear un nuevo objeto sin el campo _id para la mutación
        const { _id, ...institutionData } = institution;

        const mutation = `
          mutation CreateInstitution($createInstitutionInput: CreateInstitutionInput!) {
            createInstitution(createInstitutionInput: $createInstitutionInput) {
              _id
              name
              address
              phone
            }
          }
        `;
        const response = await fetch(GQL_HOST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { createInstitutionInput: institutionData }, // Usar institutionData aquí
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'Error creating institution');
        }
        this.institutions.push(data.data.createInstitution);
      } catch (error: any) {
        console.error('Error creating institution:', error);
        throw error;
      }
    },

    async updateInstitution(institution: Institution) {
      try {
        const { public: { GQL_HOST } } = useRuntimeConfig();
        const authStore = useAuthStore();
        const mutation = `
          mutation UpdateInstitution($updateInstitutionInput: UpdateInstitutionInput!) {
            updateInstitution(updateInstitutionInput: $updateInstitutionInput) {
              _id
              name
              address
              phone
            }
          }
        `;
        const response = await fetch(GQL_HOST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { updateInstitutionInput: institution },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'Error updating institution');
        }
        const index = this.institutions.findIndex(i => i._id === data.data.updateInstitution._id);
        if (index !== -1) {
          this.institutions.splice(index, 1, data.data.updateInstitution);
        }
      } catch (error: any) {
        console.error('Error updating institution:', error);
        throw error;
      }
    },

    async deleteInstitution(id: string) {
      try {
        const { public: { GQL_HOST } } = useRuntimeConfig();
        const authStore = useAuthStore();
        const mutation = `
          mutation DeleteInstitution($id: String!) {
            deleteInstitution(id: $id)
          }
        `;
        const response = await fetch(GQL_HOST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { id },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'Error deleting institution');
        }
        if (data.data.deleteInstitution) {
          this.institutions = this.institutions.filter(i => i._id !== id);
        }
      } catch (error: any) {
        console.error('Error deleting institution:', error);
        throw error;
      }
    },

    async fetchInstitutionById(id: string): Promise<Institution | null> {
      try {
        const { public: { GQL_HOST } } = useRuntimeConfig();
        const authStore = useAuthStore();
        const query = `
          query Institution($id: String!) {
            institution(id: $id) {
              _id
              name
              address
              phone
            }
          }
        `;
        const response = await fetch(GQL_HOST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            query,
            variables: { id },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'Error fetching institution by ID');
        }
        return data.data.institution;
      } catch (error: any) {
        console.error('Error fetching institution by ID:', error);
        throw error;
      }
    },
  },
});
