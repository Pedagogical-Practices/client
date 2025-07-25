<template>
  <v-container>
    <v-row>
      <v-col
        v-for="practice in practices"
        :key="practice.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card>
          <v-card-title>{{ practice.course.name }}</v-card-title>
          <v-card-subtitle v-if="isAdvisorView"
            >Estudiante: {{ practice.student.name }}</v-card-subtitle
          >
          <v-card-text>
            <p v-if="!isAdvisorView">
              <strong>Asesor:</strong> {{ practice.teacher.name }}
            </p>
            <p v-if="practice.protocols && practice.protocols.length > 0">
              <strong>Protocolo:</strong> {{ practice.protocols[0].name }}
            </p>
            <v-chip :color="statusColor(practice.status)" dark>{{
              practice.status
            }}</v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="viewPractice(practice.id)">{{
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
import { type Practice, PracticeStatus, UserRole } from "~/types";

const props = defineProps<{
  practices: Practice[];
  isAdvisorView: boolean;
}>();

const router = useRouter();
const authStore = useAuthStore();

const buttonText = computed(() => {
  return props.isAdvisorView ? "Revisar Práctica" : "Ver Detalles";
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

const viewPractice = (id: string) => {
  if (
    authStore.user &&
    (authStore.user.role === UserRole.ADMIN ||
      authStore.user.role === UserRole.TEACHER_DIRECTIVE)
  ) {
    router.push(`/admin/practices/${id}`);
  } else {
    router.push(`/practices/${id}`);
  }
};
</script>
