<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h5 primary--text">Evaluar Entrega</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitEvaluation">
          <v-text-field
            v-model.number="score"
            label="Puntuación (0-10)"
            type="number"
            min="0"
            max="10"
            step="0.1"
            required
          ></v-text-field>
          <v-textarea
            v-model="feedback"
            label="Retroalimentación"
            rows="5"
          ></v-textarea>
          <v-btn type="submit" color="primary" class="mt-4">Guardar Evaluación</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="router.back()">Volver</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubmissionStore } from '~/stores/submissionStore';

const route = useRoute();
const router = useRouter();
const submissionStore = useSubmissionStore();

const submissionId = route.params.submissionId as string;
const score = ref<number | null>(null);
const feedback = ref<string>('');

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

const submitEvaluation = async () => {
  if (score.value === null) {
    snackbar.value = {
      show: true,
      text: 'Por favor, ingresa una puntuación.',
      color: 'error',
      timeout: 3000,
    };
    return;
  }

  try {
    await submissionStore.evaluateSubmission(submissionId, score.value, feedback.value);
    snackbar.value = {
      show: true,
      text: 'Evaluación guardada exitosamente!',
      color: 'success',
      timeout: 3000,
    };
    router.back();
  } catch (error: any) {
    console.error('Error al guardar la evaluación:', error);
    snackbar.value = {
      show: true,
      text: `Error al guardar la evaluación: ${error.message}`,
      color: 'error',
      timeout: 3000,
    };
  }
};
</script>
