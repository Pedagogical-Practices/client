<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1>Detalles del Formulario: {{ form?.name }}</h1>
      </v-col>
    </v-row>
    <v-row v-if="form">
      <v-col cols="12">
        <v-card>
          <v-card-title>Información General</v-card-title>
          <v-card-text>
            <p><strong>Nombre:</strong> {{ form.name }}</p>
            <p>
              <strong>Creado por:</strong> {{ form.createdBy.name }} ({{
                form.createdBy.email
              }})
            </p>
            <p>
              <strong>Fecha de creación:</strong>
              {{ new Date(form.createdAt).toLocaleString() }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>Campos del Formulario</v-card-title>
          <v-card-text>
            <FormViewer :fields="form.fields" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-progress-circular indeterminate color="primary" />
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { useAuthStore } from "~/stores/authStore";
import FormViewer from "~/components/forms/FormViewer.vue";

const route = useRoute();
const router = useRouter();
const formBuilderStore = useFormBuilderStore();
const authStore = useAuthStore();
const form = ref(formBuilderStore.currentForm);
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(async () => {
  try {
    if (!authStore.isAuthenticated) {
      snackbar.value = {
        show: true,
        text: "Por favor inicia sesión.",
        color: "error",
        timeout: 3000,
      };
      router.push("/login");
    } else {
      const formId = route.params.id as string;
      await formBuilderStore.fetchForm(formId);
      form.value = formBuilderStore.currentForm;
      if (!form.value) {
        snackbar.value = {
          show: true,
          text: "Formulario no encontrado.",
          color: "error",
          timeout: 3000,
        };
        router.push("/forms");
      }
    }
  } catch (error: any) {
    console.error("Error al cargar formulario:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
    router.push("/forms");
  }
});
</script>

<style scoped></style>
