<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Gestión de Instituciones</h1>
        <v-btn color="primary" @click="openDialog()">
          <v-icon left>mdi-plus</v-icon>
          Crear Institución
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="filteredInstitutions"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="openDialog(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteInstitution(item._id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedInstitution.name"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedInstitution.address"
                  label="Dirección"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedInstitution.phone"
                  label="Teléfono"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveInstitution">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useInstitutionStore, Institution } from '~/stores/institutionStore';

const institutionStore = useInstitutionStore();
const search = ref('');
const dialog = ref(false);
const editedInstitution = ref<Institution>({ name: '' });
const defaultInstitution: Institution = { name: '' };

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Dirección', key: 'address' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const formTitle = computed(() => {
  return editedInstitution.value._id ? 'Editar Institución' : 'Crear Institución';
});

const filteredInstitutions = computed(() => {
  if (!search.value) {
    return institutionStore.institutions;
  }
  return institutionStore.institutions.filter(institution =>
    institution.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

onMounted(() => {
  institutionStore.fetchInstitutions();
});

function openDialog(item?: Institution) {
  editedInstitution.value = item ? { ...item } : { ...defaultInstitution };
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  editedInstitution.value = { ...defaultInstitution };
}

async function saveInstitution() {
  try {
    if (editedInstitution.value._id) {
      // Si tiene _id, es una actualización
      await institutionStore.updateInstitution(editedInstitution.value);
    } else {
      // Si no tiene _id, es una creación. Excluimos _id explícitamente.
      const { _id, ...institutionToCreate } = editedInstitution.value;
      await institutionStore.createInstitution(institutionToCreate);
    }
    closeDialog();
    await institutionStore.fetchInstitutions(); // Refrescar la lista después de guardar
  } catch (error) {
    console.error('Error saving institution:', error);
    // Opcionalmente, mostrar un mensaje de error al usuario
  }
}

async function deleteInstitution(id?: string) {
  if (id && confirm('¿Estás seguro de que quieres eliminar esta institución?')) {
    try {
      await institutionStore.deleteInstitution(id);
      await institutionStore.fetchInstitutions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting institution:', error);
      // Optionally, show an error message to the user
    }
  }
}
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
