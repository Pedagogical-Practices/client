<template>
  <v-data-table
    :headers="headers"
    :items="courses"
    :items-per-page="10"
    class="elevation-1"
  >
    <template v-slot:item.createdBy="{ item }">
      {{ item.createdBy.name }} ({{ item.createdBy.email }})
    </template>
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
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    createdAt: string;
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
  { title: "Creado por", key: "createdBy" },
  { title: "Acciones", key: "actions", sortable: false },
]);
</script>
