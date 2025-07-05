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
            <
            <ProtocolList
              :protocols="protocolStore.protocols"
              @view="viewProtocol"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
              v-model="newProtocol.formIds"
              :items="formStore.forms"
              item-title="name"
              item-value="_id"
              label="Formularios"
              variant="outlined"
              density="compact"
              multiple
              chips
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
// import { useFormBuilderStore } from "~/stores/formBuilderStore";
import ProtocolList from "~/components/ProtocolList.vue";

import { useFormStore } from "~/stores/formStores";
import { useProtocolStore } from "~/stores/protocolStore";
// import { useCourseStore } from "~/stores/courseStore"; // Ya no es necesario

definePageMeta({});

const router = useRouter();
// const formBuilderStore = useFormBuilderStore();
const formStore = useFormStore();
const protocolStore = useProtocolStore();
// const courseStore = useCourseStore(); // Ya no es necesario

const dialog = ref(false);
const newProtocol = ref({
  name: "",
  module: "",
  // courseId: "", // Eliminado
  formIds: [] as string[], // Ahora es un array de IDs
});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(async () => {
  console.log("protocols/index.vue: onMounted started"); // Log de inicio
  await formStore.fetchForms(); // Asegurarse de cargar los formularios
  console.log("protocols/index.vue: forms fetched"); // Log después de fetchForms
  await protocolStore.fetchProtocols(); // Ya no necesita courseId
  console.log("protocols/index.vue: protocols fetched"); // Log después de fetchProtocols
});

const openCreateProtocolDialog = () => {
  newProtocol.value = { name: "", module: "", formIds: [] }; // Inicializar formIds como array vacío
  dialog.value = true;
};

const createProtocol = async () => {
  try {
    if (
      !newProtocol.value.name ||
      !newProtocol.value.module ||
      newProtocol.value.formIds.length === 0 // Validar que se haya seleccionado al menos un formulario
    ) {
      throw new Error(
        "Todos los campos son obligatorios y al menos un formulario debe ser seleccionado."
      );
    }
    await protocolStore.createProtocol({
      name: newProtocol.value.name,
      module: newProtocol.value.module,
      formIds: newProtocol.value.formIds,
    });
    snackbar.value = {
      show: true,
      text: "¡Protocolo creado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    dialog.value = false;
    await protocolStore.fetchProtocols(); // Refrescar la lista de protocolos
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
