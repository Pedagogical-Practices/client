<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5">Registrarse</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="firstName"
                label="Nombre"
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="lastName"
                label="Apellido"
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
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                variant="outlined"
                required
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>
              <v-btn type="submit" color="primary" block class="mt-4"
                >Registrarse</v-btn
              >
            </v-form>
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
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import { UserRole } from "~/types";

const authStore = useAuthStore();
const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const handleRegister = async () => {
  try {
    await authStore.createUser({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      roles: [UserRole.STUDENT], // Default role for public registration
    });
    snackbar.value = {
      show: true,
      text: "¡Registro exitoso! Por favor, inicia sesión.",
      color: "success",
      timeout: 3000,
    };
    router.push("/login");
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
