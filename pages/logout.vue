<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5">Cerrando Sesión</v-card-title>
          <v-card-text>
            <p>Por favor, espera mientras cerramos tu sesión...</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.logout();
});
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>