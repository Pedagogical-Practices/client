import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '~/stores/authStore';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Asegúrate de que este plugin solo se ejecute en el cliente
  if (process.client) {
    const authStore = useAuthStore();

    // Hook para interceptar cada solicitud Apollo y añadir el token
    nuxtApp.hook('apollo:request', ({ setContext }) => {
      setContext(({ headers }) => ({
        headers: {
          ...headers,
          authorization: authStore.token ? `Bearer ${authStore.token}` : '',
        },
      }));
    });

    // Observar cambios en el token del store para actualizar las cabeceras dinámicamente
    authStore.$subscribe((mutation, state) => {
      // No necesitamos llamar a setHeaders aquí directamente en el cliente de Apollo
      // porque el hook apollo:request se encargará de obtener el token más reciente
      // en cada solicitud.
    });
  }
});
