<template>
  <v-container>
    <h2>Mis Estudiantes Asesorados</h2>
    <v-row>
      <v-col
        v-for="student in uniqueStudents"
        :key="student.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card @click="viewStudentPractices(student.id)">
          <v-card-title>{{ student.firstName }} {{ student.lastName }}</v-card-title>
          <v-card-subtitle>{{ student.email }}</v-card-subtitle>
          <v-card-text>
            <v-chip color="primary" size="small">Ver Grupos</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useGroupStore } from "~/stores/groupStore";
import { useAuthStore } from "~/stores/authStore";
import { User, UserRole } from "~/types";

const router = useRouter();
const groupStore = useGroupStore();
const authStore = useAuthStore();

const students = ref<User[]>([]);

onMounted(async () => {
  if (authStore.user?.id) {
    await groupStore.findGroupsByTutor(authStore.user.id);
    // Extraer estudiantes únicos de los grupos asesorados
    const fetchedStudents = groupStore.groups.flatMap((group) => group.students);
    const uniqueStudentIds = new Set();
    students.value = fetchedStudents.filter((student) => {
      const isDuplicate = uniqueStudentIds.has(student.id);
      uniqueStudentIds.add(student.id);
      return !isDuplicate;
    });
  }
});

const uniqueStudents = computed(() => {
  return students.value.filter(student => student.roles.includes(UserRole.STUDENT));
});

const viewStudentPractices = (studentId: string) => {
  router.push(`/teacher/students/${studentId}/practices`);
};
</script>
