import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware((to) => {
  // generate code
  const authStore = useAuthStore();

  if (to.path === "/editor" && !authStore.isAdmin) {
    return navigateTo("/");
  }

  if (to.path === "/admin" && !authStore.isAdmin) {
    return navigateTo("/");
  }
});
