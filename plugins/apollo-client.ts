import { defineNuxtPlugin } from '#app';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '~/generated/gql';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const client = new GraphQLClient(config.public.GQL_HOST, {
    headers: {
      // Aquí puedes añadir cabeceras globales si es necesario
    },
  });

  const sdk = getSdk(client);

  // Inyectar el cliente y el SDK en el contexto de la aplicación
  nuxtApp.provide('gqlClient', client);
  nuxtApp.provide('gqlSdk', sdk);
});
