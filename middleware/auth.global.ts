import { useAuthStore } from '~/stores/authStore';
import MeQuery from "~/queries/me.gql";
import { useApolloClient } from '@vue/apollo-composable';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const { getToken, onLogout } = useApollo();
  const { client } = useApolloClient();

  // On server-side, or if the user state is not yet loaded on client-side,
  // we need to check for a token and fetch the user.
  const token = await getToken();
  if (token && !authStore.isAuthenticated) {
    const { data, error } = await client.query({ query: MeQuery });
    if (data?.me) {
      authStore.setUser(data.me);
    } else {
      // Token is invalid/expired, clear it and the store
      await onLogout();
      authStore.setUser(null);
    }
  }

  // Define public routes that do not require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(to.path);

  // If trying to access a protected route and not authenticated, redirect to login
  if (!isPublicRoute && !authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  // If authenticated and trying to access login/register, redirect to home
  if (authStore.isAuthenticated && isPublicRoute) {
    return navigateTo('/');
  }
});