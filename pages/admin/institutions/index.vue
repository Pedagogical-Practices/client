<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col>
        <h1 class="text-h4">Gestión de Instituciones</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" class="mx-2" @click="openCreateModal"
          >Nueva Institución</v-btn
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
        :items="institutionStore.institutions"
        :loading="institutionStore.loading"
        class="elevation-1"
      >
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
            isEditing ? "Editar Institución" : "Crear Institución"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editableInstitution.name"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editableInstitution.address"
                  label="Dirección"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editableInstitution.phone"
                  label="Teléfono"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editableInstitution.email"
                  label="Correo Electrónico"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveInstitution"
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
          >¿Estás seguro de que quieres eliminar esta institución? Esta acción
          no se puede deshacer.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" text @click="deleteInstitutionConfirmed"
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
import { ref, onMounted } from "vue";
import { useInstitutionStore } from "~/stores/institutionStore";
import type { Institution } from "~/types";

const institutionStore = useInstitutionStore();

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editableInstitution = ref<Partial<Institution>>({});
const institutionToDelete = ref<string | null>(null);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const headers = [
  { title: "Nombre", value: "name" },
  { title: "Dirección", value: "address" },
  { title: "Teléfono", value: "phone" },
  { title: "Email", value: "email" },
  { title: "Acciones", value: "actions", sortable: false },
];

onMounted(async () => {
  await institutionStore.fetchInstitutions();
});

const openCreateModal = () => {
  isEditing.value = false;
  editableInstitution.value = {};
  dialog.value = true;
};

const openEditModal = (institution: Institution) => {
  isEditing.value = true;
  editableInstitution.value = { ...institution };
  dialog.value = true;
};

const closeModal = () => {
  dialog.value = false;
  editableInstitution.value = {};
};

const saveInstitution = async () => {
  try {
    // Limpiamos el objeto para enviar solo lo necesario
    const payload: any = {
      name: editableInstitution.value.name,
      address: editableInstitution.value.address,
      phone: editableInstitution.value.phone,
      email: editableInstitution.value.email,
    };

    if (isEditing.value) {
      if (!editableInstitution.value.id)
        throw new Error("ID de institución no encontrado para actualizar");
      payload.id = editableInstitution.value.id; // Añadimos el ID al payload
      await institutionStore.updateInstitution(payload);
      showSnackbar("¡Institución actualizada exitosamente!", "success");
    } else {
      await institutionStore.createInstitution(payload);
      showSnackbar("¡Institución creada exitosamente!", "success");
    }
    closeModal();
  } catch (error: any) {
    console.error("Error al guardar institución:", error);
    showSnackbar(
      `Error al guardar institución: ${error.message || "Error desconocido"}`,
      "error"
    );
  }
};

const confirmDelete = (institution: Institution) => {
  institutionToDelete.value = institution.id; // Assuming institution has an 'id' field
  deleteDialog.value = true;
};

const deleteInstitutionConfirmed = async () => {
  try {
    if (institutionToDelete.value) {
      await institutionStore.deleteInstitution(institutionToDelete.value);
      showSnackbar("¡Institución eliminada exitosamente!", "success");
    }
  } catch (error: any) {
    console.error("Error al eliminar institución:", error);
    showSnackbar(
      `Error al eliminar institución: ${error.message || "Error desconocido"}`,
      "error"
    );
  } finally {
    deleteDialog.value = false;
    institutionToDelete.value = null;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};
</script>
