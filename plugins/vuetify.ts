// plugins/vuetify.ts
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { VCalendar } from "vuetify/labs/VCalendar";
import { VDateInput } from "vuetify/labs/VDateInput";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      VCalendar,
      VDateInput,
    },
    directives,
    ssr: true,
  });

  app.vueApp.use(vuetify);
});
