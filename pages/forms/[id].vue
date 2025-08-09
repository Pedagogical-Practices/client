<template>
  <v-container>
    <v-card v-if="formStore.currentForm && !formStore.loading">
      <v-card-title>{{ formStore.currentForm.name }}</v-card-title>
      <v-card-subtitle
        >ID: {{ formStore.currentForm.id }} | Versión:
        {{ formStore.currentForm.version }}</v-card-subtitle
      >
      <v-divider class="my-4"></v-divider>
      <v-card-text>
        <FormViewer :form-definition="formStore.currentForm" v-model="formData" />
      </v-card-text>
    </v-card>
    <v-container v-else-if="formStore.loading" class="d-flex justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-container>
    <v-alert v-else type="error">
      No se pudo cargar el formulario. Es posible que no exista o que haya
      ocurrido un error.
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useFormStore } from "~/stores/formStore";
import FormViewer from "~/components/FormViewer.vue";

const route = useRoute();
const formStore = useFormStore();
const formData = ref({});

onMounted(() => {
  const formId = route.params.id as string;
  if (formId) {
    formStore.fetchFormById(formId);
  }
});
</script>
