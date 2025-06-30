<template>
  <v-container fluid class="pa-4">
    <AdminCoordinatorDashboard
      v-if="
        authStore.user?.role === UserRoles.ADMIN ||
        authStore.user?.role === UserRoles.COORDINATOR
      "
    />
    <TeacherDirectiveDashboard
      v-else-if="authStore.user?.role === UserRoles.TEACHER_DIRECTIVE"
    />
    <StudentDashboard v-else-if="authStore.user?.role === UserRoles.STUDENT" />
    <AdministrativeDashboard
      v-else-if="authStore.user?.role === UserRoles.ADMINISTRATIVE"
    />
    <v-row v-else>
      <v-col cols="12">
        <v-alert type="info" prominent>
          Bienvenido al sistema. Tu perfil no tiene un dashboard específico
          configurado.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { UserRoles } from "~/types/user";

// Importar componentes de dashboard (crearemos estos archivos a continuación)
import AdminCoordinatorDashboard from "@/components/dashboards/AdminCoordinatorDashboard.vue";
import TeacherDirectiveDashboard from "@/components/dashboards/TeacherDirectiveDashboard.vue";
import StudentDashboard from "@/components/dashboards/StudentDashboard.vue";
import AdministrativeDashboard from "@/components/dashboards/AdministrativeDashboard.vue";

const authStore = useAuthStore();

// Redireccionar si no está autenticado (opcional, ya manejado por middleware global si existe)
// onMounted(() => {
//   if (!authStore.isAuthenticated) {
//     // router.push('/login');
//   }
// });
</script>
