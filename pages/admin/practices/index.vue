<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Prácticas</span>
            <v-btn
              color="primary"
              @click="openCreatePracticeDialog"
              prepend-icon="mdi-plus"
            >
              Crear Práctica
            </v-btn>
          </v-card-title>
          <v-card-text>
            <PracticeList
              :practices="practiceStore.practices"
              @view="viewPractice"
              @delete="confirmDelete"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="createCourseDialog" max-width="600px">
      <v-card>
        <v-card-title>Crear Nueva Práctica</v-card-title>
        <v-card-text>
          <v-form ref="createPracticeForm">
            <v-text-field
              v-model="newPractice.name"
              label="Nombre de la Práctica"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-textarea
              v-model="newPractice.description"
              label="Descripción de la Práctica"
              variant="outlined"
            />
            <v-text-field
              v-model="newPractice.startDate"
              label="Fecha de Inicio"
              type="date"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="newPractice.endDate"
              label="Fecha de Fin"
              type="date"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <EntityAutocomplete
              v-model="newPractice.protocolIds"
              specific-type="protocol"
              label="Protocolos Asociados"
              :multiple="true"
            ></EntityAutocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="createCourseDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="primary" @click="createPractice">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Modal de Confirmación de Borrado -->
    <v-dialog v-model="deleteDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Borrado</v-card-title>
        <v-card-text
          >¿Estás seguro de que quieres eliminar esta práctica? Esta acción no se
          puede deshacer.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" text @click="deleteCourseConfirmed"
            >Aceptar</v-btn
          >
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
import { usePracticeStore } from "~/stores/practiceStore";
import PracticeList from "~/components/PracticeList.vue";
import EntityAutocomplete from "~/components/EntityAutocomplete.vue";

// definePageMeta({});

const router = useRouter();
const practiceStore = usePracticeStore();
const createPracticeDialog = ref(false);
const createPracticeForm = ref();
const newPractice = ref({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  protocolIds: [] as string[],
});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const deleteDialog = ref(false); // NEW
const practiceToDelete = ref<any>(null); // NEW

onMounted(() => {
  practiceStore.fetchAllPractices();
});

const openCreatePracticeDialog = () => {
  createPracticeDialog.value = true;
  newPractice.value = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    protocolIds: [],
  };
};

const createPractice = async () => {
  const { valid } = await createPracticeForm.value.validate();
  if (!valid) return;

  try {
    console.log(
      "practices/index.vue: newPractice.protocolIds before sending:",
      newPractice.value.protocolIds
    ); // NEW LOG
    await practiceStore.createPractice({
      name: newPractice.value.name,
      description: newPractice.value.description,
      startDate: newPractice.value.startDate,
      endDate: newPractice.value.endDate,
      protocolIds: newPractice.value.protocolIds,
    });
    snackbar.value = {
      show: true,
      text: "¡Práctica creada exitosamente!",
      color: "success",
      timeout: 3000,
    };
    createPracticeDialog.value = false;
    newPractice.value = {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      protocolIds: [],
    };
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const viewPractice = (practiceId: string) => {
  router.push(`/practices/${practiceId}`);
};

const confirmDelete = (practice: any) => {
  // NEW
  practiceToDelete.value = practice;
  deleteDialog.value = true;
};

const deletePracticeConfirmed = async () => {
  // NEW
  if (practiceToDelete.value) {
    try {
      await practiceStore.deletePractice(practiceToDelete.value.id);
      snackbar.value = {
        show: true,
        text: "¡Práctica eliminada exitosamente!",
        color: "success",
        timeout: 3000,
      };
    } catch (error: any) {
      snackbar.value = {
        show: true,
        text: `Error al eliminar: ${error.message}`,
        color: "error",
        timeout: 3000,
      };
    }
  }
  deleteDialog.value = false;
  practiceToDelete.value = null;
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
}
</style>
