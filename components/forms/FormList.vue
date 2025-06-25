<template>
  <v-data-table
    :items="forms"
    :headers="headers"
    class="elevation-1"
    @click:row="handleRowClick"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        size="small"
        variant="text"
        color="primary"
        @click.stop="$emit('view-form', item._id)"
        title="Ver Detalles"
        icon="mdi-eye"
      ></v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { Form } from "~/stores/formStores";

defineProps<{
  forms: Form[];
}>();

const emit = defineEmits<{
  (e: "view-form", formId: string): void;
}>();

const headers = ref([
  { title: "Nombre", key: "name" },
  { title: "Creado Por", key: "createdBy.name" },
  { title: "Fecha Creación", key: "createdAt" },
  { title: "Acciones", key: "actions", sortable: false },
]);

const handleRowClick = (_: any, { item }: { item: Form }) => {
  emit("view-form", item._id);
};
</script>

<style scoped></style>
