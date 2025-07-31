<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4">Administración de Protocolos</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openCreateModal">Crear Protocolo</v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-data-table
        :headers="headers"
        :items="protocolStore.protocols"
        class="elevation-1"
      >
        <template v-slot:item.forms="{ item }">
          <v-chip
            v-for="form in item.forms"
            :key="form.id"
            class="ma-1"
            color="info"
            size="small"
            >{{ form.name }}</v-chip
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
            isEditing ? "Editar Protocolo" : "Crear Protocolo"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editableProtocol.name"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editableProtocol.description"
                  label="Descripción"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editableProtocol.formIds"
                  :items="formOptions"
                  item-title="title"
                  item-value="value"
                  label="Formularios Asociados"
                  multiple
                  chips
                  clearable
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editableProtocol.productType"
                  label="Tipo de Producto"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveProtocol"
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
          >¿Estás seguro de que quieres eliminar este protocolo? Esta acción no
          se puede deshacer.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" text @click="deleteProtocolConfirmed"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useProtocolStore } from "~/stores/protocolStore";
import { useFormStore } from "~/stores/formStore";
import { type Protocol } from "~/types";

const protocolStore = useProtocolStore();
const formStore = useFormStore();

const headers = [
  { title: "Nombre", value: "name" },
  { title: "Descripción", value: "description" },
  { title: "Formularios", value: "forms", sortable: false },
  { title: "Tipo de Producto", value: "productType" },
  { title: "Acciones", value: "actions", sortable: false },
];

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editableProtocol = ref<any>({});
const protocolToDelete = ref<any>(null);

const formOptions = computed(() =>
  formStore.forms.map((form) => ({
    title: form.name,
    value: form.id,
  }))
);

onMounted(() => {
  protocolStore.fetchProtocols();
  formStore.fetchForms(); // Cargar todos los formularios
});

const openCreateModal = () => {
  isEditing.value = false;
  editableProtocol.value = {
    name: "",
    description: "",
    formIds: [], // Ahora es un array
    productType: "",
  };
  dialog.value = true;
};

const openEditModal = async (protocol: Protocol) => {
  isEditing.value = true;
  await protocolStore.fetchProtocol(protocol.id);
  if (protocolStore.currentProtocol) {
    editableProtocol.value = {
      ...protocolStore.currentProtocol,
      formIds: protocolStore.currentProtocol.forms?.map((f) => f.id) || [],
    };
  }
  dialog.value = true;
};

const closeModal = () => {
  dialog.value = false;
  editableProtocol.value = {};
  protocolStore.currentProtocol = null;
};

const saveProtocol = async () => {
  if (isEditing.value) {
    await protocolStore.updateProtocol(
      editableProtocol.value.id,
      editableProtocol.value
    );
  } else {
    await protocolStore.createProtocol(editableProtocol.value);
  }
  closeModal();
};

const confirmDelete = (protocol: Protocol) => {
  protocolToDelete.value = protocol;
  deleteDialog.value = true;
};

const deleteProtocolConfirmed = async () => {
  if (protocolToDelete.value) {
    await protocolStore.deleteProtocol(protocolToDelete.value.id);
  }
  deleteDialog.value = false;
  protocolToDelete.value = null;
};
</script>
