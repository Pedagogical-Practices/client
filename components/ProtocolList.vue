<template>
  <v-data-table
    :headers="headers"
    :items="protocols"
    :items-per-page="10"
    class="elevation-1"
  >
    <template v-slot:item.form.name="{ item }">
      <v-chip class="ma-1" color="info" size="small">
        {{ item.form.name }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        size="small"
        color="primary"
        @click="$emit('view', item.id)"
        prepend-icon="mdi-eye"
      >
        Completar
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Protocol } from "~/types";

defineProps<{
  protocols: Protocol[];
}>();

defineEmits(["view"]);

const headers = ref([
  { title: "Nombre", key: "name" },
  { title: "Formulario", key: "form.name" },
  { title: "Tipo de Producto", key: "productType" },
  { title: "Acciones", key: "actions", sortable: false },
]);
</script>
