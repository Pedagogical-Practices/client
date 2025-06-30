<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Llenar Formulario: {{ formStore.currentForm?.name || 'Cargando...' }}</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-arrow-left"
              @click="router.back()"
            >
              Volver
            </v-btn>
          </v-card-title>
          <v-card-text v-if="formStore.currentForm">
            <v-form ref="formViewerRef">
              <FormViewer
                :form-definition="formStore.currentForm"
                v-model="formData"
              />
            </v-form>
          </v-card-text>
          <v-card-actions v-if="formStore.currentForm">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submitForm">Enviar Formulario</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFormStore } from '~/stores/formStores';
import { useSubmissionStore } from '~/stores/submissionStore'; // Necesitamos crear este store
import { usePracticeStore } from '~/stores/practiceStore'; // Para actualizar la práctica
import FormViewer from '~/components/FormViewer.vue'; // Necesitamos crear/actualizar este componente

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();
const formStore = useFormStore();
const submissionStore = useSubmissionStore();
const practiceStore = usePracticeStore();

const formViewerRef = ref<HTMLFormElement | null>(null); 
const formData = ref<Record<string, any>>({}); // Para almacenar los datos del formulario

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

const formId = route.params.formId as string;
const practiceId = route.query.practiceId as string; // Obtener practiceId de la query

onMounted(async () => {
  if (formId) {
    await formStore.fetchForm(formId);
    // Inicializar formData con valores por defecto del formulario si existen
    if (formStore.currentForm?.fields) {
      formData.value = formStore.currentForm.fields.reduce((acc, field) => {
        if (field.variableName) {
          acc[field.variableName] = field.value !== undefined ? field.value : '';
        }
        return acc;
      }, {});
    }
  }
});

const submitForm = async () => {
  const { valid } = await formViewerRef.value!.validate();
  if (!valid) {
    snackbar.value = {
      show: true,
      text: 'Por favor, completa todos los campos requeridos.',
      color: 'error',
      timeout: 3000,
    };
    return;
  }

  try {
    // 1. Crear la Submission
    const newSubmission = await submissionStore.createSubmission({
      formId: formId,
      data: formData.value,
    });

    // 2. Actualizar la Práctica con la Submission
    if (newSubmission?._id && practiceId) {
      await practiceStore.registerFormSubmission(practiceId, formId, newSubmission._id);
    }

    snackbar.value = {
      show: true,
      text: '¡Formulario enviado exitosamente!',
      color: 'success',
      timeout: 3000,
    };
    router.back(); // Volver a la página de detalle de la práctica
  } catch (error: any) {
    console.error('Error al enviar formulario:', error);
    snackbar.value = {
      show: true,
      text: `Error al enviar formulario: ${error.message}`,
      color: 'error',
      timeout: 3000,
    };
  }
};

const viewSubmission = (submissionId: string) => {
  // Lógica para navegar a la página de visualización de la submission
  // Por ejemplo: router.push(`/submissions/${submissionId}`);
  alert(`Navegar a ver submission ${submissionId}`);
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
  border-radius: 8px;
}
</style>