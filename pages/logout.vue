<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5"> Cerrar Sesión </v-card-title>
          <v-card-text>
            <p>¿Estás seguro de que deseas cerrar tu sesión?</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" variant="text" @click="router.push('/')">
              Cancelar
            </v-btn>
            <v-btn
              color="error"
              prepend-icon="mdi-logout"
              @click="handleLogout"
              :loading="isLoading"
            >
              Cerrar Sesión
            </v-btn>
          </v-card-actions>
        </v-card>
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
const isLoading = ref<boolean>(false);
const snackbar = ref<{
  show: boolean;
  text: string;
  color: string;
  timeout: number;
}>({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const handleLogout = async (): Promise<void> => {
  try {
    isLoading.value = true;
    authStore.logout();
    snackbar.value = {
      show: true,
      text: "¡Sesión cerrada exitosamente!",
      color: "success",
      timeout: 3000,
    };
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Pequeña pausa para UX
    router.push("/login");
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message || "No se pudo cerrar sesión"}`,
      color: "error",
      timeout: 3000,
    };
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.v-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
}
.v-card {
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
