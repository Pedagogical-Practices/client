// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  if (process.client) {
    await authStore.loadUserFromToken();
    console.log("auth.global.ts: authStore.user:", authStore.user);
    console.log(
      "auth.global.ts: authStore.isAuthenticated:",
      authStore.isAuthenticated
    );
    if (authStore.token) {
      try {
        const token = authStore.token;
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("auth.global.ts: Decoded token payload:", payload);
        if (!payload.sub) {
          console.log(
            "auth.global.ts: Token does not contain sub, forcing logout"
          );
          authStore.logout();
          return navigateTo("/login");
        }
      } catch (error) {
        console.error("auth.global.ts: Invalid token, forcing logout:", error);
        authStore.logout();
        return navigateTo("/login");
      }
    }
    if (
      !authStore.isAuthenticated &&
      to.path !== "/login" &&
      to.path !== "/register" &&
      to.path !== "/editor" // Permitir redirección a /editor tras login
    ) {
      console.log("auth.global.ts: Not authenticated, redirecting to /login", {
        path: to.path,
      });
      return navigateTo("/login");
    }
  }
});
