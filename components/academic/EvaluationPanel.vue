<template>
  <v-card>
    <v-card-title>Panel de Evaluación</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form @submit.prevent="saveEvaluation">
        <v-select
          v-model="evaluationStatus"
          :items="submissionStatusOptions"
          label="Estado de la Evaluación"
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-select>

        <v-text-field
          v-model.number="score"
          label="Calificación (0-100)"
          type="number"
          variant="outlined"
          density="compact"
          :rules="[rules.isNumber, rules.inRange]"
          class="mb-4"
        ></v-text-field>

        <v-textarea
          v-model="feedback"
          label="Retroalimentación Cualitativa"
          variant="outlined"
          rows="5"
          auto-grow
          class="mb-4"
        ></v-textarea>

        <v-btn 
          type="submit"
          color="primary"
          block 
          :loading="loading"
          :disabled="!isChanged"
        >
          Guardar Evaluación
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { SubmissionStatus } from '~/types'; // Assuming types are available

const props = defineProps<{
  submissionId: string;
  initialScore?: number | null;
  initialFeedback?: string | null;
  initialStatus?: SubmissionStatus | null;
  loading: boolean; // Add this new prop
}>();

const emit = defineEmits<{
  (e: 'save-evaluation', payload: { score: number | null; feedback: string | null; status: SubmissionStatus }): void;
}>();

const score = ref<number | null>(props.initialScore ?? null);
const feedback = ref<string | null>(props.initialFeedback ?? null);
const evaluationStatus = ref<SubmissionStatus>(props.initialStatus ?? SubmissionStatus.PENDING_REVIEW);

// Options for the v-select
const submissionStatusOptions = Object.values(SubmissionStatus).map(status => ({
  title: status.replace(/_/g, ' '), // Convert PENDING_REVIEW to PENDING REVIEW
  value: status,
}));

// Track changes to enable/disable save button
const isChanged = computed(() => {
  return score.value !== props.initialScore || 
         feedback.value !== props.initialFeedback ||
         evaluationStatus.value !== props.initialStatus;
});

// Validation rules
const rules = {
  isNumber: (v: any) => !isNaN(parseFloat(v)) || 'Debe ser un número',
  inRange: (v: any) => (v >= 0 && v <= 100) || 'La calificación debe estar entre 0 y 100',
};

// Watch for initial prop changes (e.g., when submission data loads asynchronously)
watch(() => props.initialScore, (newVal) => { score.value = newVal ?? null; });
watch(() => props.initialFeedback, (newVal) => { feedback.value = newVal ?? null; });
watch(() => props.initialStatus, (newVal) => { evaluationStatus.value = newVal ?? SubmissionStatus.PENDING_REVIEW; });

const saveEvaluation = () => {
  emit('save-evaluation', {
    score: score.value,
    feedback: feedback.value,
    status: evaluationStatus.value,
  });
  // Parent component should handle setting loading to false after API call
};
</script>
