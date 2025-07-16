<template>
  <v-container>
    <div v-if="authStore.user">
      <div v-if="authStore.user.role === 'student'">
        <h2>Mis Prácticas</h2>
        <StudentPracticeList :practices="practiceStore.practices" />
      </div>
      <div v-else-if="authStore.user.role === 'teacher_directive'">
        <h2>Prácticas Asesoradas</h2>
        <AdvisorPracticeList :practices="practiceStore.practices" />
      </div>
      <div v-else-if="authStore.user.role === 'family'">
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

<script setup>
definePageMeta({
  middleware: ['redirect-admin-from-practices'],
});
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { usePracticeStore } from '~/stores/practiceStore';
import StudentPracticeList from '~/components/practices/StudentPracticeList.vue';
import AdvisorPracticeList from '~/components/practices/AdvisorPracticeList.vue';

console.log("practices.vue: Script setup started.");

const authStore = useAuthStore();
const practiceStore = usePracticeStore();

onMounted(async () => {
  try {
    await practiceStore.fetchMyPractices();
  } catch (error) {
    console.error("Failed to fetch user practices:", error);
    // Optionally, show an error message to the user
  }
});
</script>
