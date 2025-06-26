import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware((to) => {
  // generate code
  const authStore = useAuthStore();

  if (!authStore.token) {
    console.log("auth middleware: No token found, redirecting to /login"); // Log para depuración
    return navigateTo("/login");
  }
  console.log("auth middleware: Token found:", authStore.token);

  if (to.path === "/editor" && !authStore.isAdmin) {
    return navigateTo("/");
  }

  if (to.path === "/admin" && !authStore.isAdmin) {
    return navigateTo("/");
  }
});
