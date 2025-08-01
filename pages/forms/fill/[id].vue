<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center" v-if="formStore.currentForm">
            <span>Llenar Formulario: {{ formStore.currentForm?.name }}</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-arrow-left"
              @click="router.back()"
            >
              Volver
            </v-btn>
          </v-card-title>
          <v-card-text v-if="formStore.currentForm">
            <FormFiller :formDefinition="formStore.currentForm" @submit="handleFormSubmit" />
          </v-card-text>
          <v-card-text v-else>
            <v-alert type="info">Cargando formulario o formulario no encontrado.</v-alert>
          </v-card-text>
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
import { useFormStore } from '~/stores/formStore'; // Asumo que tienes un formStores.ts
import { usePracticeStore } from '~/stores/practiceStore';
import FormFiller from '~/components/FormFiller.vue';

definePageMeta({});

const route = useRoute();
const router = useRouter();
const formStore = useFormStore();
const practiceStore = usePracticeStore();

const formId = route.params.id as string;
const practiceId = route.query.practiceId as string; // Obtener practiceId de la query

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(async () => {
  if (formId) {
    await formStore.fetchFormById(formId);
  }
});

const handleFormSubmit = async (formData: any) => {
  try {
    if (!practiceId) {
      throw new Error("ID de práctica no proporcionado.");
    }
    if (!formStore.currentForm?._id) {
      throw new Error("ID de formulario no disponible.");
    }

    // Asumo que tienes una acción en practiceStore para registrar la submission
    await practiceStore.submitFormForPractice({
      practiceId: practiceId,
      formId: formStore.currentForm._id,
      formData: formData,
    });

    snackbar.value = {
      show: true,
      text: "¡Formulario enviado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    router.back(); // Volver a la página de detalle de la práctica
  } catch (error: any) {
    console.error("Error al enviar formulario:", error);
    snackbar.value = {
      show: true,
      text: `Error al enviar formulario: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};
</script>
