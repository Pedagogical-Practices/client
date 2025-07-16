<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h5 primary--text">Evaluar Entrega</v-card-title>
      <v-card-text>
        <p>Aquí se evaluará la entrega con ID: {{ submissionId }}</p>
        <p>Esta página se desarrollará en una fase posterior.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="router.back()">Volver</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const submissionId = route.params.submissionId as string;
</script>
