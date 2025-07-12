<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4">Administración de Usuarios</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openCreateModal">Crear Usuario</v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-data-table
        :headers="headers"
        :items="store.users"
        :loading="store.loading"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditModal(item)">mdi-pencil</v-icon>
          <v-icon small @click="confirmDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal de Creación/Edición -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editableUser.name" label="Nombre" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editableUser.email" label="Correo Electrónico" required></v-text-field>
              </v-col>
              <v-col cols="12" v-if="!isEditing">
                <v-text-field v-model="editableUser.password" label="Contraseña" type="password" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editableUser.role"
                  :items="userRoles"
                  label="Rol"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveUser">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Confirmación de Borrado -->
    <v-dialog v-model="deleteDialog" persistent max-width="400px">
        <v-card>
            <v-card-title class="text-h5">Confirmar Borrado</v-card-title>
            <v-card-text>¿Estás seguro de que quieres eliminar a este usuario? Esta acción no se puede deshacer.</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="deleteDialog = false">Cancelar</v-btn>
                <v-btn color="red darken-1" text @click="deleteUserConfirmed">Eliminar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserAdminStore } from '~/stores/userAdminStore';

// Middleware de ruta
definePageMeta({
  middleware: 'admin'
});

const store = useUserAdminStore();

const headers = [
  { title: 'Nombre', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Rol', value: 'role' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editableUser = ref<any>({});
const userToDelete = ref<any>(null);

// Lista de roles obtenida de la investigación del backend
const userRoles = ['admin', 'student', 'teacher_directive', 'administrative', 'family', 'coordinator'];

onMounted(() => {
  store.fetchUsers();
});

const openCreateModal = () => {
  isEditing.value = false;
  editableUser.value = { name: '', email: '', password: '', role: 'student' };
  dialog.value = true;
};

const openEditModal = (user: any) => {
  isEditing.value = true;
  editableUser.value = { ...user };
  dialog.value = true;
};

const closeModal = () => {
  dialog.value = false;
  editableUser.value = {};
};

const saveUser = async () => {
  if (isEditing.value) {
    await store.updateUser(editableUser.value._id, editableUser.value);
  } else {
    await store.createUser(editableUser.value);
  }
  closeModal();
};

const confirmDelete = (user: any) => {
    userToDelete.value = user;
    deleteDialog.value = true;
};

const deleteUserConfirmed = async () => {
    if (userToDelete.value) {
        await store.deleteUser(userToDelete.value._id);
    }
    deleteDialog.value = false;
    userToDelete.value = null;
};

</script>