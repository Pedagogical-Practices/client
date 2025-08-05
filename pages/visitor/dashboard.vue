<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 primary--text">Dashboard Público del Programa de Grupos</h2>
        <p class="text-subtitle-1">Estadísticas generales y anónimas sobre el impacto del programa de grupos.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-4 text-center" color="blue-grey-darken-1" dark>
          <v-card-title class="justify-center">Total de Estudiantes</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ dashboardStore.studentsCount ?? '--' }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-4 text-center" color="teal-darken-1" dark>
          <v-card-title class="justify-center">Instituciones Asociadas</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ dashboardStore.institutionsCount ?? '--' }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-4 text-center" color="purple-darken-1" dark>
          <v-card-title class="justify-center">Grupos Activos</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ dashboardStore.groupsCount ?? '--' }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-4 text-center" color="orange-darken-1" dark>
          <v-card-title class="justify-center">Entregas Realizadas</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ dashboardStore.submissionsCount ?? '--' }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="dashboardStore.loading">
      <v-col cols="12">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
        <p class="text-center mt-2">Cargando datos...</p>
      </v-col>
    </v-row>
    <v-row v-else-if="dashboardStore.error">
      <v-col cols="12">
        <v-alert type="error">Error al cargar el dashboard: {{ dashboardStore.error }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDashboardStore } from '~/stores/dashboardStore';

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchVisitorDashboardData();
});
</script>

<style scoped>
.text-h3 {
  font-size: 3rem;
  font-weight: bold;
}
</style>
