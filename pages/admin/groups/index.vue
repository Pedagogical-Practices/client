<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col>
        <h1 class="text-h4">Gestión de Grupos de Práctica</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openCreateModal">Nuevo Grupo</v-btn>
        <v-btn
          color="grey-darken-1"
          to="/admin"
          class="mx-2"
          icon="mdi-security"
        ></v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-data-table
        :headers="headers"
        :items="groupStore.groups"
        :loading="groupStore.loading"
        class="elevation-1"
      >
        <template v-slot:item.practice="{ item }">{{
          item.practice?.name
        }}</template>
        <template v-slot:item.tutor="{ item }"
          >{{ item.tutor?.firstName }} {{ item.tutor?.lastName }}</template
        >
        <template v-slot:item.students="{ item }">{{
          item.students?.length || 0
        }}</template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditModal(item)"
            >mdi-pencil</v-icon
          >
          <v-icon small @click="confirmDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal de Creación/Edición -->
    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            isEditing ? "Editar Grupo" : "Crear Grupo"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="editableGroup.practiceId"
                  :items="allPractices"
                  item-title="name"
                  item-value="id"
                  label="Práctica Curricular"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editableGroup.name"
                  label="Nombre del Grupo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editableGroup.period"
                  :items="periods"
                  label="Periodo"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <entity-autocomplete
                  v-model="editableGroup.tutorId"
                  label="Tutor"
                  specificType="teacher"
                ></entity-autocomplete>
              </v-col>
              <v-col cols="12">
                <entity-autocomplete
                  v-model="editableGroup.studentIds"
                  label="Estudiantes"
                  specificType="student"
                  multiple
                ></entity-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editableGroup.institutionIds"
                  :items="allInstitutions"
                  item-title="name"
                  item-value="id"
                  label="Instituciones"
                  multiple
                  chips
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveGroup">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Confirmación de Borrado -->
    <v-dialog v-model="deleteDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Borrado</v-card-title>
        <v-card-text
          >¿Estás seguro de que quieres eliminar este grupo?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" text @click="deleteGroupConfirmed"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useGroupStore } from "~/stores/groupStore";
import { usePracticeStore } from "~/stores/practiceStore";
import { useInstitutionStore } from "~/stores/institutionStore";
import { UserRole, type Group } from "~/types";
import EntityAutocomplete from "~/components/EntityAutocomplete.vue";

const groupStore = useGroupStore();
const practiceStore = usePracticeStore();
const institutionStore = useInstitutionStore();

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editableGroup = ref<
  Partial<Group> & {
    practiceId?: string | null;
    tutorId?: string;
    studentIds?: string[];
    institutionIds?: string[];
  }
>({});
const groupToDeleteId = ref<string | null>(null);

const snackbar = ref({ show: false, text: "", color: "success" });

const headers = [
  { title: "Práctica Curricular", value: "practice.name" },
  { title: "Tutor", value: "tutor.firstName" },
  { title: "Nº Estudiantes", value: "students.length" },
  { title: "Acciones", value: "actions", sortable: false },
];

const allPractices = computed(() => practiceStore.practices);
const allInstitutions = computed(() => institutionStore.institutions);

const periods = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear + i);
  return years.flatMap((year) => [`${year}-1`, `${year}-2`]);
});

onMounted(() => {
  groupStore.fetchGroups();
  practiceStore.fetchAllPractices();
  institutionStore.fetchInstitutions();
});

const openCreateModal = () => {
  isEditing.value = false;
  editableGroup.value = {
    name: "",
    period: "",
    practiceId: null,
    tutorId: "",
    studentIds: [],
    institutionIds: [],
  };
  dialog.value = true;
};

const openEditModal = (group: Group) => {
  isEditing.value = true;
  editableGroup.value = {
    ...group,
    practiceId: group.practice?.id, // Assign only the ID
    tutorId: group.tutor?.id,
    studentIds: group.students?.map((s) => s.id) || [],
    institutionIds: group.institutions?.map((i) => i.id) || [],
  };
  dialog.value = true;
};

const closeModal = () => {
  dialog.value = false;
  editableGroup.value = {};
};

const saveGroup = async () => {
  try {
    // Ensure practiceIdToSend is always a string ID
    const practiceIdToSend =
      typeof editableGroup.value.practiceId === "object" &&
      editableGroup.value.practiceId !== null
        ? (editableGroup.value.practiceId as any).id
        : editableGroup.value.practiceId;

    const payload: any = {
      name: editableGroup.value.name,
      period: editableGroup.value.period,
      practiceId: practiceIdToSend,
      tutorId: editableGroup.value.tutorId,
      studentIds: editableGroup.value.studentIds,
      institutionIds: editableGroup.value.institutionIds,
    };

    if (isEditing.value) {
      if (!editableGroup.value.id) throw new Error("ID de grupo no encontrado");
      payload.id = editableGroup.value.id;
      await groupStore.updateGroup(payload);
      showSnackbar("¡Grupo actualizado!", "success");
    } else {
      await groupStore.createGroup(payload);
      showSnackbar("¡Grupo creado!", "success");
    }
    closeModal();
  } catch (error: any) {
    showSnackbar(`Error: ${error.message}`, "error");
  }
};

const confirmDelete = (group: Group) => {
  groupToDeleteId.value = group.id;
  deleteDialog.value = true;
};

const deleteGroupConfirmed = async () => {
  if (groupToDeleteId.value) {
    try {
      await groupStore.deleteGroup(groupToDeleteId.value);
      showSnackbar("Grupo eliminado", "success");
    } catch (error: any) {
      showSnackbar(`Error: ${error.message}`, "error");
    }
  }
  deleteDialog.value = false;
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};
</script>
