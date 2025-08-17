<template>
  <v-container fluid>
    <div v-if="loading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2">Cargando reporte...</p>
    </div>

    <v-alert v-else-if="error" type="error" :text="error"></v-alert>

    <v-card v-else-if="submission && submission.form">
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
      <v-card-actions v-if="submission.score || submission.feedback">
        <v-spacer></v-spacer>
        <v-chip v-if="submission.score" color="primary" class="me-2">
          Calificación: {{ submission.score }}
        </v-chip>
        <v-chip v-if="submission.feedback" color="info">
          Retroalimentación: {{ submission.feedback }}
        </v-chip>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubmissionStore } from '~/stores/submissionStore';
import FormReportViewer from '~/components/academic/FormReportViewer.vue';

definePageMeta({
  middleware: 'academic'
});

const route = useRoute();
const router = useRouter();
const submissionStore = useSubmissionStore();

const loading = ref(true);
const error = ref<string | null>(null);

const submissionId = route.params.submissionId as string;

const submission = computed(() => submissionStore.currentSubmission);
const studentNames = computed(() => {
  if (!submission.value?.students) return '';
  return submission.value.students.map(s => `${s.firstName} ${s.lastName}`).join(', ');
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
