<template>
  <v-container>
    <h2>Grupos del Estudiante</h2>
    <div v-if="groupStore.groups.length">
      <GroupList :groups="groupStore.groups" :is-advisor-view="true" />
    </div>
    <div v-else>
      <p>No se encontraron grupos para este estudiante.</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGroupStore } from "~/stores/groupStore";
import GroupList from "~/components/practices/GroupList.vue";

const route = useRoute();
const groupStore = useGroupStore();

onMounted(async () => {
  const studentId = route.params.studentId as string;
  if (studentId) {
    await groupStore.findGroupsByStudent(studentId);
  }
});
</script>
