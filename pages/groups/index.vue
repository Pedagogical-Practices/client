<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Mis Grupos</span>
          </v-card-title>
          <v-card-text>
            <p v-if="groupStore.loading">Cargando tus grupos...</p>
            <p v-else-if="groupStore.groups.length === 0">
              No tienes grupos asignados.
            </p>
            <v-list v-else>
              <v-list-item
                v-for="group in groupStore.groups"
                :key="group.id"
                :to="`/groups/${group.id}`"
              >
                <v-list-item-title
                  >{{ group.name }} ({{ group.period }})</v-list-item-title
                >
                <v-list-item-subtitle>
                  Práctica: {{ group.practice?.name }} | Tutor:
                  {{ group.tutor?.firstName }} {{ group.tutor?.lastName }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGroupStore } from "~/stores/groupStore";
import { useAuthStore } from "~/stores/authStore"; // Import authStore
import { UserRole } from "~/types"; // Import UserRole

const groupStore = useGroupStore();
const authStore = useAuthStore(); // Initialize authStore

onMounted(async () => {
  if (authStore.user?.id) {
    // Determine which fetch method to call based on user roles
    if (authStore.user.roles.includes(UserRole.STUDENT)) {
      await groupStore.fetchMyGroups(); // For students
    } else if (authStore.user.roles.includes(UserRole.TUTOR)) {
      await groupStore.findGroupsByTutor(authStore.user.id); // For tutors
    } else if (
      authStore.user.roles.includes(UserRole.ADMIN) ||
      authStore.user.roles.includes(UserRole.COORDINATOR)
    ) {
      await groupStore.fetchGroups(); // For admins/coordinators
    } else {
      // Handle other roles or no roles if necessary
      console.warn("User has no recognized role for fetching groups.");
      groupStore.groups = []; // Clear groups if no relevant role
    }
  }
});
</script>
