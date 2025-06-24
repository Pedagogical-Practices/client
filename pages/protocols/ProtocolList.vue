<template>
  <v-data-table
    :headers="headers"
    :items="protocols"
    :items-per-page="10"
    class="elevation-1"
  >
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

defineProps<{
  protocols: Array<{
    _id: string;
    name: string;
    module: string;
    formId: string;
  }>;
}>();

defineEmits(["view"]);

const headers = ref([
  { title: "Nombre", key: "name" },
  { title: "Módulo", key: "module" },
  { title: "Acciones", key: "actions", sortable: false },
]);
</script>
