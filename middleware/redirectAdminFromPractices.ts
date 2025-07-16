import { useAuthStore } from '~/stores/authStore';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  console.log("Middleware: redirectAdminFromPractices");
  console.log("  to.path:", to.path);
  console.log("  isAuthenticated:", authStore.isAuthenticated);
  console.log("  user:", authStore.user);

  // Solo aplicar si el usuario está autenticado y tiene un rol
  if (authStore.isAuthenticated && authStore.user) {
    const isAdminOrCoordinator = authStore.user.role === 'admin' || authStore.user.role === 'coordinator';

    // Si es admin/coordinator y está intentando acceder a una ruta de prácticas de usuario
    if (isAdminOrCoordinator && to.path.startsWith('/practices')) {
      console.log("  Redirecting admin/coordinator from /practices to /admin/practices");
      // Redirigir al panel de administración de prácticas
      return navigateTo('/admin/practices');
    }
  }
});
