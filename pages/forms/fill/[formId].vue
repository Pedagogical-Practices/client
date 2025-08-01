<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card v-if="formDefinition">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ formDefinition.name }}</span>
            <v-btn color="secondary" @click="router.back()">Volver</v-btn>
          </v-card-title>
          <v-card-subtitle>{{ formDefinition.description }}</v-card-subtitle>
          <v-card-text>
            <FormViewer
              :form-definition="formDefinition"
              v-model="formData"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveForm">Guardar</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert v-else type="info">Cargando formulario...</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormViewer from '~/components/FormViewer.vue';
import { useFormStore } from '~/stores/formStore';
import type { Form } from '~/types/form';

const route = useRoute();
const router = useRouter();
const formStore = useFormStore();

const formId = route.params.formId as string;
const practiceId = route.query.practiceId as string;

const formDefinition = ref<Form | null>(null);
const formData = ref<Record<string, any>>({});

onMounted(async () => {
  // Aquí cargaríamos la definición del formulario desde un archivo JSON o una API
  // Por ahora, usaremos un mock o una función de la store
  await formStore.fetchForm(formId);
  formDefinition.value = formStore.currentForm;

  // Aquí también se podrían cargar los datos existentes si el formulario ya ha sido llenado
});

const saveForm = async () => {
  if (!formDefinition.value) return;

  try {
    // Lógica para guardar los datos del formulario (mutación de GraphQL)
    await formStore.submitForm(practiceId, formId, formData.value);
    // Redirigir o mostrar un mensaje de éxito
    router.push(`/practices/${practiceId}`);
  } catch (error) {
    console.error('Error al guardar el formulario:', error);
    // Mostrar un mensaje de error al usuario
  }
};
</script>
