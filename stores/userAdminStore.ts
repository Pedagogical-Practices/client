import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import type { User } from "~/types";

// Importar queries/mutations
import GetUsersQuery from "~/queries/admin/users/getUsers.gql";
import CreateUserMutation from "~/queries/admin/users/createUser.gql";
import UpdateUserMutation from "~/queries/admin/users/updateUser.gql";
import DeleteUserMutation from "~/queries/admin/users/deleteUser.gql";

export const useUserAdminStore = defineStore("userAdmin", () => {
  const { client } = useApolloClient();

  // State
  const users = ref<User[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<any>(null);

  // Actions
  const _handleError = (e: any, context: string) => {
    error.value = e;
    console.error(`Error in ${context}:`, e);
    throw e;
  };

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, errors } = await client.query({ query: GetUsersQuery, fetchPolicy: "network-only" });
      if (errors) throw errors;
      users.value = data.users;
    } catch (e) {
      _handleError(e, "fetchUsers");
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userData: any): Promise<User | undefined> => {
    loading.value = true;
    try {
      const { data, errors } = await client.mutate({ mutation: CreateUserMutation, variables: { input: userData } });
      if (errors) throw errors;
      await fetchUsers();
      return data?.createUser;
    } catch (e) {
      _handleError(e, "createUser");
    }
  };

  const updateUser = async (userData: any): Promise<User | undefined> => {
    loading.value = true;
    try {
      const { data, errors } = await client.mutate({ mutation: UpdateUserMutation, variables: { input: userData } });
      if (errors) throw errors;
      await fetchUsers();
      return data?.updateUser;
    } catch (e) {
      _handleError(e, "updateUser");
    }
  };

  const deleteUser = async (id: string): Promise<boolean | undefined> => {
    loading.value = true;
    try {
      const { data, errors } = await client.mutate({ mutation: DeleteUserMutation, variables: { id } });
      if (errors) throw errors;
      await fetchUsers();
      return data?.deleteUser;
    } catch (e) {
      _handleError(e, "deleteUser");
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