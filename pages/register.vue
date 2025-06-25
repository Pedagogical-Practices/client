<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>Registrarse</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="name"
                label="Nombre"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                required
              ></v-text-field>
              <v-select
                v-model="role"
                label="Rol"
                :items="['admin', 'user']"
                required
              ></v-select>
              <v-btn type="submit" color="primary" block>Registrarse</v-btn>
            </v-form>
            <v-btn to="/login" variant="text" class="mt-2">
              ¿Ya tienes cuenta? Inicia sesión
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
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

interface Snackbar {
  show: boolean;
  text: string;
  color: "success" | "error";
}

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const role = ref<string>("user");
const router = useRouter();
const authStore = useAuthStore();
const snackbar = ref<Snackbar>({
  show: false,
  text: "",
  color: "success",
});

const register = async (): Promise<void> => {
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    });
    router.push("/editor");
  } catch (error: any) {
    console.error("Form register error:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
    };
  }
};
</script>
