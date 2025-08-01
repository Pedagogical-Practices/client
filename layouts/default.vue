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

      <client-only>
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
      </client-only>

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
import { UserRole } from "~/types";

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
      UserRole.ADMIN,
      UserRole.STUDENT,
      UserRole.TEACHER_DIRECTIVE,
      UserRole.FAMILY,
    ],
  },
  {
    title: "Editor",
    value: "editor",
    to: "/editor",
    icon: "mdi-text-box",
    roles: [UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE],
  },
  {
    title: "Cursos",
    value: "courses",
    to: "/courses",
    icon: "mdi-book-open-page-variant",
    roles: [UserRole.ADMIN],
  },
  {
    title: "Formularios",
    value: "forms",
    to: "/forms",
    icon: "mdi-form-select",
    roles: [UserRole.ADMIN],
  },
  {
    title: "Protocolos",
    value: "protocols",
    to: "/protocols",
    icon: "mdi-package",
    roles: [UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT],
  },
  {
    title: "Perfil",
    value: "profile",
    to: "/profile",
    icon: "mdi-account",
    roles: [
      UserRole.ADMIN,
      UserRole.STUDENT,
      UserRole.TEACHER_DIRECTIVE,
      UserRole.FAMILY,
    ],
  },
  {
    title: "Administración",
    value: "admin",
    to: "/admin",
    icon: "mdi-security",
    roles: [UserRole.ADMIN],
  },
  {
    title: "Usuarios",
    value: "users",
    to: "/admin/users",
    icon: "mdi-account-group",
    roles: [UserRole.ADMIN],
  },
  {
    title: "Gestionar Prácticas",
    value: "admin-practices",
    to: "/admin/practices",
    icon: "mdi-school-outline",
    roles: [UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE],
  },
  {
    title: "Mis Prácticas",
    value: "practices",
    to: "/practices",
    icon: "mdi-school",
    roles: [
      UserRole.ADMIN,
      UserRole.STUDENT,
      UserRole.TEACHER_DIRECTIVE,
      UserRole.FAMILY,
    ],
  },
  {
    title: "Cerrar sesión",
    value: "logout",
    to: "/logout",
    icon: "mdi-logout",
    roles: [
      UserRole.ADMIN,
      UserRole.STUDENT,
      UserRole.TEACHER_DIRECTIVE,
      UserRole.FAMILY,
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
