<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Curso: {{ courseStore.currentCourse?.name }}</span>
            <v-btn
              color="primary"
              @click="openCreateProtocolDialog"
              prepend-icon="mdi-plus"
              v-if="authStore.isAdmin"
            >
              Crear Protocolo
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Descripción"
                  :model-value="courseStore.currentCourse?.description"
                  readonly
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Fecha de Inicio"
                  :model-value="courseStore.currentCourse?.startDate"
                  readonly
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Fecha de Fin"
                  :model-value="courseStore.currentCourse?.endDate"
                  readonly
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <ProtocolList
              :protocols="courseStore.currentCourse?.protocols || []"
              @view="viewProtocol"
              class="mt-4"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="createProtocolDialog" max-width="600px">
      <v-card>
        <v-card-title>Crear Nuevo Protocolo</v-card-title>
        <v-card-text>
          <v-form ref="createProtocolForm">
            <v-text-field
              v-model="newProtocol.name"
              label="Nombre del Protocolo"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-textarea
              v-model="newProtocol.description"
              label="Descripción"
              variant="outlined"
            />
            <EntityAutocomplete
              v-model="newProtocol.formId"
              specific-type="form"
              label="Formulario Asociado"
              required
            ></EntityAutocomplete>
            <v-text-field
              v-model="newProtocol.productType"
              label="Tipo de Producto"
              hint="Ej: INFORME_MAPEO, RECURSO_DIGITAL"
              persistent-hint
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="createProtocolDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="primary" @click="createProtocol">Guardar</v-btn>
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
import { useRoute, useRouter } from "vue-router";
import { useCourseStore } from "~/stores/courseStore";
import { useProtocolStore } from "~/stores/protocolStore";
import { useAuthStore } from "~/stores/authStore";
import ProtocolList from "~/components/ProtocolList.vue";
import EntityAutocomplete from "~/components/EntityAutocomplete.vue";

definePageMeta({});

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const protocolStore = useProtocolStore();
const authStore = useAuthStore();
const createProtocolDialog = ref(false);
const createProtocolForm = ref();
const newProtocol = ref({
  name: "",
  description: "",
  formId: "",
  productType: "",
});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(async () => {
  const courseId = route.params.id as string;
  await courseStore.fetchCourse(courseId);
});

const openCreateProtocolDialog = () => {
  createProtocolDialog.value = true;
  newProtocol.value = { name: "", description: "", formId: "", productType: "" };
};

const createProtocol = async () => {
  const { valid } = await createProtocolForm.value.validate();
  if (!valid) return;

  try {
    await protocolStore.createProtocol({
      ...newProtocol.value,
    });
    snackbar.value = {
      show: true,
      text: "¡Protocolo creado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    createProtocolDialog.value = false;
    newProtocol.value = { name: "", description: "", formId: "", productType: "" };
    await courseStore.fetchCourse(route.params.id as string); // Re-fetch course to update protocol list
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
}
</style>
