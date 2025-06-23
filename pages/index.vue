<template>
  <v-container fluid class="pa-4">
    <v-row justify="center" class="mt-6">
      <v-col cols="12" sm="6" md="3">
        <v-btn
          color="primary"
          variant="flat"
          block
          size="large"
          to="/forms"
          prepend-icon="mdi-format-list-bulleted"
        >
          Ver Formularios
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn
          color="success"
          variant="flat"
          block
          size="large"
          to="/editor"
          prepend-icon="mdi-plus"
        >
          Crear Formulario
        </v-btn>
      </v-col>
      <v-col v-if="!authStore.isAuthenticated" cols="12" sm="6" md="3">
        <v-btn
          color="info"
          variant="flat"
          block
          size="large"
          to="/login"
          prepend-icon="mdi-login"
        >
          Iniciar Sesión
        </v-btn>
      </v-col>
      <v-col v-if="!authStore.isAuthenticated" cols="12" sm="6" md="3">
        <v-btn
          color="warning"
          variant="flat"
          block
          size="large"
          to="/register"
          prepend-icon="mdi-account-plus"
        >
          Registrarse
        </v-btn>
      </v-col>
      <v-col v-if="authStore.isAuthenticated" cols="12" sm="6" md="3">
        <v-btn
          color="error"
          variant="flat"
          block
          size="large"
          @click="logout"
          prepend-icon="mdi-logout"
        >
          Cerrar Sesión
        </v-btn>
      </v-col>
    </v-row>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const logout = async () => {
  try {
    await authStore.logout(); // Asumimos que authStore tiene un método logout
    snackbar.value = {
      show: true,
      text: "Sesión cerrada con éxito.",
      color: "success",
      timeout: 3000,
    };
    router.push("/login");
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 2.5rem;
  color: #1976d2;
}
p {
  font-size: 1.2rem;
  color: #555;
}
</style>
