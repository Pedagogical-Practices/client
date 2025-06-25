<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>Control de prácticas pedagógicas </v-toolbar-title>
        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :temporary="$vuetify.display.smAndDown"
      >
        <v-list>
          <v-list-subheader>Plain Variant</v-list-subheader>

          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            color="primary"
            variant="plain"
            :to="item.to"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <slot />
      </v-main>
    </v-layout>
  </v-card>
</template>
<script setup>
import { ref, watch } from "vue";

const items = [
  {
    title: "Home",
    value: "home",
    to: "/",
    icon: "mdi-home",
  },
  {
    title: "Editor",
    value: "editor",
    to: "/editor",
    icon: "mdi-text-box",
  },
  {
    title: "Cursos",
    value: "courses",
    to: "/courses",
    icon: "mdi-book-open-page-variant",
  },
  {
    title: "Formularios",
    value: "forms",
    to: "/forms",
    icon: "mdi-form-select",
  },
  {
    title: "Protocolos",
    value: "protocols",
    to: "/protocols",
    icon: "mdi-file-document-box",
  },
  {
    title: "Perfil",
    value: "profile",
    to: "/profile",
    icon: "mdi-account-profile",
  },
  {
    title: "Cerrar sesión",
    value: "logout",
    to: "/logout",
    icon: "mdi-logout",
  },
];

const drawer = ref(false);
const group = ref(null);

watch(group, () => {
  drawer.value = false;
});
</script>
