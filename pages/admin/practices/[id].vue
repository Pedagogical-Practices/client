<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Detalle de la Práctica</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-arrow-left"
              @click="router.back()"
            >
              Volver
            </v-btn>
          </v-card-title>
          <v-card-text v-if="practiceStore.currentPractice">
            <v-row>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-title>Estudiante:</v-list-item-title>
                  <v-list-item-subtitle>{{ practiceStore.currentPractice.student?.name || 'N/A' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Docente Asesor:</v-list-item-title>
                  <v-list-item-subtitle>{{ practiceStore.currentPractice.advisor?.name || 'N/A' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Protocolo:</v-list-item-title>
                  <v-list-item-subtitle>{{ practiceStore.currentPractice.protocol?.name || 'N/A' }} ({{ practiceStore.currentPractice.protocol?.module || 'N/A' }})</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Institución:</v-list-item-title>
                  <v-list-item-subtitle>{{ practiceStore.currentPractice.institutionName }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Curso/Grado:</v-list-item-title>
                  <v-list-item-subtitle>{{ practiceStore.currentPractice.courseName }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Estado:</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip
                      v-if="practiceStore.currentPractice?.status"
                      :color="getStatusColor(practiceStore.currentPractice.status)"
                      size="small"
                    >
                      {{ practiceStore.currentPractice.status }}
                    </v-chip>
                    <span v-else>N/A</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-title>Creado por:</v-list-item-title>
                  <v-list-item-subtitle>{{ practiceStore.currentPractice.createdBy?.name || 'N/A' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Fecha de Creación:</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ practiceStore.currentPractice.createdAt ? new Date(practiceStore.currentPractice.createdAt).toLocaleDateString() : 'N/A' }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Progreso:</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-progress-linear
                      :model-value="completionPercentage"
                      color="primary"
                      height="10"
                      rounded
                    >
                      <strong>{{ completionPercentage.toFixed(0) }}%</strong>
                    </v-progress-linear>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <h3 class="mb-3">Formularios del Protocolo</h3>
            <v-list density="compact">
              <v-list-item
                v-for="filledForm in practiceStore.currentPractice.filledForms"
                :key="filledForm.form._id"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="filledForm.submission ? 'success' : 'warning'"
                    :icon="filledForm.submission ? 'mdi-check-circle' : 'mdi-alert-circle'"
                  ></v-icon>
                </template>
                <v-list-item-title>
                  {{ filledForm.form?.name || 'Formulario Desconocido' }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Estado: {{ filledForm.submission ? 'Completado' : 'Pendiente' }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    v-if="!filledForm.submission"
                    color="success"
                    size="small"
                    class="mr-2"
                    @click="fillForm(filledForm.form._id)"
                  >
                    Llenar Formulario
                  </v-btn>
                  <v-btn
                    v-else
                    color="info"
                    size="small"
                    @click="viewSubmission(filledForm.submission._id)"
                  >
                    Ver Envío
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-text v-else>
            <v-alert type="info">Cargando detalles de la práctica o práctica no encontrada.</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'; // Importar computed
import { useRoute, useRouter } from 'vue-router';
import { usePracticeStore } from '~/stores/practiceStore';
import { PracticeStatus } from '~/types/practice';

definePageMeta({});

const route = useRoute();
const router = useRouter();
const practiceStore = usePracticeStore();

const practiceId = route.params.id as string;

onMounted(async () => {
  if (practiceId) {
    await practiceStore.fetchPractice(practiceId);
  }
});

const completionPercentage = computed(() => {
  if (!practiceStore.currentPractice || practiceStore.currentPractice.filledForms.length === 0) {
    return 0;
  }
  const completedForms = practiceStore.currentPractice.filledForms.filter(
    (ff) => ff.submission
  ).length;
  const totalForms = practiceStore.currentPractice.filledForms.length;
  return (completedForms / totalForms) * 100;
});

const getStatusColor = (status: PracticeStatus): string => {
  switch (status) {
    case PracticeStatus.ASSIGNED:
      return 'blue';
    case PracticeStatus.IN_PROGRESS:
      return 'orange';
    case PracticeStatus.COMPLETED:
      return 'green';
    case PracticeStatus.REVIEWED:
      return 'purple';
    default:
      return 'grey';
  }
};

const fillForm = (formId: string) => {
  router.push(`/forms/fill/${formId}?practiceId=${practiceId}`);
};

const viewSubmission = (submissionId: string) => {
  router.push(`/submissions/${submissionId}`);
};

const evaluateSubmission = (submissionId: string) => {
  router.push(`/evaluate-submission/${submissionId}`);
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
  border-radius: 8px;
}
</style>