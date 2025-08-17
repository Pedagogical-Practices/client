<template>
  <v-container fluid>
    <div v-if="loading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2">Cargando reporte...</p>
    </div>

    <v-alert v-else-if="error" type="error" :text="error"></v-alert>

    <v-row v-else-if="submission && submission.form">
      <!-- Columna del Formulario -->
      <v-col cols="12" :md="isEvaluator ? 8 : 12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-btn icon flat @click="router.back()" class="me-2 no-print">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span>Reporte de: {{ submission.form.name }}</span>
            <v-spacer></v-spacer>
            <v-btn icon flat @click="handlePrint" class="no-print">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            Entregado por: {{ studentNames }} el {{ formatDate(submission.createdAt) }}
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <FormReportViewer 
              :form-definition="submission.form" 
              :form-data="submission.formData"
            />
          </v-card-text>
          <v-card-actions v-if="submission.score || submission.feedback || submission.evaluationStatus">
            <v-spacer></v-spacer>
            <v-chip v-if="submission.evaluationStatus" :color="getStatusColor(submission.evaluationStatus)" class="me-2">
              Estado: {{ getStatusText(submission.evaluationStatus) }}
            </v-chip>
            <v-chip v-if="submission.score" color="primary" class="me-2">
              Calificación: {{ submission.score }}
            </v-chip>
            <v-chip v-if="submission.feedback" color="info">
              Retroalimentación: {{ submission.feedback }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Columna del Panel de Evaluación (visible solo para evaluadores) -->
      <v-col cols="12" md="4" v-if="isEvaluator">
        <EvaluationPanel
          :submission-id="submissionId"
          :initial-score="submission.score"
          :initial-feedback="submission.feedback"
          :initial-status="submission.evaluationStatus"
          :loading="loadingEvaluation"
          @save-evaluation="handleSaveEvaluation"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubmissionStore } from '~/stores/submissionStore';
import { useAuthStore } from '~/stores/authStore';
import FormReportViewer from '~/components/academic/FormReportViewer.vue';
import EvaluationPanel from '~/components/academic/EvaluationPanel.vue';
import { UserRole, SubmissionStatus } from '~/types';

const route = useRoute();
const router = useRouter();
const submissionStore = useSubmissionStore();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref<string | null>(null);
const snackbar = ref({ show: false, text: '', color: '' });
const loadingEvaluation = ref(false); // New ref for evaluation panel loading

const submissionId = route.params.submissionId as string;

const submission = computed(() => submissionStore.currentSubmission);
const studentNames = computed(() => {
  if (!submission.value?.students) return '';
  return submission.value.students.map(s => `${s.firstName} ${s.lastName}`).join(', ');
});

const isEvaluator = computed(() => {
  const userRoles = authStore.user?.roles || [];
  return userRoles.includes(UserRole.ADMIN) ||
         userRoles.includes(UserRole.COORDINATOR) ||
         userRoles.includes(UserRole.TUTOR) ||
         userRoles.includes(UserRole.ASSESSOR);
});

onMounted(async () => {
  loading.value = true;
  try {
    await submissionStore.fetchSubmission(submissionId);
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const handlePrint = () => {
  window.print();
};

const handleSaveEvaluation = async (payload: { score: number | null; feedback: string | null; status: SubmissionStatus }) => {
  loadingEvaluation.value = true; // Set loading to true
  try {
    await submissionStore.evaluateSubmission(
      submissionId,
      payload.score,
      payload.feedback,
      payload.status
    );
    snackbar.value = { show: true, text: 'Evaluación guardada con éxito', color: 'success' };
    // Re-fetch submission to update displayed data
    await submissionStore.fetchSubmission(submissionId);
  } catch (e: any) {
    snackbar.value = { show: true, text: `Error al guardar evaluación: ${e.message}`, color: 'error' };
  } finally {
    loadingEvaluation.value = false; // Set loading to false in finally block
  }
};

const getStatusColor = (status: SubmissionStatus) => {
  switch (status) {
    case SubmissionStatus.APPROVED: return 'success';
    case SubmissionStatus.NEEDS_REVISION: return 'warning';
    case SubmissionStatus.PENDING_REVIEW: return 'info';
    default: return 'default';
  }
};

const getStatusText = (status: SubmissionStatus) => {
  switch (status) {
    case SubmissionStatus.APPROVED: return 'Aprobado';
    case SubmissionStatus.NEEDS_REVISION: return 'Necesita Correcciones';
    case SubmissionStatus.PENDING_REVIEW: return 'Pendiente de Revisión';
    default: return status.replace(/_/g, ' ');
  }
};

useHead({
  title: computed(() => `Reporte de ${submission.value?.form?.name || ''}`)
});
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .v-card {
    box-shadow: none !important;
    border: none !important;
  }
  .v-container {
    padding: 0 !important;
  }
}
</style>
