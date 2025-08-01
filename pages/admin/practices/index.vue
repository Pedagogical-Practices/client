<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Gestión de Prácticas</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openCreatePracticeDialog"
            >
              Asignar Nueva Práctica
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="practiceStore.practices"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:item.student="{ item }">
                {{ item.student?.name || "N/A" }}
              </template>
              <template v-slot:item.teacher="{ item }">
                {{ item.teacher?.name || "N/A" }}
              </template>
              <template v-slot:item.course="{ item }">
                {{ item.course?.name || "N/A" }}
              </template>
              <template v-slot:item.protocols="{ item }">
                <div v-if="item.protocols && item.protocols.length">
                  <v-chip
                    v-for="protocol in item.protocols"
                    :key="protocol.id"
                    size="small"
                    class="mr-1 mb-1"
                  >
                    {{ protocol.name }}
                  </v-chip>
                </div>
                <span v-else>N/A</span>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small">
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  size="small"
                  color="info"
                  icon="mdi-eye"
                  class="mr-2"
                  @click="viewPractice(item.id)"
                  title="Ver Detalle"
                ></v-btn>
                <v-btn
                  size="small"
                  color="warning"
                  icon="mdi-pencil"
                  class="mr-2"
                  @click="editPractice(item.id)"
                  title="Editar Práctica"
                ></v-btn>
                <v-btn
                  size="small"
                  color="error"
                  icon="mdi-delete"
                  @click="confirmDeletePractice(item.id)"
                  title="Eliminar Práctica"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para crear/editar práctica -->
    <v-dialog v-model="dialog" max-width="700px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{
            isEditMode ? "Editar Práctica" : "Asignar Nueva Práctica"
          }}</span>
          <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="practiceFormRef">
            <EntityAutocomplete
              v-model="newPractice.studentId"
              specific-type="student"
              label="Docente en formación"
              :multiple="false"
            ></EntityAutocomplete>
            <EntityAutocomplete
              v-model="newPractice.teacherId"
              specific-type="teacher"
              label="Docente Asesor"
              :multiple="false"
            ></EntityAutocomplete>
            <EntityAutocomplete
              v-model="newPractice.protocolIds"
              specific-type="protocol"
              label="Protocolos"
              :multiple="true"
            ></EntityAutocomplete>
            <EntityAutocomplete
              v-model="newPractice.courseId"
              specific-type="course"
              label="Curso"
              :multiple="false"
            >
            </EntityAutocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-content-save"
            @click="savePractice"
          >
            {{ isEditMode ? "Guardar Cambios" : "Asignar" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteConfirmDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar esta práctica? Esta acción no se
          puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteConfirmDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="error" variant="elevated" @click="deletePractice"
            >Eliminar</v-btn
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { PracticeStatus } from "~/types";
import { usePracticeStore } from "~/stores/practiceStore";
import { useAuthStore } from "~/stores/authStore";
import { useProtocolStore } from "~/stores/protocolStore";

import EntityAutocomplete from "~/components/EntityAutocomplete.vue";

const router = useRouter();
const practiceStore = usePracticeStore();
const authStore = useAuthStore();
const protocolStore = useProtocolStore();

const dialog = ref(false);
const isEditMode = ref(false);

const closeDialog = () => {
  dialog.value = false;
  // practiceFormRef.value?.reset(); // Limpiar el formulario
};

const newPractice = ref({
  id: "", // Para modo edición
  studentId: "",
  teacherId: "",
  protocolIds: [],
  courseId: "",
  status: PracticeStatus.PENDING, // Default para nueva práctica
});

const openCreatePracticeDialog = () => {
  isEditMode.value = false;
  newPractice.value = {
    id: "",
    studentId: "",
    teacherId: "",
    protocolIds: [],
    courseId: "",
    status: PracticeStatus.PENDING,
  };
  dialog.value = true;
};

const practiceFormRef = ref<HTMLFormElement | null>(null);

const practiceToDeleteId = ref<string | null>(null);
const deleteConfirmDialog = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const headers = ref([
  { title: "Docente en formación", key: "student" },
  { title: "Docente Asesor", key: "teacher" },
  { title: "Protocolos", key: "protocols" },
  { title: "Curso", key: "course" },
  { title: "Estado", key: "status" },
  { title: "Acciones", key: "actions", sortable: false },
]);

onMounted(async () => {
  console.log("practices/index.vue: onMounted started.");
  await practiceStore.fetchPractices();
  console.log("practices/index.vue: practices fetched.");
  await protocolStore.fetchProtocols();
  console.log("practices/index.vue: protocols fetched.");
  await authStore.fetchUsers();
  console.log("practices/index.vue: users fetched.");
});

const students = computed(() => {
  console.log(
    "practices/index.vue: Computing students. authStore.users:",
    authStore.users
  );
  return (authStore.users || []).filter((user) => user.role === "STUDENT");
});
const advisors = computed(() => {
  console.log(
    "practices/index.vue: Computing advisors. authStore.users:",
    authStore.users
  );
  return (authStore.users || []).filter(
    (user) => user.role === "TEACHER_DIRECTIVE"
  );
});

const getStatusColor = (status: PracticeStatus): string => {
  switch (status) {
    case PracticeStatus.ASSIGNED:
      return "blue";
    case PracticeStatus.IN_PROGRESS:
      return "orange";
    case PracticeStatus.COMPLETED:
      return "green";
    case PracticeStatus.REVIEWED:
      return "purple";
    default:
      return "grey";
  }
};

const savePractice = async () => {
  const { valid } = await practiceFormRef.value!.validate();
  if (!valid) return;

  try {
    if (isEditMode.value) {
      await practiceStore.updatePractice(
        newPractice.value.id,
        newPractice.value
      );
      snackbar.value = {
        show: true,
        text: "¡Práctica actualizada exitosamente!",
        color: "success",
        timeout: 3000,
      };
    } else {
      const { id, ...createData } = newPractice.value;
      await practiceStore.createPractice(createData);
      snackbar.value = {
        show: true,
        text: "¡Práctica asignada exitosamente!",
        color: "success",
        timeout: 3000,
      };
    }
    closeDialog();
    await practiceStore.fetchPractices(); // Refrescar la lista
  } catch (error: any) {
    console.error("Error al guardar práctica:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const viewPractice = (id: string) => {
  router.push(`/admin/practices/${id}`); // Navegar a la página de detalle de la práctica
};

const editPractice = (id: string) => {
  isEditMode.value = true;
  const practice = practiceStore.practices.find((p) => p.id === id);
  if (practice) {
    newPractice.value = {
      id: practice.id,
      studentId: practice.student.id,
      teacherId: practice.teacher.id,
      protocolIds: practice.protocols.map((p) => p.id),
      courseId: practice.course.id,
      status: practice.status,
    };
    dialog.value = true;
  }
};

const confirmDeletePractice = (id: string) => {
  practiceToDeleteId.value = id;
  deleteConfirmDialog.value = true;
};

const deletePractice = async () => {
  try {
    if (practiceToDeleteId.value) {
      await practiceStore.deletePractice(practiceToDeleteId.value);
      snackbar.value = {
        show: true,
        text: "¡Práctica eliminada exitosamente!",
        color: "success",
        timeout: 3000,
      };
      deleteConfirmDialog.value = false;
      practiceToDeleteId.value = null;
      await practiceStore.fetchPractices(); // Refrescar la lista
    }
  } catch (error: any) {
    console.error("Error al eliminar práctica:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};
</script>
