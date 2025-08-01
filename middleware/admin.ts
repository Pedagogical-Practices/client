import { useAuthStore } from '~/stores/authStore';
import { UserRole } from "~/types";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user || user.role !== UserRole.ADMIN) {
    return navigateTo('/'); // Redirigir a la página de inicio si no es admin
  }
});
