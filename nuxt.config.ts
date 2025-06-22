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
      GQL_HOST: process.env.GQL_HOST || "http://127.0.0.1:4000/graphql",
    },
  },
  "graphql-client": {
    watch: true,
    autoImport: true,
    functionPrefix: "Gql",
    documentPaths: ["./queries"],
    preferGETQueries: false,
    codegen: {
      silent: false, // Mostrar logs de codegen
      skipTypename: true,
      useTypeImports: true,
      dedupeFragments: true,
      onlyOperationTypes: true,
      avoidOptionals: true, // Como en el ejemplo
      disableOnBuild: false,
      maybeValue: "T | null",
      scalars: {},
    },
    clients: {
      default: {
        host: process.env.GQL_HOST || "http://127.0.0.1:4000/graphql",
      },
    },
  },
});
