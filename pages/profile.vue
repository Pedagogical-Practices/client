<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5">Editar Perfil</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleUpdateProfile">
              <v-text-field
                v-model="name"
                label="Nombre"
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Correo Electrónico"
                type="email"
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Nueva Contraseña (opcional)"
                type="password"
                variant="outlined"
              ></v-text-field>
              <v-btn type="submit" color="primary" block class="mt-4"
                >Actualizar Perfil</v-btn
              >
            </v-form>
            <v-btn color="error" variant="text" @click="logout" class="mt-2"
              >Cerrar Sesión</v-btn
            >
          </v-card-text>
          <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="snackbar.timeout"
          >
            {{ snackbar.text }}
            <template v-slot:actions>
              <v-btn variant="text" @click="snackbar.show = false"
                >Cerrar</v-btn
              >
            </template>
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const name = ref(authStore.user?.name || "");
const email = ref(authStore.user?.email || "");
const password = ref("");
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(() => {
  if (!authStore.isAuthenticated) router.push("/login");
});

const handleUpdateProfile = async () => {
  try {
    const updateInput: any = { name: name.value, email: email.value };
    if (password.value) updateInput.password = password.value;
    await authStore.updateProfile(updateInput);
    snackbar.value = {
      show: true,
      text: "¡Perfil actualizado!",
      color: "success",
      timeout: 3000,
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      text: error.message,
      color: "error",
      timeout: 3000,
    };
  }
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
