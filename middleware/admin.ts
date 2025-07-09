import { useAuthStore } from '~/stores/authStore';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user || user.role !== 'admin') {
    return navigateTo('/'); // Redirigir a la página de inicio si no es admin
  }
});
