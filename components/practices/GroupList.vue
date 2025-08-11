<template>
  <v-container>
    <v-row>
      <v-col v-for="group in groups" :key="group.id" cols="12" md="6" lg="4">
        <v-card>
          <v-card-title>{{ group.name }}</v-card-title> <!-- Display group name -->
          <v-card-subtitle v-if="group.practice?.name">
            Práctica: {{ group.practice.name }}
          </v-card-subtitle>
          <v-card-subtitle v-if="group.tutor">
            Tutor: {{ group.tutor.firstName }} {{ group.tutor.lastName }}
          </v-card-subtitle>

          <v-card-text>
            <p v-if="group.students && group.students.length > 0">
              <strong>Estudiantes:</strong>
              <span v-for="(student, index) in group.students" :key="student.id">
                {{ student.firstName }} {{ student.lastName }}{{ index < group.students.length - 1 ? ', ' : '' }}
              </span>
            </p>
            <p v-if="group.practice?.protocols && group.practice.protocols.length > 0">
              <strong>Protocolo:</strong> {{ group.practice.protocols[0].name }}
            </p>
            <v-chip :color="statusColor(group.status)" dark>{{
              group.status
            }}</v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="viewGroup(group.id)">{{
              buttonText
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import { type Group, PracticeStatus, UserRole } from "~/types";

const props = defineProps<{
  groups: Group[];
  isAdvisorView: boolean;
}>();

const router = useRouter();
const authStore = useAuthStore();

const buttonText = computed(() => {
  // Adjust button text based on view and user role
  if (props.isAdvisorView) {
    return "Ver Detalles del Grupo"; // For advisor view
  } else if (authStore.user?.roles.includes(UserRole.STUDENT)) {
    return "Ver Mis Prácticas"; // For student view
  }
  return "Ver Detalles"; // Default
});

const statusColor = (status: PracticeStatus) => {
  switch (status) {
    case PracticeStatus.PENDING:
      return "blue";
    case PracticeStatus.IN_PROGRESS:
      return "orange";
    case PracticeStatus.COMPLETED:
      return "green";
    case PracticeStatus.ARCHIVED:
      return "grey";
    default:
      return "grey";
  }
};

const viewGroup = (id: string) => {
  // This function needs to be adjusted based on the actual navigation logic
  // For now, let's assume it navigates to a group detail page
  if (props.isAdvisorView) {
    // If it's an advisor view, it might navigate to admin/groups or teacher/students/studentId/practices
    // This component is used in /teacher/students/[studentId]/practices.vue
    // So, clicking this button should probably navigate to the group's detail page for the advisor
    router.push(`/teacher/students/${router.currentRoute.value.params.studentId}/practices/${id}`);
  } else if (authStore.user?.roles.includes(UserRole.STUDENT)) {
    router.push(`/groups/${id}`); // Student's own group detail
  } else {
    router.push(`/admin/groups/${id}`); // Admin/Coordinator view
  }
};
</script>