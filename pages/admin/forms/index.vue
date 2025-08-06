<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Listado de Formularios</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-file-document-plus"
              @click="createNewForm"
            >
              Nuevo Formulario
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <FormList
                  :forms="filteredForms"
                  @view-form="viewForm"
                  @edit-form="editForm"
                  @delete-form="confirmDeleteForm"
                />
              </v-col>
            </v-row>
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

    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text
          >¿Estás seguro de que quieres eliminar este formulario? Esta acción no
          se puede deshacer.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showDeleteConfirm = false"
            >Cancelar</v-btn
          >
          <v-btn color="error" variant="text" @click="deleteForm"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFormStore } from "~/stores/formStore";
import { useFormElementStore } from "~/stores/formElementStore";
import { useAuthStore } from "~/stores/authStore";
import FormList from "~/components/forms/FormList.vue";
import type { Form } from "~/types";

// definePageMeta({});

const router = useRouter();
const formStore = useFormStore();
const formElementStore = useFormElementStore();
const authStore = useAuthStore();
const filter = ref("");
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const showDeleteConfirm = ref(false);
const formToDeleteId = ref<string | null>(null);

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
      await formStore.fetchForms();
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

const confirmDeleteForm = (formId: string) => {
  formToDeleteId.value = formId;
  showDeleteConfirm.value = true;
};

const deleteForm = async () => {
  if (!formToDeleteId.value) return;
  try {
    await formStore.deleteForm(formToDeleteId.value);
    snackbar.value = {
      show: true,
      text: "¡Formulario eliminado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    showDeleteConfirm.value = false;
    formToDeleteId.value = null;
    await formStore.fetchForms(); // Re-fetch forms after deletion
  } catch (error: any) {
    console.error("Error al eliminar formulario:", error);
    snackbar.value = {
      show: true,
      text: `Error al eliminar: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const filteredForms = computed(() => {
  const forms = formStore.forms.filter((form: Form) =>
    form.name.toLowerCase().includes(filter.value.toLowerCase())
  );
  return forms.sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
});

const updateFilter = (value: string) => {
  filter.value = value;
};

const viewForm = (formId: string) => {
  router.push(`/forms/${formId}`);
};

const editForm = (formId: string) => {
  router.push(`/editor?id=${formId}`);
};

const createNewForm = () => {
  formElementStore.initializeForm([]);
  formStore.formName = "";
  formStore.editingFormId = null;
  formElementStore.setSelectedElement(null);
  router.push("/editor");
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
  border-radius: 8px;
}
</style>
