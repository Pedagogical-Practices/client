import { defineStore } from "pinia";
import { navigateTo } from "nuxt/app";
import { ref, computed } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

import { UserRole } from "~/types";
import type { User } from "~/types";

// GQL documents
import LoginMutation from "~/queries/login.gql";
import CreateUserMutation from "~/queries/createUser.gql";
import UpdateUserMutation from "~/queries/updateUser.gql";
import DeleteUserMutation from "~/queries/deleteUser.gql";
import GetUsersQuery from "~/queries/users.gql";
import GetUserByIdQuery from "~/queries/user.gql";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const { onLogin, onLogout } = useApollo();
    const { client: apolloClient } = useApolloClient();

    // State
    const user = ref<User | null>(null);
    const users = ref<User[]>([]);

    // Actions
    const login = async (email: string, password: string): Promise<void> => {
      try {
        const { data, errors } = await apolloClient.mutate({
          mutation: LoginMutation,
          variables: { email, password },
        });

        if (errors) {
          throw new Error(errors[0]?.message || "Error en login");
        }

        const { user: loggedInUser, token } = data?.login;
        user.value = loggedInUser;
        await onLogin(token); // Usa el onLogin del scope principal
        await navigateTo(
          user.value?.roles?.includes(UserRole.ADMIN) ? "/admin" : "/"
        );
      } catch (error: any) {
        console.error("authStore: Login error:", error);
        throw new Error(
          error.message || "Error desconocido durante el inicio de sesión."
        );
      }
    };

    const createUser = async (userInput: any): Promise<User> => {
      try {
        const { data, errors } = await apolloClient.mutate({
          mutation: CreateUserMutation,
          variables: { input: userInput },
        });
        if (errors) {
          throw new Error(errors[0]?.message || "Error al crear usuario");
        }
        return data?.createUser;
      } catch (error: any) {
        console.error("authStore: CreateUser error:", error);
        throw new Error(error.message || "Error desconocido al crear usuario.");
      }
    };

    const updateUser = async (id: string, userInput: any): Promise<User> => {
      try {
        const { data, errors } = await apolloClient.mutate({
          mutation: UpdateUserMutation,
          variables: { id, input: userInput },
        });
        if (errors) {
          throw new Error(errors[0]?.message || "Error al actualizar usuario");
        }
        return data?.updateUser;
      } catch (error: any) {
        console.error("authStore: UpdateUser error:", error);
        throw new Error(
          error.message || "Error desconocido al actualizar usuario."
        );
      }
    };

    const deleteUser = async (id: string): Promise<boolean> => {
      try {
        const { data, errors } = await apolloClient.mutate({
          mutation: DeleteUserMutation,
          variables: { id },
        });
        if (errors) {
          throw new Error(errors[0]?.message || "Error al eliminar usuario");
        }
        return data?.deleteUser;
      } catch (error: any) {
        console.error("authStore: DeleteUser error:", error);
        throw new Error(
          error.message || "Error desconocido al eliminar usuario."
        );
      }
    };

    const logout = async (): Promise<void> => {
      user.value = null;
      await onLogout(); // Usa el onLogout del scope principal
      await navigateTo("/login");
    };

    const setUser = (newUser: User | null) => {
      user.value = newUser;
    };

    const fetchUsers = async () => {
      try {
        const { data, errors } = await apolloClient.query({
          query: GetUsersQuery,
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
          query: GetUserByIdQuery,
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
      storage: "localStorage", // Sintaxis corregida
      paths: ["user"],
    },
  }
);
