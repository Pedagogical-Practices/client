<template>
  <v-container>
    <v-row>
      <v-col
        v-for="group in groups"
        :key="group.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card>
          <v-card-title>{{ group.practice.name }}</v-card-title>
          <v-card-subtitle v-if="isAdvisorView"
            >Estudiante: {{ group.student.name }}</v-card-subtitle
          >
          <v-card-text>
            <p v-if="!isAdvisorView">
              <strong>Asesor:</strong> {{ group.teacher.name }}
            </p>
            <p v-if="group.protocols && group.protocols.length > 0">
              <strong>Protocolo:</strong> {{ group.protocols[0].name }}
            </p>
            <v-chip :color="statusColor(group.status)" dark>{{
              group.status
            }}</v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="viewPractice(group.id)">{{
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
  return props.isAdvisorView ? "Revisar Grupo" : "Ver Detalles";
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
  if (
    authStore.user &&
    (authStore.user.role === UserRole.ADMIN ||
      authStore.user.role === UserRole.TEACHER_DIRECTIVE)
  ) {
    router.push(`/admin/groups/${id}`);
  } else {
    router.push(`/groups/${id}`);
  }
};
</script>
