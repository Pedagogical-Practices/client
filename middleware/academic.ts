import { useAuthStore } from '~/stores/authStore';
import { UserRole } from '~/types';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Si el usuario no está autenticado, redirigir al login.
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  const userRoles = authStore.user?.roles || [];
  const requiredRoles = [UserRole.TUTOR, UserRole.ASSESSOR, UserRole.COORDINATOR];

  const hasRequiredRole = userRoles.some(role => requiredRoles.includes(role));

  // Si el usuario no tiene ninguno de los roles requeridos, redirigir a la página principal.
  if (!hasRequiredRole) {
    return navigateTo('/');
  }
});
