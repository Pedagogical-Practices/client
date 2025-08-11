<template>
  <v-container>
    <h2>Mis Estudiantes Asesorados</h2>
    <v-row>
      <v-col cols="12">
        <p v-if="groupStore.loading">Cargando estudiantes...</p>
        <p v-else-if="teacherGroups.length === 0">No tienes grupos asignados como tutor.</p>
        <v-expansion-panels v-else>
          <v-expansion-panel
            v-for="group in teacherGroups"
            :key="group.id"
            :title="`Grupo: ${group.name} (${group.period}) - Práctica: ${group.practice?.name}`"
          >
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-subheader>Estudiantes en este grupo:</v-list-subheader>
                <v-list-item
                  v-for="student in group.students"
                  :key="student.id"
                  @click="viewStudentPractices(student.id, group.id)"
                >
                  <v-list-item-title>{{ student.firstName }} {{ student.lastName }}</v-list-item-title>
                  <v-list-item-subtitle>{{ student.email }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useGroupStore } from "~/stores/groupStore";
import { useAuthStore } from "~/stores/authStore";
import { type Group, type User, UserRole } from "~/types"; // Import Group type

const router = useRouter();
const groupStore = useGroupStore();
const authStore = useAuthStore();

// Instead of 'students', store the groups directly
const teacherGroups = ref<Group[]>([]);

onMounted(async () => {
  if (authStore.user?.id) {
    await groupStore.findGroupsByTutor(authStore.user.id);
    // The groups are already stored in groupStore.groups by findGroupsByTutor
    teacherGroups.value = groupStore.groups;
  }
});

// Remove uniqueStudents computed property as it's no longer needed for display
// const uniqueStudents = computed(() => {
//   return students.value.filter((student) =>
//     student.roles && Array.isArray(student.roles) && student.roles.includes(UserRole.STUDENT)
//   );
// });

const viewStudentPractices = (studentId: string, groupId: string) => {
  // We might need to adjust this route later to include groupId if necessary
  router.push(`/teacher/students/${studentId}/practices`);
};
</script>