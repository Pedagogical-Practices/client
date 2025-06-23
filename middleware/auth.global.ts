import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  if (process.client) {
    await authStore.loadUserFromToken();
    if (
      !authStore.isAuthenticated &&
      to.path !== "/login" &&
      to.path !== "/register"
    ) {
      return navigateTo("/login");
    }
  }
});
