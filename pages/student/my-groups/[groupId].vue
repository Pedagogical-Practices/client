<template>
  <v-container>
    <v-row v-if="groupStore.isLoading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Cargando detalles del grupo...</p>
      </v-col>
    </v-row>
    <v-row v-else-if="groupStore.error || !group">
      <v-col>
        <v-alert type="error">
          No se pudieron cargar los detalles del grupo. Por favor, intenta de nuevo.
        </v-alert>
      </v-col>
    </v-row>
    <template v-else>
      <v-row>
        <v-col cols="12">
          <v-btn @click="router.back()" color="grey" class="mb-4">
            <v-icon left>mdi-arrow-left</v-icon>
            Volver a Mis Grupos
          </v-btn>
          <h1 class="text-h4">{{ group.practice.name }}</h1>
          <h2 class="text-h6 font-weight-regular">{{ group.name }} - {{ group.period }}</h2>
          <v-divider class="my-4"></v-divider>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <h3 class="text-h5 mb-4">Progreso de Protocolos</h3>
          <student-protocol-progress
            :protocols="group.practice.protocols"
            :submissions="submissions"
            :group-id="groupId"
          ></student-protocol-progress>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroupStore } from '~/stores/groupStore';
import { useSubmissionStore } from '~/stores/submissionStore';
import { useAuthStore } from '~/stores/authStore';
import StudentProtocolProgress from '~/components/student/StudentProtocolProgress.vue';

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();
const submissionStore = useSubmissionStore();
const authStore = useAuthStore();

const groupId = route.params.groupId;

const group = computed(() => groupStore.currentGroup);
const submissions = computed(() => submissionStore.submissions);

onMounted(async () => {
  groupStore.fetchGroup(groupId);
  if (authStore.user && authStore.user.id) {
    submissionStore.fetchSubmissionsByStudentAndGroup(authStore.user.id, groupId);
  }
});

</script>
