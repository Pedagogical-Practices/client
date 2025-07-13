<template>
  <v-container>
    <div v-if="authStore.user">
      <div v-if="authStore.user.role === 'student'">
        <StudentPracticeList :practices="practiceStore.practices" />
      </div>
      <div v-else-if="authStore.user.role === 'teacher_directive'">
        <AdvisorPracticeList :practices="practiceStore.practices" />
      </div>
      <div v-else-if="authStore.user.role === 'family'">
        <h2>Progreso del Estudiante (Familiar)</h2>
        <!-- Aquí irá el componente para familiares -->
      </div>
      <div v-else>
        <h2>Vista de Prácticas (Rol: {{ authStore.user.role }})</h2>
        <p>Vista general o de administrador.</p>
      </div>
    </div>
    <div v-else>
      <p>Cargando...</p>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { usePracticeStore } from '~/stores/practiceStore';
import StudentPracticeList from '~/components/practices/StudentPracticeList.vue';
import AdvisorPracticeList from '~/components/practices/AdvisorPracticeList.vue';

const authStore = useAuthStore();
const practiceStore = usePracticeStore();

onMounted(async () => {
  try {
    await practiceStore.fetchPractices();
  } catch (error) {
    console.error("Failed to fetch practices:", error);
    // Optionally, show an error message to the user
  }
});
</script>
