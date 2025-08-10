<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-toolbar-title>Nombre de la APP</v-toolbar-title>
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
      UserRole.ASSESSOR,
      UserRole.FAMILY,
      UserRole.TUTOR,
      UserRole.COORDINATOR,
    ],
  },
  {
    title: "Editor",
    value: "editor",
    to: "/editor",
    icon: "mdi-text-box",
    roles: [UserRole.ADMIN, UserRole.ASSESSOR, UserRole.COORDINATOR],
  },
  {
    title: "Prácticas",
    value: "admin-practices",
    to: "/practices",
    icon: "mdi-book-open-page-variant",
    roles: [
      UserRole.ADMIN,
      UserRole.COORDINATOR,
      UserRole.TUTOR,
      UserRole.ASSESSOR,
    ],
  },
  {
    title: "Formularios",
    value: "admin-forms",
    to: "/forms",
    icon: "mdi-form-select",
    roles: [
      UserRole.ADMIN,
      UserRole.COORDINATOR,
      UserRole.TUTOR,
      UserRole.ASSESSOR,
    ],
  },
  {
    title: "Protocolos",
    value: "admin-protocols",
    to: "/protocols",
    icon: "mdi-package",
    roles: [
      UserRole.ADMIN,
      UserRole.COORDINATOR,
      UserRole.TUTOR,
      UserRole.ASSESSOR,
    ],
  },
  {
    title: "Mis Prácticas",
    value: "practices",
    to: "/practices",
    icon: "mdi-book-open-page-variant",
    roles: [UserRole.STUDENT, UserRole.ASSESSOR, UserRole.TUTOR],
  },
  {
    title: "Mis Formularios",
    value: "forms",
    to: "/forms",
    icon: "mdi-form-select",
    roles: [UserRole.STUDENT, UserRole.ASSESSOR, UserRole.TUTOR],
  },
  {
    title: "Mis Protocolos",
    value: "protocols",
    to: "/protocols",
    icon: "mdi-package",
    roles: [UserRole.STUDENT, UserRole.ASSESSOR, UserRole.TUTOR],
  },
  {
    title: "Perfil",
    value: "profile",
    to: "/profile",
    icon: "mdi-account",
    roles: [
      UserRole.ADMIN,
      UserRole.STUDENT,
      UserRole.ASSESSOR,
      UserRole.FAMILY,
      UserRole.TUTOR,
      UserRole.COORDINATOR,
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
    title: "Gestionar Grupos",
    value: "admin-groups",
    to: "/admin/groups",
    icon: "mdi-school-outline",
    roles: [UserRole.ADMIN, UserRole.COORDINATOR],
  },
  {
    title: "Mis Grupos",
    value: "groups",
    to: "/groups",
    icon: "mdi-school",
    roles: [
      UserRole.ADMIN,
      UserRole.STUDENT,
      UserRole.ASSESSOR,
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
      UserRole.ASSESSOR,
      UserRole.FAMILY,
    ],
  },
];

const filteredItems = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) {
    return [];
  }
  return allItems.filter((item) =>
    item.roles.some((role) => authStore.user.roles.includes(role))
  );
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
