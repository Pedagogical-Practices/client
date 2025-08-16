<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-btn icon flat @click="router.back()" class="me-2">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span>Entregas para: {{ formStore.currentForm?.name || '...' }}</span>
      </v-card-title>
      <v-card-subtitle>Grupo: {{ groupStore.currentGroup?.name || '...' }}</v-card-subtitle>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="submissions"
        :loading="loading"
        hover
        items-per-page-text="Items por página"
      >
        <template v-slot:item.students="{ item }">
          <div v-if="item.students && item.students.length">
            <v-chip v-for="student in item.students" :key="student.id" size="small" class="ma-1">
              {{ student.firstName }} {{ student.lastName }}
            </v-chip>
          </div>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.score="{ item }">
          <v-chip :color="item.score ? 'primary' : 'default'" size="small">
            {{ item.score ?? 'Sin calificar' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn 
            color="primary"
            variant="tonal"
            small 
            @click="navigateToEvaluation(item.id)"
          >
            Revisar y Evaluar
          </v-btn>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <template v-slot:no-data>
          <v-alert type="info" class="ma-4">No hay entregas para este formulario.</v-alert>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubmissionStore } from '~/stores/submissionStore';
import { useFormStore } from '~/stores/formStore';
import { useGroupStore } from '~/stores/groupStore';
import type { Submission } from '~/types';

definePageMeta({
  middleware: 'academic'
});

const route = useRoute();
const router = useRouter();
const submissionStore = useSubmissionStore();
const formStore = useFormStore();
const groupStore = useGroupStore();

const loading = ref(true);
const error = ref<string | null>(null);

const groupId = route.params.groupId as string;
const formId = route.params.formId as string;

const submissions = computed(() => submissionStore.submissions);

const headers = [
  { title: 'Estudiante(s)', key: 'students', sortable: false },
  { title: 'Fecha de Entrega', key: 'createdAt' },
  { title: 'Calificación', key: 'score' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
];

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch all necessary data in parallel
    await Promise.all([
      submissionStore.fetchSubmissionsByFormAndGroup(groupId, formId),
      formStore.fetchFormById(formId),
      groupStore.fetchGroup(groupId) // To display group name
    ]);
  } catch (e: any) {
    error.value = e.message;
    console.error("Error fetching data:", e);
  } finally {
    loading.value = false;
  }
});

const navigateToEvaluation = (submissionId: string) => {
  router.push(`/academic/submissions/evaluate/${submissionId}`);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

useHead({
  title: computed(() => `Entregas de ${formStore.currentForm?.name || '...'}`)
});
</script>
