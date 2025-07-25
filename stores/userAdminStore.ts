import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import type { User } from "~/types";

export const useUserAdminStore = defineStore("userAdmin", () => {
  // State
  const users = ref<User[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<any>(null);

  // Actions
  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { client } = useApolloClient();
      const { data, errors } = await client.query({
        query: gql`
          query GetUsers {
            users {
              id
              name
              email
              role
            }
          }
        `,
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
      users.value = data.users;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userData: any): Promise<User> => {
    loading.value = true;
    try {
      const { mutate } = useMutation(gql`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            name
            email
            role
          }
        }
      `);
      const result = await mutate({ input: userData });
      if (result?.errors) throw result.errors;
      await fetchUsers();
      return result?.data?.createUser;
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id: string, userData: any): Promise<User> => {
    loading.value = true;
    try {
      const { mutate } = useMutation(gql`
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
          updateUser(id: $id, input: $input) {
            id
            name
            email
            role
          }
        }
      `);
      const result = await mutate({ id, input: userData });
      if (result?.errors) throw result.errors;
      await fetchUsers();
      return result?.data?.updateUser;
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    loading.value = true;
    try {
      const { mutate } = useMutation(gql`
        mutation DeleteUser($id: ID!) {
          deleteUser(id: $id)
        }
      `);
      const result = await mutate({ id });
      if (result?.errors) throw result.errors;
      await fetchUsers();
      return result?.data?.deleteUser;
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
});
