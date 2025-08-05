<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 primary--text">Dashboard del Asesor</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4 text-center" color="blue-grey-darken-1" dark>
          <v-card-title class="justify-center">Estudiantes Asignados</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ groupStore.groups.length }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4 text-center" color="teal-darken-1" dark>
          <v-card-title class="justify-center">Entregas Pendientes</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ pendingSubmissionsCount }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4 text-center" color="purple-darken-1" dark>
          <v-card-title class="justify-center">Entregas Aprobadas</v-card-title>
          <v-card-text>
            <div class="text-h3">{{ approvedSubmissionsCount }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Mis Grupos Asesorados</v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item
                v-for="group in groupStore.groups"
                :key="group.id"
                :title="group.name"
                :subtitle="`Periodo: ${group.period} - Tutor: ${group.tutor.name}`"
                @click="viewGroupDetails(group.id)"
              >
                <template v-slot:append>
                  <v-chip color="primary" size="small">Ver Detalles</v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-alert v-if="!groupStore.groups.length" type="info" class="mt-4">
              No tienes grupos asignados como asesor.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGroupStore } from '~/stores/groupStore';
import { useAuthStore } from '~/stores/authStore';
import { useSubmissionStore } from '~/stores/submissionStore';
import { SubmissionStatus } from '~/types';

const groupStore = useGroupStore();
const authStore = useAuthStore();
const submissionStore = useSubmissionStore();
const router = useRouter();

const pendingSubmissionsCount = computed(() => {
  return submissionStore.submissions.filter(sub => sub.status === SubmissionStatus.SUBMITTED || sub.status === SubmissionStatus.NEEDS_REVISION).length;
});

const approvedSubmissionsCount = computed(() => {
  return submissionStore.submissions.filter(sub => sub.status === SubmissionStatus.APPROVED).length;
});

onMounted(async () => {
  if (authStore.user?.id) {
    // Fetch groups where the current user is an ASSESSOR
    await groupStore.findGroupsByTutor(authStore.user.id); // Assuming ASSESSORs are also considered tutors for group assignment

    // Fetch submissions related to these groups
    const groupIds = groupStore.groups.map(g => g.id);
    if (groupIds.length > 0) {
      // This part needs a backend query to fetch submissions by multiple group IDs or by assessor ID
      // For now, we'll fetch all and filter, which is inefficient but works for placeholder
      await submissionStore.fetchSubmissions(); // This fetches all submissions
      submissionStore.submissions.value = submissionStore.submissions.filter(sub => groupIds.includes(sub.group.id));
    }
  }
});

const viewGroupDetails = (groupId: string) => {
  router.push(`/groups/${groupId}`);
};
</script>

<style scoped>
.text-h3 {
  font-size: 3rem;
  font-weight: bold;
}
</style>
