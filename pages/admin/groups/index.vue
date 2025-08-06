<template>
  <v-container>
    <div v-if="authStore.user">
      <div v-if="authStore.user.role === UserRole.STUDENT">
        <h2>Mis Grupos</h2>
        <GroupList
          :groups="groupStore.groups"
          :is-advisor-view="false"
        />
      </div>
      <div v-else-if="authStore.user.role === UserRole.TEACHER_DIRECTIVE">
        <h2>Grupos Asesorados</h2>
        <GroupList
          :groups="groupStore.groups"
          :is-advisor-view="true"
        />
      </div>
      <div v-else-if="authStore.user.role === UserRole.FAMILY">
        <h2>Progreso del Estudiante</h2>
        <p>Aquí se mostrará el progreso del estudiante asociado.</p>
      </div>
      <div v-else>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para ver esta página.</p>
        <p>Rol detectado: {{ authStore.user.role }}</p>
      </div>
    </div>
    <div v-else>
      <p>Cargando...</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useGroupStore } from "~/stores/groupStore";
import GroupList from "~/components/practices/GroupList.vue";
import { UserRole } from "~/types";

const authStore = useAuthStore();
const groupStore = useGroupStore();

onMounted(async () => {
  try {
    if (authStore.user?.role === UserRole.STUDENT) {
      await groupStore.fetchMyGroups();
    } else if (authStore.user?.role === UserRole.TEACHER_DIRECTIVE) {
      await groupStore.findGroupsByTutor(authStore.user.id);
    }
  } catch (error) {
    console.error("Failed to fetch practices:", error);
    // Optionally, show an error message to the user
  }
});
</script>
