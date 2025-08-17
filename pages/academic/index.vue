<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-account-group"></v-icon>
        <span class="ms-2">Grupos de Práctica</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          density="compact"
          label="Buscar grupo..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="filteredGroups"
        :loading="loading"
        :search="search"
        hover
        items-per-page-text="Items por página"
      >
        <template v-slot:item.practice="{ item }">
          {{ item.practice?.name || 'N/A' }}
        </template>
        <template v-slot:item.tutor="{ item }">
          {{ item.tutor ? `${item.tutor.firstName} ${item.tutor.lastName}` : 'N/A' }}
        </template>
        <template v-slot:item.studentCount="{ item }">
          {{ item.students?.length || 0 }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn 
            color="primary"
            variant="tonal"
            small 
            @click="navigateToGroup(item.id)"
          >
            Gestionar
          </v-btn>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>
         <template v-slot:no-data>
          <v-alert type="info" class="ma-4">No hay grupos para mostrar.</v-alert>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGroupStore } from '~/stores/groupStore';
import { usePracticeStore } from '~/stores/practiceStore';
import { useDataSourceStore } from '~/stores/dataSourceStore';
import { DataSourceType } from '~/types';

definePageMeta({
  middleware: 'academic'
});

useHead({
  title: 'Gestión de Grupos'
});

const router = useRouter();
const groupStore = useGroupStore();

const search = ref('');
const loading = ref(true);

const headers = [
  { title: 'Nombre del Grupo', key: 'name', align: 'start' },
  { title: 'Práctica (Curso)', key: 'practice', align: 'start' },
  { title: 'Tutor Asignado', key: 'tutor', align: 'start' },
  { title: 'Periodo', key: 'period', align: 'start' },
  { title: 'Nº Estudiantes', key: 'studentCount', align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
];

const filteredGroups = computed(() => groupStore.groups);

onMounted(async () => {
  loading.value = true;
  try {
    await groupStore.fetchGroups();
  } catch (error) {
    console.error("Error fetching groups:", error);
  } finally {
    loading.value = false;
  }
});

const navigateToGroup = (groupId: string) => {
  router.push(`/academic/groups/${groupId}`);
};
</script>