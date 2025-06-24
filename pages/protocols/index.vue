<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Lista de Protocolos</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-file-document-plus"
              @click="openCreateProtocolDialog"
            >
              Nuevo Protocolo
            </v-btn>
          </v-card-title>
          <v-card-text>
            <ProtocolList
              :protocols="formBuilderStore.protocols"
              @view="viewProtocol"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para crear nuevo protocolo -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Crear Nuevo Protocolo</span>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createProtocol">
            <v-text-field
              v-model="newProtocol.name"
              label="Nombre del Protocolo"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-text-field
              v-model="newProtocol.module"
              label="Módulo"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-select
              v-model="newProtocol.courseId"
              :items="formBuilderStore.courses"
              item-title="name"
              item-value="_id"
              label="Curso"
              variant="outlined"
              density="compact"
              required
            ></v-select>
            <v-select
              v-model="newProtocol.formId"
              :items="formBuilderStore.forms"
              item-title="name"
              item-value="_id"
              label="Formulario"
              variant="outlined"
              density="compact"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-content-save"
            @click="createProtocol"
          >
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { useRouter } from "vue-router";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import ProtocolList from "~/components/ProtocolList.vue";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const formBuilderStore = useFormBuilderStore();
const dialog = ref(false);
const newProtocol = ref({
  name: "",
  module: "",
  courseId: "",
  formId: "",
});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(async () => {
  await formBuilderStore.fetchCourses();
  await formBuilderStore.fetchForms();
  if (formBuilderStore.courses.length > 0) {
    await formBuilderStore.fetchProtocols(formBuilderStore.courses[0]._id);
  }
});

const openCreateProtocolDialog = () => {
  newProtocol.value = { name: "", module: "", courseId: "", formId: "" };
  dialog.value = true;
};

const createProtocol = async () => {
  try {
    if (
      !newProtocol.value.name ||
      !newProtocol.value.module ||
      !newProtocol.value.courseId ||
      !newProtocol.value.formId
    ) {
      throw new Error("Todos los campos son obligatorios");
    }
    await formBuilderStore.createProtocol({
      name: newProtocol.value.name,
      module: newProtocol.value.module,
      courseId: newProtocol.value.courseId,
      formId: newProtocol.value.formId,
    });
    snackbar.value = {
      show: true,
      text: "¡Protocolo creado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    dialog.value = false;
    await formBuilderStore.fetchProtocols(newProtocol.value.courseId);
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const viewProtocol = (protocolId: string) => {
  router.push(`/protocols/${protocolId}`);
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
  border-radius: 8px;
}
</style>
