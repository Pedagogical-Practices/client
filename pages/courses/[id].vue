<!-- pages/courses/[id].vue -->
<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Curso: {{ formBuilderStore.currentCourse?.name }}</span>
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
                  :model-value="formBuilderStore.currentCourse?.institution"
                  readonly
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Grupos Asignados"
                  :model-value="
                    formBuilderStore.currentCourse?.assignedGroups.join(', ')
                  "
                  readonly
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-tabs v-model="activeTab" class="mt-4">
              <v-tab value="protocols">Protocolos</v-tab>
              <v-tab value="attendance">Control de Asistencia</v-tab>
            </v-tabs>
            <v-window v-model="activeTab">
              <v-window-item value="protocols">
                <ProtocolList
                  :protocols="formBuilderStore.protocols"
                  @view="viewProtocol"
                />
              </v-window-item>
              <v-window-item value="attendance">
                <v-select
                  v-model="selectedProtocolId"
                  :items="formBuilderStore.protocols"
                  item-title="name"
                  item-value="_id"
                  label="Seleccionar Protocolo"
                  variant="outlined"
                  class="mb-4"
                />
                <AttendanceList
                  :attendanceRecords="selectedProtocol?.attendanceRecords || []"
                  @add="openCreateAttendanceDialog"
                />
              </v-window-item>
            </v-window>
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
                formBuilderStore.forms.map((f) => ({
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
    <v-dialog v-model="createAttendanceDialog" max-width="800px">
      <v-card>
        <v-card-title>Crear Registro de Asistencia</v-card-title>
        <v-card-text>
          <v-form ref="createAttendanceForm">
            <v-text-field
              v-model="newAttendance.week"
              label="Semana"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="newAttendance.date"
              label="Fecha"
              type="date"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="newAttendance.topic"
              label="Tema / Actividad"
              variant="outlined"
              :rules="[
                (v) => !!v || 'Requerido',
                (v) =>
                  v !== 'no se presentó' ||
                  newAttendance.advisorSignature ||
                  'Firma del asesor requerida si no se presentó',
              ]"
            />
            <v-text-field
              v-model.number="newAttendance.hours"
              label="No. de horas"
              type="number"
              variant="outlined"
              :rules="[
                (v) => !!v || 'Requerido',
                (v) => v >= 0 || 'Horas no pueden ser negativas',
              ]"
            />
            <v-select
              v-model="newAttendance.group"
              label="Grupo"
              :items="formBuilderStore.currentCourse?.assignedGroups || []"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="newAttendance.classType"
              label="Clase"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="newAttendance.other"
              label="Otra"
              variant="outlined"
            />
            <v-text-field
              v-model="newAttendance.advisorSignature"
              label="Firma del Docente Asesor"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="newAttendance.tutorSignature"
              label="Firma del Docente Tutor"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-textarea
              v-model="newAttendance.observations"
              label="Observaciones"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="createAttendanceDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="primary" @click="createAttendance">Guardar</v-btn>
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { useAuthStore } from "~/stores/authStore";
import ProtocolList from "~/components/ProtocolList.vue";
import AttendanceList from "~/components/AttendanceList.vue";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const formBuilderStore = useFormBuilderStore();
const authStore = useAuthStore();
const createProtocolDialog = ref(false);
const createAttendanceDialog = ref(false);
const createProtocolForm = ref();
const createAttendanceForm = ref();
const newProtocol = ref({
  name: "",
  module: "",
  formId: "",
});
const newAttendance = ref({
  week: "",
  date: "",
  topic: "",
  hours: 0,
  group: "",
  classType: "",
  other: "",
  advisorSignature: "",
  tutorSignature: "",
  observations: "",
});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});
const activeTab = ref("protocols");
const selectedProtocolId = ref("");

const selectedProtocol = computed(() =>
  formBuilderStore.protocols.find((p) => p._id === selectedProtocolId.value)
);

onMounted(async () => {
  const courseId = route.params.id as string;
  await formBuilderStore.fetchCourse(courseId);
  await formBuilderStore.fetchProtocols(courseId);
  await formBuilderStore.fetchForms();
});

const openCreateProtocolDialog = () => {
  createProtocolDialog.value = true;
  newProtocol.value = { name: "", module: "", formId: "" };
};

const createProtocol = async () => {
  const { valid } = await createProtocolForm.value.validate();
  if (!valid) return;

  try {
    await formBuilderStore.createProtocol({
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
    await formBuilderStore.fetchProtocols(route.params.id as string);
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const openCreateAttendanceDialog = () => {
  if (!selectedProtocolId.value) {
    snackbar.value = {
      show: true,
      text: "Selecciona un protocolo primero",
      color: "error",
      timeout: 3000,
    };
    return;
  }
  createAttendanceDialog.value = true;
  newAttendance.value = {
    week: "",
    date: "",
    topic: "",
    hours: 0,
    group: "",
    classType: "",
    other: "",
    advisorSignature: "",
    tutorSignature: "",
    observations: "",
  };
};

const createAttendance = async () => {
  const { valid } = await createAttendanceForm.value.validate();
  if (!valid) return;

  try {
    await formBuilderStore.createAttendanceRecord({
      protocolId: selectedProtocolId.value,
      ...newAttendance.value,
    });
    snackbar.value = {
      show: true,
      text: "¡Registro de asistencia creado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    createAttendanceDialog.value = false;
    newAttendance.value = {
      week: "",
      date: "",
      topic: "",
      hours: 0,
      group: "",
      classType: "",
      other: "",
      advisorSignature: "",
      tutorSignature: "",
      observations: "",
    };
    await formBuilderStore.fetchProtocols(route.params.id as string);
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
