<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5">Iniciar Sesión</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Correo Electrónico"
                type="email"
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                variant="outlined"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block class="mt-4"
                >Iniciar Sesión</v-btn
              >
            </v-form>
            <v-btn variant="text" to="/register" class="mt-2"
              >¿No tienes cuenta? Regístrate</v-btn
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
import { ref } from "vue";
import { useAuthStore } from "~/stores/authStore";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    snackbar.value = {
      show: true,
      text: "¡Login exitoso!",
      color: "success",
      timeout: 3000,
    };
    // La redirección se maneja en authStore.ts
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: error.message,
      color: "error",
      timeout: 3000,
    };
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
