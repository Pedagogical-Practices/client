<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Gestión de Grupos</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openCreateGroupDialog"
            >
              Asignar Nuevo Grupo
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="groupStore.groups"
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
                  @click="viewGroup(item.id)"
                  title="Ver Detalle"
                ></v-btn>
                <v-btn
                  size="small"
                  color="warning"
                  icon="mdi-pencil"
                  class="mr-2"
                  @click="editGroup(item.id)"
                  title="Editar Grupo"
                ></v-btn>
                <v-btn
                  size="small"
                  color="error"
                  icon="mdi-delete"
                  @click="confirmDeleteGroup(item.id)"
                  title="Eliminar Grupo"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para crear/editar grupo -->
    <v-dialog v-model="dialog" max-width="700px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ isEditMode ? "Editar Grupo" : "Asignar Nuevo Grupo" }}</span>
          <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="groupFormRef">
            <EntityAutocomplete
              v-model="newGroup.studentId"
              specific-type="student"
              label="Docente en formación"
              :multiple="false"
            ></EntityAutocomplete>
            <EntityAutocomplete
              v-model="newGroup.teacherId"
              specific-type="teacher"
              label="Docente Asesor"
              :multiple="false"
            ></EntityAutocomplete>
            <EntityAutocomplete
              v-model="newGroup.protocolIds"
              specific-type="protocol"
              label="Protocolos"
              :multiple="true"
            ></EntityAutocomplete>
            <EntityAutocomplete
              v-model="newGroup.practiceId"
              specific-type="practice"
              label="Curso de Malla Curricular"
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
            @click="saveGroup"
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
          ¿Estás seguro de que quieres eliminar este grupo? Esta acción no se
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
import { useGroupStore } from "~/stores/groupStore";
import { useAuthStore } from "~/stores/authStore";
import { useProtocolStore } from "~/stores/protocolStore";

import EntityAutocomplete from "~/components/EntityAutocomplete.vue";

const router = useRouter();
const groupStore = useGroupStore();
const authStore = useAuthStore();
const protocolStore = useProtocolStore();

const dialog = ref(false);
const isEditMode = ref(false);

const closeDialog = () => {
  dialog.value = false;
  // groupFormRef.value?.reset(); // Limpiar el formulario
};

const newGroup = ref({
  id: "", // Para modo edición
  studentId: "",
  teacherId: "",
  protocolIds: [],
  courseId: "",
  status: PracticeStatus.PENDING, // Default para nuevo grupo
});

const openCreateGroupDialog = () => {
  isEditMode.value = false;
  newGroup.value = {
    id: "",
    studentId: "",
    teacherId: "",
    protocolIds: [],
    courseId: "",
    status: PracticeStatus.PENDING,
  };
  dialog.value = true;
};

const groupFormRef = ref<HTMLFormElement | null>(null);

const groupToDeleteId = ref<string | null>(null);
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
  { title: "Curso de Malla Curricular", key: "practice.name" },
  { title: "Estado", key: "status" },
  { title: "Acciones", key: "actions", sortable: false },
]);

onMounted(async () => {
  console.log("groups/index.vue: onMounted started.");
  await groupStore.fetchGroups();
  console.log("groups/index.vue: groups fetched.");
  await protocolStore.fetchProtocols();
  console.log("groups/index.vue: protocols fetched.");
  await authStore.fetchUsers();
  console.log("groups/index.vue: users fetched.");
});

const students = computed(() => {
  console.log(
    "groups/index.vue: Computing students. authStore.users:",
    authStore.users
  );
  return (authStore.users || []).filter((user) => user.role === "STUDENT");
});
const advisors = computed(() => {
  console.log(
    "groups/index.vue: Computing advisors. authStore.users:",
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

const saveGroup = async () => {
  const { valid } = await groupFormRef.value!.validate();
  if (!valid) return;

  try {
    if (isEditMode.value) {
      await groupStore.updateGroup(newGroup.value.id, newGroup.value);
      snackbar.value = {
        show: true,
        text: "¡Grupo actualizado exitosamente!",
        color: "success",
        timeout: 3000,
      };
    } else {
      const { id, ...createData } = newGroup.value;
      await groupStore.createGroup(createData);
      snackbar.value = {
        show: true,
        text: "¡Grupo asignado exitosamente!",
        color: "success",
        timeout: 3000,
      };
    }
    closeDialog();
    await groupStore.fetchGroups(); // Refrescar la lista
  } catch (error: any) {
    console.error("Error al guardar grupo:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const viewGroup = (id: string) => {
  router.push(`/admin/groups/${id}`); // Navegar a la página de detalle del grupo
};

const editGroup = (id: string) => {
  isEditMode.value = true;
  const group = groupStore.groups.find((p) => p.id === id);
  if (group) {
    newGroup.value = {
      id: group.id,
      studentId: group.student.id,
      teacherId: group.teacher.id,
      protocolIds: group.protocols.map((p) => p.id),
      practiceId: group.practice.id,
      status: group.status,
    };
    dialog.value = true;
  }
};

const confirmDeleteGroup = (id: string) => {
  groupToDeleteId.value = id;
  deleteConfirmDialog.value = true;
};

const deleteGroup = async () => {
  try {
    if (groupToDeleteId.value) {
      await groupStore.deleteGroup(groupToDeleteId.value);
      snackbar.value = {
        show: true,
        text: "¡Grupo eliminado exitosamente!",
        color: "success",
        timeout: 3000,
      };
      deleteConfirmDialog.value = false;
      groupToDeleteId.value = null;
      await groupStore.fetchGroups(); // Refrescar la lista
    }
  } catch (error: any) {
    console.error("Error al eliminar grupo:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};
</script>
