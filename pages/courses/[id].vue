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
              <v-col cols="12" md="6">
                <v-text-field
                  label="Institución"
                  :model-value="courseStore.currentCourse?.institution"
                  readonly
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Grupos Asignados"
                  :model-value="
                    courseStore.currentCourse?.assignedGroups.join(', ')
                  "
                  readonly
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <ProtocolList
              :protocols="protocolStore.protocols"
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
            <v-select
              v-model="newProtocol.module"
              label="Módulo"
              :items="[
                'Módulo 1',
                'Módulo 2',
                'Módulo 3',
                'Módulo 4',
                'Módulo 5',
                'Módulo 6',
              ]"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-select
              v-model="newProtocol.formId"
              label="Formulario"
              :items="
                formStore.forms.map((f: any) => ({
                  title: f.name,
                  value: f._id,
                }))
              "
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
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
// import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { useCourseStore } from "~/stores/courseStore";
import { useProtocolStore } from "~/stores/protocolStore";
import { useFormStore } from "~/stores/formStores";
import { useAuthStore } from "~/stores/authStore";
import ProtocolList from "~/components/ProtocolList.vue";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
// const formBuilderStore = useFormBuilderStore();
const courseStore = useCourseStore();
const protocolStore = useProtocolStore();
const formStore = useFormStore();
const authStore = useAuthStore();
const createProtocolDialog = ref(false);
const createProtocolForm = ref();
const newProtocol = ref({
  name: "",
  module: "",
  formId: "",
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
  await protocolStore.fetchProtocols(courseId);
  await formStore.fetchForms(); // Para el select de formularios
});

const openCreateProtocolDialog = () => {
  createProtocolDialog.value = true;
  newProtocol.value = { name: "", module: "", formId: "" };
};

const createProtocol = async () => {
  const { valid } = await createProtocolForm.value.validate();
  if (!valid) return;

  try {
    await protocolStore.createProtocol({
      ...newProtocol.value,
      courseId: route.params.id as string,
    });
    snackbar.value = {
      show: true,
      text: "¡Protocolo creado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    createProtocolDialog.value = false;
    newProtocol.value = { name: "", module: "", formId: "" };
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
