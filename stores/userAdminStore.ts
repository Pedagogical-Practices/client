import { defineStore } from 'pinia';
import GetUsers from '~/queries/adminUsers.gql';
import { CreateUser, UpdateUserByAdmin, DeleteUser } from '~/queries/adminUsers.gql';

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
        const { data, error } = await useAsyncQuery(GetUsers);
        if (error.value) {
          throw error.value;
        }
        this.users = data.value.users;
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async createUser(userData: any) {
      this.loading = true;
      try {
        const { mutate } = useMutation(CreateUser);
        const response = await mutate({ createUserInput: userData });
        if (response?.data) {
          this.users.push(response.data.createUser.user);
        }
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id: string, userData: any) {
      this.loading = true;
      try {
        const { mutate } = useMutation(UpdateUserByAdmin);
        const response = await mutate({ id, updateUserInput: { _id: id, ...userData } });
        if (response?.data) {
          const index = this.users.findIndex(u => u._id === id);
          if (index !== -1) {
            this.users[index] = response.data.updateUserByAdmin;
          }
        }
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id: string) {
      this.loading = true;
      try {
        const { mutate } = useMutation(DeleteUser);
        await mutate({ id });
        this.users = this.users.filter(u => u._id !== id);
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
  },
});