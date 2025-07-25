<template>
  <v-container fluid class="pa-4">
    <AdminCoordinatorDashboard v-if="authStore.user?.role === UserRole.ADMIN" />
    <v-row v-else>
      <v-col cols="12">
        <v-alert type="info" prominent>
          Bienvenido al sistema. Tu perfil no tiene un dashboard específico
          configurado.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { UserRole } from "~/types";

// Importar componentes de dashboard
import AdminCoordinatorDashboard from "@/components/dashboards/AdminCoordinatorDashboard.vue";

const authStore = useAuthStore();
</script>
