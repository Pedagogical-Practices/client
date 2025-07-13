import { defineStore } from "pinia";
import { navigateTo } from "nuxt/app";
import { ref, computed } from 'vue'; // Importar ref y computed
import { useApolloClient } from '@vue/apollo-composable'; // Importar useApolloClient
import { gql } from 'graphql-tag'; // Importar gql
import type { UserDto, CreateUserInput, UpdateUserInput } from "~/types/user";

// Import GQL documents. The module will handle loading them as DocumentNodes.
import CreateUserMutation from "~/queries/register.gql";
import LoginMutation from "~/queries/login.gql";
import UpdateUserMutation from "~/queries/updateUser.gql";
import MeQuery from "~/queries/me.gql";

const GET_USERS_QUERY_STRING = `
  query GetUsers {
    users {
      _id
      name
      email
      role
    }
  }
`;

// piniaPluginPersistedstate is auto-imported by the Nuxt module

interface AuthState {
  user: UserDto | null;
  users: UserDto[]; // Añadir la lista de usuarios
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<UserDto | null>(null);
  const users = ref<UserDto[]>([]); // Inicializar users como un array vacío

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
      await onLogin(token); // Handles token storage and client reset
      await navigateTo(user.value?.role === "admin" ? "/editor" : "/");

    } catch (error: any) {
      console.error("authStore: Login error:", error);
      throw new Error(error.message || "Error desconocido durante el inicio de sesión.");
    }
  };

  const register = async (userInput: CreateUserInput): Promise<void> => {
    const { onLogin } = useApollo();
    const { mutate } = useMutation(CreateUserMutation);

    try {
      const result = await mutate({ createUserInput: userInput });

      if (result?.errors) {
        throw new Error(result.errors[0]?.message || "Error en el registro");
      }

      const { user: registeredUser, token } = result?.data?.createUser;
      user.value = registeredUser;
      await onLogin(token);
      await navigateTo(user.value?.role === "admin" ? "/editor" : "/");

    } catch (error: any) {
      console.error("authStore: Register error:", error);
      throw new Error(error.message || "Error desconocido durante el registro.");
    }
  };

  const updateProfile = async (userInput: UpdateUserInput): Promise<void> => {
    const { mutate } = useMutation(UpdateUserMutation);
    try {
      const result = await mutate({ updateUserInput: userInput });

      if (result?.errors) {
        throw new Error(result.errors[0]?.message || "Error al actualizar el perfil");
      }
      user.value = result?.data?.updateUser;
    } catch (error: any) {
      console.error("authStore: UpdateProfile error:", error);
      throw new Error(error.message || "Error desconocido al actualizar el perfil.");
    }
  };

  const logout = async (): Promise<void> => {
    const { onLogout } = useApollo();
    user.value = null;
    await onLogout(); // Handles token removal and client reset
    await navigateTo("/login");
  };

  const setUser = (newUser: UserDto | null) => {
    user.value = newUser;
  };

  const fetchUsers = async () => {
    const { client } = useApolloClient();
    try {
      const { data, errors } = await client.query({ query: gql(GET_USERS_QUERY_STRING), fetchPolicy: 'network-only' });
      if (errors) throw errors;
      users.value = data.users;
      console.log('authStore: Users fetched and assigned:', users.value);
    } catch (error: any) {
      console.error("authStore: Error fetching users:", error);
      throw new Error(error.message || "Error desconocido al cargar usuarios.");
    }
  };

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  // Return state, actions, and getters
  return {
    user,
    users, // Exportar users
    login,
    register,
    updateProfile,
    logout,
    setUser,
    fetchUsers, // Exportar fetchUsers
    isAuthenticated,
    isAdmin,
  };
}, {
  // Pinia Persist configuration
  persist: {
    storage: piniaPluginPersistedstate.localStorage(), // Use the module's localStorage function
    paths: ['user'],
  },
});