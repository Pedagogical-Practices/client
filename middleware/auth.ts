import { useAuthStore } from '~/stores/authStore';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    console.log('Auth middleware: User not authenticated, redirecting to login.');
    return navigateTo('/login');
  }
});
