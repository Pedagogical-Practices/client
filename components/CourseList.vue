<template>
  <v-data-table
    :headers="headers"
    :items="courses"
    :items-per-page="10"
    class="elevation-1"
  >
    <template v-slot:item.protocols="{ item }">
      <v-chip
        v-for="protocol in item.protocols"
        :key="protocol.id"
        class="ma-1"
        color="info"
        size="small"
      >
        {{ protocol.name }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        size="small"
        color="primary"
        @click="$emit('view', item.id)"
        prepend-icon="mdi-eye"
      >
        Ver
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Course } from "~/types";

defineProps<{
  courses: Course[];
}>();

defineEmits(["view"]);

const headers = ref([
  { title: "Nombre", key: "name" },
  { title: "Descripción", key: "description" },
  { title: "Fecha Inicio", key: "startDate" },
  { title: "Fecha Fin", key: "endDate" },
  { title: "Protocolos", key: "protocols" },
  { title: "Acciones", key: "actions", sortable: false },
]);
</script>
