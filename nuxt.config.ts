// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "nuxt-graphql-client",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  build: {
    transpile: ["vuetify", "nuxt-graphql-request"],
  },
  runtimeConfig: {
    public: {
      GQL_HOST: "http://127.0.0.1:4000/graphql",
    },
  },
  graphql: {
    clients: {
      default: {
        endpoint: "http://127.0.0.1:4000/graphql",
        headers: {
          "Content-Type": "application/json",
          "x-apollo-operation-name": "CreateForm", // Evita CSRF
        },
      },
    },
  },
});
