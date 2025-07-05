<template>
  <v-data-table
    :headers="headers"
    :items="protocols"
    :items-per-page="10"
    class="elevation-1"
  >
    <template v-slot:item.forms="{ item }">
      <v-chip
        v-for="form in item.forms"
        :key="form._id"
        class="ma-1"
        color="info"
        size="small"
      >
        {{ form.name }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        size="small"
        color="primary"
        @click="$emit('view', item._id)"
        prepend-icon="mdi-eye"
      >
        Completar
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Protocol } from "~/stores/protocolStore"; // Importar la interfaz Protocol

defineProps<{
  protocols: Protocol[]; // Usar la interfaz Protocol directamente
}>();

defineEmits(["view"]);

const headers = ref([
  { title: "Nombre", key: "name" },
  { title: "Módulo", key: "module" },
  { title: "Formularios", key: "forms" }, // Nueva columna para mostrar los formularios
  { title: "Acciones", key: "actions", sortable: false },
]);
</script>
