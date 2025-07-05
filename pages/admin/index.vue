<template>
  <h1>Adminstrador</h1>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Instituciones</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Buscar Institución"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-btn @click="openCreateDialog" color="primary"
              >Nueva Institución</v-btn
            >
            <v-data-table
              :headers="headers"
              :items="filteredInstitutions"
              :loading="loading"
              :search="search"
              item-key="_id"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn @click="openEditDialog(item)" icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn @click="deleteInstitution(item._id!)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for Create/Edit Institution -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ formTitle }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="editedItem.name"
              label="Nombre"
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.address"
              label="Dirección"
            ></v-text-field>
            <v-text-field
              v-model="editedItem.phone"
              label="Teléfono"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog">Cancelar</v-btn>
          <v-btn @click="saveInstitution" color="primary">{{
            editedIndex === -1 ? "Crear" : "Guardar"
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <snackbar
      :show.sync="snackbar.show"
      :message.sync="snackbar.message"
      :color.sync="snackbar.color"
      :timeout.sync="snackbar.timeout"
    ></snackbar>
  </v-container>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";

// Assuming these queries exist based on the context
import InstitutionQuery from "~/queries/Institution.gql";
import CreateInstitution from "~/queries/CreateInstitution.gql";
import UpdateInstitution from "~/queries/UpdateInstitution.gql";
import DeleteInstitution from "~/queries/DeleteInstitution.gql";

// Define Institution interface
import type { Institution } from "~/types/institution";

// Reactive data properties
const dialog = ref(false);
const search = ref("");
const loading = ref(false);
const institutions = ref<Institution[]>([]); // This will hold the fetched institutions
const editedIndex = ref(-1);
const editedItem = reactive<Institution>({
  name: "",
  address: "",
  phone: "",
});
const defaultItem = reactive<Institution>({
  name: "",
  address: "",
  phone: "",
});

const snackbar = reactive({
  show: false,
  message: "",
  color: "",
  timeout: 3000,
});

// Computed properties
const formTitle = computed(() =>
  editedIndex.value === -1 ? "Nueva Institución" : "Editar Institución"
);

const filteredInstitutions = computed(() => {
  if (!search.value) {
    return institutions.value;
  }
  return institutions.value.filter((institution) =>
    institution.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const headers = [
  { title: "Nombre", key: "name" },
  { title: "Dirección", key: "address" },
  { title: "Teléfono", key: "phone" },
  { title: "Acciones", key: "actions", sortable: false },
];

// Methods
const openCreateDialog = () => {
  Object.assign(editedItem, defaultItem);
  editedIndex.value = -1;
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  // Reset editedItem after closing dialog
  Object.assign(editedItem, defaultItem);
  editedIndex.value = -1;
};

const saveInstitution = async () => {
  // Placeholder for save logic
  console.log("Saving institution:", editedItem);
  closeDialog();
};

const openEditDialog = (item: Institution) => {
  editedIndex.value = institutions.value.indexOf(item);
  Object.assign(editedItem, item);
  dialog.value = true;
};

const deleteInstitution = async (id: string) => {
  // Placeholder for delete logic
  console.log("Deleting institution with ID:", id);
};

// Fetch institutions on component mount
// Fetch institutions on component mount
onMounted(() => {
  loading.value = true;
  try {
    const { result, onError } = useQuery(InstitutionQuery);
    onError((error) => {
      console.error("Error fetching institutions:", error);
      snackbar.message = "Error al cargar instituciones.";
      snackbar.color = "error";
      snackbar.show = true;
      loading.value = false;
    });
  } catch (error) {
    console.error("Error fetching institutions:", error);
    snackbar.message = "Error al cargar instituciones.";
    snackbar.color = "error";
    snackbar.show = true;
    loading.value = false;
  }
});
</script>
