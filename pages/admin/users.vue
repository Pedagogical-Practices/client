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
        :loading="loading"
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

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            isEditing ? "Editar Usuario" : "Crear Usuario"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editableUser.name"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editableUser.email"
                  label="Correo Electrónico"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="!isEditing">
                <v-text-field
                  v-model="editableUser.password"
                  label="Contraseña"
                  :type="passwordVisible ? 'text' : 'password'"
                  :required="!isEditing"
                  :append-inner-icon="
                    passwordVisible ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append-inner="passwordVisible = !passwordVisible"
                ></v-text-field>
              </v-col>
              <!--v-col cols="12" v-if="!isEditing">
                <v-text-field
                  v-model="editableUser.password"
                  label="Contraseña"
                  type="password"
                  required
                ></v-text-field>
              </v-col-->
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

    <v-dialog v-model="deleteDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Borrado</v-card-title>
        <v-card-text
          >¿Estás seguro de que quieres eliminar a este usuario? Esta acción no
          se puede deshacer.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" text @click="deleteUserConfirmed"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserAdminStore } from "~/stores/userAdminStore";
import { UserRole } from "~/types";

const store = useUserAdminStore();

// Reactive state variables
const userRoles = Object.values(UserRole);
const loading = ref(true);
const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editableUser = ref<any>({});
const userToDelete = ref<any>(null);
const passwordVisible = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

// Functions
const openCreateModal = () => {
  isEditing.value = false;
  editableUser.value = {
    name: "",
    email: "",
    password: "",
    role: UserRole.STUDENT,
  };
  dialog.value = true;
};

const openEditModal = (user: any) => {
  isEditing.value = true;
  editableUser.value = { ...user, password: "" }; // Initialize password to empty string
  dialog.value = true;
};

const closeModal = () => {
  dialog.value = false;
  editableUser.value = {};
  passwordVisible.value = false; // Reset password visibility
};

const saveUser = async () => {
  try {
    if (isEditing.value) {
      // Only send password if it's not empty
      const userToUpdate = { ...editableUser.value };
      if (userToUpdate.password === "") {
        delete userToUpdate.password;
      }
      await store.updateUser(userToUpdate.id, userToUpdate);
      showSnackbar("¡Usuario actualizado exitosamente!", "success");
    } else {
      await store.createUser(editableUser.value);
      showSnackbar("¡Usuario creado exitosamente!", "success");
    }
    closeModal();
    await store.fetchUsers(); // Refresh the list
  } catch (error: any) {
    console.error("Error al guardar usuario:", error);
    showSnackbar(
      `Error al guardar usuario: ${error.message || "Error desconocido"}`,
      "error"
    );
  }
};

const confirmDelete = (user: any) => {
  userToDelete.value = user;
  deleteDialog.value = true;
};

const deleteUserConfirmed = async () => {
  try {
    if (userToDelete.value) {
      await store.deleteUser(userToDelete.value.id);
      showSnackbar("¡Usuario eliminado exitosamente!", "success");
    }
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    showSnackbar(
      `Error al eliminar usuario: ${error.message || "Error desconocido"}`,
      "error"
    );
  } finally {
    deleteDialog.value = false;
    userToDelete.value = null;
    await store.fetchUsers(); // Refresh the list
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Computed properties
const headers = [
  { title: "Nombre", value: "name" },
  { title: "Email", value: "email" },
  { title: "Rol", value: "role" },
  { title: "Acciones", value: "actions", sortable: false },
];

const formTitle = computed(() => {
  return isEditing.value ? "Editar Usuario" : "Crear Usuario";
});

// Lifecycle hooks
onMounted(async () => {
  try {
    await store.fetchUsers();
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    showSnackbar(
      `Error al cargar usuarios: ${error.message || "Error desconocido"}`,
      "error"
    );
  } finally {
    loading.value = false;
  }
});
</script>
