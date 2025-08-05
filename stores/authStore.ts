import { defineStore } from "pinia";
import { navigateTo } from "nuxt/app";
import { ref, computed } from "vue";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

import { UserRole } from "~/types";
import type { User } from "~/types";

// GQL documents
import LoginMutation from "~/queries/login.gql";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const { client: apolloClient } = useApolloClient();
    // State
    const user = ref<User | null>(null);
    const users = ref<User[]>([]);

    // Actions
    const login = async (email: string, password: string): Promise<void> => {
      const { onLogin } = useApollo();
      const { mutate } = useMutation(LoginMutation);

      try {
        const result = await mutate({ email, password });

        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error en login");
        }

        const { user: loggedInUser, token } = result?.data?.login;
        user.value = loggedInUser;
        await onLogin(token);
        await navigateTo(user.value?.roles?.includes(UserRole.ADMIN) ? "/admin" : "/");
      } catch (error: any) {
        console.error("authStore: Login error:", error);
        throw new Error(
          error.message || "Error desconocido durante el inicio de sesión."
        );
      }
    };

    const createUser = async (userInput: any): Promise<User> => {
      const { mutate } = useMutation(gql`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            firstName
            lastName
            email
            roles
          }
        }
      `);
      try {
        const result = await mutate({ input: userInput });
        if (result?.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al crear usuario"
          );
        }
        return result?.data?.createUser;
      } catch (error: any) {
        console.error("authStore: CreateUser error:", error);
        throw new Error(error.message || "Error desconocido al crear usuario.");
      }
    };

    const updateUser = async (id: string, userInput: any): Promise<User> => {
      const { mutate } = useMutation(gql`
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
          updateUser(id: $id, input: $input) {
            id
            firstName
            lastName
            email
            roles
          }
        }
      `);
      try {
        const result = await mutate({ id, input: userInput });
        if (result?.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al actualizar usuario"
          );
        }
        return result?.data?.updateUser;
      } catch (error: any) {
        console.error("authStore: UpdateUser error:", error);
        throw new Error(
          error.message || "Error desconocido al actualizar usuario."
        );
      }
    };

    const deleteUser = async (id: string): Promise<boolean> => {
      const { mutate } = useMutation(gql`
        mutation DeleteUser($id: ID!) {
          deleteUser(id: $id)
        }
      `);
      try {
        const result = await mutate({ id });
        if (result?.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al eliminar usuario"
          );
        }
        return result?.data?.deleteUser;
      } catch (error: any) {
        console.error("authStore: DeleteUser error:", error);
        throw new Error(
          error.message || "Error desconocido al eliminar usuario."
        );
      }
    };

    const logout = async (): Promise<void> => {
      const { onLogout } = useApollo();
      user.value = null;
      await onLogout();
      await navigateTo("/login");
    };

    const setUser = (newUser: User | null) => {
      user.value = newUser;
    };

    const fetchUsers = async () => {
      try {
        const { data, errors } = await apolloClient.query({
          query: gql`
            query GetUsers {
              users {
                id
                firstName
                lastName
                email
                roles
              }
            }
          `,
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        users.value = data.users;
      } catch (error: any) {
        console.error("authStore: Error fetching users:", error);
        throw new Error(
          error.message || "Error desconocido al cargar usuarios."
        );
      }
    };

    const fetchUserById = async (id: string): Promise<User | null> => {
      try {
        const { data, errors } = await apolloClient.query({
          query: gql`
            query GetUserById($id: ID!) {
              user(id: $id) {
                id
                firstName
                lastName
                email
                roles
              }
            }
          `,
          variables: { id },
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        return data.user;
      } catch (error: any) {
        console.error("authStore: Error fetching user by ID:", error);
        throw new Error(
          error.message || "Error desconocido al cargar usuario por ID."
        );
      }
    };

    // Getters
    const isAuthenticated = computed(() => !!user.value);
    const isAdmin = computed(() => user.value?.roles?.includes(UserRole.ADMIN));

    // Return state, actions, and getters
    return {
      user,
      users,
      login,
      createUser,
      updateUser,
      deleteUser,
      logout,
      setUser,
      fetchUsers,
      fetchUserById,
      isAuthenticated,
      isAdmin,
    };
  },
  {
    // Pinia Persist configuration
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      paths: ["user"],
    },
  }
);
