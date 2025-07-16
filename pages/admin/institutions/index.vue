<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Gestión de Instituciones</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openCreateDialog"
            >
              Nueva Institución
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Buscar Institución"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
              class="mb-4"
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="filteredInstitutions"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editInstitution(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteInstitution(item)">
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:no-data>
                No hay instituciones disponibles.
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para Crear/Editar Institución -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Nombre"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.address"
                  label="Dirección"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.phone"
                  label="Teléfono"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog"
            >Cancelar</v-btn
          >
          <v-btn color="blue darken-1" text @click="saveInstitution"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn text @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useInstitutionStore } from "~/stores/institutionStore";

const institutionStore = useInstitutionStore();

const search = ref("");
const dialog = ref(false);
const loading = ref(true);
const editedIndex = ref(-1);
const editedItem = ref({
  _id: "",
  name: "",
  address: "",
  phone: "",
});
const defaultItem = {
  _id: "",
  name: "",
  address: "",
  phone: "",
};

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
  timeout: 3000,
});

const headers = ref([
  { title: "Nombre", key: "name" },
  { title: "Dirección", key: "address" },
  { title: "Teléfono", key: "phone" },
  { title: "Acciones", key: "actions", sortable: false },
]);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Nueva Institución" : "Editar Institución";
});

const filteredInstitutions = computed(() => {
  if (!search.value) {
    return institutionStore.institutions;
  }
  return institutionStore.institutions.filter((institution) =>
    institution.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Métodos CRUD
const openCreateDialog = () => {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
  dialog.value = true;
};

const editInstitution = (item: any) => {
  editedIndex.value = institutionStore.institutions.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const deleteInstitution = async (item: any) => {
  if (
    confirm(
      `¿Estás seguro de que quieres eliminar la institución ${item.name}?`
    )
  ) {
    try {
      await institutionStore.deleteInstitution(item._id);
      showSnackbar(`Institución ${item.name} eliminada.`, "success");
    } catch (error: any) {
      showSnackbar(`Error al eliminar: ${error.message}`, "error");
    }
  }
};

const saveInstitution = async () => {
  try {
    if (editedIndex.value > -1) {
      // Editar
      await institutionStore.updateInstitution(editedItem.value);
      showSnackbar("Institución actualizada correctamente.", "success");
    } else {
      // Crear
      const { _id, ...institutionData } = editedItem.value; // Excluir _id
      await institutionStore.createInstitution(institutionData);
      showSnackbar("Institución creada correctamente.", "success");
    }
    closeDialog();
  } catch (error: any) {
    showSnackbar(`Error al guardar: ${error.message}`, "error");
  }
};

const closeDialog = () => {
  dialog.value = false;
  editedItem.value = { ...defaultItem };
};

const showSnackbar = (message: string, color: string) => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Cargar instituciones al montar el componente
onMounted(async () => {
  try {
    await institutionStore.fetchInstitutions();
  } catch (error: any) {
    showSnackbar(`Error al cargar instituciones: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
});

// Observar cambios en la búsqueda
watch(search, () => {
  // La tabla computada filteredInstitutions ya maneja el filtrado
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
