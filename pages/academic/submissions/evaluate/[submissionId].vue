<template>
  <v-container fluid>
    <div v-if="loading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2">Cargando entrega...</p>
    </div>

    <v-alert v-else-if="error" type="error" :text="error"></v-alert>

    <v-row v-else-if="submission && submission.form">
      <!-- Columna del Formulario -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-btn icon flat @click="router.back()" class="me-2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span>Revisando: {{ submission.form.name }}</span>
          </v-card-title>
          <v-card-subtitle>Entregado por: {{ studentNames }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <FormViewer 
              :form-definition="submission.form" 
              :model-value="submission.formData"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna de Evaluación -->
      <v-col cols="12" md="4">
        <v-card position="sticky" top="80">
          <v-card-title>Panel de Evaluación</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form @submit.prevent="handleSaveEvaluation">
              <v-text-field
                v-model.number="evaluation.score"
                label="Calificación (0-100)"
                type="number"
                variant="outlined"
                density="compact"
                :rules="[rules.isNumber, rules.inRange]"
              ></v-text-field>
              <v-textarea
                v-model="evaluation.feedback"
                label="Retroalimentación Cualitativa"
                variant="outlined"
                rows="10"
                auto-grow
              ></v-textarea>
              <v-btn 
                type="submit"
                color="primary"
                block 
                :loading="isSubmitting"
                :disabled="!isEvaluationChanged"
              >
                Guardar Evaluación
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubmissionStore } from '~/stores/submissionStore';
import FormViewer from '~/components/FormViewer.vue';

definePageMeta({
  middleware: 'academic'
});

const route = useRoute();
const router = useRouter();
const submissionStore = useSubmissionStore();

const loading = ref(true);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const snackbar = ref({ show: false, text: '', color: '' });

const submissionId = route.params.submissionId as string;

const submission = computed(() => submissionStore.currentSubmission);
const studentNames = computed(() => {
  if (!submission.value?.students) return '';
  return submission.value.students.map(s => `${s.firstName} ${s.lastName}`).join(', ');
});

const evaluation = ref({
  score: null as number | null,
  feedback: '' as string | null,
});

const originalEvaluation = ref({ ...evaluation.value });

const isEvaluationChanged = computed(() => {
  return evaluation.value.score !== originalEvaluation.value.score || 
         evaluation.value.feedback !== originalEvaluation.value.feedback;
});

const rules = {
  isNumber: (v: any) => !isNaN(parseFloat(v)) || 'Debe ser un número',
  inRange: (v: any) => (v >= 0 && v <= 100) || 'La calificación debe estar entre 0 y 100',
};

onMounted(async () => {
  loading.value = true;
  try {
    await submissionStore.fetchSubmission(submissionId);
    if (submission.value) {
      evaluation.value.score = submission.value.score;
      evaluation.value.feedback = submission.value.feedback;
      originalEvaluation.value = { ...evaluation.value };
    }
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

const handleSaveEvaluation = async () => {
  if (!isEvaluationChanged.value) return;
  isSubmitting.value = true;
  try {
    await submissionStore.evaluateSubmission(
      submissionId,
      evaluation.value.score,
      evaluation.value.feedback
    );
    snackbar.value = { show: true, text: 'Evaluación guardada con éxito', color: 'success' };
    originalEvaluation.value = { ...evaluation.value }; // Update original state
  } catch (e: any) {
    snackbar.value = { show: true, text: `Error al guardar: ${e.message}`, color: 'error' };
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: computed(() => studentNames.value ? `Evaluando a ${studentNames.value}` : 'Evaluación')
});
</script>

<style scoped>
.v-card[position='sticky'] {
  top: 80px; /* Adjust based on your app bar height */
}
</style>
