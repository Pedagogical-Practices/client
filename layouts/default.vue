<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>Control de prácticas pedagógicas</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="!authStore.isAuthenticated" to="/login" text>
          Iniciar Sesión
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :temporary="isMobile"
        :mobile="isMobile"
        location="left"
        theme="light"
        v-if="authStore.isAuthenticated"
      >
        <v-list>
          <v-list-item
            v-for="(item, i) in filteredItems"
            :key="i"
            :value="item"
            color="primary"
            variant="plain"
            :to="item.to"
            @click="drawer = false"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/authStore";

const authStore = useAuthStore();
const drawer = ref(false);
const isMobile = ref(false);
const router = useRouter();

const allItems = [
  {
    title: "Home",
    value: "home",
    to: "/",
    icon: "mdi-home",
    roles: [
      "admin",
      "student",
      "teacher_directive",
      "administrative",
      "family",
      "coordinator",
    ],
  },
  {
    title: "Editor",
    value: "editor",
    to: "/editor",
    icon: "mdi-text-box",
    roles: ["admin", "coordinator"],
  },
  {
    title: "Cursos",
    value: "courses",
    to: "/courses",
    icon: "mdi-book-open-page-variant",
    roles: ["admin", "coordinator"],
  },
  {
    title: "Formularios",
    value: "forms",
    to: "/forms",
    icon: "mdi-form-select",
    roles: ["admin", "coordinator"],
  },
  {
    title: "Protocolos",
    value: "protocols",
    to: "/protocols",
    icon: "mdi-file-document-box",
    roles: [
      "admin",
      "student",
      "teacher_directive",
      "administrative",
      "family",
      "coordinator",
    ],
  },
  {
    title: "Perfil",
    value: "profile",
    to: "/profile",
    icon: "mdi-account-profile",
    roles: [
      "admin",
      "student",
      "teacher_directive",
      "administrative",
      "family",
      "coordinator",
    ],
  },
  {
    title: "Asistencia",
    value: "attendance",
    to: "/attendance",
    icon: "mdi-chart-bar",
    roles: ["admin", "coordinator"],
  },
  {
    title: "Administración",
    value: "admin",
    to: "/admin",
    icon: "mdi-account-cog",
    roles: ["admin"],
  },
  {
    title: "Usuarios",
    value: "users",
    to: "/admin/users",
    icon: "mdi-account-group",
    roles: ["admin"],
  },
  {
    title: "Instituciones",
    value: "institutions",
    to: "/admin/institutions",
    icon: "mdi-bank",
    roles: ["admin"],
  },
  /*{
    title: "Gestionar Protocolos",
    value: "admin-protocols",
    to: "/admin/protocols",
    icon: "mdi-file-document-multiple",
    roles: ["admin"],
  },*/
  {
    title: "Configuración",
    value: "settings",
    to: "/settings",
    icon: "mdi-cog",
    roles: ["admin", "coordinator"],
  },
  {
    title: "Gestionar Prácticas",
    value: "admin-practices",
    to: "/admin/practices",
    icon: "mdi-school-outline",
    roles: ["admin", "coordinator", "teacher_directive"],
  },
  {
    title: "Mis Prácticas",
    value: "practices",
    to: "/practices",
    icon: "mdi-school",
    roles: [
      "admin",
      "student",
      "teacher_directive",
      "administrative",
      "family",
      "coordinator",
    ],
  },
  {
    title: "Cerrar sesión",
    value: "logout",
    to: "/logout",
    icon: "mdi-logout",
    roles: [
      "admin",
      "student",
      "teacher_directive",
      "administrative",
      "family",
      "coordinator",
    ],
  },
];

const filteredItems = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) {
    return [];
  }
  return allItems.filter((item) => item.roles.includes(authStore.user.role));
});

router.afterEach(() => {
  drawer.value = false;
});

onMounted(() => {
  isMobile.value = window.innerWidth < 600;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 600;
  });
});
</script>
