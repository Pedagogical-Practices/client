<template>
  <v-data-table
    :headers="headers"
    :items="courses"
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
        Ver
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  courses: Array<{
    _id: string;
    name: string;
    institution: string;
    assignedGroups: string[];
  }>;
}>();

defineEmits(["view"]);

const headers = ref([
  { title: "Nombre", key: "name" },
  { title: "Institución", key: "institution" },
  {
    title: "Grupos",
    key: "assignedGroups",
    value: (item: any) => item.assignedGroups.join(", "),
  },
  { title: "Acciones", key: "actions", sortable: false },
]);
</script>
