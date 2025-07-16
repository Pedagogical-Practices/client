import { defineStore } from 'pinia';
import { useApolloClient } from '@vue/apollo-composable';
import * as AdminUsersQueries from '~/queries/adminUsers.gql';

export const useUserAdminStore = defineStore('userAdmin', {
  state: () => ({
    users: [] as any[],
    loading: false,
    error: null as any,
  }),
  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const { client } = useApolloClient();
        const { data, errors } = await client.query({ query: AdminUsersQueries.GetUsers, fetchPolicy: 'network-only' });
        if (errors) throw errors;
        this.users = data.users;
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async createUser(userData: any) {
      this.loading = true;
      try {
        const { mutate } = useMutation(AdminUsersQueries.CreateUser);
        const response = await mutate({ createUserInput: userData });
        if (response?.errors) throw response.errors;
        await this.fetchUsers(); // Re-fetch the list
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id: string, userData: any) {
      this.loading = true;
      try {
        const { mutate } = useMutation(AdminUsersQueries.UpdateUserByAdmin);
        const response = await mutate({ id, updateUserInput: { _id: id, ...userData } });
        if (response?.errors) throw response.errors;
        await this.fetchUsers(); // Re-fetch the list
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id: string) {
      this.loading = true;
      try {
        const { mutate } = useMutation(AdminUsersQueries.DeleteUser);
        const response = await mutate({ id });
        if (response?.errors) throw response.errors;
        await this.fetchUsers(); // Re-fetch the list
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
  },
});