import { useAuthStore } from '~/stores/authStore';
import MeQuery from "~/queries/me.gql";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Routes that require the user to be authenticated.
  const protectedRoutes = ['/editor', '/forms', '/protocols', '/practices', '/courses', '/institutions', '/profile', '/settings'];
  // Routes that require admin privileges.
  const adminRoutes = ['/editor']; // Add other admin-only routes here

  const authStore = useAuthStore();
  const { getToken, onLogout } = useApollo();

  // On server-side, or if the user state is not yet loaded on client-side,
  // we need to check for a token and fetch the user.
  const token = await getToken();
  if (token && !authStore.isAuthenticated) {
    const { data, error } = await useAsyncQuery(MeQuery);
    if (data.value?.me) {
      authStore.setUser(data.value.me);
    } else {
      // Token is invalid/expired, clear it and the store
      await onLogout();
      authStore.setUser(null);
    }
  }

  const requiresAuth = protectedRoutes.some(path => to.path.startsWith(path));
  const requiresAdmin = adminRoutes.some(path => to.path.startsWith(path));

  // --- Redirection Logic ---

  // If the route requires authentication and the user is not logged in, redirect to login.
  if (requiresAuth && !authStore.isAuthenticated) {
    // Avoid redirect loop if already going to login
    if (to.path !== '/login') {
      return navigateTo('/login');
    }
    return; // Already on a public page or login, do nothing.
  }

  // If the route requires admin and the user is not an admin, redirect to the home page.
  if (requiresAdmin && !authStore.isAdmin) {
    return navigateTo('/');
  }

  // If the user is logged in and tries to access login/register, redirect them to the editor.
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/editor');
  }
});