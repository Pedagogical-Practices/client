import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '~/stores/authStore';

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  nuxtApp.hook('app:created', () => {
    if (nuxtApp.$graphql) {
      nuxtApp.$graphql.setHeaders({
        authorization: authStore.token ? `Bearer ${authStore.token}` : '',
      });

      authStore.$subscribe((mutation, state) => {
        nuxtApp.$graphql.setHeaders({
          authorization: state.token ? `Bearer ${state.token}` : '',
        });
      });
    } else {
      console.warn('nuxtApp.$graphql no está disponible en app:created');
    }
  });
});
