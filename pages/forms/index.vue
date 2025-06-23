<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1>Listado de Formularios</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <FormFilter v-model="filter" @update:filter="updateFilter" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <FormList :forms="filteredForms" @view-form="viewForm" />
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { useAuthStore } from "~/stores/authStore";
import FormList from "~/components/forms/FormList.vue";
import FormFilter from "~/components/forms/FormFilter.vue";

const router = useRouter();
const formBuilderStore = useFormBuilderStore();
const authStore = useAuthStore();
const filter = ref("");
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
      await formBuilderStore.fetchForms();
    }
  } catch (error: any) {
    console.error("Error al cargar datos:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
    router.push("/login");
  }
});

const filteredForms = computed(() => {
  return formBuilderStore.forms.filter((form) =>
    form.name.toLowerCase().includes(filter.value.toLowerCase())
  );
});

const updateFilter = (value: string) => {
  filter.value = value;
};

const viewForm = (formId: string) => {
  router.push(`/forms/${formId}`);
};
</script>

<style scoped></style>
