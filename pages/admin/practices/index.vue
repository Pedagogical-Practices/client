<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col>
        <h1 class="text-h4">Gestión de Prácticas Curriculares</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" class="mx-2" @click="openCreateModal"
          >Nueva Práctica</v-btn
        >
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
        :items="practiceStore.practices"
        :loading="practiceStore.loading"
        class="elevation-1"
      >
        <template v-slot:item.protocols="{ item }">
          <v-chip
            v-for="protocol in item.protocols"
            :key="protocol.id"
            class="mr-1"
            >{{ protocol.name }}</v-chip
          >
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditModal(item)"
            >mdi-pencil</v-icon
          >
          <v-icon small @click="confirmDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal de Creación/Edición -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            isEditing ? "Editar Práctica" : "Crear Práctica"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editablePractice.name"
                  label="Nombre de la Práctica"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editablePractice.description"
                  label="Descripción"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editablePractice.protocolIds"
                  :items="allProtocols"
                  item-title="name"
                  item-value="id"
                  label="Protocolos"
                  multiple
                  chips
                  closable-chips
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="savePractice"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Confirmación de Borrado -->
    <v-dialog v-model="deleteDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Borrado</v-card-title>
        <v-card-text
          >¿Estás seguro de que quieres eliminar esta práctica
          curricular?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" text @click="deletePracticeConfirmed"
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
import { usePracticeStore } from "~/stores/practiceStore";
import { useProtocolStore } from "~/stores/protocolStore";
import type { Practice, Protocol } from "~/types";

const practiceStore = usePracticeStore();
const protocolStore = useProtocolStore();

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editablePractice = ref<Partial<Practice> & { protocolIds?: string[] }>(
  {}
);
const practiceToDeleteId = ref<string | null>(null);

const snackbar = ref({ show: false, text: "", color: "success" });

const headers = [
  { title: "Nombre", value: "name" },
  { title: "Protocolos", value: "protocols" },
  { title: "Acciones", value: "actions", sortable: false },
];

const allProtocols = computed(() => protocolStore.protocols);

onMounted(() => {
  practiceStore.fetchAllPractices();
  protocolStore.fetchProtocols();
});

const openCreateModal = () => {
  isEditing.value = false;
  editablePractice.value = { name: "", protocolIds: [] };
  dialog.value = true;
};

const openEditModal = (practice: Practice) => {
  isEditing.value = true;
  editablePractice.value = {
    ...practice,
    protocolIds: practice.protocols?.map((p) => p.id) || [],
    description: practice.description || "",
  };
  dialog.value = true;
};

const closeModal = () => {
  dialog.value = false;
};

const savePractice = async () => {
  try {
    const payload: any = {
      name: editablePractice.value.name,
      protocols: editablePractice.value.protocolIds, // Cambiado a 'protocols'
      description: editablePractice.value.description, // Añadido el campo description
    };

    if (isEditing.value) {
      if (!editablePractice.value.id)
        throw new Error("ID de práctica no encontrado");
      payload.id = editablePractice.value.id; // Añadimos el ID al payload
      await practiceStore.updatePractice(payload);
      showSnackbar("¡Práctica actualizada!", "success");
    } else {
      await practiceStore.createPractice(payload);
      showSnackbar("¡Práctica creada!", "success");
    }
    closeModal();
  } catch (error: any) {
    showSnackbar(`Error: ${error.message}`, "error");
  }
};

const confirmDelete = (practice: Practice) => {
  practiceToDeleteId.value = practice.id;
  deleteDialog.value = true;
};

const deletePracticeConfirmed = async () => {
  if (practiceToDeleteId.value) {
    try {
      await practiceStore.deletePractice(practiceToDeleteId.value);
      showSnackbar("Práctica eliminada", "success");
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
