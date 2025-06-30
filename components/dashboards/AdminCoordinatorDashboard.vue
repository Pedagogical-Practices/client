<template>
  <v-row>
    <v-col cols="12">
      <h2 class="text-h5 mb-4">Dashboard de Administrador/Coordinador</h2>
      <v-row>
        <v-col cols="12" md="6" lg="3">
          <v-card class="pa-4 text-center" color="primary" dark>
            <v-card-title class="justify-center">Usuarios</v-card-title>
            <v-card-text>
              <div class="text-h3">{{ dashboardStore.usersCount ?? '--' }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-card class="pa-4 text-center" color="success" dark>
            <v-card-title class="justify-center">Prácticas</v-card-title>
            <v-card-text>
              <div class="text-h3">{{ dashboardStore.practicesCount ?? '--' }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-card class="pa-4 text-center" color="info" dark>
            <v-card-title class="justify-center">Protocolos</v-card-title>
            <v-card-text>
              <div class="text-h3">{{ dashboardStore.protocolsCount ?? '--' }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-card class="pa-4 text-center" color="warning" dark>
            <v-card-title class="justify-center">Formularios</v-card-title>
            <v-card-text>
              <div class="text-h3">{{ dashboardStore.formsCount ?? '--' }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="dashboardStore.loading">
        <v-col cols="12">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
          <p class="text-center mt-2">Cargando datos del dashboard...</p>
        </v-col>
      </v-row>
      <v-row v-else-if="dashboardStore.error">
        <v-col cols="12">
          <v-alert type="error">Error al cargar el dashboard: {{ dashboardStore.error }}</v-alert>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchAdminCoordinatorDashboardData();
});
</script>

<style scoped>
.text-h3 {
  font-size: 3rem;
  font-weight: bold;
}
</style>