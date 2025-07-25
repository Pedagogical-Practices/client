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
        :items="store.protocols"
        :loading="store.loading"
        class="elevation-1"
      >
        <template v-slot:item.form.name="{ item }">
          {{ item.form.name }}
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
                <EntityAutocomplete
                  v-model="editableProtocol.formId"
                  specific-type="form"
                  label="Formulario Asociado"
                  required
                ></EntityAutocomplete>
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
import { ref, onMounted } from "vue";
import { useProtocolStore } from "~/stores/protocolStore";
import { Protocol } from "~/types/protocol"; // Adjust the import path as necessary
import EntityAutocomplete from "~/components/EntityAutocomplete.vue";

// Middleware de ruta
definePageMeta({
  middleware: "admin",
});

const store = useProtocolStore();

const headers = [
  { title: "Nombre", value: "name" },
  { title: "Descripción", value: "description" },
  { title: "Formulario", value: "form.name" },
  { title: "Tipo de Producto", value: "productType" },
  { title: "Acciones", value: "actions", sortable: false },
];

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editableProtocol = ref<any>({});
const protocolToDelete = ref<any>(null);

onMounted(() => {
  store.fetchProtocols();
});

const openCreateModal = () => {
  isEditing.value = false;
  editableProtocol.value = {
    name: "",
    description: "",
    formId: "",
    productType: "",
  };
  dialog.value = true;
};

const openEditModal = async (protocol: Protocol) => {
  await store.fetchProtocol(protocol.id);
  isEditing.value = true;
  if (store.currentProtocol) {
    editableProtocol.value = {
      ...store.currentProtocol,
      formId: store.currentProtocol.form?.id || "",
    };
  } else {
    editableProtocol.value = { ...protocol, formId: protocol.form?.id || "" };
  }
  dialog.value = true;
};

const closeModal = () => {
  dialog.value = false;
  editableProtocol.value = {};
};

const saveProtocol = async () => {
  if (isEditing.value) {
    const { id, ...dataToUpdate } = editableProtocol.value;
    await store.updateProtocol(id, dataToUpdate);
  } else {
    await store.createProtocol(editableProtocol.value);
  }
  closeModal();
};

const confirmDelete = (protocol: Protocol) => {
  protocolToDelete.value = protocol;
  deleteDialog.value = true;
};

const deleteProtocolConfirmed = async () => {
  if (protocolToDelete.value) {
    await store.deleteProtocol(protocolToDelete.value.id);
  }
  deleteDialog.value = false;
  protocolToDelete.value = null;
};
</script>
