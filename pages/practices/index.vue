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
              <template v-slot:item.advisor="{ item }">
                {{ item.advisor?.name || "N/A" }}
              </template>
              <template v-slot:item.protocol="{ item }">
                {{ item.protocol?.name || "N/A" }} ({{
                  item.protocol?.module || "N/A"
                }})
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
                  @click="viewPractice(item._id)"
                  title="Ver Detalle"
                ></v-btn>
                <v-btn
                  size="small"
                  color="warning"
                  icon="mdi-pencil"
                  class="mr-2"
                  @click="editPractice(item._id)"
                  title="Editar Práctica"
                ></v-btn>
                <v-btn
                  size="small"
                  color="error"
                  icon="mdi-delete"
                  @click="confirmDeletePractice(item._id)"
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
            <v-select
              v-model="newPractice.studentId"
              :items="students"
              item-title="name"
              item-value="_id"
              label="Estudiante"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'Estudiante es requerido']"
            ></v-select>
            <v-select
              v-model="newPractice.advisorId"
              :items="advisors"
              item-title="name"
              item-value="_id"
              label="Docente Asesor"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'Docente Asesor es requerido']"
            ></v-select>
            <v-select
              v-model="newPractice.protocolId"
              :items="protocolStore.protocols"
              item-title="name"
              item-value="_id"
              label="Protocolo"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'Protocolo es requerido']"
            ></v-select>
            <v-text-field
              v-model="newPractice.institutionName"
              label="Nombre de la Institución"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'Institución es requerida']"
            ></v-text-field>
            <v-text-field
              v-model="newPractice.courseName"
              label="Nombre del Curso/Grado"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'Curso/Grado es requerido']"
            ></v-text-field>
            <v-select
              v-if="isEditMode"
              v-model="newPractice.status"
              :items="Object.values(PracticeStatus)"
              label="Estado de la Práctica"
              variant="outlined"
              density="compact"
            ></v-select>
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
import { usePracticeStore } from "~/stores/practiceStore";
import { useAuthStore } from "~/stores/authStore";
import { useProtocolStore } from "~/stores/protocolStore";
import { PracticeStatus } from "~/types/practice"; // Importar el enum

definePageMeta({});

const router = useRouter();
const practiceStore = usePracticeStore();
const authStore = useAuthStore();
const protocolStore = useProtocolStore();

const dialog = ref(false);
const practiceFormRef = ref<HTMLFormElement | null>(null);
const newPractice = ref({
  id: "", // Para modo edición
  studentId: "",
  advisorId: "",
  protocolId: "",
  institutionName: "",
  courseName: "",
  status: PracticeStatus.ASSIGNED, // Default para nueva práctica
});
const isEditMode = ref(false);
const practiceToDeleteId = ref<string | null>(null);
const deleteConfirmDialog = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const headers = ref([
  { title: "Estudiante", key: "student" },
  { title: "Asesor", key: "advisor" },
  { title: "Protocolo", key: "protocol" },
  { title: "Institución", key: "institutionName" },
  { title: "Curso", key: "courseName" },
  { title: "Estado", key: "status" },
  { title: "Acciones", key: "actions", sortable: false },
]);

const students = ref<Array<{ _id: string; name: string }>>([]);
const advisors = ref<Array<{ _id: string; name: string }>>([]);

onMounted(async () => {
  await practiceStore.fetchPractices();
  await protocolStore.fetchProtocols(); // Cargar protocolos
  await fetchUsersForSelects(); // Cargar usuarios (estudiantes y asesores)
});

const fetchUsersForSelects = async () => {
  // Aquí deberías tener una forma de obtener todos los usuarios
  // o usuarios con roles específicos (estudiantes, asesores)
  // Por ahora, simularemos o usaremos una API si existe
  // Asumiendo que authStore.fetchUsers() existe y devuelve todos los usuarios
  // O que tienes endpoints específicos para estudiantes y asesores
  try {
    // Ejemplo: Si tienes un endpoint para listar todos los usuarios
    // const allUsers = await authStore.fetchAllUsers();
    // students.value = allUsers.filter(user => user.role === 'student');
    // advisors.value = allUsers.filter(user => user.role === 'advisor');

    // Por ahora, simularemos con los usuarios que ya tenemos en authStore
    // Esto es un placeholder, deberías tener una forma real de obtenerlos
    const dummyUsers = [
      {
        _id: "686069b0a63eb317830f9368",
        name: "Alexander Toscano Ricardo",
        email: "atoscano@correo.unicordoba.edu.co",
        role: "admin",
      },
      // Añade más usuarios de prueba si es necesario
    ];
    students.value = dummyUsers.filter(
      (user) => user.role === "student" || user.role === "admin"
    ); // Asumiendo que admin puede ser estudiante/asesor para pruebas
    advisors.value = dummyUsers.filter(
      (user) => user.role === "advisor" || user.role === "admin"
    );

    // Si necesitas obtener usuarios reales, deberías implementar un método en authStore
    // que llame a un endpoint del backend para listar usuarios.
    // Por ejemplo, en auth.resolver.ts podrías tener una query `users`
    // y en auth.service.ts un `findAllUsers`
    // Y luego en authStore.ts un `fetchUsers`
    // await authStore.fetchUsers();
    // students.value = authStore.users.filter(u => u.role === 'student');
    // advisors.value = authStore.users.filter(u => u.role === 'advisor');
  } catch (error: any) {
    console.error("Error fetching users for selects:", error);
    snackbar.value = {
      show: true,
      text: `Error al cargar usuarios: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

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

const openCreatePracticeDialog = () => {
  isEditMode.value = false;
  newPractice.value = {
    id: "", // Para modo edición
    studentId: "",
    advisorId: "",
    protocolId: "",
    institutionName: "",
    courseName: "",
    status: PracticeStatus.ASSIGNED, // Default para nueva práctica
  };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  practiceFormRef.value?.reset(); // Limpiar el formulario
};

const savePractice = async () => {
  const { valid } = await practiceFormRef.value!.validate();
  if (!valid) return;

  try {
    if (isEditMode.value) {
      await practiceStore.updatePractice(newPractice.value);
      snackbar.value = {
        show: true,
        text: "¡Práctica actualizada exitosamente!",
        color: "success",
        timeout: 3000,
      };
    } else {
      await practiceStore.createPractice({
        studentId: newPractice.value.studentId,
        advisorId: newPractice.value.advisorId,
        protocolId: newPractice.value.protocolId,
        institutionName: newPractice.value.institutionName,
        courseName: newPractice.value.courseName,
      });
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
  router.push(`/practices/${id}`); // Navegar a la página de detalle de la práctica
};

const editPractice = (id: string) => {
  isEditMode.value = true;
  const practice = practiceStore.practices.find((p) => p._id === id);
  if (practice) {
    newPractice.value = {
      id: practice._id,
      studentId: practice.student._id,
      advisorId: practice.advisor._id,
      protocolId: practice.protocol._id,
      institutionName: practice.institutionName,
      courseName: practice.courseName,
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
      await practiceStore.removePractice(practiceToDeleteId.value);
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
