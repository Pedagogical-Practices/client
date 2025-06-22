import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  if (to.path === "/editor" && !authStore.isAdmin) {
    return navigateTo("/");
  }
});
